import React from 'react'

export function DeleteAccountModal({
  isOpen,
  confirmText,
  setConfirmText,
  deleting,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean
  confirmText: string
  setConfirmText: (value: string) => void
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Delete Account</h3>
        <p className="text-gray-600 mb-6">
          This action cannot be undone. This will permanently delete your account and remove all your data.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-bold">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="DELETE"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={deleting || confirmText !== 'DELETE'}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


