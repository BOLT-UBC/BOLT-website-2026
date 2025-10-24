'use client'

import { useState } from 'react'
import ResumeUpload from '@/components/ResumeUpload'

export default function TestResumePage() {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUploadSuccess = (resume: any) => {
    setUploadResult(resume)
    setError(null)
    console.log('Upload successful:', resume)
  }

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage)
    setUploadResult(null)
    console.error('Upload error:', errorMessage)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Resume Upload Test
          </h1>
          <p className="text-gray-600">
            Test the resume upload functionality for BOLT members
          </p>
        </div>

        <div className="space-y-6">
          {/* Resume Upload Component */}
          <ResumeUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />

          {/* Success Message */}
          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Resume uploaded successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p><strong>File:</strong> {uploadResult.resume_file_name}</p>
                    <p><strong>URL:</strong> <a href={uploadResult.resume_url} target="_blank" rel="noopener noreferrer" className="underline">{uploadResult.resume_url}</a></p>
                    <p><strong>Uploaded:</strong> {new Date(uploadResult.resume_uploaded_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Upload failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Testing Instructions:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make sure you're logged in as a non-admin user</li>
              <li>• Try uploading a PDF or Word document</li>
              <li>• File size should be less than 5MB</li>
              <li>• Check the Supabase Storage bucket "bolt-resumes-2025"</li>
              <li>• Verify the profile table has resume fields updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
