export interface User {
  username: string
  roles: string[]
}

export interface Book {
  id?: number
  title: string
  author: string
  isbn: string
  publicationYear: number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  bookLink?: string
}

export interface BookResponse {
  content: Book[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface LoginResponse {
  token: string
  username: string
  roles: string[]
}

export interface RegisterResponse {
  message: string
  username: string
  roles: string[]
} 