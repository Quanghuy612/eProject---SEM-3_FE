/*
=========================================================
* Mobile Top-Up Application - Premium Version
=========================================================
*/

import { useNavigate } from "react-router-dom";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";
import MKButton from "components/User/MKButton";

// Material Kit 2 React examples
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";
import DefaultFooter from "examples/User/Footers/DefaultFooter";
import FilledInfoCard from "examples/User/Cards/InfoCards/FilledInfoCard";

// Routes
import getRoutes from "routes";
import footerRoutes from "footer.routes";

// Images
import bgImage from "assets/images/city-profile.jpg";

function Presentation() {
  const navigate = useNavigate();
  const routes = getRoutes();

  // Navigation handlers
  const handleTopUpNow = () => navigate("/services/online-recharge");
  const handleHowItWorks = () => navigate("/contact-us");
  // const handleLearnMore = () => navigate("/features");
  const handleSignUp = () => navigate("/authentication/sign-up");
  const handleLogin = () => navigate("/authentication/sign-in");

  // Data for network providers
  const networks = [
    { name: "Viettel", color: "red", icon: "call", discount: "3%" },
    { name: "Mobifone", color: "blue", icon: "smartphone", discount: "2.5%" },
    { name: "Vinaphone", color: "green", icon: "sim_card", discount: "2%" },
    { name: "Vietnamobile", color: "orange", icon: "payments", discount: "1.5%" },
    { name: "Gmobile", color: "purple", icon: "settings_cell", discount: "1%" },
  ];

  // Data for features
  const features = [
    {
      title: "Instant",
      description: "Top-up completed in just 10 seconds",
      icon: "bolt",
      color: "info",
    },
    {
      title: "Secure",
      description: "PCI DSS certified data encryption",
      icon: "lock",
      color: "success",
    },
    {
      title: "Rewards",
      description: "1-5% cashback depending on carrier",
      icon: "local_offer",
      color: "warning",
    },
  ];

  // Data for statistics
  const stats = [
    { value: "10,000+", label: "Daily transactions", color: "info", icon: "trending_up" },
    { value: "99.99%", label: "Success rate", color: "success", icon: "check_circle" },
    { value: "24/7", label: "Customer support", color: "primary", icon: "support_agent" },
  ];

  // Top-up amounts
  const topupAmounts = [
    { amount: 10, bonus: 0.5 },
    { amount: 20, bonus: 1 },
    { amount: 50, bonus: 2.5 },
    { amount: 100, bonus: 5 },
    { amount: 200, bonus: 10 },
    { amount: 500, bonus: 25 },
  ];

  return (
    <>
      <MKBox position="fixed" width="100%" zIndex={10}>
        <DefaultNavbar
          routes={routes}
          sticky
          transparent
          light
          actionButton={{
            type: "internal",
            route: "/login",
            label: "Login",
            color: "info",
            onClick: handleLogin,
          }}
        />
      </MKBox>

      {/* Hero Section */}
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          paddingTop: "80px",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100px",
            background: "linear-gradient(to top, #fff, transparent)",
          },
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <MKTypography
                variant="h1"
                color="white"
                mb={3}
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Mobile Top-Up{" "}
                <Box component="span" sx={{ color: "info.main" }}>
                  Super Fast
                </Box>
              </MKTypography>

              <MKTypography
                variant="h5"
                color="white"
                mb={4}
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                  lineHeight: 1.6,
                  maxWidth: "500px",
                }}
              >
                24/7 online top-up service with attractive promotions. Instant cashback for every
                transaction.
              </MKTypography>

              {/* CTA Buttons */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <MKButton
                  variant="gradient"
                  color="info"
                  size="large"
                  onClick={handleTopUpNow}
                  sx={{
                    borderRadius: "8px",
                    padding: "12px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <Icon sx={{ mr: 1 }}>flash_on</Icon>
                  Top Up Now
                </MKButton>

                <MKButton
                  variant="outlined"
                  color="white"
                  size="large"
                  onClick={handleHowItWorks}
                  sx={{
                    borderRadius: "8px",
                    padding: "12px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderWidth: "2px",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Icon sx={{ mr: 1 }}>info</Icon>
                  How It Works
                </MKButton>
              </Box>

              {/* Special Offer */}
              <Box
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  maxWidth: "400px",
                  backdropFilter: "blur(5px)",
                }}
              >
                <Icon sx={{ color: "warning.main", mr: 1, fontSize: "2rem" }}>local_offer</Icon>
                <Box>
                  <MKTypography variant="button" color="white" fontWeight="bold">
                    SPECIAL OFFER
                  </MKTypography>
                  <MKTypography variant="body2" color="white" opacity={0.9}>
                    5% cashback for first top-up!
                  </MKTypography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      {/* Main Content */}
      <Card
        sx={{
          p: { xs: 2, md: 4 },
          mx: { xs: 1, lg: 3 },
          mt: -10,
          mb: 6,
          backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.98),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }) => xxl,
          borderRadius: 3,
          overflow: "visible",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Network Providers */}
        <Container sx={{ py: 8 }}>
          <MKTypography
            variant="h3"
            textAlign="center"
            mb={8}
            sx={{
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: "linear-gradient(90deg, #00B4DB 0%, #0083B0 100%)",
                borderRadius: 2,
              },
            }}
          >
            Supported Carriers
          </MKTypography>

          <Grid container spacing={3} justifyContent="center">
            {networks.map((network, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <MKBox
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  p={3}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    backgroundColor: "white",
                    boxShadow: 2,
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <MKBox
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={60}
                    height={60}
                    borderRadius="50%"
                    bgColor={`${network.color}.light`}
                    color={`${network.color}.dark`}
                    mb={1}
                  >
                    <Icon fontSize="large">{network.icon}</Icon>
                  </MKBox>
                  <MKTypography variant="h6" fontWeight="bold" mb={0.5}>
                    {network.name}
                  </MKTypography>
                  <MKTypography variant="button" color={network.color} fontWeight="bold">
                    {network.discount} Cashback
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Features */}
        <MKBox
          py={8}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(to bottom, #f8f9fa, #fff)",
          }}
        >
          <Container>
            <MKTypography
              variant="h3"
              textAlign="center"
              mb={8}
              sx={{
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "4px",
                  background: "linear-gradient(90deg, #00B4DB 0%, #0083B0 100%)",
                  borderRadius: 2,
                },
              }}
            >
              Key Features
            </MKTypography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <FilledInfoCard
                    variant="gradient"
                    color={feature.color}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    action={{
                      type: "internal",
                      route: "/features",
                      label: "Learn more",
                      // onClick: handleLearnMore,
                    }}
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      boxShadow: 3,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 6,
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </MKBox>

        {/* Statistics */}
        <Container sx={{ py: 8 }}>
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MKBox
                  textAlign="center"
                  p={4}
                  sx={{
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${stat.color}.main 0%, ${stat.color}.dark 100%)`,
                    color: "white",
                    boxShadow: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: "3rem",
                      mb: 2,
                      opacity: 0.8,
                    }}
                  >
                    {stat.icon}
                  </Icon>
                  <MKTypography variant="h2" fontWeight="bold" mb={1}>
                    {stat.value}
                  </MKTypography>
                  <MKTypography variant="h5" opacity={0.9}>
                    {stat.label}
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Top-up Amounts */}
        <Container sx={{ py: 8 }}>
          <MKTypography
            variant="h3"
            textAlign="center"
            mb={6}
            sx={{
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "4px",
                background: "linear-gradient(90deg, #00B4DB 0%, #0083B0 100%)",
                borderRadius: 2,
              },
            }}
          >
            Popular Amounts
          </MKTypography>

          <Grid container spacing={2} justifyContent="center">
            {topupAmounts.map((item, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <MKBox
                  textAlign="center"
                  p={3}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: 2,
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
                      borderColor: "info.main",
                    },
                  }}
                >
                  <MKTypography variant="h4" fontWeight="bold" color="info">
                    {item.amount.toLocaleString()}K
                  </MKTypography>
                  <MKTypography variant="body2" color="success" fontWeight="medium">
                    +{item.bonus.toLocaleString()}K cashback
                  </MKTypography>
                </MKBox>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Call to Action */}
        <MKBox
          py={8}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "radial-gradient(circle at 75% 50%, rgba(255,255,255,0.1) 0%, transparent 30%)",
            },
          }}
        >
          <Container position="relative">
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} md={8}>
                <MKTypography variant="h3" color="white" mb={2}>
                  Ready to get started?
                </MKTypography>
                <MKTypography variant="body1" color="white" opacity={0.9}>
                  Sign up now to get 20% bonus on your first top-up and other exciting gifts
                </MKTypography>
              </Grid>
              <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "right" }}>
                <MKButton
                  variant="contained"
                  color="white"
                  size="large"
                  onClick={handleSignUp}
                  sx={{
                    borderRadius: "8px",
                    padding: "12px 32px",
                    color: "info.main",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Sign Up Now
                </MKButton>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </Card>

      {/* Footer */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
