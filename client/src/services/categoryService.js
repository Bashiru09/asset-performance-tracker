import { supabase } from '../lib/supabase'

const API_URL = 'https://asset-performance-tracker.onrender.com/api/v1/categories'

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

export const getCategories = async () => {
  return request(API_URL)
}

export const createCategory = async (name) => {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
  })
}

export const deleteCategory = async (categoryId) => {
  return request(`${API_URL}/${categoryId}`, {
    method: 'DELETE',
  })
}


export const updateCategory = async (categoryId, name) => {
  return request(`${API_URL}/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
}