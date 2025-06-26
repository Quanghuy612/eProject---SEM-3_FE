// @mui material components
import { Fab, Grid, Card, Modal, Box, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";
import MDTypography from "components/Admin/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/Admin/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Admin/Navbars/DashboardNavbar";
import DataTable from "examples/Admin/Tables/DataTable";
import packagesTableData from "./data/packagesTableData";
import useAdminStore from "stores/adminStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState, useCallback } from "react";
import MDButton from "components/Admin/MDButton";
import LoadingSpinner from "examples/User/LoadingSpinner/LoadingSpinner";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});

function Packages() {
  const getPackages = useAdminStore((state) => state.getPackages);
  const togglePackage = useAdminStore((state) => state.togglePackage);
  const addPackage = useAdminStore((state) => state.addPackage);
  const [tableDataTopUp, setTableDataTopUp] = useState({ columns: [], rows: [] });
  const [tableDataSpecialRecharge, setTableDataSpecialRecharge] = useState({
    columns: [],
    rows: [],
  });
  const [tableDataSpecialService, setTableDataSpecialService] = useState({ columns: [], rows: [] });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(false);
  const { loading } = useAdminStore();

  const handleToggle = useCallback(
    async (packageItem) => {
      const result = await togglePackage(packageItem.id, packageItem.type, !packageItem.enable);
      if (result?.statusCode == 200) {
        fetchData();
      }
    },
    [togglePackage]
  );

  const fetchData = useCallback(async () => {
    const result = await getPackages();
    if (result?.data) {
      const topupTable = packagesTableData({ param: result.data.topup, onToggle: handleToggle });
      const specialRechargeTable = packagesTableData({
        param: result.data.specialRecharge,
        onToggle: handleToggle,
      });
      const specialServiceTable = packagesTableData({
        param: result.data.specialServices,
        onToggle: handleToggle,
      });

      setTableDataTopUp(topupTable);
      setTableDataSpecialRecharge(specialRechargeTable);
      setTableDataSpecialService(specialServiceTable);
    }
  }, [getPackages, handleToggle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await addPackage({ ...data, type });
    if (result?.statusCode == 200) {
      fetchData();
      reset();
      setOpen(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={4}>
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
                  <MDTypography variant="h6" color="white" sx={{ flexGrow: 1 }}>
                    Top up packages
                  </MDTypography>
                  <Fab
                    onClick={() => {
                      setOpen(true);
                      setType("topup");
                    }}
                    style={{ width: 35, height: 35, minHeight: 35 }}
                  >
                    <AddIcon />
                  </Fab>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={tableDataTopUp}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={true}
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="warning"
                  borderRadius="lg"
                  coloredShadow="warning"
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" color="white">
                    Special Packages
                  </MDTypography>
                  <Fab
                    onClick={() => {
                      setOpen(true);
                      setType("specialrecharge");
                    }}
                    style={{ width: 35, height: 35, minHeight: 35 }}
                  >
                    <AddIcon />
                  </Fab>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={tableDataSpecialRecharge}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={true}
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="success"
                  borderRadius="lg"
                  coloredShadow="success"
                  sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" color="white">
                    Services Packages
                  </MDTypography>
                  <Fab
                    onClick={() => {
                      setOpen(true);
                      setType("specialservice");
                    }}
                    style={{ width: 35, height: 35, minHeight: 35 }}
                  >
                    <AddIcon />
                  </Fab>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={tableDataSpecialService}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={true}
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        <Modal
          open={open}
          onClose={() => {
            reset();
            setOpen(false);
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              {`Add a ${
                type === "topup"
                  ? "Top-up"
                  : type === "specialrecharge"
                  ? "Special Recharge"
                  : type === "specialservice"
                  ? "Special Service"
                  : ""
              } Package`}
            </MDTypography>

            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Amount"
              fullWidth
              type="number"
              {...register("amount")}
              error={!!errors.amount}
              helperText={errors.amount?.message}
            />

            <MDButton variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </MDButton>
          </Box>
        </Modal>
      </DashboardLayout>
    </>
  );
}

export default Packages;
