import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createBook, updateBook, getBook, deleteBook } from '../services/book'
import { useAuth } from '../context/AuthContext'

const BookForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: ''
  })

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(Number(id)),
    enabled: !!id
  })

  useEffect(() => {
    if (id) {
      fetchBook()
    }
  }, [id])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const book = await getBook(Number(id))
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publicationYear: book.publicationYear.toString()
      })
    } catch (err) {
      setError('Failed to fetch book details')
      console.error('Error fetching book:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const bookData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear)
      }

      if (id) {
        await updateBook(Number(id), bookData)
      } else {
        await createBook(bookData)
      }
      navigate('/books')
    } catch (err) {
      setError('Failed to save book')
      console.error('Error saving book:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      await deleteBook(Number(id))
      navigate('/books')
    } catch (err) {
      setError('Failed to delete book')
      console.error('Error deleting book:', err)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Book' : 'Add New Book'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!error && error.includes('Title')}
                helperText={error && error.includes('Title') ? error : ''}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                error={!!error && error.includes('Author')}
                helperText={error && error.includes('Author') ? error : ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                error={!!error && error.includes('ISBN')}
                helperText={error && error.includes('ISBN') ? error : 'Format: 0-7475-3269-9'}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Publication Year"
                name="publicationYear"
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                error={!!error && error.includes('Publication Year')}
                helperText={error && error.includes('Publication Year') ? error : ''}
                required
                inputProps={{
                  min: 1800,
                  max: new Date().getFullYear()
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {id && isAdmin && (
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={loading}
              >
                Delete Book
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Book' : 'Add Book'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/books')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this book? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BookForm 