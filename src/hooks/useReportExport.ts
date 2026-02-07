import { useCallback } from "react";
import { PDFReportGenerator, type PDFReportConfig } from "@/lib/pdfReportGenerator";
import { CSVExportGenerator, type CSVExportConfig } from "@/lib/csvExportGenerator";

export const useReportExport = () => {
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

  return { generatePDFReport, generateCSVReport };
};