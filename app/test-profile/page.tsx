'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { supabase } from '@/lib/supabase'

export default function TestProfilePage() {
  const { user, loading } = useAuth()
  const [testResult, setTestResult] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)

  const runTest = async () => {
    setIsRunning(true)
    setTestResult('Running comprehensive profile test...\n')

    try {
      if (!user) {
        setTestResult('❌ No user is currently signed in')
        return
      }

      setTestResult(prev => prev + `Current user: ${user.email} (${user.id})\n`)
      setTestResult(prev => prev + `User created at: ${new Date(user.created_at).toLocaleString()}\n`)
      setTestResult(prev => prev + `User metadata: ${JSON.stringify(user.user_metadata, null, 2)}\n\n`)

      // Check if profile exists
      setTestResult(prev => prev + 'Checking if profile exists...\n')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setTestResult(prev => prev + '❌ Profile does not exist for this user\n')
          setTestResult(prev => prev + 'This means the database trigger is not working properly\n\n')

          // Try to create profile manually
          setTestResult(prev => prev + 'Attempting to create profile manually...\n')
          const profileData = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
            role: 'non_member'
          }

          setTestResult(prev => prev + `Profile data to insert: ${JSON.stringify(profileData, null, 2)}\n`)

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select()
            .single()

          if (createError) {
            setTestResult(prev => prev + `❌ Error creating profile manually: ${createError.message}\n`)
            setTestResult(prev => prev + `Error code: ${createError.code}\n`)
            setTestResult(prev => prev + `Error details: ${JSON.stringify(createError, null, 2)}\n`)
          } else {
            setTestResult(prev => prev + `✅ Profile created manually: ${JSON.stringify(newProfile, null, 2)}\n`)
          }
        } else {
          setTestResult(prev => prev + `❌ Error checking profile: ${profileError.message}\n`)
          setTestResult(prev => prev + `Error code: ${profileError.code}\n`)
        }
      } else {
        setTestResult(prev => prev + `✅ Profile exists: ${JSON.stringify(profile, null, 2)}\n`)
      }

      // Additional diagnostic: Check if we can query profiles at all
      setTestResult(prev => prev + '\n--- Additional Diagnostics ---\n')
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .limit(5)

      if (allProfilesError) {
        setTestResult(prev => prev + `❌ Cannot query profiles table: ${allProfilesError.message}\n`)
      } else {
        setTestResult(prev => prev + `✅ Can query profiles table. Found ${allProfiles?.length || 0} profiles\n`)
        if (allProfiles && allProfiles.length > 0) {
          setTestResult(prev => prev + `Sample profiles: ${JSON.stringify(allProfiles, null, 2)}\n`)
        }
      }

    } catch (error: any) {
      setTestResult(prev => prev + `❌ Test failed: ${error.message}\n`)
      setTestResult(prev => prev + `Stack trace: ${error.stack}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Please Sign In</h1>
          <p className="text-xl mb-6">You need to be signed in to test profile creation.</p>
          <a
            href="/login"
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#614ea5] to-[#493b7b] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Profile Creation Test</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Current User Info:</h2>
            <div className="bg-white/5 rounded-lg p-4 text-white/80 font-mono text-sm">
              <div>Email: {user.email}</div>
              <div>ID: {user.id}</div>
              <div>Created: {new Date(user.created_at).toLocaleString()}</div>
              <div>Provider: {user.app_metadata?.provider || 'email'}</div>
            </div>
          </div>

          <button
            onClick={runTest}
            disabled={isRunning}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isRunning ? 'Running Test...' : 'Run Profile Test'}
          </button>

          {testResult && (
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Test Results:</h3>
              <pre className="text-white/80 font-mono text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}

          <div className="mt-6">
            <a
              href="/membership"
              className="text-white/60 text-sm hover:text-white/80 transition-colors"
            >
              ← Back to Membership
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
