import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isValidUUID } from '@/lib/validation'
import { getAuthContext } from '@/lib/serverAuth'

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

    // Verify the user exists and get their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, resume_url')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
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
    if (profile.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be deleted through this endpoint' },
        { status: 403 }
      )
    }

    // Delete user's resume file from storage if it exists
    if (profile.resume_url) {
      try {
        // Extract file path from URL
        const url = new URL(profile.resume_url)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1] // Get file name

        await supabase.storage
          .from('bolt-resumes-2025')
          .remove([`${userId}/${fileName}`])
      } catch {
        // Log error but don't fail the deletion
        // Note: Resume file deletion failed, but user deletion continues
      }
    }

    // Delete user's profile (this will cascade to related data due to foreign key constraints)
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteProfileError) {
      return NextResponse.json(
        { error: 'Failed to delete user profile', details: deleteProfileError.message },
        { status: 500 }
      )
    }

    // Note: We cannot delete the auth user from the client side for security reasons
    // The auth user will remain in Supabase auth but will be orphaned
    // In production, you might want to implement a server-side admin function to clean up orphaned auth users

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully. Note: Authentication data may remain for security purposes.'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
