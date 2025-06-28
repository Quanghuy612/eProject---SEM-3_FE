import React from "react";
import PropTypes from "prop-types";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingSpinner = ({ open, color }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <CircularProgress size={80} thickness={4} sx={{ color }} />
    </Backdrop>
  );
};

// ✅ PropTypes validation
LoadingSpinner.propTypes = {
  open: PropTypes.bool,
  color: PropTypes.string,
};

// ✅ Default props (optional)
LoadingSpinner.defaultProps = {
  open: true,
  color: "#00B8D4",
};

export default LoadingSpinner;
