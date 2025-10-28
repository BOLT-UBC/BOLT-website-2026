import React from 'react'

interface AccountPanelProps {
  user: { email: string; created_at: string }
  profile: { role?: string } | null
  setShowDeleteConfirm: (value: boolean) => void
}

export function AccountPanel({ user, profile, setShowDeleteConfirm }: AccountPanelProps) {
  const handleUpdateRole = async () => {
    const email = (document.getElementById('admin-email') as HTMLInputElement)?.value;
    const role = (document.getElementById('admin-role') as HTMLSelectElement)?.value;
    if (email && role) {
      try {
        const response = await fetch('/api/admin/update-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, role })
        });
        if (response.ok) {
          alert('Role updated successfully!');
        } else {
          alert('Failed to update role');
        }
      } catch (error) {
        // Failed to update role
        void error
        alert('Error updating role');
      }
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      {/* Admin Panel - Only show for admins */}
      {profile?.role === 'admin' && (
        <div className="mb-8 p-6 bg-red-500/20 border border-red-400/30 rounded-lg">
          <h3 className="text-xl font-bold text-red-100 mb-4">🔧 Admin Panel</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-red-100 mb-2">Update User Role</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="User email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-red-300/30 rounded text-white placeholder-red-200/50"
                  id="admin-email"
                />
                <select className="px-3 py-2 bg-white/10 border border-red-300/30 rounded text-white" id="admin-role">
                  <option value="non_member">Non-Member</option>
                  <option value="platinum_member">Platinum Member</option>
                  <option value="executive_member">Executive Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleUpdateRole}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white/60 mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-white/60 mb-1">Account Created</label>
              <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <p className="text-white/70 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
