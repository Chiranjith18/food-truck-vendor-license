import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviewerId, setReviewerId] = useState('');
  const [inspectorId, setInspectorId] = useState('');

  useEffect(() => {
    api.get('/api/applications').then(res => setApps(res.data));
    api.get('/api/admin/users').then(res => setUsers(res.data));
  }, []);

  const assignReviewer = () => {
    if (!reviewerId) return alert('Select a reviewer first');
    api
      .put(`/api/applications/${selected.id}/assignReviewer`, null, { params: { reviewerId } })
      .then(() => alert('Assigned Reviewer'));
  };

  const assignInspector = () => {
    if (!inspectorId) return alert('Select an inspector first');
    api
      .put(`/api/applications/${selected.id}/assignInspector`, null, { params: { inspectorId } })
      .then(() => alert('Assigned Inspector'));
  };

  const issueLicense = () => {
    api.put(`/api/applications/${selected.id}/issueLicense`).then(() => alert('License Issued'));
  };

  const changestatus = async () => {
    if (!selected) return alert('Please select an application first');
    try {
      await api.put(`/api/applications/${selected.id}/status`, null, { params: { status: 'APPROVED' } });
      alert('Status changed to Approved');
      const res = await api.get('/api/applications');
      setApps(res.data);
      setSelected(null);
      setReviewerId('');
      setInspectorId('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change status to approved');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="#fff" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: 1200,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
          overflowX: 'auto',
          mb: 4,
        }}
      >
        <Table sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {['ID', 'Vendor', 'Status', 'Reviewer', 'Inspector', 'Select'].map(header => (
                <TableCell key={header} sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {apps.map(a => (
              <TableRow
                key={a.id}
                selected={selected?.id === a.id}
                sx={{ '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.3)' } }}
              >
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.user?.email}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>{a.assignedReviewer?.email || '-'}</TableCell>
                <TableCell>{a.assignedInspector?.email || '-'}</TableCell>
                <TableCell>
                  <Radio checked={selected?.id === a.id} onChange={() => setSelected(a)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selected && (
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: '#ccc' }}>Select Reviewer</InputLabel>
              <Select
                value={reviewerId}
                onChange={e => setReviewerId(e.target.value)}
                sx={{ color: '#fff', '.MuiSelect-icon': { color: '#fff' } }}
                label="Select Reviewer"
              >
                {users
                  .filter(u => u.role === 'REVIEWER')
                  .map(u => (
                    <MenuItem key={u.id} value={u.id} sx={{ color: '#000' }}>
                      {u.email}
                    </MenuItem>
                  ))}
              </Select>
              <Button
                variant="outlined"
                onClick={assignReviewer}
                startIcon={<AssignmentIndIcon />}
                sx={{ mt: 1, color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#FFD700', color: '#FFD700' } }}
              >
                Assign Reviewer
              </Button>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: '#ccc' }}>Select Inspector</InputLabel>
              <Select
                value={inspectorId}
                onChange={e => setInspectorId(e.target.value)}
                sx={{ color: '#fff', '.MuiSelect-icon': { color: '#fff' } }}
                label="Select Inspector"
              >
                {users
                  .filter(u => u.role === 'INSPECTOR')
                  .map(u => (
                    <MenuItem key={u.id} value={u.id} sx={{ color: '#000' }}>
                      {u.email}
                    </MenuItem>
                  ))}
              </Select>
              <Button
                variant="outlined"
                onClick={assignInspector}
                startIcon={<AssignmentIndIcon />}
                sx={{ mt: 1, color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#FFD700', color: '#FFD700' } }}
              >
                Assign Inspector
              </Button>
            </FormControl>

            <Button variant="contained" color="success" onClick={changestatus} sx={{ height: 40, alignSelf: 'center' }}>
              Approve
            </Button>
            <Button variant="contained" color="primary" onClick={issueLicense} sx={{ height: 40, alignSelf: 'center' }}>
              Issue License
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default AdminDashboard;
