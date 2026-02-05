import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Car,
  CalendarClock,
  Settings,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type Definition ---
type VehicleModel = {
  id: string;
  manufacturer: string;
  model: string;
  modelCode: string;
  frame: string;
  transmissionType: string;
  trimLevel: string;
  fuelInjectionType: string;
  turbo: boolean;
  comments: string;
  dateModified: string;
  searchField?: string;
};

// --- Mock Data ---
const mockVehicleModels: VehicleModel[] = [
  {
    id: "1",
    manufacturer: "Toyota",
    model: "Axio",
    modelCode: "NZE141",
    frame: "NZE141-1234567",
    transmissionType: "Automatic",
    trimLevel: "G",
    fuelInjectionType: "EFI",
    turbo: false,
    comments: "Standard Japanese import",
    dateModified: "2024-01-20",
  },
  {
    id: "2",
    manufacturer: "Nissan",
    model: "X-Trail",
    modelCode: "NT32",
    frame: "NT32-2345678",
    transmissionType: "CVT",
    trimLevel: "Hybrid",
    fuelInjectionType: "Direct Injection",
    turbo: true,
    comments: "Used in fleet",
    dateModified: "2024-03-18",
  },
  {
    id: "3",
    manufacturer: "Suzuki",
    model: "Wagon R",
    modelCode: "MH44S",
    frame: "MH44S-9876543",
    transmissionType: "Automatic",
    trimLevel: "FX",
    fuelInjectionType: "MPFI",
    turbo: false,
    comments: "",
    dateModified: "2024-02-10",
  },
];

// --- Column Definition ---
const columns: ColumnDef<VehicleModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
  },
  {
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-700">{row.getValue("model")}</span>
    ),
  },
  {
    accessorKey: "modelCode",
    header: "Model Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("modelCode")}</span>
    ),
  },
  {
    accessorKey: "frame",
    header: "Frame",
  },
  {
    accessorKey: "transmissionType",
    header: "Transmission Type",
  },
  {
    accessorKey: "trimLevel",
    header: "Trim Level",
  },
  {
    accessorKey: "fuelInjectionType",
    header: "Fuel Injection Type",
  },
  {
    accessorKey: "turbo",
    header: "Turbo",
    cell: ({ row }) =>
      row.getValue("turbo") ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
      ) : (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No</Badge>
      ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarClock className="h-3 w-3" />
        {row.getValue("dateModified")}
      </div>
    ),
  },
];

// --- Main Component ---
export default function VehicleModelReport() {
  const [data] = useState<VehicleModel[]>(
    mockVehicleModels.map((item) => ({
      ...item,
      searchField: `${item.manufacturer} ${item.model} ${item.modelCode}`,
    }))
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Manufacturer",
      "Model",
      "Model Code",
      "Frame",
      "Transmission Type",
      "Trim Level",
      "Fuel Injection Type",
      "Turbo",
      "Comments",
      "Modified",
    ];
    const rows = data.map((m) => [
      m.manufacturer,
      m.model,
      m.modelCode,
      m.frame,
      m.transmissionType,
      m.trimLevel,
      m.fuelInjectionType,
      m.turbo ? "Yes" : "No",
      m.comments,
      m.dateModified,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicle_model_report.csv";
    link.click();
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Model Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [
        [
          "Manufacturer",
          "Model",
          "Model Code",
          "Frame",
          "Transmission",
          "Trim",
          "Fuel Type",
          "Turbo",
          "Comments",
          "Modified",
        ],
      ],
      body: data.map((m) => [
        m.manufacturer,
        m.model,
        m.modelCode,
        m.frame,
        m.transmissionType,
        m.trimLevel,
        m.fuelInjectionType,
        m.turbo ? "Yes" : "No",
        m.comments,
        m.dateModified,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("vehicle_model_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-gray-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Model Report</h1>
          <p className="text-muted-foreground text-sm">Manage and view vehicle model specs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-[#6330B8] text-white" onClick={exportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Settings className="h-5 w-5" />
            Model List
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search by model code or manufacturer..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}