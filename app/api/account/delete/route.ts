import { NextRequest, NextResponse } from 'next/server'
import { isValidUUID } from '@/lib/validation'
import { getAuthContext, getSupabaseAdmin } from '@/lib/serverAuth'

// Delete user account
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

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }

    // Verify the member exists
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('member_id, role')
      .eq('member_id', userId)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Authorization: only the owner can delete their account; admins cannot be deleted via this endpoint
    const isOwner = auth.userId === userId
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if user is trying to delete an admin account (prevent this for security)
    if (member.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be deleted through this endpoint' },
        { status: 403 }
      )
    }

    // Delete the resume file from storage if one exists
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('resume')
      .eq('member_id', userId)
      .single()

    if (resume?.resume) {
      try {
        const url = new URL(resume.resume)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]

        await supabaseAdmin.storage
          .from('bolt-resumes-2026')
          .remove([`${userId}/${fileName}`])
      } catch {
        // Log error but don't fail the deletion
      }
    }

    // Delete the auth user; ON DELETE CASCADE cleans up members, resumes,
    // and event_attendance rows automatically.
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      return NextResponse.json(
        { error: 'Failed to delete account', details: deleteUserError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
