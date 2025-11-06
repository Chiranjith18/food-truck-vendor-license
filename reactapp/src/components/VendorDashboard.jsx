import React, { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import useWebSocketNotifications from "../hooks/useWebSocketNotifications";
import api from "../api";

function VendorDashboard({ userId }) {
  const [apps, setApps] = useState([]);
  const notifications = useWebSocketNotifications(userId);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/applications")
      .then(res => setApps(res.data))
      .catch(() => alert("Failed to load applications"));
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setMessage(notifications[notifications.length - 1].message);
      setOpen(true);
    }
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)", p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 900, borderRadius: 4, color: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>Your Applications</Typography>
        <Table sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Submitted</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>License Number</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Expiry Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apps.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No applications</TableCell>
              </TableRow>
            )}
            {apps.map(app => (
              <TableRow key={app.id}>
                <TableCell>{app.id}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{app.submissionDate ? new Date(app.submissionDate).toLocaleString() : ""}</TableCell>
                <TableCell>{app.licenseNumber || "-"}</TableCell>
                <TableCell>{app.licenseExpiryDate ? new Date(app.licenseExpiryDate).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default VendorDashboard;
