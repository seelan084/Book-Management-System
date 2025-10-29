import axios from 'axios'
import { Book, BookResponse } from '../types'

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

export const getBookCount = async (): Promise<number> => {
  try {
    console.log('Fetching book count...')
    const response = await api.get('/books/count')
    console.log('Book count response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching book count:', error)
    throw error
  }
}

export const getBooks = async (page = 0, size = 10, sort = 'id,asc'): Promise<BookResponse> => {
  try {
    console.log('Fetching books...')
    const response = await api.get(`/books?page=${page}&size=${size}&sort=${sort}`)
    console.log('Books response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

export const getBook = async (id: number): Promise<Book> => {
  try {
    console.log(`Fetching book ${id}...`)
    const response = await api.get(`/books/${id}`)
    console.log('Book response:', response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error)
    throw error
  }
}

export const createBook = async (book: Book): Promise<Book> => {
  try {
    console.log('Creating book:', book)
    const response = await api.post('/books', book)
    console.log('Create book response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating book:', error)
    throw error
  }
}

export const updateBook = async (id: number, book: Book): Promise<Book> => {
  try {
    console.log(`Updating book ${id}:`, book)
    const response = await api.put(`/books/${id}`, book)
    console.log('Update book response:', response.data)
    return response.data
  } catch (error) {
    console.error(`Error updating book ${id}:`, error)
    throw error
  }
}

export const deleteBook = async (id: number): Promise<void> => {
  try {
    console.log(`Deleting book ${id}...`)
    await api.delete(`/books/${id}`)
    console.log('Book deleted successfully')
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error)
    throw error
  }
}

export const searchBooks = async (
  page = 0,
  size = 10,
  sort = 'id,asc',
  title?: string,
  author?: string,
  isbn?: string,
  year?: number
): Promise<BookResponse> => {
  try {
    console.log('Searching books with params:', { page, size, sort, title, author, isbn, year })
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort
    })
    if (title) params.append('title', title)
    if (author) params.append('author', author)
    if (isbn) params.append('isbn', isbn)
    if (year) params.append('year', year.toString())

    const response = await api.get(`/books/search?${params.toString()}`)
    console.log('Search response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error searching books:', error)
    throw error
  }
} 