import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import useWebSocketNotifications from "../hooks/useWebSocketNotifications";

function ReviewerDashboard({ userId }) {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const notifications = useWebSocketNotifications(userId);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await api.get("/api/applications");
        setApplications(res.data);
      } catch {
        setError("Failed to fetch applications.");
      }
    }
    fetchApps();
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

  const openApp = (app) => {
    setSelectedApp(app);
    setComments("");
    setError("");
  };

  const submitReview = async (status) => {
    if (!status) {
      setError("Select a review action.");
      return;
    }
    if (status === "REVIEWREJECTED" && !comments.trim()) {
      setError("Comments required when rejecting.");
      return;
    }
    try {
      await api.post(
        `/api/reviewer/reviews/${selectedApp.id}/add`,
        { status, comments },
        { params: { reviewerId: userId } }
      );
      setSelectedApp(null);
      setComments("");
      setError("");
    } catch {
      setError("Failed to submit review.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6D5BBA, #8D58BF, #DE67A3)",
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 900,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.15)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
          color: "white",
          overflowX: "auto",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Reviewer Dashboard
        </Typography>

        <Table sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Vendor</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Submission</TableCell>
              <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                  No assigned applications
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow
                  key={app.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.user?.email}</TableCell>
                  <TableCell>{app.status}</TableCell>
                  <TableCell>
                    {app.submissionDate ? new Date(app.submissionDate).toLocaleString() : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => openApp(app)}
                      sx={{ color: "white", borderColor: "white" }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {selectedApp && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Application Details
            </Typography>
            <Typography>
              <strong>Vendor: </strong> {selectedApp.user?.email}
            </Typography>
            <Typography>
              <strong>Status: </strong> {selectedApp.status}
            </Typography>
            <Typography gutterBottom>
              <strong>Submission: </strong>{" "}
              {selectedApp.submissionDate ? new Date(selectedApp.submissionDate).toLocaleString() : ""}
            </Typography>
            <TextField
              label="Comments (mandatory on rejection)"
              multiline
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              margin="normal"
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "lightgray" } }}
              sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 1 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => submitReview("REVIEWAPPROVED")}
                sx={{ flex: 1, fontWeight: "bold" }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => submitReview("REVIEWREJECTED")}
                sx={{ flex: 1, fontWeight: "bold" }}
              >
                Reject
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedApp(null)}
                sx={{ flex: 1, color: "white", borderColor: "white", fontWeight: "bold" }}
              >
                Back
              </Button>
            </Box>
          </>
        )}

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default ReviewerDashboard;
