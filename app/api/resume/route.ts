import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isValidUUID, validateFile, checkRateLimit } from '@/lib/validation'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// Get user's resume info from the resumes table
export async function GET(request: NextRequest) {
  try {
    // AuthN required
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Basic UUID validation
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // Authorization: only owner or admin can view
    const isOwner = auth.userId === userId
    const isAdmin = auth.role === 'admin'
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('resume, file_name, file_size, file_type, time_stamp_added')
      .eq('member_id', userId)
      .maybeSingle()

    if (resumeError) {
      return NextResponse.json(
        { error: 'Failed to fetch resume', details: resumeError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        resume_url: resume?.resume || null,
        file_name: resume?.file_name || null,
        file_size: resume?.file_size || null,
        file_type: resume?.file_type || null,
        time_stamp_added: resume?.time_stamp_added || null
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Upload or update resume
export async function POST(request: NextRequest) {
  try {
    // AuthN required
    const auth = await getAuthContext(request)
    if (!auth) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] Authentication failed - no auth context')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let formData: FormData
    try {
      formData = await request.formData()
    } catch (formError) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] FormData parsing error:', formError)
      return NextResponse.json(
        { error: 'Failed to parse form data', details: formError instanceof Error ? formError.message : 'Unknown error' },
        { status: 400 }
      )
    }

    const userId = formData.get('userId') as string
    const file = formData.get('file') as File | null

    if (!userId) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] Missing userId in form data')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!file || !(file instanceof File)) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] Missing or invalid file in form data', { file, type: typeof file })
      return NextResponse.json(
        { error: 'File is required and must be a valid file' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`upload:${clientIP}`, 5, 60000)) { // 5 uploads per minute
      return NextResponse.json(
        { error: 'Too many upload attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // UUID validation
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // File validation
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      )
    }

    // Authorization: only owner can upload their resume
    const isOwner = auth.userId === userId
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get admin client for resumes table operations
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    // Create authenticated Supabase client for storage operations
    // We need to use the user's access token for storage upload (RLS policies)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '') || null

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    // Create client with user's access token for storage operations
    const storageClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
    })

    // Upload file to Supabase Storage with secure naming
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${userId}/${Date.now()}-${sanitizedFileName}`

    // Delete ALL old resume files for this user to ensure only one resume exists
    // Use admin client for listing/deleting to ensure it works reliably
    try {
      const { data: existingFiles, error: listError } = await supabaseAdmin.storage
        .from('bolt-resumes-2026')
        .list(userId, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (listError) {
        // eslint-disable-next-line no-console
        console.warn('[resume/POST] Failed to list existing files:', listError)
      } else if (existingFiles && existingFiles.length > 0) {
        // Delete all files in the user's folder
        const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`)
        const { error: deleteError } = await supabaseAdmin.storage
          .from('bolt-resumes-2026')
          .remove(filesToDelete)

        if (deleteError) {
          // eslint-disable-next-line no-console
          console.warn('[resume/POST] Failed to delete old resume files:', deleteError)
        } else {
          // eslint-disable-next-line no-console
          console.log(`[resume/POST] Deleted ${filesToDelete.length} old resume file(s) for user ${userId}`)
        }
      }
    } catch (deleteError) {
      // Log but don't fail - old file cleanup is not critical
      // eslint-disable-next-line no-console
      console.warn('[resume/POST] Error during old resume cleanup:', deleteError)
    }

    // Upload new file using user's token (respects storage RLS policies)
    const { error: uploadError } = await storageClient.storage
      .from('bolt-resumes-2026')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] Storage upload error:', {
        message: uploadError.message,
        name: uploadError.name,
        error: String(uploadError),
      })

      // Provide more helpful error messages
      let errorMessage = 'Failed to upload file to storage'
      const errorMsg = uploadError.message || String(uploadError)
      if (errorMsg.includes('Bucket not found') || errorMsg.includes('does not exist')) {
        errorMessage = 'Storage bucket "bolt-resumes-2026" does not exist. Please create it in Supabase dashboard.'
      } else if (errorMsg.includes('new row violates row-level security') || errorMsg.includes('RLS')) {
        errorMessage = 'Storage bucket permissions not configured. Please set up RLS policies for the bucket.'
      } else if (errorMsg) {
        errorMessage = errorMsg
      }

      return NextResponse.json(
        { error: errorMessage, details: errorMsg },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = storageClient.storage
      .from('bolt-resumes-2026')
      .getPublicUrl(fileName)

    // Upsert the resumes row (unique constraint on member_id) using admin client to bypass RLS
    const { data: updatedResume, error: updateError } = await supabaseAdmin
      .from('resumes')
      .upsert({
        member_id: userId,
        resume: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        time_stamp_added: new Date().toISOString()
      }, { onConflict: 'member_id' })
      .select()
      .single()

    if (updateError) {
      // eslint-disable-next-line no-console
      console.error('[resume/POST] Resume upsert error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update resume', details: updateError.message },
        { status: 500 }
      )
    }

    if (!updatedResume) {
      return NextResponse.json(
        { error: 'Failed to update resume - no data returned' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        resume_url: updatedResume.resume,
        file_name: updatedResume.file_name,
        file_size: updatedResume.file_size,
        file_type: updatedResume.file_type,
        time_stamp_added: updatedResume.time_stamp_added
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[resume/POST] Unexpected error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { error: 'Failed to upload resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Delete resume
export async function DELETE(request: NextRequest) {
  try {
    // AuthN required
    const auth = await getAuthContext(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // UUID validation
    if (!isValidUUID(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // Authorization: only owner can delete their resume
    const isOwner = auth.userId === userId
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`delete:${clientIP}`, 10, 60000)) { // 10 deletions per minute
      return NextResponse.json(
        { error: 'Too many delete attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get admin client to fetch the resumes row and delete from storage
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    // Delete ALL files from storage for this user using admin client
    try {
      const { data: existingFiles, error: listError } = await supabaseAdmin.storage
        .from('bolt-resumes-2026')
        .list(userId, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (listError) {
        // eslint-disable-next-line no-console
        console.warn('[resume/DELETE] Failed to list existing files:', listError)
      } else if (existingFiles && existingFiles.length > 0) {
        // Delete all files in the user's folder
        const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`)
        const { error: deleteError } = await supabaseAdmin.storage
          .from('bolt-resumes-2026')
          .remove(filesToDelete)

        if (deleteError) {
          // eslint-disable-next-line no-console
          console.warn('[resume/DELETE] Storage delete error:', deleteError)
        } else {
          // eslint-disable-next-line no-console
          console.log(`[resume/DELETE] Deleted ${filesToDelete.length} resume file(s) for user ${userId}`)
        }
      }
    } catch (storageError) {
      // eslint-disable-next-line no-console
      console.warn('[resume/DELETE] Storage delete exception:', storageError)
      // Continue with resumes row delete even if storage delete fails
    }

    // Delete the resumes row using admin client to bypass RLS
    const { error: deleteRowError } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('member_id', userId)

    if (deleteRowError) {
      // eslint-disable-next-line no-console
      console.error('[resume/DELETE] Resume row delete error:', deleteRowError)
      return NextResponse.json(
        { error: 'Failed to delete resume', details: deleteRowError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
