// src/pages/VehicleClassReport.tsx

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type Definition ---
type VehicleClass = {
  id: string;
  className: string;
  classCode: string;
  showInApp: boolean;
  fareScheme: string;
  corporateFareScheme: string;
  roadTripFareScheme: string;
  appFareScheme: string;
  commission: number;
  searchField?: string;
};

// --- Sample Data ---
const mockVehicleClasses: VehicleClass[] = [
  {
    id: "1",
    className: "Economy",
    classCode: "ECO",
    showInApp: true,
    fareScheme: "StandardFareA",
    corporateFareScheme: "CorporateFA1",
    roadTripFareScheme: "RoadTripFA1",
    appFareScheme: "AppFA1",
    commission: 10,
  },
  {
    id: "2",
    className: "Luxury",
    classCode: "LUX",
    showInApp: true,
    fareScheme: "StandardFareB",
    corporateFareScheme: "CorporateFA2",
    roadTripFareScheme: "RoadTripFA2",
    appFareScheme: "AppFA2",
    commission: 15,
  },
  {
    id: "3",
    className: "Mini Van",
    classCode: "MNV",
    showInApp: false,
    fareScheme: "StandardFareC",
    corporateFareScheme: "CorporateFA3",
    roadTripFareScheme: "RoadTripFA3",
    appFareScheme: "AppFA3",
    commission: 12,
  },
];

// --- Columns ---
const columns: ColumnDef<VehicleClass>[] = [
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
    accessorKey: "className",
    header: "Class Name",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">
        {row.getValue("className")}
      </span>
    ),
  },
  {
    accessorKey: "classCode",
    header: "Class Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("classCode")}</span>
    ),
  },
  {
    accessorKey: "showInApp",
    header: "Show in App",
    cell: ({ row }) =>
      row.getValue("showInApp") ? (
        <Badge variant="outline" className="text-green-700 bg-green-50 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-700 bg-red-50 border-red-300">
          <XCircle className="h-3 w-3 mr-1" /> No
        </Badge>
      ),
  },
  {
    accessorKey: "fareScheme",
    header: "Fare Scheme",
  },
  {
    accessorKey: "corporateFareScheme",
    header: "Corporate Fare",
  },
  {
    accessorKey: "roadTripFareScheme",
    header: "RoadTrip Fare",
  },
  {
    accessorKey: "appFareScheme",
    header: "App Fare",
  },
  {
    accessorKey: "commission",
    header: "Commission (%)",
    cell: ({ row }) => `${row.getValue("commission")}%`,
  },
];

// --- Main Component ---
export default function VehicleClassReport() {
  const [data] = useState<VehicleClass[]>(
    mockVehicleClasses.map((item) => ({
      ...item,
      searchField: `${item.className} ${item.classCode}`,
    }))
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Class Name",
      "Class Code",
      "Show in App",
      "Fare Scheme",
      "Corporate Fare Scheme",
      "RoadTrip Fare Scheme",
      "App Fare Scheme",
      "Commission",
    ];
    const rows = data.map((v) => [
      v.className,
      v.classCode,
      v.showInApp ? "Yes" : "No",
      v.fareScheme,
      v.corporateFareScheme,
      v.roadTripFareScheme,
      v.appFareScheme,
      `${v.commission}%`,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicle_class_report.csv";
    link.click();
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Class Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [
        [
          "Class",
          "Code",
          "In App",
          "Fare",
          "Corporate",
          "RoadTrip",
          "App Fare",
          "Commission",
        ],
      ],
      body: data.map((v) => [
        v.className,
        v.classCode,
        v.showInApp ? "Yes" : "No",
        v.fareScheme,
        v.corporateFareScheme,
        v.roadTripFareScheme,
        v.appFareScheme,
        `${v.commission}%`,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("vehicle_class_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Class Report</h1>
          <p className="text-muted-foreground text-sm">
            List of vehicle classes and related fare schemes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} className="bg-[#6330B8] text-white">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Truck className="h-5 w-5" />
            Class List
            <Badge variant="outline" className="text-muted-foreground ml-2">
              {data.length} Classes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search class name or code..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}