import React from "react";
import Card from "@mui/material/Card";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MDBox from "components/Admin/MDBox";
import MDTypography from "components/Admin/MDTypography";
import MDInput from "components/Admin/MDInput";
import MDButton from "components/Admin/MDButton";
import BasicLayout from "../components/BasicLayout";
import bgImage from "assets/admin/images/bg-sign-in-basic.jpeg";
import useAdminStore from "stores/adminStore";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

function Basic() {
  const { login, loading } = useAdminStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await login(data, navigate);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
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
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                {loading ? "Signing in..." : "Sign In"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
