import * as XLSX from "xlsx";
import { useCallback } from "react";

export interface ExcelColumn {
  header: string;
  dataKey: string;
}

export const useExcelExport = () => {
  const exportToExcel = useCallback(<T extends Record<string, any>>(
    data: T[],
    columns: ExcelColumn[],
    fileName: string
  ) => {
    // 1. Filter and Map data according to columns
    const formattedData = data.map((row) => {
      const newRow: Record<string, any> = {};
      columns.forEach((col) => {
        // Map the header name to the data value
        newRow[col.header] = row[col.dataKey];
      });
      return newRow;
    });

    // 2. Create a Worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Optional: Auto-width columns (makes it look nicer)
    const columnWidths = columns.map(() => ({ wch: 20 }));
    worksheet["!cols"] = columnWidths;

    // 3. Create a Workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // 4. Write the file
    // Ensure filename ends in .xlsx
    const finalFileName = fileName.endsWith(".xlsx") 
      ? fileName 
      : `${fileName.replace(".csv", "")}.xlsx`;

    XLSX.writeFile(workbook, finalFileName);
  }, []);

  return { exportToExcel };
};