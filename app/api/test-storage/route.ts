import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test storage bucket access
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
      return NextResponse.json(
        { error: 'Failed to list buckets', details: bucketError.message },
        { status: 500 }
      )
    }

    // Check if our bucket exists
    const resumeBucket = buckets.find(bucket => bucket.name === 'bolt-resumes-2025')

    if (!resumeBucket) {
      return NextResponse.json(
        { error: 'Resume bucket not found', availableBuckets: buckets.map(b => b.name) },
        { status: 404 }
      )
    }

    // Test bucket contents
    const { data: files, error: filesError } = await supabase.storage
      .from('bolt-resumes-2025')
      .list()

    if (filesError) {
      return NextResponse.json(
        { error: 'Failed to list files', details: filesError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resume bucket is accessible',
      bucket: resumeBucket,
      fileCount: files?.length || 0,
      files: files?.slice(0, 10) || [] // Show first 10 files
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
