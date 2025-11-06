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
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import useWebSocketNotifications from "../hooks/useWebSocketNotifications";

function InspectorDashboard({ userId }) {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const notifications = useWebSocketNotifications(userId);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await api.get("/api/applications");
        setApps(res.data);
      } catch {
        setError("Failed to fetch inspection tasks");
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

  const startInspection = (app) => {
    setSelected(app);
    setNotes("");
    setResult("");
    setError("");
  };

  const submitInspection = async () => {
    if (!notes.trim()) {
      setError("Notes are required for inspection.");
      return;
    }
    if (!result) {
      setError("Select inspection result.");
      return;
    }
    try {
      await api.post(
        `/api/inspector/inspections/${selected.id}/add`,
        { notes, result },
        { params: { inspectorId: userId } }
      );
      setSelected(null);
      setNotes("");
      setResult("");
      setError("");
    } catch {
      setError("Failed to submit inspection.");
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
          Inspector Dashboard
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
            {apps.filter((app) => app.status === "INSPECTIONSCHEDULED").length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "white" }}>
                  No inspections assigned
                </TableCell>
              </TableRow>
            ) : (
              apps
                .filter((app) => app.status === "INSPECTIONSCHEDULED")
                .map((app) => (
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
                        onClick={() => startInspection(app)}
                        sx={{ color: "white", borderColor: "white" }}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        {selected && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Inspect Application {selected.id}
            </Typography>
            <Typography>
              <strong>Vendor: </strong> {selected.user?.email}
            </Typography>
            <Typography gutterBottom>
              <strong>Status: </strong> {selected.status}
            </Typography>

            <TextField
              label="Inspection Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "lightgray" } }}
              sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 1 }}
            />

            <Select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              displayEmpty
              fullWidth
              variant="filled"
              sx={{
                mb: 3,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                color: result ? "white" : "lightgray",
              }}
              inputProps={{ "aria-label": "Select inspection result" }}
            >
              <MenuItem value="" disabled>
                Select Result
              </MenuItem>
              <MenuItem value="PASSED">Passed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="FOLLOWUPREQUIRED">Follow Up Required</MenuItem>
            </Select>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitInspection}
                sx={{ flex: 1, fontWeight: "bold" }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelected(null)}
                sx={{ flex: 1, fontWeight: "bold", color: "white", borderColor: "white" }}
              >
                Cancel
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

export default InspectorDashboard;
