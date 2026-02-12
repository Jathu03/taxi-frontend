import { useState, useMemo } from "react";
import type { ReactNode } from 'react';
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout"; // Fixed import path from @/components/EnhancedDataTable to @/components/DataTableLayout
import { Button } from "@/components/ui/button";
import { FileText, Printer, FileSpreadsheet, RotateCcw } from "lucide-react";
import { useReportExport } from "@/hooks/useReportExport";
import { type ReportColumn } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  searchPlaceholder?: string;
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
  searchPlaceholder,
  filters = [],
  additionalActions,
  fileName,
  enableCSV = true,
  enablePDF = true,
  enableExcel = true,
  enablePrint = true,
}: ReportConfig<T>) {
  const { generatePDFReport, generateCSVReport, generateExcelReport } = useReportExport();

  // Search state
  const [searchValue, setSearchValue] = useState("");

  // Dynamic filter state
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters.reduce((acc, f) => ({ ...acc, [f.key as string]: f.defaultValue }), {})
  );

  // Apply filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchValue) {
      result = result.filter(item => {
        const val = item[searchKey as string]?.toString().toLowerCase() || "";
        return val.includes(searchValue.toLowerCase());
      });
    }

    // Apply filters
    filters.forEach(filter => {
      const filterValue = filterValues[filter.key as string];
      if (filterValue !== "all") {
        result = result.filter(item => {
          const itemValue = item[filter.key];
          // Special handling for boolean values (Select options are always strings "true"/"false")
          if (typeof itemValue === "boolean") {
            return String(itemValue) === filterValue;
          }
          return itemValue === filterValue;
        });
      }
    });

    return result;
  }, [data, filterValues, filters, searchValue, searchKey]);

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

  const handleReset = () => {
    setSearchValue("");
    setFilterValues(
      filters.reduce((acc, f) => ({ ...acc, [f.key as string]: f.defaultValue }), {})
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">{title}</h1>
          <p className="text-muted-foreground mt-1">Audit and analysis report</p>
        </div>
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
            <Button
              onClick={() => handleGeneratePDF("save")}
              variant="outline"
              className="gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
            >
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

      {/* Filter Panel */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder={searchPlaceholder || `Search by ${String(searchKey)}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {filters.map(filter => (
            <div key={filter.key as string} className="space-y-2">
              <Label htmlFor={filter.key as string}>{filter.label}</Label>
              <Select
                value={filterValues[filter.key as string]}
                onValueChange={(val) =>
                  setFilterValues(prev => ({ ...prev, [filter.key]: val }))
                }
              >
                <SelectTrigger id={filter.key as string}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <EnhancedDataTable
        columns={tableColumns}
        data={filteredData}
        hideSearch
        enableExport={false} // Export handled by template buttons
      />
    </div>
  );
}