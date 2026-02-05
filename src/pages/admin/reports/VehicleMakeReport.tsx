// src/pages/VehicleMakeReport.tsx

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Factory,
  CalendarClock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type ---
type VehicleMake = {
  id: string;
  manufacturer: string;
  code: string;
  dateModified: string;
  searchField?: string;
};

// --- Mock Data ---
const mockVehicleMakes: VehicleMake[] = [
  {
    id: "1",
    manufacturer: "Toyota",
    code: "TOY",
    dateModified: "2024-01-15",
  },
  {
    id: "2",
    manufacturer: "Nissan",
    code: "NIS",
    dateModified: "2024-02-01",
  },
  {
    id: "3",
    manufacturer: "Suzuki",
    code: "SUZ",
    dateModified: "2024-03-10",
  },
  {
    id: "4",
    manufacturer: "Mitsubishi",
    code: "MIT",
    dateModified: "2024-01-28",
  },
];

// --- Table Columns ---
const columns: ColumnDef<VehicleMake>[] = [
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
    cell: ({ row }) => (
      <span className="font-semibold text-blue-700">{row.getValue("manufacturer")}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Manufacturer Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("code")}</span>
    ),
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

// --- Component ---
export default function VehicleMakeReport() {
  const [data] = useState<VehicleMake[]>(
    mockVehicleMakes.map((m) => ({
      ...m,
      searchField: `${m.manufacturer} ${m.code}`,
    }))
  );

  const exportCSV = () => {
    const headers = ["Manufacturer", "Code", "Date Modified"];
    const rows = data.map((m) => [m.manufacturer, m.code, m.dateModified]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicle_make_report.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Make Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Manufacturer", "Code", "Modified"]],
      body: data.map((m) => [m.manufacturer, m.code, m.dateModified]),
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [99, 48, 184],
      },
    });

    doc.save("vehicle_make_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Make Report</h1>
          <p className="text-muted-foreground">List of registered vehicle manufacturers</p>
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
            <Factory className="h-5 w-5" />
            Manufacturer List
            <Badge variant="outline" className="text-muted-foreground ml-2">
              {data.length} Records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search manufacturer or code..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}