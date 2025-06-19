/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useEffect, useState } from "react";
import API from "../../../api/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";
import MKInput from "components/User/MKInput";
import MKButton from "components/User/MKButton";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

export default function Account() {
  const routes = getRoutes();
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: -1,
    username: "",
    phoneNumber: "",
    fullname: "",
    password: "",
    currentPassword: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/authentication/sign-in");
      return;
    }

    let userIdFromToken = -1;

    try {
      const decoded = jwtDecode(token);
      userIdFromToken = parseInt(decoded.UserId);
    } catch (err) {
      console.error("Token decode failed", err);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await API.get(`users/${userIdFromToken}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error("Failed to fetch user info", error);
        toast.error("❌ Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("❗ Please fix the errors in the form.");
      return;
    }

    setUpdating(true);

    try {
      const payload = {
        fullname: formData.fullname,
        email: formData.email,
        currentPassword: formData.currentPassword,
        phoneNumber: formData.phoneNumber,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await API.put(`users/${formData.userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Update successful!");
      setFormData((prev) => ({
        ...prev,
        password: "",
        currentPassword: "",
      }));
    } catch (error) {
      console.error("Update failed", error);
      toast.error("❌ Update failed. Please check your current password.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MKBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <MKTypography variant="body1" color="text">
          Loading information...
        </MKTypography>
      </MKBox>
    );
  }

  return (
    <>
      <DefaultNavbar routes={routes} transparent light />
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox
        px={1}
        width="100%"
        minHeight="100vh"
        mx="auto"
        position="relative"
        zIndex={2}
        display="flex"
        flexDirection="column"
      >
        <MKBox mt={16} mb={6}>
          {" "}
          {/* Thêm margin top 8rem (8 * 8px = 64px) */}
          <Grid container justifyContent="center">
            <Grid item xs={11} sm={9} md={7} lg={6} xl={5}>
              <Card>
                <MKBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={2}
                  mb={1}
                  textAlign="center"
                >
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Account Information
                  </MKTypography>
                  <MKTypography variant="body2" color="white" opacity={0.8}>
                    Update your personal information
                  </MKTypography>
                </MKBox>
                <MKBox pt={4} pb={3} px={3}>
                  <MKBox component="form" role="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="text"
                            label="Username"
                            fullWidth
                            disabled
                            value={formData.username}
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="text"
                            label="Phone number"
                            fullWidth
                            disabled
                            value={formData.phoneNumber}
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="text"
                            label="Full name *"
                            fullWidth
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            error={!!errors.fullname}
                            helperText={errors.fullname}
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="email"
                            label="Email *"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="password"
                            label="Current Password *"
                            fullWidth
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                          />
                        </MKBox>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKBox mb={2}>
                          <MKInput
                            type="password"
                            label="New Password (optional)"
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                          />
                        </MKBox>
                      </Grid>
                    </Grid>
                    <MKBox mt={4} mb={1} textAlign="center">
                      <MKButton
                        variant="gradient"
                        color="info"
                        type="submit"
                        disabled={
                          !formData.fullname ||
                          !formData.email ||
                          !formData.currentPassword ||
                          updating
                        }
                        fullWidth
                      >
                        {updating ? "Updating..." : "Update"}
                      </MKButton>
                    </MKBox>
                  </MKBox>
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
    </>
  );
}
