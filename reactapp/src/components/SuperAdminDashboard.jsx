import { useEffect, useState } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
} from '@mui/material';

function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/superadmin/users');
      setUsers(res.data);
    } catch (err) {
      setMessage('Failed to fetch users.');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUserId || !newRole) {
      setMessage('Select user and role');
      return;
    }
    try {
      await api.put(`/api/superadmin/users/${selectedUserId}/role`, null, {
        params: { role: newRole },
      });
      setMessage('Role updated');
      fetchUsers();
    } catch {
      setMessage('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/api/superadmin/users/${id}`);
      setMessage('User deleted');
      fetchUsers();
      if (selectedUserId === id) setSelectedUserId(null);
    } catch {
      setMessage('Failed to delete user');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#fff" align="center">
        Super Admin Panel - User Management
      </Typography>
      {message && (
        <Typography sx={{ mb: 2, color: '#ffd700' }}>
          {message}
        </Typography>
      )}
      <Paper
        elevation={6}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 1100,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 750 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(175,0,45,0.8)' }}>
              {['Email', 'Role', 'Actions'].map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: '#fff' }}>
                  No users available
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover sx={{ cursor: 'default' }}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {selectedUserId && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              displayEmpty
              sx={{
                minWidth: 200,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 1,
                color: '#fff',
                '& .MuiOutlinedInput-input': { color: '#fff' },
                '& .MuiSelect-icon': { color: '#fff' },
                '& .MuiInputLabel-root': { color: '#ccc' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
              }}
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="VENDOR">Vendor</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="REVIEWER">Reviewer</MenuItem>
              <MenuItem value="INSPECTOR">Inspector</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
            </Select>
            <Button
              variant="contained"
              color="success"
              onClick={handleRoleChange}
              sx={{ fontWeight: 'bold', minWidth: 120 }}
            >
              Update Role
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default SuperAdminDashboard;
