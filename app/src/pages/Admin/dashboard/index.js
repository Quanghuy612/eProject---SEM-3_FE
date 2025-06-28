// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/Admin/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/Admin/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Admin/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Admin/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Admin/Charts/BarCharts/ReportsBarChart";

import useAdminStore from "stores/adminStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "examples/User/LoadingSpinner/LoadingSpinner";

function prepareChartDatasets(data) {
  const labels = data.map((item) => item.date);

  const topUpChart = {
    labels,
    datasets: {
      label: "Top Up",
      data: data.map((item) => item.totalTopUp),
    },
  };

  const rechargeChart = {
    labels,
    datasets: {
      label: "Special Recharge",
      data: data.map((item) => item.totalSpecialRecharge),
    },
  };

  const serviceChart = {
    labels,
    datasets: {
      label: "Special Service",
      data: data.map((item) => item.totalSpecialService),
    },
  };

  return { topUpChart, rechargeChart, serviceChart };
}

function Dashboard() {
  const [total, setTotal] = useState(null);
  const caculateTotal = useAdminStore((state) => state.caculateTotal);
  const caculateService = useAdminStore((state) => state.caculateService);
  const { loading } = useAdminStore();
  const [topUpChart, setTopUpChart] = useState(null);
  const [rechargeChart, setRechargeChart] = useState(null);
  const [serviceChart, setServiceChart] = useState(null);

  useEffect(() => {
    const fetchDataServices = async () => {
      const result = await caculateService();
      const { topUpChart, rechargeChart, serviceChart } = prepareChartDatasets(result.data);
      setTopUpChart(topUpChart);
      setRechargeChart(rechargeChart);
      setServiceChart(serviceChart);
    };
    const fetchData = async () => {
      const result = await caculateTotal();
      setTotal(result.data);
    };
    fetchData();
    fetchDataServices();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="warning"
                  icon="person_add"
                  title="Today's New Users"
                  count={total?.newUsers ?? 0}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="format_list_bulleted"
                  title="Today's Feedbacks"
                  count={total?.feedbacks ?? 0}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Today's Transactions"
                  count={total?.transactionCount ?? 0}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Revenue"
                  count={`$ ${total?.totalRevenue ?? 0}`}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
          <MDBox mt={4.5}>
            {topUpChart && (
              <ReportsBarChart
                color="success"
                title="Top Up Usage"
                description="TopUps used this week"
                date="Updated just now"
                chart={topUpChart}
              />
            )}
          </MDBox>
          <MDBox mt={5.5}>
            {rechargeChart && (
              <ReportsBarChart
                color="warning"
                title="Special Recharge Usage"
                description="Special Recharges this week"
                date="Updated just now"
                chart={rechargeChart}
              />
            )}
          </MDBox>
          <MDBox mt={5.5}>
            {serviceChart && (
              <ReportsBarChart
                color="info"
                title="Special Service Usage"
                description="Special Services this week"
                date="Updated just now"
                chart={serviceChart}
              />
            )}
          </MDBox>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
