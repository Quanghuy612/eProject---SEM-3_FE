// @mui material components
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  RadioGroup,
  Radio,
} from "@mui/material";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
// import MKTypography from "components/User/MKTypography";
// import MKButton from "components/User/MKButton";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import billStore from "stores/billStore";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI / QR Code" },
  { id: "wallet", label: "Wallet Balance" },
  { id: "netbanking", label: "Net Banking" },
];

function Bills() {
  const { getBill, completePayBill } = billStore();
  const [bills, setBills] = useState(null);
  const [payBill, setPayBill] = useState(null);
  const routes = getRoutes();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const handleOpenPayment = () => setPaymentOpen(true);
  const handleClosePayment = () => setPaymentOpen(false);
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const fetchData = async () => {
    const res = await getBill();
    setBills(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPayMent = (bill) => {
    setPayBill(bill);
    handleOpenPayment();
  };

  const confirmPayBill = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    let data = {
      BillIds: [payBill.billId],
      PayMentMethod: selectedMethod,
    };
    const res = await completePayBill(data);
    if (res.status != 200) {
      toast.error("Error while confirm payment");
      return;
    }
    toast.success(res.data.message);
    setSelectedMethod("");
    fetchData();
    handleClosePayment();
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
        }}
      >
        <MKBox
          sx={{
            backgroundColor: "#fff",
            padding: 2,
          }}
          marginTop={20}
        >
          <MKBox
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              marginBottom: 4,
            }}
          >
            <Typography variant="h3">Your bills</Typography>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showUnpaidOnly}
                  onChange={(e) => setShowUnpaidOnly(e.target.checked)}
                />
              }
              label="Show Unpaid Only"
            />
          </MKBox>
          <Grid container spacing={3} maxWidth="lg">
            {bills
              ?.filter((bill) => {
                const billDate = new Date(bill.dueDate);
                const from = fromDate ? new Date(fromDate) : null;
                const to = toDate ? new Date(toDate) : null;

                const isInDateRange = (!from || billDate >= from) && (!to || billDate <= to);

                const isUnpaidMatch = showUnpaidOnly ? !bill.isPaid : true;

                return isInDateRange && isUnpaidMatch;
              })
              .map((bill, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: "white", borderRadius: 3, boxShadow: 6 }}>
                    <CardContent>
                      {/* Main TopUp Package */}
                      {bill.topUpName && (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          📦 Recharge: {bill.topUpName}
                        </Typography>
                      )}

                      {/* Special Recharge Packages */}
                      {bill.specialRechargePackages?.length > 0 && (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          📦 Special recharge: {bill.specialRechargePackages.join(", ")}
                        </Typography>
                      )}

                      {/* Special Service Packages */}
                      {bill.specialServicePackages?.length > 0 && (
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          🛠️ Services: {bill.specialServicePackages.join(", ")}
                        </Typography>
                      )}

                      <Divider sx={{ my: 1 }} />

                      {/* Amount, Due Date, Status */}
                      <Typography variant="body1">
                        💵 Amount: ${bill.totalAmount.toFixed(2)}
                      </Typography>
                      <Typography variant="body1">
                        📅 Due Date: {new Date(bill.dueDate).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Typography
                          variant="body2"
                          color={bill.isPaid ? "success.main" : "error.main"}
                          fontWeight="bold"
                          sx={{ flexGrow: 1 }}
                        >
                          {bill.isPaid ? "✅ Paid" : "❌ Unpaid"}
                        </Typography>

                        {!bill.isPaid && (
                          <Button
                            variant="contained"
                            sx={{ color: "#FFF" }}
                            onClick={() => openPayMent(bill)}
                            size="small"
                          >
                            Pay Now
                          </Button>
                        )}
                      </Box>

                      {/* Payment Modal */}
                      <Dialog
                        open={paymentOpen}
                        onClose={handleClosePayment}
                        maxWidth="sm"
                        fullWidth
                        BackdropProps={{
                          sx: {
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                          },
                        }}
                      >
                        <DialogTitle>Pay Bill</DialogTitle>
                        <DialogContent>
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
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClosePayment}>Cancel</Button>
                          <Button
                            variant="contained"
                            sx={{ color: "#FFF" }}
                            onClick={() => {
                              confirmPayBill();
                            }}
                          >
                            Confirm Payment
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </MKBox>
      </MKBox>
    </>
  );
}

export default Bills;
