/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Material Kit 2 React examples
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";
import DefaultFooter from "examples/User/Footers/DefaultFooter";

// Routes
import getRoutes from "routes";
import footerRoutes from "footer.routes";

// Images
import aboutImage from "assets/images/bg-about-us.jpg";
import missionImage from "assets/images/bg-presentation.jpg";
import visionImage from "assets/images/lehonghai.jpg";

function AboutUs() {
  const routes = getRoutes();
  return (
    <>
      <DefaultNavbar
        routes={routes}
        // action={{
        //   type: "internal",
        //   route: "/signup",
        //   label: "Sign Up Now",
        //   color: "info",
        // }}
        transparent
        light
      />

      {/* Hero Banner */}
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.7),
              rgba(gradients.dark.state, 0.7)
            )}, url(${aboutImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Grid container>
            <Grid item xs={12} md={8} sx={{ color: "white" }}>
              <MKTypography variant="h1" color="white" fontWeight="bold" mb={2}>
                About Us
              </MKTypography>
              <MKTypography variant="h5" color="white" opacity={0.8}>
                Vietnam is Leading Online Mobile Top-Up Platform
              </MKTypography>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      {/* Main Content */}
      <MKBox py={6}>
        <Container>
          {/* About Section */}
          <Grid container spacing={6} alignItems="center" mb={8}>
            <Grid item xs={12} md={6}>
              <MKTypography variant="h3" fontWeight="bold" mb={3}>
                Our Company
              </MKTypography>
              <MKTypography variant="body1" mb={3}>
                We are pioneers in Vietnam is online mobile top-up industry, providing fast, secure,
                and convenient top-up solutions for all customers.
              </MKTypography>
              <MKTypography variant="body1" mb={3}>
                With direct connections to major carriers like Viettel, Vinaphone, and Mobifone, we
                are committed to delivering the best service with a 99.9% success rate.
              </MKTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MKBox
                component="img"
                src={aboutImage}
                alt="About Us"
                width="100%"
                borderRadius="lg"
                shadow="xl"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Mission & Vision */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <MKBox
                  component="img"
                  src={missionImage}
                  alt="Our Mission"
                  width="100%"
                  borderRadius="lg"
                  mb={3}
                />
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Our Mission
                </MKTypography>
                <MKTypography variant="body1">
                  To provide fast, convenient, and secure mobile top-up solutions for all users,
                  contributing to the development of cashless payments in Vietnam.
                </MKTypography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <MKBox
                  component="img"
                  src={visionImage}
                  alt="Our Vision"
                  width="100%"
                  borderRadius="lg"
                  mb={3}
                />
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Our Vision
                </MKTypography>
                <MKTypography variant="body1">
                  To become Vietnam is number one online mobile top-up platform, continuously
                  innovating technology to deliver the best customer experience.
                </MKTypography>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Core Values */}
          <MKBox textAlign="center" mb={6}>
            <MKTypography variant="h3" fontWeight="bold" mb={3}>
              Core Values
            </MKTypography>
          </MKBox>
          <Grid container spacing={4}>
            {[
              {
                icon: "fas fa-bolt",
                title: "Speed",
                description: "Top-up in just 3 seconds, 24/7 processing",
              },
              {
                icon: "fas fa-shield-alt",
                title: "Security",
                description: "Multi-layer security system, absolute safety",
              },
              {
                icon: "fas fa-hand-holding-heart",
                title: "Convenience",
                description: "Top-up anytime, anywhere with just a few taps",
              },
              {
                icon: "fas fa-headset",
                title: "Support",
                description: "Professional 24/7 customer support team",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card sx={{ p: 3, height: "100%", textAlign: "center" }}>
                  <MKTypography variant="h2" color="info" mb={2}>
                    <i className={item.icon} />
                  </MKTypography>
                  <MKTypography variant="h5" fontWeight="bold" mb={2}>
                    {item.title}
                  </MKTypography>
                  <MKTypography variant="body2">{item.description}</MKTypography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </MKBox>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default AboutUs;
