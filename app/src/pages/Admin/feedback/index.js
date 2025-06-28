// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";
import MDTypography from "components/Admin/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/Admin/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Admin/Navbars/DashboardNavbar";
import DataTable from "examples/Admin/Tables/DataTable";
import feedbacksTableData from "./data/feedbacksTableData";
import useAdminStore from "stores/adminStore";

import { useEffect, useState } from "react";
import LoadingSpinner from "examples/User/LoadingSpinner/LoadingSpinner";

function Feedback() {
  const getFeedbacks = useAdminStore((state) => state.getFeedbacks);
  const handleFeedback = useAdminStore((state) => state.handleFeedback);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const { loading } = useAdminStore();

  const handleApprove = async (feedback) => {
    const result = await handleFeedback(feedback.feedbackId, "approve");
    if (result?.statusCode == 200) {
      fetchData();
    }
  };

  const handleClose = async (feedback) => {
    const result = await handleFeedback(feedback.feedbackId, "close");
    if (result?.statusCode === 200) {
      fetchData();
    }
  };

  const fetchData = async () => {
    const result = await getFeedbacks();
    if (result?.data) {
      const { columns, rows } = feedbacksTableData({
        param: result.data,
        onApprove: handleApprove,
        onClose: handleClose,
      });
      setTableData({ columns, rows });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" color="white">
                    Feedbacks
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={tableData}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={true}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Feedback;
