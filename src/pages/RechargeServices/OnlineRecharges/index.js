// @mui material components

// Material Kit 2 React components
import MKBox from "components/User/MKBox";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useState, useEffect } from "react";
import onlineRechargeStore from "stores/onlineRechargeStore";
import {
  Box,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI / QR Code" },
  { id: "wallet", label: "Wallet Balance" },
  { id: "netbanking", label: "Net Banking" },
];

function OnlineRecharges() {
  const routes = getRoutes();
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(1);
  const { loading, error, data, getOnlineRecharge, getOtp, vertifyOtp, completeRecharge } =
    onlineRechargeStore();
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [virtualOtp, setVirtualOtp] = useState("");
  const [topUp, setTopUp] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getOnlineRecharge();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setTopUp(data);
    }
  }, [data]);

  const selectRechargePackage = async (item) => {
    setSelectedRecharge(item);
    if (user?.PhoneNumber) {
      setStep(3);
      setPhoneNumber(user.PhoneNumber);
      const otpData = await getOtp(user.PhoneNumber);
      if (otpData) {
        setVirtualOtp(otpData);
      }
    } else {
      setStep(2);
    }
  };

  const sendOtp = async () => {
    const otpData = await getOtp(phoneNumber);
    if (otpData) {
      setVirtualOtp(otpData);
      setStep(3);
    }
  };

  const checkOtp = async (phoneNumber, virtualOtp) => {
    await vertifyOtp(phoneNumber, virtualOtp);
    if (error) {
      toast.error(error);
      return;
    }
    setVirtualOtp("");
    setStep(4);
  };

  const [selectedMethod, setSelectedMethod] = useState("");

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const completePayment = async () => {
    let data = {
      PhoneNumber: phoneNumber,
      TotalAmount: selectedRecharge.price,
      TopUpId: selectedRecharge.topUpId,
      PayMentMethod: selectedMethod,
    };
    const res = await completeRecharge(data);
    if (res.status != 200) {
      toast.error("Error while confirm payment");
      return;
    }
    setTransaction(res.data.data);
    setStep(6);
  };

  const completeTransaction = () => {
    setStep(7);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <>
      <MKBox position="fixed" top="0.5rem" width="100%" zIndex={10}>
        <DefaultNavbar routes={routes} />
      </MKBox>
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
          position: "relative",
        }}
      >
        {virtualOtp && (
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 420,
              top: "50%",
              left: "85%",
              transform: "translateY(-50%)",
              backgroundColor: "#fff",
              borderRadius: 3,
              marginTop: 2,
              padding: 2,
              color: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
              Your OTP
            </Typography>
            <Box
              sx={{
                backgroundColor: "#1976d2",
                borderRadius: "20px 20px 20px 5px",
                padding: "15px 25px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "white",
                boxShadow: "0 2px 10px rgba(25, 118, 210, 0.5)",
                userSelect: "text",
              }}
            >
              {virtualOtp}
            </Box>
          </Box>
        )}
        <Box
          sx={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            margin: "2rem auto",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {/* Step 1 */}
          {!loading && !error && step === 1 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Select Recharge Package
              </Typography>
              <List>
                {topUp?.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        marginBottom: "10px",
                        color: "grey",
                      }}
                      onClick={() => {
                        selectRechargePackage(item);
                      }}
                    >
                      {item.topUpName}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Enter Mobile Number
              </Typography>
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Box display="flex" justifyContent="space-between">
                <Button
                  sx={{
                    color: "grey",
                  }}
                  variant="outlined"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  sx={{
                    color: "#fff",
                  }}
                  variant="contained"
                  onClick={sendOtp}
                  disabled={!phoneNumber}
                >
                  Continue
                </Button>
              </Box>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Vertify OTP
              </Typography>
              <TextField
                fullWidth
                label="OTP"
                type="text"
                onChange={(e) => setOtp(e.target.value)}
              />
              <Box display="flex" justifyContent="space-between">
                <Button
                  sx={{
                    color: "grey",
                  }}
                  variant="outlined"
                  onClick={() => {
                    if (user) {
                      setStep(1);
                      getOnlineRecharge();
                    } else {
                      setStep(2);
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  sx={{
                    color: "#fff",
                  }}
                  variant="contained"
                  onClick={() => checkOtp(phoneNumber, virtualOtp)}
                  disabled={!otp}
                >
                  Continue
                </Button>
              </Box>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Confirm Recharge
              </Typography>
              <Typography>
                <strong>Package:</strong> {selectedRecharge?.topUpName}
              </Typography>
              <Typography>
                <strong>Price:</strong> {selectedRecharge?.price}$
              </Typography>
              <Typography>
                <strong>Phone Number:</strong> {phoneNumber}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Button
                  sx={{
                    color: "grey",
                  }}
                  variant="outlined"
                  onClick={() => setStep(3)}
                >
                  Back
                </Button>
                <Button
                  sx={{
                    color: "#fff",
                  }}
                  variant="contained"
                  onClick={() => setStep(5)}
                >
                  Confirm
                </Button>
              </Box>
            </>
          )}

          {step === 5 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Select Payment Method
              </Typography>

              <RadioGroup value={selectedMethod} onChange={handleChange}>
                {paymentOptions.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>

              <Box mt={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={completePayment}
                  disabled={!selectedMethod}
                  sx={{
                    color: "#fff",
                  }}
                >
                  Complete
                </Button>
              </Box>
            </>
          )}
          {step === 6 && (
            <>
              <Box display="flex" flexDirection="column" justifyContent="center" minHeight="300px">
                <Typography variant="h4" fontWeight="bold">
                  Transaction detail
                </Typography>
                <Typography>
                  <strong>Phone Number:</strong> {transaction?.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Transaction Number:</strong> {transaction?.transactionId}
                </Typography>
                <Typography>
                  <strong>Total:</strong> {transaction?.totalAmount}$
                </Typography>
                <Typography>
                  <strong>Payment method:</strong> {transaction?.paymentMethod}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {transaction?.transactionDate}$
                </Typography>
              </Box>
              <Box mt={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={completeTransaction}
                  disabled={!selectedMethod}
                  sx={{
                    color: "#fff",
                  }}
                >
                  Complete
                </Button>
              </Box>
            </>
          )}
          {step === 7 && (
            <>
              <Box display="flex" flexDirection="column" justifyContent="center" minHeight="300px">
                <CheckCircleIcon sx={{ fontSize: 100, color: "green" }} />
                <Typography variant="h4" mt={2}>
                  Transaction Successful
                </Typography>
                <Typography variant="h5" mt={1}>
                  Thank you for choosing our service.
                </Typography>
                <Typography variant="h6" color="text.secondary" mt={3}>
                  Redirecting to home...
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </MKBox>
    </>
  );
}

export default OnlineRecharges;
