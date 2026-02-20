import { useCallback } from "react";
import { PDFReportGenerator, type PDFReportConfig } from "@/lib/pdfReportGenerator";

export const usePDFReport = () => {
  const generateReport = useCallback(
    async (config: PDFReportConfig, action: "save" | "print" = "save") => {
      const generator = new PDFReportGenerator(config);
      await generator.generate(action);
    },
    []
  );

  return { generateReport };
};