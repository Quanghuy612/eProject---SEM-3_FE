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
import aboutCompany from "assets/images/team-1.jpg";
import missionImage from "assets/images/bg-presentation.jpg";
import visionImage from "assets/images/ivana-squares.jpg";
import { motion } from "framer-motion";

function AboutUs() {
  const routes = getRoutes();
  const MotionBox = motion(MKBox);
  const MotionGridItem = motion(Grid);
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -50 },
    visible: { opacity: 1, scale: 1, x: 0 },
  };
  const zoomVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <MotionBox
        position="fixed"
        width="100%"
        zIndex={10}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <DefaultNavbar routes={routes} sticky transparent light />
      </MotionBox>

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
            <MotionGridItem
              item
              xs={12}
              md={6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 * 0.15, duration: 0.5, ease: "easeOut" }}
            >
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
            </MotionGridItem>
            <MotionGridItem
              item
              xs={12}
              md={6}
              variants={zoomVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 * 0.15, duration: 0.5, ease: "easeOut" }}
            >
              <MKBox
                component="img"
                src={aboutCompany}
                alt="About Us"
                width="100%"
                borderRadius="lg"
                shadow="xl"
              />
            </MotionGridItem>
          </Grid>

          <Divider sx={{ my: 6 }} />

          {/* Mission & Vision */}
          <Grid container spacing={6}>
            <MotionGridItem
              item
              xs={12}
              md={6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <MKBox
                  component="img"
                  src={missionImage}
                  alt="Our Mission"
                  sx={{ width: "100%", borderRadius: "12px", mb: 3 }}
                />
                <MKTypography variant="h4" fontWeight="bold" mb={2}>
                  Our Mission
                </MKTypography>
                <MKTypography variant="body1">
                  To provide fast, convenient, and secure mobile top-up solutions for all users,
                  contributing to the development of cashless payments in Vietnam.
                </MKTypography>
              </Card>
            </MotionGridItem>
            <MotionGridItem
              item
              xs={12}
              md={6}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
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
            </MotionGridItem>
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
