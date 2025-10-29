import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers } from '../services/user'
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { People } from '@mui/icons-material'

const Users = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState<Array<{ username: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (err) {
        console.error('Error fetching users:', err)
        setError('Failed to load users. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (user?.roles.includes('ADMIN')) {
      fetchUsers()
    }
  }, [user])

  if (!user?.roles.includes('ADMIN')) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">You do not have permission to view this page.</Alert>
      </Container>
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h1">
          Registered Users
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {users.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No users registered yet.
          </Typography>
        ) : (
          <List>
            {users.map((user, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}

export default Users 