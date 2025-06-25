// Material Kit 2 React components
import MKBox from "components/User/MKBox";
import MKTypography from "components/User/MKTypography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// Material Kit 2 React example components
import DefaultNavbar from "examples/User/Navbars/DefaultNavbar";

// Material Kit 2 React page layout routes
import getRoutes from "routes";

// @mui components
import {
  Card,
  CardContent,
  Grid,
  Modal,
  Box,
  Button,
  TextField,
  Fab,
  CardHeader,
  CardActions,
  Pagination,
} from "@mui/material";

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
  const [totalItems, setTotalItems] = useState(1);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [thanksMessage, setThanksMessage] = useState("");

  const fetchData = async () => {
    const res = await getFeedBack({ currentPage });
    setTotalItems(Math.ceil(res.data.totalItems / pageSize));
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
    reset();
    setThanksMessage("Thank you for your feedback!");

    setTimeout(() => {
      setThanksMessage("");
      setOpen(false);
      fetchData();
    }, 2000);
  };

  return (
    <>
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: () =>
            `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})`,
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
        <MKBox width="100%" zIndex={10} paddingTop={2}>
          <DefaultNavbar relative routes={routes} light />
        </MKBox>
        <MKBox width="60%" mx="auto" position="relative" zIndex={2}>
          <Card
            sx={{
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              marginTop: 4,
            }}
          >
            <CardHeader
              sx={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
                marginBottom: 2,
              }}
              title={
                <MKBox
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MKTypography variant="h4" sx={{ flexGrow: 1 }}>
                    FeedBacks
                  </MKTypography>
                  <Fab
                    color="primary"
                    style={{ width: 35, height: 35, minHeight: 35 }}
                    onClick={() => setOpen(true)}
                  >
                    <AddIcon />
                  </Fab>
                </MKBox>
              }
            />
            {feedbackList.map((feedback, index) => (
              <MKBox key={index} pt={1} pb={1} pr={2} pl={2}>
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
            {/* Footer with pagination */}
            <CardActions sx={{ justifyContent: "center", paddingTop: 2 }}>
              <Pagination
                count={totalItems}
                page={currentPage}
                onChange={(e, value) => setCurrentPage(value)}
                color="info"
              />
            </CardActions>
          </Card>
        </MKBox>

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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {thanksMessage ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                gap={2}
                sx={{
                  animation: "fadeIn 0.4s ease-in-out",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 60, color: "success.main" }} />
                <MKTypography variant="h5" fontWeight="bold" color="success.main">
                  {thanksMessage}
                </MKTypography>
                <MKTypography variant="body2" color="text.secondary">
                  We appreciate your valuable input!
                </MKTypography>
              </Box>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </Modal>
      </MKBox>
    </>
  );
}

export default FeedBacks;
