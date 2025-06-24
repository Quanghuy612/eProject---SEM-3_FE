// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";

// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// @mui components
import { Card, CardContent, Grid, Modal, Box, Button, TextField, Fab } from "@mui/material";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import AddIcon from "@mui/icons-material/Add";
import feedBackStore from "stores/feedBackStore";
import { toast } from "react-toastify";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// eslint-disable-next-line react/prop-types
function StarDisplay({ ratting }) {
  const totalStars = 5;
  return (
    <>
      {Array.from({ length: totalStars }, (_, i) =>
        i < ratting ? (
          <StarIcon key={i} sx={{ color: "#fbc02d" }} />
        ) : (
          <StarBorderIcon key={i} sx={{ color: "#ccc" }} />
        )
      )}
    </>
  );
}

const schema = yup.object().shape({
  subject: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  rating: yup.number().required("Rating is required").min(1, "Min 1").max(5, "Max 5"),
});

function FeedBacks() {
  const routes = getRoutes();
  const [feedbackList, setFeedbackList] = useState([]);
  const [open, setOpen] = useState(false);
  const { getFeedBack, createFeedBack } = feedBackStore();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = async () => {
    const res = await getFeedBack();
    setFeedbackList(res.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subject: "",
      content: "",
      rating: 0,
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      Subject: data.subject,
      InitialMessage: data.content,
      Ratting: data.rating,
      UserId: user ? parseInt(user.UserId) : null,
    };
    const res = await createFeedBack(payload);
    if (res.status != 200) {
      toast.error("Error while creating feedback");
      return;
    }
    toast.success(res.data.message);
    reset();
    setOpen(false);
    fetchData();
  };

  return (
    <>
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <MKBox width="100%" zIndex={10} paddingTop={2}>
          <DefaultNavbar relative routes={routes} light />
        </MKBox>
        <MKBox px={1} width="100%" mx="auto" position="relative" zIndex={2} marginTop={20}>
          <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
            <Grid item xs={10} sm={9} md={8} lg={7} xl={5}>
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
                    Feedbacks
                  </MKTypography>
                </MKBox>
                {feedbackList.map((feedback) => (
                  <MKBox key={feedback.id} pt={2} pb={2} px={3}>
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <MKTypography variant="h6">{feedback.subject}</MKTypography>
                          <MKTypography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {feedback.initialMessage}
                          </MKTypography>
                          <StarDisplay ratting={feedback.ratting} />
                        </CardContent>
                      </Card>
                    </Grid>
                  </MKBox>
                ))}
              </Card>
            </Grid>
          </Grid>
        </MKBox>
        <MKBox width="50%">
          <Grid container spacing={2}></Grid>
        </MKBox>

        {/* ➕ Floating Button */}
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ position: "fixed", bottom: 32, right: 32 }}
        >
          <AddIcon />
        </Fab>

        {/* 📋 Feedback Modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
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
            }}
          >
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Content"
                  multiline
                  rows={4}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Box>
                  <MKTypography variant="body2" mb={0.5}>
                    Rating
                  </MKTypography>
                  <Rating
                    {...field}
                    value={Number(field.value)}
                    onChange={(_, value) => field.onChange(value)}
                  />
                  {errors.rating && (
                    <MKTypography color="error" variant="caption">
                      {errors.rating.message}
                    </MKTypography>
                  )}
                </Box>
              )}
            />

            <Button type="submit" variant="contained" sx={{ color: "#fff" }}>
              Submit Feedback
            </Button>
          </Box>
        </Modal>
      </MKBox>
    </>
  );
}

export default FeedBacks;
