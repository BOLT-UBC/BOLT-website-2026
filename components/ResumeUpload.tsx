'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

interface ResumeUploadProps {
  onUploadSuccess?: (resume: any) => void
  onUploadError?: (error: string) => void
}

export default function ResumeUpload({ onUploadSuccess, onUploadError }: ResumeUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [currentResume, setCurrentResume] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if user can upload resume
  const canUploadResume = user?.profile?.role &&
    ['non_member', 'platinum_member', 'executive_member'].includes(user.profile.role)

  // Load current resume info from user profile
  useEffect(() => {
    if (user?.profile) {
      setCurrentResume({
        resume_url: user.profile.resume_url,
        resume_file_name: user.profile.resume_file_name,
        resume_uploaded_at: user.profile.resume_uploaded_at
      })
    }
  }, [user?.profile])

  if (!canUploadResume) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Resume Upload</h3>
        <p className="text-gray-500">Resume uploads are not available for your account type.</p>
      </div>
    )
  }

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      onUploadError?.('User not authenticated')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('file', file)

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setCurrentResume(result.data)
        onUploadSuccess?.(result.data)
      } else {
        onUploadError?.(result.error)
      }
    } catch (error) {
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
      const response = await fetch(`/api/resume?userId=${user.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setCurrentResume(null)
      } else {
        onUploadError?.(result.error)
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Upload</h3>

      {currentResume?.resume_url ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-900">{currentResume.resume_file_name}</p>
                <p className="text-sm text-green-700">
                  Uploaded {currentResume.resume_uploaded_at ? new Date(currentResume.resume_uploaded_at).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={currentResume.resume_url}
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
