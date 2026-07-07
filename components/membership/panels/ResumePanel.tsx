import React from 'react'
import ResumeUpload from '@/components/ResumeUpload'

export function ResumePanel() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Resume Management</h2>
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-100 mb-2">Boost Your Opportunities!</h3>
              <p className="text-blue-200/90 leading-relaxed">
                Upload your resume to our secure database so our sponsors and partners can discover your talent!
                This helps you connect with internship opportunities, job openings, and networking events.
                Your resume helps us match you with the right opportunities and showcase your skills to our industry partners.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ResumeUpload />
    </div>
  )
}
