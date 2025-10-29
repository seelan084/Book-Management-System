import axios from 'axios'

const API_URL = 'http://localhost:8082/api'

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface User {
  id: number
  username: string
  roles: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, data)
  return response.data
}

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, data)
  return response.data
}

export const getUserCount = async (): Promise<number> => {
  try {
    console.log('Fetching user count...')
    const response = await api.get('/users/count')
    console.log('User count response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching user count:', error)
    throw error
  }
}

export const getAllUsers = async (): Promise<Array<{ username: string }>> => {
  try {
    console.log('Fetching all users...')
    const response = await api.get('/users')
    console.log('Users response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
} 