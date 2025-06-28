// @mui material components

import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
//import { toast } from "react-toastify";
import DashboardLayout from "examples/Admin/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Admin/Navbars/DashboardNavbar";
import { Paper, Typography, Grid, Button, TextField, Box, Divider } from "@mui/material";

function CustomerSupport() {
  const [connection, setConnection] = useState(null);
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5110/chathub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    if (!connection) return;

    // Setup event handlers first
    connection.on("ReceiveGuestMessage", (guestId, message) => {
      if (guestId === selectedGuest) {
        setChat((prev) => [...prev, { user: guestId, text: message }]);
      }
    });

    connection.on("UpdateGuestList", (guestIds) => {
      setGuests(guestIds);
    });

    // Only start if connection is disconnected
    if (connection.state === "Disconnected") {
      connection
        .start()
        .then(() => connection.invoke("RegisterAdmin"))
        .catch(console.error);
    }
  }, [connection, selectedGuest]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Grid container spacing={3}>
        {/* Guest List Sidebar */}
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 2, height: "70vh", overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
              👥 Active Guests
            </Typography>

            {guests.length === 0 && <Typography color="textSecondary">No active guests</Typography>}

            {guests.map((guestId) => (
              <Button
                key={guestId}
                fullWidth
                variant={guestId === selectedGuest ? "contained" : "outlined"}
                onClick={async () => {
                  setSelectedGuest(guestId);

                  if (connection) {
                    try {
                      const history = await connection.invoke("GetGuestChat", guestId);
                      const mapped = history.map((h) => ({
                        user: h.sender || h.Sender,
                        text: h.message || h.Message,
                      }));

                      setChat(mapped);
                    } catch (err) {
                      console.error("❌ Failed to load chat history:", err);
                    }
                  }
                }}
                sx={{
                  mb: 1,
                  color: guestId === selectedGuest ? "#fff" : "inherit",
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                GUEST: #{guestId}
              </Button>
            ))}
          </Paper>
        </Grid>

        {/* Chat Window */}
        <Grid item xs={8}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#263238",
              color: "#fff",
              borderRadius: 2,
            }}
          >
            {selectedGuest && (
              <Button variant="light" fullWidth>
                GUEST: #{selectedGuest}
              </Button>
            )}
            <Divider sx={{ bgcolor: "#fff", height: 2 }} />

            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                mb: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {chat.length === 0 && (
                <Typography sx={{ mt: 2, color: "#fff", textAlign: "center" }}>
                  Select chat
                </Typography>
              )}

              {chat.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    alignSelf: msg.user === "Admin" ? "flex-end" : "flex-start",
                    backgroundColor: msg.user === "Admin" ? "#43A047" : "#455A64",
                    color: "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "60%",
                    mb: 1,
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              ))}

              {/* 👇 Scroll anchor here */}
              <div ref={chatEndRef} />
            </Box>

            {/* Message input */}
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!selectedGuest}
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!message.trim() || !selectedGuest) return;
                    try {
                      await connection.send("SendMessageToGuest", selectedGuest, message);
                      setChat((prev) => [...prev, { user: "Admin", text: message }]);
                      setMessage("");
                    } catch (error) {
                      console.error("Failed to send message:", error);
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#fff" }}
                disabled={!selectedGuest}
                onClick={async () => {
                  if (!message.trim() || !selectedGuest) return;
                  try {
                    await connection.send("SendMessageToGuest", selectedGuest, message);
                    setChat((prev) => [...prev, { user: "Admin", text: message }]);
                    setMessage("");
                  } catch (error) {
                    console.error("Failed to send message:", error);
                  }
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default CustomerSupport;
