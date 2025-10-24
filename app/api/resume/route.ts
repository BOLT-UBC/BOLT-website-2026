import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { profileService } from '@/lib/database'

// Get user's resume info from profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const profile = await profileService.getById(userId)

    return NextResponse.json({
      success: true,
      data: {
        resume_url: profile.resume_url,
        resume_file_name: profile.resume_file_name,
        resume_uploaded_at: profile.resume_uploaded_at
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
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const file = formData.get('file') as File

    if (!userId || !file) {
      return NextResponse.json(
        { error: 'User ID and file are required' },
        { status: 400 }
      )
    }

    // Check if user is allowed to upload resume (not admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    if (profile?.role === 'admin') {
      return NextResponse.json(
        { error: 'Admins cannot upload resumes' },
        { status: 403 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and Word documents are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload file to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bolt-resumes-2025')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('bolt-resumes-2025')
      .getPublicUrl(fileName)

    // Update profile with resume info
    const updatedProfile = await profileService.update(userId, {
      resume_url: urlData.publicUrl,
      resume_file_name: file.name,
      resume_uploaded_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        resume_url: updatedProfile.resume_url,
        resume_file_name: updatedProfile.resume_file_name,
        resume_uploaded_at: updatedProfile.resume_uploaded_at
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Delete resume
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Clear resume info from profile
    const updatedProfile = await profileService.update(userId, {
      resume_url: null,
      resume_file_name: null,
      resume_uploaded_at: null
    })

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
      data: updatedProfile
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
