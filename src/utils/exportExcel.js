import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, baseFileName = "data") => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but got:", data);
    return;
  }

  // Get current date in dd_mm_yyyy format
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const formattedDate = `${dd}_${mm}_${yyyy}`;
  const fullFileName = `${baseFileName}_${formattedDate}.xlsx`;

  // Convert JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to binary
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob and trigger download
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fullFileName);
};
