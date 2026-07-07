import React from 'react'

export type UserRole = 'non_member' | 'bolt_member' | 'executive_member' | 'admin'

function getRoleDisplayName(role: UserRole) {
  switch (role) {
    case 'non_member': return 'Non-Member'
    case 'bolt_member': return 'Bolt Member'
    case 'executive_member': return 'Executive Member'
    case 'admin': return 'Admin'
  }
}

function getRoleColor(role: UserRole) {
  switch (role) {
    case 'non_member': return 'bg-gray-100 text-gray-800'
    case 'bolt_member': return 'bg-yellow-100 text-yellow-800'
    case 'executive_member': return 'bg-blue-100 text-blue-800'
    case 'admin': return 'bg-red-100 text-red-800'
  }
}

export function RoleBadge({ role, className = '' }: { role: UserRole, className?: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)} ${className}`}>
      {getRoleDisplayName(role)}
    </span>
  )
}

export const roleUtils = { getRoleDisplayName, getRoleColor }


