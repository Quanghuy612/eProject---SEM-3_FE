import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// @mui components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Kit components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";
import MKInput from "components/User/MKInput";
import MKButton from "components/User/MKButton";

// Other layout components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";
import getRoutes from "routes";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import useAuthStore from "stores/authStore";
import { useNavigate } from "react-router-dom";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required").min(3).max(15),
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  password: yup.string().required("Password is required").min(6),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

function SignUp() {
  const routes = getRoutes();
  const { signup, loading } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const requestPayload = {
      Username: data.username,
      Fullname: data.fullName,
      Password: data.password,
      PhoneNumber: data.phone,
      Email: data.email,
    };
    await signup(requestPayload, navigate);
  };

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
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
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
                  Create Account
                </MKTypography>
              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox
                  component="form"
                  role="form"
                  onSubmit={handleSubmit(onSubmit)}
                  autoComplete="off"
                >
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Full Name"
                      fullWidth
                      autoComplete="off"
                      {...register("fullName")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.fullName?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Username"
                      fullWidth
                      autoComplete="off"
                      {...register("username")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.username?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="email"
                      label="Email"
                      fullWidth
                      autoComplete="off"
                      {...register("email")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.email?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="text"
                      label="Phone Number"
                      fullWidth
                      autoComplete="off"
                      {...register("phone")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.phone?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="password"
                      label="Password"
                      fullWidth
                      autoComplete="new-password"
                      {...register("password")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.password?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      type="password"
                      label="Confirm Password"
                      fullWidth
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                    />
                    <MKTypography variant="caption" fontWeight="regular" color="error" mt={1}>
                      {errors.confirmPassword?.message}
                    </MKTypography>
                  </MKBox>
                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth type="submit">
                      {loading ? "Signing up" : "Sign Up"}
                    </MKButton>
                  </MKBox>
                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Already have an account?{" "}
                      <MKTypography
                        component={Link}
                        to="/authentication/sign-in"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Sign in
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default SignUp;
