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

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

function Transactions() {
  const getTransactions = useAdminStore((state) => state.getTransactions);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [excel, setExcel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTransactions({ fromDate, toDate });
      if (result?.data) {
        setExcel(result.data);
        const { columns, rows } = transactionsTableData({ param: result.data });
        setTableData({ columns, rows });
      }
    };
    fetchData();
  }, [fromDate, toDate]);

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
                bgColor="light"
                borderRadius="lg"
                coloredShadow="info"
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <MDTypography variant="h6" color="black" sx={{ flexGrow: 1 }}>
                  Transactions
                </MDTypography>
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
                      sx={{ color: "black", mr: 1 }}
                      InputLabelProps={{ style: { color: "black" } }}
                      InputProps={{ style: { color: "black" } }}
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
                      sx={{ color: "black", mr: 1 }}
                      InputLabelProps={{ style: { color: "black" } }}
                      InputProps={{ style: { color: "black" } }}
                    />
                  )}
                />
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
                  showTotalEntries={true}
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
