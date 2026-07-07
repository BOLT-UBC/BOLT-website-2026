import React from 'react'

interface AccountPanelProps {
  user: { email: string; created_at: string }
  profile: { role?: string } | null
  setShowDeleteConfirm: (value: boolean) => void
  onLogout: () => void
}

export function AccountPanel({ user, profile, setShowDeleteConfirm, onLogout }: AccountPanelProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-8">Account Settings</h2>

      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">Email</label>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">Account Created</label>
            <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
