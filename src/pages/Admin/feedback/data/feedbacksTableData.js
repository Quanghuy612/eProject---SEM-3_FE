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
import MDButton from "components/Admin/MDButton";

export default function data({ param = [], onApprove, onClose } = {}) {
  const Text = ({ text }) => (
    <MDTypography display="block" variant="button" fontWeight="medium">
      {text}
    </MDTypography>
  );

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A");

  const getStatusBadge = (status) => {
    let color;
    switch (status) {
      case "Approved":
        color = "success";
        break;
      case "Closed":
        color = "error";
        break;
      case "Open":
        color = "default";
        break;
      default:
        color = "warning";
    }

    return (
      <MDBox ml={-1}>
        <MDBadge badgeContent={status} color={color} variant="gradient" size="sm" />
      </MDBox>
    );
  };

  const generateRows = (data) =>
    data.map((feedback) => ({
      username: <Text text={feedback.username} />,
      subject: <Text text={feedback.subject} />,
      initialMessage: <Text text={feedback.initialMessage} />,
      ratting: <Text text={feedback.ratting} />,
      status: getStatusBadge(feedback.status),
      createdAt: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(feedback.createdAt)}
        </MDTypography>
      ),
      action: feedback.status === "Open" && (
        <MDBox display="flex" justifyContent="center">
          <MDButton
            variant="gradient"
            color="info"
            size="small"
            sx={{ mr: 0.5 }}
            onClick={() => onApprove(feedback)}
          >
            Approve
          </MDButton>
          <MDButton variant="gradient" color="error" size="small" onClick={() => onClose(feedback)}>
            Close
          </MDButton>
        </MDBox>
      ),
    }));

  return {
    columns: [
      { Header: "User", accessor: "username", align: "left" },
      { Header: "Title", accessor: "subject", align: "left" },
      { Header: "Content", accessor: "initialMessage", align: "left" },
      { Header: "Ratting", accessor: "ratting", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Created Time", accessor: "createdAt", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: generateRows(param),
  };
}
