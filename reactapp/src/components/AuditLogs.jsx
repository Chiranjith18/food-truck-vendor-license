import { useEffect, useState } from 'react';
import api from '../api';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/api/admin/audit-logs').then(res => setLogs(res.data));
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)',
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 1200,
          borderRadius: 4,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          color: '#fff',
          overflowX: 'auto',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Audit Logs
        </Typography>
        <Table sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {['User', 'IP', 'Time', 'Module', 'Operation', 'Details'].map(header => (
                <TableCell key={header} sx={{ fontWeight: 'bold', color: '#FFD700' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#fff' }}>
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map(log => (
                <TableRow key={log.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}>
                  <TableCell>{log.user?.email || '-'}</TableCell>
                  <TableCell>{log.ipAddress || '-'}</TableCell>
                  <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                  <TableCell>{log.module || '-'}</TableCell>
                  <TableCell>{log.operation || '-'}</TableCell>
                  <TableCell>{log.details || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default AuditLogs;
