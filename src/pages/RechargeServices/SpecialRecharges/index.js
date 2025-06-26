// @mui material components

// Material Kit 2 React components
import MKBox from "components/User/MKBox";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useState, useEffect, useRef } from "react";
import specialRechargeStore from "stores/specialRechargeStore";
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
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MKButton from "components/User/MKButton";
import LoadingSpinner from "examples/User/LoadingSpinner/LoadingSpinner";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI / QR Code" },
  { id: "wallet", label: "Wallet Balance" },
  { id: "netbanking", label: "Net Banking" },
  { id: "postpaying", label: "Post paying bill" },
];

function SpecialRechares() {
  const routes = getRoutes();
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(1);
  const { loading, getSpecialRecharge, getOtp, vertifyOtp, completeRecharge } =
    specialRechargeStore();
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  const [otp, setOtp] = useState("");
  const [virtualOtp, setVirtualOtp] = useState("");
  const [topUp, setTopUp] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();
  const pdfRef = useRef();

  const fetchData = async () => {
    const res = await getSpecialRecharge();
    if (res?.statusCode == 200) {
      setTopUp(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectRechargePackage = async (item) => {
    setSelectedRecharge(item);
    if (user?.PhoneNumber) {
      setStep(3);
      const otpData = await getOtp(user?.PhoneNumber);
      if (otpData) {
        setVirtualOtp(otpData);
      }
    }
  };

  const checkOtp = async () => {
    if (otp && user?.PhoneNumber) {
      const res = await vertifyOtp(user?.PhoneNumber, otp);
      if (res?.statusCode == 200) {
        setVirtualOtp("");
        setStep(4);
      }
    }
  };

  const [selectedMethod, setSelectedMethod] = useState("");

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const completePayment = async () => {
    let data = {
      PhoneNumber: user?.PhoneNumber,
      TotalAmount: selectedRecharge.price,
      TopUpId: selectedRecharge.specialRechargeId,
      PayMentMethod: selectedMethod,
    };
    const res = await completeRecharge(data);
    if (res?.statusCode != 200) {
      toast.error("Error while confirm payment");
      return;
    }
    if (selectedMethod == "postpaying") {
      completeTransaction();
    } else {
      setTransaction(res.data.data);
      setStep(6);
    }
  };

  const completeTransaction = () => {
    setStep(7);
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("transaction_summary.pdf");
  };

  return (
    <>
      {loading && <LoadingSpinner />}
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
        }}
      >
        <MKBox width="100%" zIndex={10} paddingTop={2}>
          <DefaultNavbar relative routes={routes} light />
        </MKBox>
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
          {step === 1 && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Select Special Package
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
                      {item.specialRechargeName}
                    </Button>
                  </ListItem>
                ))}
              </List>
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
                      getSpecialRecharge();
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
                  onClick={() => checkOtp(user?.PhoneNumber, virtualOtp)}
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
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 3,
                  backgroundColor: "#fafafa",
                  maxWidth: "100%",
                  mt: 5,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Confirm Recharge
                </Typography>
                <Divider />
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Package</Typography>
                  <Typography>{selectedRecharge?.specialRechargeName}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Price</Typography>
                  <Typography>{selectedRecharge?.price}$</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Phone Number</Typography>
                  <Typography>{user?.PhoneNumber}</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
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
                    ml: 1,
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
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 3,
                  backgroundColor: "#fafafa",
                  maxWidth: "100%",
                  mt: 5,
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Select Payment Method
                </Typography>
                <Divider />
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
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center">
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
              <Box
                ref={pdfRef}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  padding: 3,
                  backgroundColor: "#fafafa",
                  maxWidth: "100%",
                  mt: 5,
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Transaction Summary
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Phone Number</Typography>
                  <Typography>{transaction?.phoneNumber}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Transaction ID</Typography>
                  <Typography>{transaction?.transactionId}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Total</Typography>
                  <Typography fontWeight="bold">${transaction?.totalAmount}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Payment Method</Typography>
                  <Typography>{transaction?.paymentMethod}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography color="text.secondary">Date</Typography>
                  <Typography>{transaction?.transactionDate}</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center">
                <MKButton
                  variant="contained"
                  color="success"
                  onClick={handleDownloadPdf}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Print Transaction
                </MKButton>
                <Button
                  variant="contained"
                  onClick={completeTransaction}
                  disabled={!selectedMethod}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    ml: 1,
                  }}
                >
                  Complete
                </Button>
              </Box>
            </>
          )}
          {step === 7 && (
            <>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="300px"
                textAlign="center"
              >
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

export default SpecialRechares;
