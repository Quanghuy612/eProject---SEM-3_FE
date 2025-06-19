// @mui material components

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
import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";

function Transactions() {
  const { getTransaction } = billStore();
  const [transactions, setTransactions] = useState([]);
  const routes = getRoutes();

  const fetchData = async () => {
    const res = await getTransaction();
    setTransactions(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 6,
            width: "100%",
            maxWidth: 900,
            margin: "auto",
          }}
          marginTop={20}
        >
          <Typography variant="h5" fontWeight="bold" p={2} textAlign="center">
            Transactions
          </Typography>

          {/* TableContainer with maxHeight for vertical scroll */}
          <div style={{ maxHeight: "640px", overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Transaction Date</th>
                  <th style={{ textAlign: "center", padding: "8px" }}>Amount ($)</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {!transactions || transactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.transactionId} style={{ borderTop: "1px solid #ddd" }}>
                      <td style={{ padding: "8px" }}>{tx.localTime}</td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        {tx.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: "8px" }}>{tx.paymentMethod}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Box>
      </MKBox>
    </>
  );
}

export default Transactions;
