import { supabase } from '../lib/supabase'

const API_URL = 'https://asset-performance-tracker.onrender.com/api/v1/portfolios'

const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  if (!session) {
    throw new Error('You are not authenticated')
  }

  return session.access_token
}

const request = async (url, options = {}) => {
  const token = await getAccessToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const getCategorySummary = async (month) => {
  return request(
    `${API_URL}/category-summary?month=${month}`
  )
}

export const getMonthlySummary = async (month) => {
  return request(
    `${API_URL}/summary?month=${month}`
  )
}

export const getPortfolioPerformance = async (month) => {
  return request(
    `${API_URL}/performance?month=${month}`
  )
}

export const getPortfolioHistory = async (from, to) => {
  return request(
    `${API_URL}/history?from=${from}&to=${to}`
  )
}
