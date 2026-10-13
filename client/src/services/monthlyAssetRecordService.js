import { supabase } from '../lib/supabase'

const API_URL = 'http://localhost:3000/api/v1/monthly-asset-records'

const getAccessToken = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) throw error

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

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const getMonthlyRecords = async () => {
  return request(API_URL)
}

export const getMonthlyRecord = async (recordId) => {
  return request(`${API_URL}/${recordId}`)
}

export const createMonthlyRecord = async (record) => {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify(record),
  })
}

export const updateMonthlyRecord = async (recordId, record) => {
  return request(`${API_URL}/${recordId}`, {
    method: 'PUT',
    body: JSON.stringify(record),
  })
}

export const deleteMonthlyRecord = async (recordId) => {
  return request(`${API_URL}/${recordId}`, {
    method: 'DELETE',
  })
}