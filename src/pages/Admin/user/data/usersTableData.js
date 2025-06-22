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
    data.map((transaction) => ({
      Username: <Text phoneNumber={transaction.username} />,
      Fullname: <Text phoneNumber={transaction.fullname} />,
      Email: <Text phoneNumber={transaction.email} />,
      PhoneNumber: <Text phoneNumber={transaction.phoneNumber} />,
    }));

  return {
    columns: [
      { Header: "Username", accessor: "Username", align: "left" },
      { Header: "Full name", accessor: "Fullname", width: "20%", align: "left" },
      { Header: "Phone number", accessor: "PhoneNumber", align: "left" },
      { Header: "Email", accessor: "Email", align: "left" },
    ],
    rows: generateRows(param),
  };
}
