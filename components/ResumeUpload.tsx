'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/useAuth'

interface ResumeUploadProps {
  // eslint-disable-next-line no-unused-vars
  onUploadSuccess?: (resume: ResumeData) => void
  // eslint-disable-next-line no-unused-vars
  onUploadError?: (error: string) => void
}

// Shape of a row in the `resumes` table (see lib/supabase.ts Database type).
// Resumes now live in their own table rather than on the member's profile,
// so this is fetched separately via /api/resume rather than from user.profile.
interface ResumeData {
  resume?: string | null
  file_name?: string | null
  file_size?: number | null
  file_type?: string | null
  time_stamp_added?: string | null
}

export default function ResumeUpload({ onUploadSuccess, onUploadError }: ResumeUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch the current resume info for this member from the resumes table
  // (via the /api/resume route), rather than from the profile object.
  const refreshResume = useCallback(async () => {
    if (!user?.id) {
      setCurrentResume(null)
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch(`/api/resume?userId=${user.id}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })

      if (!response.ok) {
        setCurrentResume(null)
        return
      }

      const result = await response.json()
      setCurrentResume(result?.data ?? null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[ResumeUpload] Failed to fetch resume:', error)
      // On error, clear resume state to be safe
      setCurrentResume(null)
    }
  }, [user?.id])

  // Load current resume info on mount / when the user changes
  useEffect(() => {
    refreshResume()
  }, [refreshResume])

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      onUploadError?.('User not authenticated')
      return
    }

    setUploading(true)

    try {
      // Get access token for authentication
      const { supabase } = await import('@/lib/supabase')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session?.access_token) {
        onUploadError?.('Failed to get authentication token')
        return
      }

      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('file', file)

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        onUploadError?.(result.error || `Upload failed: ${response.status}`)
        return
      }

      if (result.success) {
        // Update local state immediately
        setCurrentResume(result.data)
        onUploadSuccess?.(result.data)
        // Refresh from the resumes table to ensure consistency
        await refreshResume()
      } else {
        onUploadError?.(result.error || 'Upload failed')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ResumeUpload] Upload error:', error)
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const deleteResume = async () => {
    if (!user?.id) return

    try {
      // Get access token for authentication
      const { supabase } = await import('@/lib/supabase')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session?.access_token) {
        onUploadError?.('Failed to get authentication token')
        return
      }

      const response = await fetch(`/api/resume?userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        onUploadError?.(result.error || `Delete failed: ${response.status}`)
        return
      }

      if (result.success) {
        // Clear local state immediately
        setCurrentResume(null)

        // Refresh from the resumes table to ensure UI reflects updated state
        // This updates the component without reloading the page
        await refreshResume()
      } else {
        onUploadError?.(result.error || 'Delete failed')
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[ResumeUpload] Delete error:', error)
      onUploadError?.(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Upload</h3>

      {currentResume?.resume ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-900">{currentResume?.file_name}</p>
                <p className="text-sm text-green-700">
                  Uploaded {currentResume?.time_stamp_added ? new Date(currentResume.time_stamp_added).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={currentResume.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View
              </a>
              <button
                onClick={deleteResume}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload your resume'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your resume here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PDF or Word documents only • Max 5MB
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
