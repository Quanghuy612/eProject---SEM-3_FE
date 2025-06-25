/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";
import MDTypography from "components/Admin/MDTypography";

export default function data({ param = [] } = {}) {
  const AmountInfo = ({ amount }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        ${Number(amount || 0).toFixed(2)}
      </MDTypography>
    </MDBox>
  );

  const Text = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const generateRows = (data) =>
    data.map((transaction) => ({
      "Transaction's No": <Text name={transaction.transactionId} />,
      totalAmount: <AmountInfo amount={transaction.totalAmount} />,
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {transaction.localTime}
        </MDTypography>
      ),
      paymentMethod: <Text name={transaction.paymentMethod} />,
    }));

  return {
    columns: [
      { Header: "Transaction's No", accessor: "Transaction's No", align: "left" },
      { Header: "Total", accessor: "totalAmount", align: "left" },
      { Header: "Date", accessor: "date", align: "left" },
      { Header: "Payment method", accessor: "paymentMethod", align: "left" },
    ],
    rows: generateRows(param),
  };
}
