import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Categories from './pages/Categories'
import Assets from './pages/Assets'
import AssetDetail from './pages/AssetDetail'
import History from './pages/History'
import Settings from './pages/Settings'
import Login from './pages/Login'
import AddMonthlyRecord from './pages/AddMonthlyRecord'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/"
        element={
          user ? (
            <AppLayout user={user}>
              <Dashboard />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/portfolio"
        element={
          user ? (
            <AppLayout user={user}>
              <Portfolio />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/categories"
        element={
          user ? (
            <AppLayout user={user}>
              <Categories />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/assets"
        element={
          user ? (
            <AppLayout user={user}>
              <Assets />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/assets/:assetId"
        element={
          user ? (
            <AppLayout user={user}>
              <AssetDetail />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/history"
        element={
          user ? (
            <AppLayout user={user}>
              <History />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
  path="/history/new"
  element={
    user ? (
      <AppLayout user={user}>
        <AddMonthlyRecord />
      </AppLayout>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
        path="/settings"
        element={
          user ? (
            <AppLayout user={user}>
              <Settings />
            </AppLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}

export default App