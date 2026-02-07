import { useCallback } from "react";
import { PDFReportGenerator, type PDFReportConfig } from "@/lib/pdfReportGenerator";
import { CSVExportGenerator, type CSVExportConfig } from "@/lib/csvExportGenerator";
import { useExcelExport } from "@/hooks/useExcelExport";
import { type ReportColumn } from "@/types/reports";

export const useReportExport = () => {
  const { exportToExcel } = useExcelExport();

  const generatePDFReport = useCallback(
    async (config: PDFReportConfig, action: "save" | "print" = "save") => {
      const generator = new PDFReportGenerator(config);
      await generator.generate(action);
    },
    []
  );

  const generateCSVReport = useCallback((config: CSVExportConfig) => {
    const generator = new CSVExportGenerator(config);
    generator.export();
  }, []);

  const generateExcelReport = useCallback(<T extends Record<string, any>>(
    data: T[],
    columns: ReportColumn[],
    fileName: string
  ) => {
    exportToExcel(data, columns, fileName);
  }, [exportToExcel]);

  return { generatePDFReport, generateCSVReport, generateExcelReport };
};