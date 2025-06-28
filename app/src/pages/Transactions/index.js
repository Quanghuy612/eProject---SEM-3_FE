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
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Pagination,
  TextField,
} from "@mui/material";
import transactionsTableData from "./data/transactionsTableData";
import DataTable from "examples/Admin/Tables/DataTable";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function Transactions() {
  const { getTransaction } = billStore();
  const routes = getRoutes();
  const [totalItems, setTotalItems] = useState(1);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchData = async () => {
    const res = await getTransaction({ fromDate, toDate, currentPage });
    const { columns, rows } = transactionsTableData({ param: res.data?.data });
    setTotalItems(Math.ceil(res.data.totalItems / pageSize));
    setTableData({ columns, rows });
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, currentPage]);

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
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
          <Card
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              marginTop: 4,
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
                    Your Transactions
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
      </MKBox>
    </>
  );
}

export default Transactions;
