/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================
*/

// @mui material components
import Grid from "@mui/material/Grid";
import { keyframes } from "@mui/system";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Material Kit 2 React footerRoutes
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Routes
import getRoutes from "routes";

// Images
import contactBg from "assets/images/bg2.jpg";
import teamMeeting from "assets/images/team-2.jpg";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { motion } from "framer-motion";

// Animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function ContactUs() {
  const routes = getRoutes();
  const MotionGridItem = motion(Grid);
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -50 },
    visible: { opacity: 1, scale: 1, x: 0 },
  };

  return (
    <>
      <MKBox width="100%" zIndex={10} position="fixed">
        <DefaultNavbar routes={routes} light />
      </MKBox>

      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: () =>
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${contactBg})`,
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
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh", position: "relative", zIndex: 1 }}
        >
          {/* Left Side - Contact Information */}
          <Grid item xs={12} lg={5} sx={{ display: "flex", justifyContent: "center" }}>
            <MKBox
              width="90%"
              borderRadius="xl"
              p={5}
              sx={{
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(26, 26, 46, 0.8)",
                border: "1px solid rgba(179, 207, 215, 0.4)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                animation: `${float} 6s ease-in-out infinite`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
                  borderColor: "rgba(179, 207, 215, 0.6)",
                },
              }}
            >
              <MKTypography
                variant="h1"
                color="white"
                mb={4}
                textAlign="center"
                sx={{
                  textShadow: "0 0 15px rgba(179, 207, 215, 0.7)",
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  position: "relative",
                  "&:after": {
                    content: '""',
                    display: "block",
                    width: "80px",
                    height: "4px",
                    background: "linear-gradient(90deg, #B3CFD7, transparent)",
                    margin: "15px auto 0",
                    borderRadius: "2px",
                  },
                }}
              >
                Contact Us
              </MKTypography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        animation: `${pulse} 4s ease-in-out infinite`,
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <LocationOnIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        Address
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        Building T, FPT Polytechnic
                        <br />
                        13 Trinh Van Bo, Hanoi, Vietnam
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        animation: `${pulse} 4s ease-in-out infinite 0.5s`,
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <PhoneIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        Phone
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        Hotline: 1900 1234
                        <br />
                        Support: 028 1234 5678
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        animation: `${pulse} 4s ease-in-out infinite 1s`,
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <EmailIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        Email
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        info@company.com
                        <br />
                        support@company.com
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>

                <Grid item xs={12} md={6}>
                  <MKBox
                    display="flex"
                    alignItems="flex-start"
                    mb={3}
                    sx={{
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <MKBox
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.2)"
                      mr={3}
                      sx={{
                        animation: `${pulse} 4s ease-in-out infinite 1.5s`,
                        border: "1px solid rgba(179, 207, 215, 0.3)",
                      }}
                    >
                      <ScheduleIcon sx={{ color: "#B3CFD7", fontSize: "2rem" }} />
                    </MKBox>
                    <MKBox>
                      <MKTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                        Working Hours
                      </MKTypography>
                      <MKTypography variant="body2" color="white" opacity={0.8}>
                        Monday - Friday: 8:00 AM - 5:30 PM
                        <br />
                        Saturday: 8:00 AM - 12:00 PM
                      </MKTypography>
                    </MKBox>
                  </MKBox>
                </Grid>
              </Grid>

              <MKBox mt={6} textAlign="center">
                <MKTypography
                  variant="h4"
                  color="white"
                  mb={3}
                  sx={{
                    textShadow: "0 0 10px rgba(179, 207, 215, 0.5)",
                    position: "relative",
                    display: "inline-block",
                    "&:before, &:after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      width: "30px",
                      height: "1px",
                      background: "rgba(179, 207, 215, 0.5)",
                    },
                    "&:before": {
                      left: "-40px",
                    },
                    "&:after": {
                      right: "-40px",
                    },
                  }}
                >
                  Connect With Us
                </MKTypography>
                <MKBox display="flex" justifyContent="center" gap={3}>
                  {[
                    { icon: <FacebookIcon fontSize="large" />, color: "#4267B2" },
                    { icon: <TwitterIcon fontSize="large" />, color: "#1DA1F2" },
                    { icon: <LinkedInIcon fontSize="large" />, color: "#0077B5" },
                    { icon: <InstagramIcon fontSize="large" />, color: "#E1306C" },
                  ].map((social, index) => (
                    <MKBox
                      key={index}
                      component="a"
                      href="#"
                      width={60}
                      height={60}
                      borderRadius="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgColor="rgba(179, 207, 215, 0.1)"
                      sx={{
                        transition: "all 0.3s",
                        border: `1px solid ${social.color}`,
                        color: social.color,
                        "&:hover": {
                          transform: "translateY(-5px) scale(1.1)",
                          bgColor: "rgba(66, 103, 178, 0.2)",
                          boxShadow: `0 5px 15px ${social.color}80`,
                        },
                      }}
                    >
                      {social.icon}
                    </MKBox>
                  ))}
                </MKBox>
              </MKBox>
            </MKBox>
          </Grid>

          {/* Right Side - Content Replacement for Map */}
          <MotionGridItem
            item
            xs={12}
            lg={5}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 * 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <MKBox
              width="90%"
              borderRadius="xl"
              overflow="hidden"
              sx={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(26, 26, 46, 0.7)",
                border: "1px solid rgba(179, 207, 215, 0.4)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                p: 4,
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <MKBox
                component="img"
                src={teamMeeting}
                alt="Team meeting"
                width="100%"
                borderRadius="lg"
                mb={4}
                sx={{
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(179, 207, 215, 0.3)",
                }}
              />

              <MKTypography variant="h3" color="white" mb={3} textAlign="center" fontWeight="bold">
                We are Always Ready to Help You
              </MKTypography>

              <MKBox mb={4}>
                {[
                  "Professional team with over 10 years of experience",
                  "24/7 support for urgent issues",
                  "Customized solutions tailored to your needs",
                  "Guaranteed response within 2 working hours",
                ].map((item, index) => (
                  <MKBox key={index} display="flex" alignItems="center" mb={2}>
                    <CheckCircleIcon sx={{ color: "#B3CFD7", mr: 2 }} />
                    <MKTypography variant="body1" color="white" opacity={0.9}>
                      {item}
                    </MKTypography>
                  </MKBox>
                ))}
              </MKBox>

              <MKTypography variant="body1" color="white" opacity={0.8} textAlign="center" mb={4}>
                Customer satisfaction is at the heart of everything we do. Contact us now to receive
                the most dedicated consultation.
              </MKTypography>

              <MKBox textAlign="center" mt={3}>
                {/* <MKTypography variant="h6" color="#B3CFD7" fontWeight="bold">
                SUBSCRIBE TO OUR NEWSLETTER
              </MKTypography> */}
                <MKBox component="form" display="flex" justifyContent="center" mt={2}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "30px 0 0 30px",
                      border: "none",
                      width: "70%",
                      outline: "none",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "12px 25px",
                      borderRadius: "0 30px 30px 0",
                      border: "none",
                      backgroundColor: "#B3CFD7",
                      color: "#1A1A2E",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        backgroundColor: "#9BBBC7",
                      },
                    }}
                  >
                    Subscribe
                  </button>
                </MKBox>
              </MKBox>
            </MKBox>
          </MotionGridItem>
        </Grid>
      </MKBox>
    </>
  );
}

export default ContactUs;
