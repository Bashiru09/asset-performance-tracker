import { useEffect, useState } from 'react'
import { LogOut, User, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Settings() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      setError('')

      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      navigate('/login')
    } catch (error) {
      console.error('Failed to log out:', error)
      setError(error.message || 'Failed to log out')
      setLoggingOut(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage your account and application settings.
        </p>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="font-semibold text-zinc-900">
            Account
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your account information.
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {/* Email */}
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <Mail
                size={18}
                className="text-zinc-600"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-900">
                {user?.email || 'No email available'}
              </p>
            </div>
          </div>

          {/* Authentication */}
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
              <User
                size={18}
                className="text-zinc-600"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Authentication
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-900">
                Google
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="font-semibold text-zinc-900">
            Session
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your current session.
          </p>
        </div>

        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={17} />

            {loggingOut
              ? 'Signing out...'
              : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings