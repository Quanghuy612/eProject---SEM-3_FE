// @mui material components
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Material Kit 2 React footerRoutes
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Routes
import getRoutes from "routes";

// Images
import contactBg from "assets/images/bg2.jpg";

// Icons
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LockIcon from "@mui/icons-material/Lock";
import ReplayIcon from "@mui/icons-material/Replay";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MKButton from "components/User/MKButton";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

import { useState, useRef, useEffect } from "react";

function CustomerSupport() {
  const routes = getRoutes();
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const handleChatClick = async () => {
    let chatId = localStorage.getItem("chatId");
    if (!chatId) {
      chatId = crypto.randomUUID();
      localStorage.setItem("chatId", chatId);
    }
    if (!chatActive) {
      if (!connection) {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5110/chathub")
          .withAutomaticReconnect()
          .build();

        try {
          await newConnection.start();
          console.log("✅ SignalR connected");

          // Register the guest with the backend
          await newConnection.invoke("RegisterGuest", chatId);

          newConnection.on("ReceiveMessage", (user, message) => {
            setChat((prev) => [...prev, { user, text: message }]);
          });

          setConnection(newConnection);
          setChatActive(true);
        } catch (error) {
          toast.error("Failed to start chat service. Try again later.");
          console.error("SignalR connection error:", error);
        }
      } else {
        try {
          await connection.invoke("RegisterGuest", chatId);
        } catch (error) {
          console.error("Failed to register guest:", error);
        }

        setChatActive(true);
      }
    } else {
      if (message.trim() === "") return;
      if (connection?.state !== signalR.HubConnectionState.Connected) {
        console.warn("❌ SignalR is not connected.");
        toast.error("Chat not connected. Please try again.");
        return;
      }

      try {
        await connection.send("SendMessageToAdmin", chatId, message);
        setChat((prev) => [...prev, { user: "You", text: message }]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message.");
      }
    }
  };

  return (
    <>
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: () =>
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${contactBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at 30% 50%, rgba(179, 207, 215, 0.1) 0%, transparent 70%)",
            zIndex: 0,
          },
        }}
      >
        <MKBox width="100%" zIndex={10}>
          <DefaultNavbar routes={routes} light />
        </MKBox>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100%", zIndex: 1, marginTop: 1 }}
        >
          <Grid item xs={12} lg={5} sx={{ display: "flex", justifyContent: "center" }}>
            <MKBox
              width="90%"
              borderRadius="xl"
              p={5}
              sx={{
                height: "75vh",
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(26, 26, 46, 0.8)",
                border: "1px solid rgba(179, 207, 215, 0.4)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
                  borderColor: "rgba(179, 207, 215, 0.6)",
                },
              }}
            >
              <MKTypography
                variant="h1"
                color="white"
                mb={4}
                textAlign="center"
                sx={{
                  textShadow: "0 0 15px rgba(179, 207, 215, 0.7)",
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    display: "block",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #B3CFD7, transparent)",
                    margin: "15px auto 0",
                    borderRadius: "2px",
                  },
                }}
              >
                Frequently Q & A
              </MKTypography>

              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <HelpOutlineIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        How long does it take to process a recharge?
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        Most recharges are processed instantly. In rare cases, it may take up to 5
                        minutes.
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <LockIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        Is my payment information secure?
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        Yes. We use secure SSL encryption and do not store any card or banking
                        details.
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <ReplayIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        What if my recharge fails?
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        If a recharge fails, the amount will be automatically refunded within 1–2
                        business days.
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={90}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <AccountBalanceWalletIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        What payment methods are supported?
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        We accepted payment methods include credit/debit cards, bank transfers,
                        digital wallets, and postpaid options for registered users.
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>
              </Grid>
            </MKBox>
          </Grid>

          <Grid
            item
            xs={12}
            lg={5}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <MKBox
              width="90%"
              borderRadius="xl"
              overflow="hidden"
              sx={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(26, 26, 46, 0.7)",
                border: "1px solid rgba(179, 207, 215, 0.4)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                ...(chatActive ? { height: "75vh" } : { maxHeight: "75vh" }),
                p: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <MKTypography
                variant="h1"
                color="white"
                mb={4}
                textAlign="center"
                sx={{
                  textShadow: "0 0 15px rgba(179, 207, 215, 0.7)",
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    display: "block",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #B3CFD7, transparent)",
                    margin: "15px auto 0",
                    borderRadius: "2px",
                  },
                }}
              >
                Live services
              </MKTypography>

              {/* ✅ Hotline Section */}
              <MKTypography
                variant="h4"
                color="white"
                mb={2}
                fontWeight="medium"
                textAlign="center"
              >
                📞 Hotline: <strong>1900.1234 - 028.1234.5678</strong>
              </MKTypography>

              {/* 💬 Live Chat Box */}

              {chatActive && (
                <MKBox
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "md",
                    p: 2,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MKBox
                    ref={chatRef}
                    sx={{
                      flexGrow: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "md",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      padding: 1,
                      height: "300px",
                    }}
                  >
                    {chat.map((msg, idx) => {
                      const isUser = msg.user === "You";

                      return (
                        <MKBox
                          key={idx}
                          sx={{
                            alignSelf: isUser ? "flex-end" : "flex-start",
                            backgroundColor: isUser ? "#00B8D4" : "#37474F",
                            color: "#fff",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            maxWidth: "70%",
                            wordBreak: "break-word",
                          }}
                        >
                          <MKTypography variant="body2" sx={{ color: "#fff" }}>
                            {msg.text}
                          </MKTypography>
                        </MKBox>
                      );
                    })}
                  </MKBox>

                  <MKBox mt={1} display="flex" gap={1}>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await handleChatClick();
                        }
                      }}
                    />
                    <MKButton color="info" onClick={handleChatClick}>
                      Send
                    </MKButton>
                  </MKBox>
                </MKBox>
              )}

              {/* 💬 Live Chat Button */}
              {!chatActive && (
                <MKButton
                  variant="contained"
                  color="info"
                  size="large"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: chatActive ? "#43A047" : "#00B8D4",
                    "&:hover": {
                      backgroundColor: chatActive ? "#388E3C" : "#0097A7",
                    },
                  }}
                  onClick={handleChatClick}
                >
                  💬 Live Chat
                </MKButton>
              )}
            </MKBox>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default CustomerSupport;
