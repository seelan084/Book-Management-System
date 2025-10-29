import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createBook, updateBook, getBook } from '../services/book'
import { Book } from '../types'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid
} from '@mui/material'
import { toast } from 'react-toastify'

interface BookFormProps {
  bookId?: number
}

const BookForm = ({ bookId }: BookFormProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    bookLink: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          const book = await getBook(bookId)
          setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationYear: book.publicationYear,
            bookLink: book.bookLink || ''
          })
        } catch (error) {
          console.error('Error fetching book:', error)
          toast.error('Failed to fetch book details')
          navigate('/books')
        }
      }
      fetchBook()
    }
  }, [bookId, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publicationYear' ? parseInt(value) || '' : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (bookId) {
        await updateBook(bookId, formData)
        toast.success('Book updated successfully')
      } else {
        await createBook(formData)
        toast.success('Book added successfully')
      }
      navigate('/books')
    } catch (error) {
      console.error('Error saving book:', error)
      toast.error(bookId ? 'Failed to update book' : 'Failed to add book')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {bookId ? 'Edit Book' : 'Add New Book'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                onChange={handleChange}
                inputProps={{ min: 1000, max: new Date().getFullYear() }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Book Link (URL)"
                name="bookLink"
                value={formData.bookLink}
                onChange={handleChange}
                placeholder="https://example.com/book"
                helperText="Enter the URL where users can read the book online"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Saving...' : bookId ? 'Update Book' : 'Add Book'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default BookForm 