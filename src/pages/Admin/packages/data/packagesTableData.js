/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDTypography from "components/Admin/MDTypography";
import Switch from "@mui/material/Switch";
import MDBox from "components/Admin/MDBox";

export default function data({ param = [], onToggle = () => {} } = {}) {
  const Text = ({ phoneNumber }) => (
    <MDTypography display="block" variant="button" fontWeight="medium">
      {phoneNumber}
    </MDTypography>
  );

  const generateRows = (data) =>
    data.map((item) => ({
      name: <Text phoneNumber={item.name} />,
      count: <Text phoneNumber={item.count} />,
      toggle: (
        <MDBox display="flex" justifyContent="center" alignItems="center">
          <Switch
            checked={item.enable || false}
            onChange={() => onToggle(item)}
            color="primary"
            inputProps={{ "aria-label": "toggle package" }}
          />
        </MDBox>
      ),
    }));

  return {
    columns: [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Usages", accessor: "count", width: "20%", align: "left" },
      { Header: "Enable", accessor: "toggle", width: "10%", align: "center" },
    ],
    rows: generateRows(param),
  };
}
