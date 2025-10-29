import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Link as LinkIcon } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { getBooks, deleteBook, searchBooks } from '../services/book'
import { Book } from '../types'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

const BookList = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTitle, setSearchTitle] = useState('')
  const [searchAuthor, setSearchAuthor] = useState('')
  const [searchIsbn, setSearchIsbn] = useState('')
  const [searchYear, setSearchYear] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['books', page, rowsPerPage, searchTitle, searchAuthor, searchIsbn, searchYear],
    queryFn: () => searchBooks(page, rowsPerPage, 'id,asc', searchTitle, searchAuthor, searchIsbn, searchYear ? parseInt(searchYear) : undefined),
    retry: 1
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Book deleted successfully')
      setDeleteDialogOpen(false)
    },
    onError: (error) => {
      console.error('Delete error:', error)
      toast.error('Failed to delete book. Please try again.')
    }
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = () => {
    setPage(0)
    queryClient.invalidateQueries({ queryKey: ['books'] })
  }

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (bookToDelete?.id) {
      deleteMutation.mutate(bookToDelete.id)
    }
  }

  const handleClearSearch = () => {
    setSearchTitle('')
    setSearchAuthor('')
    setSearchIsbn('')
    setSearchYear('')
    setPage(0)
    queryClient.invalidateQueries({ queryKey: ['books'] })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load books. Please try again later.
          {error instanceof Error && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Error: {error.message}
            </Typography>
          )}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Books</Typography>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/books/new')}
            >
              Add New Book
            </Button>
          )}
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Author"
                value={searchAuthor}
                onChange={(e) => setSearchAuthor(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="ISBN"
                value={searchIsbn}
                onChange={(e) => setSearchIsbn(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Year"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                size="small"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleClearSearch}>
                  Clear
                </Button>
                <Button variant="contained" onClick={handleSearch}>
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

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
                <TableCell>Updated At</TableCell>
                {isAdmin && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content && data.content.length > 0 ? (
                data.content.map((book) => (
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
                    <TableCell>
                      {book.updatedAt && format(new Date(book.updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/books/${book.id}/edit`)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(book)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 9 : 8} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No books found. {isAdmin ? 'Add some books to get started!' : 'Check back later for new books.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.totalElements || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

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

export default BookList 