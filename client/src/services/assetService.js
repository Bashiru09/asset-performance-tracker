import { supabase } from '../lib/supabase'

const API_URL = 'http://localhost:3000/api/v1/assets'

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

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const getAssets = async () => {
  return request(API_URL)
}

export const createAsset = async (name, categoryId) => {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      name,
      categoryId,
    }),
  })
}


export const updateAsset = async (assetId, name) => {
  return request(`${API_URL}/${assetId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
    }),
  })
}


export const deleteAsset = async (assetId) => {
  return request(`${API_URL}/${assetId}`, {
    method: 'DELETE',
  })
}

export const getAsset = async (assetId) => {
  return request(`${API_URL}/${assetId}`)
}



