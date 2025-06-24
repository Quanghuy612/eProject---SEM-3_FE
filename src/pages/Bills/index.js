// @mui material components
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Pagination,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  TextField,
} from "@mui/material";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";
import DataTable from "examples/Admin/Tables/DataTable";
import billsTableData from "./data/billsTableData";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import billStore from "stores/billStore";
import React, { useState, useEffect } from "react";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI / QR Code" },
  { id: "wallet", label: "Wallet Balance" },
  { id: "netbanking", label: "Net Banking" },
];

function Bills() {
  const { getBill, completePayBill } = billStore();
  const [payBill, setPayBill] = useState(null);
  const routes = getRoutes();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const handleOpenPayment = () => setPaymentOpen(true);
  const handleClosePayment = () => setPaymentOpen(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const pageSize = 10;

  const handleChange = (event) => {
    setSelectedMethod(event.target.value);
  };

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setShowUnpaid(false);
  };

  const fetchData = async () => {
    const isPaid = showUnpaid ? false : undefined;
    const res = await getBill({ fromDate, toDate, isPaid, currentPage });
    const { columns, rows } = billsTableData({ param: res.data.data, onView: openPayMent });
    setTotalItems(Math.ceil(res.data.totalItems / pageSize));
    setTableData({ columns, rows });
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, showUnpaid, currentPage]);

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
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: () =>
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
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
        <MKBox width="100%" zIndex={10} paddingTop={2}>
          <DefaultNavbar relative routes={routes} light />
        </MKBox>
        <MKBox width="60%" mx="auto">
          ;
          <Card
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardHeader
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
              }}
              title={
                <MKBox
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Your Bills
                  </Typography>
                  <IconButton
                    color="info"
                    onClick={resetFilters}
                    title="Reset Filters"
                    aria-label="reset filters"
                  >
                    <RestartAltIcon />
                  </IconButton>
                  <Flatpickr
                    value={fromDate}
                    options={{
                      dateFormat: "d/m/Y",
                    }}
                    onChange={([date]) => setFromDate(date)}
                    render={({ value, ...props }, ref) => (
                      <TextField
                        {...props}
                        inputRef={ref}
                        value={value}
                        onChange={() => {}}
                        label="From Date"
                        placeholder="From Date"
                        variant="outlined"
                      />
                    )}
                  />
                  <Flatpickr
                    value={toDate}
                    options={{
                      dateFormat: "d/m/Y",
                    }}
                    onChange={([date]) => setToDate(date)}
                    render={({ value, ...props }, ref) => (
                      <TextField
                        {...props}
                        inputRef={ref}
                        value={value}
                        onChange={() => {}}
                        label="To Date"
                        placeholder="To Date"
                        variant="outlined"
                      />
                    )}
                  />
                  <MKTypography variant="button" fontWeight="regular" color="text">
                    Show Unpaid Bills
                  </MKTypography>
                  <Switch checked={showUnpaid} onChange={() => setShowUnpaid(!showUnpaid)} />
                </MKBox>
              }
            />

            <CardContent>
              <MKBox pt={1}>
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MKBox>
            </CardContent>

            {/* Footer with pagination */}
            <CardActions sx={{ justifyContent: "center", paddingTop: 2 }}>
              <Pagination
                count={totalItems}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="info"
              />
            </CardActions>
          </Card>
        </MKBox>
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
      </MKBox>
    </>
  );
}

export default Bills;
