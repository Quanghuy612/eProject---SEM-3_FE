// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";
import MDTypography from "components/Admin/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/Admin/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Admin/Navbars/DashboardNavbar";
import DataTable from "examples/Admin/Tables/DataTable";
import transactionsTableData from "./data/transactionsTableData";
import useAdminStore from "stores/adminStore";
import { exportToExcel } from "utils/exportExcel";

import { useEffect, useState } from "react";

function Transactions() {
  const getTransactions = useAdminStore((state) => state.getTransactions);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [excel, setExcel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTransactions();
      if (result?.data) {
        setExcel(result.data);
        const { columns, rows } = transactionsTableData({ param: result.data });
        setTableData({ columns, rows });
      }
    };
    fetchData();
  }, []);

  return (
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
                  Transactions
                </MDTypography>
                <Button
                  sx={{
                    backgroundColor: "#FFA000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#FF8F00",
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => exportToExcel(excel, "Bills.xlsx")}
                >
                  Export Excel
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Transactions;
