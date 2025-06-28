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
import MDBadge from "components/Admin/MDBadge";

export default function data({ param = [] } = {}) {
  const Phone = ({ phoneNumber }) => (
    <MDTypography display="block" variant="button" fontWeight="medium">
      {phoneNumber}
    </MDTypography>
  );

  const AmountInfo = ({ amount }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        ${amount.toFixed(2)}
      </MDTypography>
    </MDBox>
  );

  const PackageName = ({ name }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A");

  const getStatusBadge = (isPaid) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={isPaid ? "Paid" : "Unpaid"}
        color={isPaid ? "success" : "error"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  const generateRows = (data) =>
    data.map((bill) => ({
      phone: <Phone phoneNumber={bill.phoneNumber} />,
      packageName: <PackageName name={bill.packageName} />,
      packageType: <PackageName name={bill.packageType} />,
      amountInfo: <AmountInfo amount={bill.totalAmount} />,
      status: getStatusBadge(bill.isPaid),
      dueDate: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(bill.dueDate)}
        </MDTypography>
      ),
    }));

  return {
    columns: [
      { Header: "Phone Number", accessor: "phone", width: "25%", align: "left" },
      { Header: "Package name", accessor: "packageName", align: "left" },
      { Header: "Package type", accessor: "packageType", align: "left" },
      { Header: "Total Amount", accessor: "amountInfo", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Due Date", accessor: "dueDate", align: "center" },
    ],
    rows: generateRows(param),
  };
}
