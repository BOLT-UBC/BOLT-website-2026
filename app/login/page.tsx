'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { authService } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08050f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
            <p className="text-white/60 font-mono text-sm">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()

  const nextPath = searchParams.get('next') || '/membership'

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmailMessage, setCheckEmailMessage] =
    useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  })

  useEffect(() => {
    if (!authLoading && user) {
      router.push(nextPath)
    }
  }, [user, authLoading, router, nextPath])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError(null)
    setCheckEmailMessage(null)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setCheckEmailMessage(null)

    try {
      if (isLogin) {
        const { error } = await authService.signIn(
          formData.email,
          formData.password
        )

        if (error) throw error

        router.push(nextPath)
      } else {
        const { user, session, error } =
          await authService.signUp(
            formData.email,
            formData.password,
            formData.fullName
          )

        if (error) throw error

        if (user && !session) {
          setCheckEmailMessage(
            `We sent a confirmation link to ${formData.email}. Check your inbox and spam folder to verify your account before signing in.`
          )
        } else if (user) {
          router.push(nextPath)
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred'

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#08050f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl" />

            <div className="relative w-12 h-12 rounded-full border-2 border-purple-400/20 border-t-purple-400 animate-spin" />
          </div>

          <p className="text-white/50 font-mono text-sm tracking-wide">
            Checking session...
          </p>
        </div>
      </main>
    )
  }

  if (user) {
    return (
      <main className="min-h-screen bg-[#08050f] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Redirecting
          </h1>

          <p className="mt-2 text-white/50 font-mono text-sm">
            Taking you to your membership portal...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08050f] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 pointer-events-none">
        {/* Main purple glow */}
        <div
          className="
            absolute
            -top-40
            left-1/2
            -translate-x-1/2
            w-[650px]
            h-[500px]
            rounded-full
            bg-purple-700/20
            blur-[140px]
          "
        />

        {/* Left glow */}
        <div
          className="
            absolute
            top-1/3
            -left-48
            w-[400px]
            h-[400px]
            rounded-full
            bg-violet-800/10
            blur-[120px]
          "
        />

        {/* Bottom glow */}
        <div
          className="
            absolute
            -bottom-48
            right-0
            w-[500px]
            h-[500px]
            rounded-full
            bg-purple-900/20
            blur-[130px]
          "
        />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)]
            bg-[size:55px_55px]
          "
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#08050f_90%)]" />
      </div>

      {/* =====================================================
          TOP BRAND
      ====================================================== */}

      <div className="relative z-10 pt-8 px-6">
        <button
          onClick={() => router.push('/')}
          className="
            group
            flex
            items-center
            gap-3
            mx-auto
            text-white
            transition-all
            duration-200
          "
        >
          <div
            className="
              relative
              w-11
              h-11
              rounded-xl
              bg-white/[0.06]
              border
              border-white/10
              backdrop-blur-xl
              flex
              items-center
              justify-center
              overflow-hidden
              group-hover:border-purple-400/40
              transition-all
            "
          >
            <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-all" />

            <Image
              src="/images/Logo.webp"
              alt="BOLT UBC Logo"
              width={38}
              height={38}
              className="relative object-contain"
            />
          </div>

          <div className="text-left">
            <p className="font-mono text-sm font-semibold tracking-[0.25em]">
              BOLT
            </p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              UBC
            </p>
          </div>
        </button>
      </div>

      {/* =====================================================
          LOGIN AREA
      ====================================================== */}

      <div className="relative z-10 min-h-[calc(100vh-100px)] flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[460px]">

          {/* Heading */}
          <div className="text-center mb-8">
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-purple-500/10
                border
                border-purple-400/20
                mb-5
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/80 font-mono">
                Member Portal
              </span>
            </div>

            <h1
              className="
                text-3xl
                md:text-4xl
                font-semibold
                tracking-[-0.03em]
                text-white
              "
            >
              {isLogin
                ? 'Welcome back.'
                : 'Join the community.'}
            </h1>

            <p className="mt-3 text-sm text-white/45 leading-relaxed max-w-sm mx-auto">
              {isLogin
                ? 'Sign in to access your BOLT membership portal and exclusive resources.'
                : 'Create your BOLT account and unlock access to member-only resources and opportunities.'}
            </p>
          </div>

          {/* =================================================
              CARD
          ================================================== */}

          <div
            className="
              relative
              rounded-[26px]
              border
              border-white/[0.10]
              bg-white/[0.045]
              backdrop-blur-2xl
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              overflow-hidden
            "
          >
            {/* Card glow */}
            <div
              className="
                absolute
                -top-32
                left-1/2
                -translate-x-1/2
                w-72
                h-72
                rounded-full
                bg-purple-600/10
                blur-[90px]
                pointer-events-none
              "
            />

            <div className="relative p-6 sm:p-8">

              {/* Form */}
              <form
                onSubmit={handleEmailAuth}
                className="space-y-5"
              >

                {/* Full name */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="
                        block
                        mb-2
                        text-[11px]
                        uppercase
                        tracking-[0.14em]
                        text-white/45
                        font-mono
                      "
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="Your full name"
                      className="
                        w-full
                        h-12
                        px-4
                        rounded-xl
                        bg-black/20
                        border
                        border-white/10
                        text-white
                        text-sm
                        placeholder:text-white/20
                        outline-none
                        transition-all
                        duration-200
                        focus:border-purple-400/60
                        focus:bg-purple-500/[0.04]
                        focus:ring-4
                        focus:ring-purple-500/10
                      "
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="
                      block
                      mb-2
                      text-[11px]
                      uppercase
                      tracking-[0.14em]
                      text-white/45
                      font-mono
                    "
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-xl
                      bg-black/20
                      border
                      border-white/10
                      text-white
                      text-sm
                      placeholder:text-white/20
                      outline-none
                      transition-all
                      duration-200
                      focus:border-purple-400/60
                      focus:bg-purple-500/[0.04]
                      focus:ring-4
                      focus:ring-purple-500/10
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="
                        text-[11px]
                        uppercase
                        tracking-[0.14em]
                        text-white/45
                        font-mono
                      "
                    >
                      Password
                    </label>
                  </div>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    autoComplete={
                      isLogin
                        ? 'current-password'
                        : 'new-password'
                    }
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-xl
                      bg-black/20
                      border
                      border-white/10
                      text-white
                      text-sm
                      placeholder:text-white/20
                      outline-none
                      transition-all
                      duration-200
                      focus:border-purple-400/60
                      focus:bg-purple-500/[0.04]
                      focus:ring-4
                      focus:ring-purple-500/10
                    "
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="
                      flex
                      gap-3
                      p-3.5
                      rounded-xl
                      bg-red-500/[0.08]
                      border
                      border-red-400/20
                    "
                  >
                    <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-red-500/15 flex items-center justify-center">
                      <span className="text-red-300 text-xs">
                        !
                      </span>
                    </div>

                    <p className="text-red-200/80 text-xs leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success */}
                {checkEmailMessage && (
                  <div
                    className="
                      flex
                      gap-3
                      p-3.5
                      rounded-xl
                      bg-emerald-500/[0.08]
                      border
                      border-emerald-400/20
                    "
                  >
                    <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <span className="text-emerald-300 text-xs">
                        ✓
                      </span>
                    </div>

                    <p className="text-emerald-200/80 text-xs leading-relaxed">
                      {checkEmailMessage}
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !!checkEmailMessage}
                  className="
                    group
                    relative
                    w-full
                    h-12
                    rounded-xl
                    overflow-hidden
                    bg-gradient-to-r
                    from-[#8b5cf6]
                    via-[#7c3aed]
                    to-[#6d28d9]
                    text-white
                    text-sm
                    font-semibold
                    shadow-[0_10px_30px_rgba(124,58,237,0.25)]
                    transition-all
                    duration-200
                    hover:shadow-[0_12px_40px_rgba(124,58,237,0.4)]
                    hover:-translate-y-[1px]
                    active:translate-y-0
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:translate-y-0
                  "
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <span className="relative">
                    {loading
                      ? 'Please wait...'
                      : checkEmailMessage
                      ? 'Check your email'
                      : isLogin
                      ? 'Sign In'
                      : 'Create Account'}
                  </span>
                </button>
              </form>

              {/* Toggle */}
              <div className="mt-7 text-center">
                <span className="text-xs text-white/35">
                  {isLogin
                    ? "Don't have an account?"
                    : 'Already have an account?'}
                </span>

                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError(null)
                    setCheckEmailMessage(null)

                    setFormData({
                      email: '',
                      password: '',
                      fullName: '',
                    })
                  }}
                  className="
                    ml-2
                    text-xs
                    text-purple-300
                    hover:text-purple-200
                    font-medium
                    transition-colors
                  "
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </div>

              {/* Forgot password */}
              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    onClick={async () => {
                      if (!formData.email) {
                        setError(
                          'Please enter your email address first'
                        )
                        return
                      }

                      try {
                        await authService.resetPassword(
                          formData.email
                        )

                        setError(
                          'Password reset email sent! Check your inbox.'
                        )
                      } catch (error: unknown) {
                        const errorMessage =
                          error instanceof Error
                            ? error.message
                            : 'Failed to send reset email'

                        setError(errorMessage)
                      }
                    }}
                    className="
                      text-[11px]
                      text-white/30
                      hover:text-purple-300
                      transition-colors
                    "
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              BACK TO HOME
          ================================================== */}

          <div className="mt-7 text-center">
            <button
              onClick={() => router.push('/')}
              className="
                group
                inline-flex
                items-center
                gap-2
                text-xs
                text-white/35
                hover:text-white/70
                transition-colors
              "
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                ←
              </span>

              Back to home
            </button>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-white/15 font-mono">
            BOLT UBC • Member Access
          </p>
        </div>
      </div>
    </main>
  )
}
