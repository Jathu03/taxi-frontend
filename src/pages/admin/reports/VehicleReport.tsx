// src/pages/VehicleReport.tsx

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSpreadsheet, FileText, CarFront } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type Vehicle = {
  id: string;
  registrationNo: string;
  code: string;
  vehicleClass: string;
  manufacture: string;
  model: string;
  insuranceExpiry: string;
  licenseExpiry: string;
  // Computed field
  searchField?: string;
};

// --- Sample Data ---
const mockVehicleData: Vehicle[] = [
  {
    id: "v1",
    registrationNo: "CAB-1234",
    code: "VEH-001",
    vehicleClass: "ECONOMY",
    manufacture: "Toyota",
    model: "Axio",
    insuranceExpiry: "2024-12-31",
    licenseExpiry: "2024-10-15",
  },
  {
    id: "v2",
    registrationNo: "LUX-5678",
    code: "VEH-002",
    vehicleClass: "LUXURY",
    manufacture: "BMW",
    model: "5 Series",
    insuranceExpiry: "2025-01-20",
    licenseExpiry: "2024-11-10",
  },
  {
    id: "v3",
    registrationNo: "BUS-9090",
    code: "VEH-003",
    vehicleClass: "BUS",
    manufacture: "Nissan",
    model: "Civilian",
    insuranceExpiry: "2025-03-15",
    licenseExpiry: "2024-12-01",
  },
  {
    id: "v4",
    registrationNo: "ECO-2345",
    code: "VEH-004",
    vehicleClass: "ECONOMY",
    manufacture: "Suzuki",
    model: "Alto",
    insuranceExpiry: "2025-02-01",
    licenseExpiry: "2024-10-01",
  },
];

// --- Column Definitions ---
const columns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "registrationNo",
    header: "Registration No",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-blue-700">
        {row.getValue("registrationNo")}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: "Class",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("vehicleClass")}</Badge>
    ),
  },
  {
    accessorKey: "manufacture",
    header: "Manufacture",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "insuranceExpiry",
    header: "Insurance Expiry Date",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("insuranceExpiry")}</Badge>
    ),
  },
  {
    accessorKey: "licenseExpiry",
    header: "Revenue License Exp Date",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("licenseExpiry")}</Badge>
    ),
  },
];

// 🚀 COMPONENT STARTS HERE
export default function VehicleReport() {
  const [data] = useState<Vehicle[]>(() =>
    mockVehicleData.map((v) => ({
      ...v,
      searchField: `${v.registrationNo} ${v.code} ${v.model}`,
    }))
  );

  const exportCSV = () => {
    const headers =
      "Registration No,Code,Class,Manufacture,Model,Insurance Expiry,License Expiry";
    const rows = data.map(
      (v) =>
        `${v.registrationNo},${v.code},${v.vehicleClass},${v.manufacture},${v.model},${v.insuranceExpiry},${v.licenseExpiry}`
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicle_report.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Vehicle Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Reg No",
          "Code",
          "Class",
          "Make",
          "Model",
          "Insurance Expiry",
          "License Expiry",
        ],
      ],
      body: data.map((v) => [
        v.registrationNo,
        v.code,
        v.vehicleClass,
        v.manufacture,
        v.model,
        v.insuranceExpiry,
        v.licenseExpiry,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("vehicle_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Report</h1>
          <p className="text-muted-foreground mt-1">All registered vehicles summary</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-100"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <CarFront className="h-5 w-5" />
            Vehicle Details ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search vehicle by reg no, code, or model..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}