/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDTypography from "components/Admin/MDTypography";

export default function data({ param = [] } = {}) {
  const Phone = ({ phoneNumber }) => (
    <MDTypography display="block" variant="button" fontWeight="medium">
      {phoneNumber}
    </MDTypography>
  );

  const AmountInfo = ({ amount }) => (
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      ${amount.toFixed(2)}
    </MDTypography>
  );

  const PaymentMethod = ({ method }) => (
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {method}
    </MDTypography>
  );

  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("en-GB") : "N/A");

  const generateRows = (data) =>
    data.map((transaction) => ({
      no: <Phone phoneNumber={transaction.transactionId} />,
      phone: <Phone phoneNumber={transaction.phoneNumber} />,
      transactionDate: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDate(transaction.transactionDate)}
        </MDTypography>
      ),
      amountInfo: <AmountInfo amount={transaction.totalAmount} />,
      paymentMethod: <PaymentMethod method={transaction.paymentMethod} />,
    }));

  return {
    columns: [
      { Header: "Transaction No", accessor: "no", align: "left" },
      { Header: "Phone Number", accessor: "phone", width: "20%", align: "left" },
      { Header: "Transaction Date", accessor: "transactionDate", align: "left" },
      { Header: "Total Amount", accessor: "amountInfo", align: "left" },
      { Header: "Payment Method", accessor: "paymentMethod", align: "left" },
    ],
    rows: generateRows(param),
  };
}
