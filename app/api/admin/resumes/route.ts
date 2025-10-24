import { NextRequest, NextResponse } from 'next/server'
import { resumeService } from '@/lib/database'
import { authService } from '@/lib/auth'

// Get all resumes (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Extract user ID from token (you'll need to implement JWT verification)
    // For now, we'll use a simple approach
    const userId = authHeader.replace('Bearer ', '')

    // Check if user is admin
    const isAdmin = await authService.isAdmin(userId)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const resumes = await resumeService.getAllResumes()

    return NextResponse.json({
      success: true,
      data: resumes,
      count: resumes.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
