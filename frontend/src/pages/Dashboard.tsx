import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookCount, getBooks, deleteBook } from '../services/book'
import { getUserCount } from '../services/user'
import { Book } from '../types'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { People, MenuBook, AdminPanelSettings, Add, Edit, Delete, Link as LinkIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookCount, setBookCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [books, setBooks] = useState<Book[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const isAdmin = user?.roles.includes('ADMIN')

  const fetchCounts = async () => {
    try {
      console.log('Fetching counts...')
      const [books, users] = await Promise.all([
        getBookCount(),
        getUserCount()
      ])
      console.log('Book count:', books)
      console.log('User count:', users)
      setBookCount(books)
      setUserCount(users)
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  }

  const fetchBooks = async () => {
    try {
      console.log('Fetching books...')
      const response = await getBooks(0, 5) // Get first 5 books
      console.log('Books response:', response)
      setBooks(response.content)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (bookToDelete?.id) {
      try {
        await deleteBook(bookToDelete.id)
        toast.success('Book deleted successfully')
        setDeleteDialogOpen(false)
        // Refresh the data
        fetchCounts()
        fetchBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
        toast.error('Failed to delete book')
      }
    }
  }

  useEffect(() => {
    fetchCounts()
    fetchBooks()
  }, [])

  // Refresh counts when navigating back to dashboard
  useEffect(() => {
    const handleFocus = () => {
      fetchCounts()
      fetchBooks()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: isAdmin ? 'primary.light' : 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user?.username}!
            </Typography>
            <Typography variant="h5" color={isAdmin ? 'primary.contrastText' : 'text.secondary'}>
              {isAdmin ? 'Administrator Dashboard' : 'User Dashboard'}
            </Typography>
          </Box>
          {isAdmin && (
            <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.contrastText' }} />
          )}
        </Box>
      </Paper>

      {isAdmin && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Admin Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/books/new')}
              >
                Add New Book
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<People />}
                onClick={() => navigate('/users')}
              >
                Manage Users
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MenuBook sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="div">
                  Total Books
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                {bookCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Books in the library
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    Total Users
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                  {userCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Recent Books Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Recent Books</Typography>
          <Button
            variant="outlined"
            startIcon={<MenuBook />}
            onClick={() => navigate('/books')}
          >
            View All Books
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Book Link</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                {isAdmin && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {books.length > 0 ? (
                books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.publicationYear}</TableCell>
                    <TableCell>
                      {book.bookLink ? (
                        <Button
                          href={book.bookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          startIcon={<LinkIcon />}
                          color="primary"
                        >
                          Read Book
                        </Button>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          No link available
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={book.createdBy} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {book.createdAt && format(new Date(book.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/books/${book.id}/edit`)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(book)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 8 : 7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No books found. {isAdmin ? 'Add some books to get started!' : 'Check back later for new books.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the book "{bookToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Dashboard 