import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError('')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Google login failed:', error)

      setError(
        error.message || 'Failed to sign in with Google'
      )

      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
              <span className="text-lg font-semibold text-white">
                A
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
              Asset Tracker
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Track your assets and monitor your portfolio.
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Sign in to continue to your portfolio.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.45h3.14c1.84-1.7 2.93-4.2 2.93-7.41Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.99Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.53 14.07A5.86 5.86 0 0 1 6.22 12c0-.72.12-1.42.31-2.07V7.4H3.28A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.6l3.25-2.53Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 5.9c1.43 0 2.72.49 3.74 1.45l2.8-2.8C16.83 2.97 14.63 2 12 2a9.75 9.75 0 0 0-8.72 5.4l3.25 2.53C7.3 7.62 9.46 5.9 12 5.9Z"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            Your account is securely authenticated with Google.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login