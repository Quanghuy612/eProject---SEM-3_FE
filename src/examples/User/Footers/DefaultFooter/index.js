/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { keyframes } from "@mui/system";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import PaymentIcon from "@mui/icons-material/Payment";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import BoltIcon from "@mui/icons-material/Bolt";

// Animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function DefaultFooter({ content }) {
  const { brand, menus, copyright } = content;
  return (
    <MKBox
      component="footer"
      sx={{
        background:
          "linear-gradient(135deg, rgba(127, 127, 158, 0.95) 0%, rgba(35, 35, 65, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(179, 207, 215, 0.2)",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={4} sx={{ mb: 3 }}>
            <MKBox display="flex" alignItems="center" mb={2}>
              <Link to={brand.route}>
                <MKBox
                  component="img"
                  src={brand.image}
                  alt={brand.name}
                  maxWidth="3rem"
                  mr={2}
                  sx={{
                    animation: `${pulse} 4s ease-in-out infinite`,
                    filter: "drop-shadow(0 0 8px rgba(179, 207, 215, 0.5))",
                  }}
                />
              </Link>
              <MKTypography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(90deg, #B3CFD7, #FFFFFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 10px rgba(179, 207, 215, 0.3)",
                }}
              >
                Mobile Recharges
              </MKTypography>
            </MKBox>

            <MKTypography variant="body2" color="white" opacity={0.8} mb={3}>
              Fast, secure and reliable mobile recharges for all networks. Instant top-ups with the
              best rates.
            </MKTypography>

            <MKBox display="flex" alignItems="center" mt={3} gap={2}>
              {/* Facebook */}
              <MKBox
                component="a"
                href="#"
                onClick={(e) => e.preventDefault()}
                width={40}
                height={40}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.1)"
                sx={{
                  border: "1px solid #1877F2",
                  color: "#1877F2",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 5px 15px rgba(24, 119, 242, 0.5)",
                  },
                }}
              >
                <FacebookIcon />
              </MKBox>

              {/* Twitter */}
              <MKBox
                component="a"
                href="#"
                onClick={(e) => e.preventDefault()}
                width={40}
                height={40}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.1)"
                sx={{
                  border: "1px solid #1DA1F2",
                  color: "#1DA1F2",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 5px 15px rgba(29, 161, 242, 0.5)",
                  },
                }}
              >
                <TwitterIcon />
              </MKBox>

              {/* Instagram */}
              <MKBox
                component="a"
                href="#"
                onClick={(e) => e.preventDefault()}
                width={40}
                height={40}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.1)"
                sx={{
                  border: "1px solid #E4405F",
                  color: "#E4405F",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 5px 15px rgba(228, 64, 95, 0.5)",
                  },
                }}
              >
                <InstagramIcon />
              </MKBox>

              {/* LinkedIn */}
              <MKBox
                component="a"
                href="#"
                onClick={(e) => e.preventDefault()}
                width={40}
                height={40}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="rgba(255, 255, 255, 0.1)"
                sx={{
                  border: "1px solid #0A66C2",
                  color: "#0A66C2",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 5px 15px rgba(10, 102, 194, 0.5)",
                  },
                }}
              >
                <LinkedInIcon />
              </MKBox>
            </MKBox>
          </Grid>

          {/* Menu Links */}
          {menus.map(({ name: title, items }) => (
            <Grid key={title} item xs={6} md={2} sx={{ mb: 3 }}>
              <MKTypography
                display="block"
                variant="h6"
                fontWeight="bold"
                color="white"
                mb={2}
                sx={{
                  position: "relative",
                  "&:after": {
                    content: '""',
                    display: "block",
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, #B3CFD7, transparent)",
                    mt: 1,
                  },
                }}
              >
                {title}
              </MKTypography>
              <MKBox component="ul" p={0} m={0} sx={{ listStyle: "none" }}>
                {items.map(({ name, route, href }) => (
                  <MKBox
                    key={name}
                    component="li"
                    p={0}
                    m={0}
                    lineHeight={2}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {href ? (
                      <MKTypography
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        variant="button"
                        fontWeight="regular"
                        color="white"
                        opacity={0.8}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": {
                            opacity: 1,
                            color: "#B3CFD7",
                          },
                        }}
                      >
                        <BoltIcon sx={{ fontSize: "1rem", mr: 1 }} />
                        {name}
                      </MKTypography>
                    ) : (
                      <MKTypography
                        component={Link}
                        to={route}
                        variant="button"
                        fontWeight="regular"
                        color="white"
                        opacity={0.8}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          "&:hover": {
                            opacity: 1,
                            color: "#B3CFD7",
                          },
                        }}
                      >
                        <BoltIcon sx={{ fontSize: "1rem", mr: 1 }} />
                        {name}
                      </MKTypography>
                    )}
                  </MKBox>
                ))}
              </MKBox>
            </Grid>
          ))}

          <Grid item xs={12} md={4} sx={{ mb: 3 }}>
            <MKTypography
              variant="h6"
              fontWeight="bold"
              color="white"
              mb={2}
              sx={{
                position: "relative",
                "&:after": {
                  content: '""',
                  display: "block",
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, #B3CFD7, transparent)",
                  mt: 1,
                },
              }}
            ></MKTypography>

            <MKBox display="flex" alignItems="center" mb={2}>
              <SecurityIcon sx={{ color: "#B3CFD7", mr: 1 }} />
              <MKTypography variant="body2" color="white" opacity={0.8}>
                256-bit SSL Secure Payments
              </MKTypography>
            </MKBox>

            <MKBox display="flex" alignItems="center">
              <SupportAgentIcon sx={{ color: "#B3CFD7", mr: 1 }} />
              <MKTypography variant="body2" color="white" opacity={0.8}>
                24/7 Customer Support
              </MKTypography>
            </MKBox>
          </Grid>

          {/* Copyright */}
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <MKTypography
              variant="body2"
              color="white"
              opacity={0.7}
              sx={{
                animation: `${float} 6s ease-in-out infinite`,
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              {copyright}
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

// Typechecking props for the DefaultFooter
DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;
