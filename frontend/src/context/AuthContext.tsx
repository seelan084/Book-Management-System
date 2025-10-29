import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login as loginService, register as registerService } from '../services/auth'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, isAdmin: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.username && parsedUser.roles) {
          setUser(parsedUser)
        } else {
          // Invalid user data, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error)
      // Clear invalid data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await loginService(username, password)
      console.log('Login response:', response)
      const userData = {
        username: response.username,
        roles: response.roles
      }
      console.log('Setting user data:', userData)
      console.log('User roles:', userData.roles)
      console.log('Is admin?', userData.roles.includes('ADMIN'))
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      // Verify admin status after setting user
      console.log('User state after login:', user)
      console.log('Is admin after state update?', userData.roles.includes('ADMIN'))
      
      toast.success('Login successful!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your credentials.')
      throw error
    }
  }

  const register = async (username: string, password: string, isAdmin: boolean) => {
    try {
      console.log('AuthContext: Registering user:', { username, isAdmin })
      const response = await registerService(username, password, isAdmin)
      console.log('AuthContext: Registration response:', response)
      return response
    } catch (error) {
      console.error('AuthContext: Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
    toast.success('Logged out successfully!')
  }

  const isAuthenticated = !!user
  const isAdmin = user?.roles.includes('ADMIN') ?? false

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 