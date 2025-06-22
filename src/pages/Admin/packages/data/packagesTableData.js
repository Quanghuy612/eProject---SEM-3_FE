/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDTypography from "components/Admin/MDTypography";

export default function data({ param = [] } = {}) {
  const Text = ({ phoneNumber }) => (
    <MDTypography display="block" variant="button" fontWeight="medium">
      {phoneNumber}
    </MDTypography>
  );

  const generateRows = (data) =>
    data.map((item) => ({
      name: <Text phoneNumber={item.name} />,
      count: <Text phoneNumber={item.count} />,
    }));

  return {
    columns: [
      { Header: "Name", accessor: "name", align: "left" },
      { Header: "Count", accessor: "count", width: "20%", align: "left" },
    ],
    rows: generateRows(param),
  };
}
