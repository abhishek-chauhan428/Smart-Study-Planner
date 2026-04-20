import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export function SignupPage() {
  const navigate = useNavigate()
  const { signUp, loginWithGoogle, pending } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    try {
      await signUp(name.trim(), email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('FIREBASE SIGNUP ERROR:', err)
      setError(err?.message || String(err) || 'Could not create account. Try again.')
    }
  }

  async function handleGoogleSignup() {
    setGoogleError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setGoogleError(err?.code === 'auth/popup-closed-by-user'
        ? 'Sign-up cancelled.'
        : 'Google sign-up failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <h1 className="mb-1.5 text-2xl font-semibold text-slate-900 dark:text-gray-100">Sign up</h1>
      <p className="mb-5 max-w-[52ch] text-slate-600 dark:text-slate-400">
        Create your account to start tracking study sessions.
      </p>

      {/* Google Sign-Up */}
      {googleError && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{googleError}</p>
      )}
      <button
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Signing up…' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400">or sign up with email</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm leading-snug text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-slate-900 dark:text-gray-100">Name</span>
          <input
            className="w-full rounded-lg border border-slate-200 bg-[#f8f7fb] px-3 py-2.5 text-slate-900 outline-none focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-blue-400/50 dark:border-slate-600 dark:bg-[#0f1117] dark:text-gray-100"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-slate-900 dark:text-gray-100">Email</span>
          <input
            className="w-full rounded-lg border border-slate-200 bg-[#f8f7fb] px-3 py-2.5 text-slate-900 outline-none focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-blue-400/50 dark:border-slate-600 dark:bg-[#0f1117] dark:text-gray-100"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-slate-900 dark:text-gray-100">Password</span>
          <input
            className="w-full rounded-lg border border-slate-200 bg-[#f8f7fb] px-3 py-2.5 text-slate-900 outline-none focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-blue-400/50 dark:border-slate-600 dark:bg-[#0f1117] dark:text-gray-100"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-65 dark:bg-blue-500 dark:hover:bg-blue-400"
          disabled={pending}
        >
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 no-underline underline-offset-2 hover:underline dark:text-blue-400"
        >
          Log in
        </Link>
      </p>
    </>
  )
}
