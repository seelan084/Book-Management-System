import axios from 'axios'
import { LoginResponse, RegisterResponse } from '../types'

const API_URL = 'http://localhost:8082/api'

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Sending login request with:', { username, password })
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    })
    console.log('Login response:', response.data)
    const roles = Array.isArray(response.data.roles) ? response.data.roles : []
    return {
      token: response.data.token,
      username: response.data.username,
      roles: roles
    }
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
    }
    throw error
  }
}

export const register = async (username: string, password: string, isAdmin: boolean): Promise<RegisterResponse> => {
  try {
    console.log('Sending registration request with:', { username, isAdmin })
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      password,
      isAdmin
    })
    console.log('Registration response:', response.data)
    const roles = Array.isArray(response.data.roles) ? response.data.roles : []
    return {
      message: response.data.message,
      username: response.data.username,
      roles: roles
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    if (error.response) {
      console.error('Error response:', error.response.data)
    }
    throw error
  }
} 