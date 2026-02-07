"use client";
import { useState, useMemo } from "react";
import type { ReactNode } from 'react';
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { FileText, Printer, FileSpreadsheet } from "lucide-react";
import { useReportExport } from "@/hooks/useReportExport";
import { type ReportColumn } from "@/types/reports";

export type ReportFilter<T> = {
  key: keyof T;
  label: string;
  options: Array<{ label: string; value: string }>;
  defaultValue: string;
};

export type ReportConfig<T> = {
  title: string;
  data: T[];
  tableColumns: ColumnDef<T>[];
  exportColumns: ReportColumn[];
  searchKey: keyof T;
  filters?: ReportFilter<T>[];
  additionalActions?: ReactNode;
  fileName: string;
  enableCSV?: boolean; // Default true
  enablePDF?: boolean; // Default true
  enableExcel?: boolean; // Default true
  enablePrint?: boolean; // Default true
};

export function ReportPageTemplate<T extends Record<string, any>>({
  title,
  data,
  tableColumns,
  exportColumns,
  searchKey,
  filters = [],
  additionalActions,
  fileName,
  enableCSV = true,
  enablePDF = true,
  enableExcel = true,
  enablePrint = true,
}: ReportConfig<T>) {
  const { generatePDFReport, generateCSVReport, generateExcelReport } = useReportExport();

  // Dynamic filter state
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce((acc, f) => ({ ...acc, [f.key as string]: f.defaultValue }), {})
  );

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...data];

    filters.forEach(filter => {
      const filterValue = filterValues[filter.key as string];
      if (filterValue !== "all") {
        result = result.filter(item => item[filter.key] === filterValue);
      }
    });

    return result;
  }, [data, filterValues, filters]);

  // Generate filter tags for PDF
  const getFilterTags = () => {
    return [
      ...filters.map(f => ({
        label: f.label,
        value: f.options.find(opt => opt.value === filterValues[f.key as string])?.label || "All",
      })),
      { label: "Total Records", value: String(data.length) },
      { label: "Filtered", value: String(filteredData.length) },
    ];
  };

  const handleGeneratePDF = async (action: "save" | "print") => {
    await generatePDFReport(
      {
        title,
        orientation: "landscape",
        logoUrl: "/logo.png",
        filterTags: getFilterTags(),
        columns: exportColumns,
        data: filteredData,
        fileName: fileName.replace(/\.[^/.]+$/, ".pdf"),
        showMetadata: true,
      },
      action
    );
  };

  const handleGenerateCSV = () => {
    generateCSVReport({
      columns: exportColumns,
      data: filteredData,
      fileName: fileName.replace(/\.[^/.]+$/, ".csv"),
      includeHeaders: true,
    });
  };

  const handleGenerateExcel = () => {
    generateExcelReport(
      filteredData,
      exportColumns,
      fileName.replace(/\.[^/.]+$/, ".xlsx")
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {additionalActions}

          {enableCSV && (
            <Button onClick={handleGenerateCSV} variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Export CSV
            </Button>
          )}

          {enableExcel && (
            <Button onClick={handleGenerateExcel} variant="outline" className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200">
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </Button>
          )}

          {enablePDF && (
            <Button onClick={() => handleGeneratePDF("save")} className="gap-2">
              <FileText className="h-4 w-4" /> PDF
            </Button>
          )}

          {enablePrint && (
            <Button onClick={() => handleGeneratePDF("print")} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {filters.map(filter => (
            <div key={filter.key as string} className="flex items-center gap-2">
              <label className="text-sm font-medium">{filter.label}:</label>
              <select
                value={filterValues[filter.key as string]}
                onChange={e =>
                  setFilterValues(prev => ({ ...prev, [filter.key]: e.target.value }))
                }
                className="border rounded px-3 py-1.5"
              >
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      <EnhancedDataTable
        columns={tableColumns}
        data={filteredData}
        searchKey={searchKey as string}
      />
    </div>
  );
}