// src/pages/FareSchemeReport.tsx

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  FileText,
  BadgePercent,
  CarFront,
  DollarSign,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
type FareScheme = {
  id: string;
  schemeName: string;
  vehicleClass: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  searchField?: string;
};

// --- Sample Data ---
const mockFareSchemes: FareScheme[] = [
  {
    id: "1",
    schemeName: "Standard Scheme A",
    vehicleClass: "ECONOMY",
    baseFare: 150,
    perKm: 50,
    perMin: 5,
  },
  {
    id: "2",
    schemeName: "Corporate Executive",
    vehicleClass: "LUXURY",
    baseFare: 450,
    perKm: 100,
    perMin: 15,
  },
  {
    id: "3",
    schemeName: "Weekend Special",
    vehicleClass: "VAN",
    baseFare: 300,
    perKm: 80,
    perMin: 8,
  },
];

// --- Columns ---
const columns: ColumnDef<FareScheme>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "schemeName",
    header: "Scheme Name",
    cell: ({ row }) => (
      <span className="font-semibold text-violet-700">{row.getValue("schemeName")}</span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: "Vehicle Class",
    cell: ({ row }) => (
      <Badge variant="outline" className="uppercase">
        {row.getValue("vehicleClass")}
      </Badge>
    ),
  },
  {
    accessorKey: "baseFare",
    header: "Base Fare",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        LKR {row.getValue("baseFare")}
      </div>
    ),
  },
  {
    accessorKey: "perKm",
    header: "Per KM",
    cell: ({ row }) => `LKR ${row.getValue("perKm")}`,
  },
  {
    accessorKey: "perMin",
    header: "Per Min",
    cell: ({ row }) => `LKR ${row.getValue("perMin")}`,
  },
];

// --- Component ---
export default function FareSchemeReport() {
  const [data] = useState<FareScheme[]>(
    mockFareSchemes.map((f) => ({
      ...f,
      searchField: `${f.schemeName} ${f.vehicleClass}`,
    }))
  );

  // --- Export CSV ---
  const exportCSV = () => {
    const headers = [
      "Scheme Name",
      "Vehicle Class",
      "Base Fare",
      "Per KM",
      "Per Min",
    ];
    const rows = data.map((f) => [
      f.schemeName,
      f.vehicleClass,
      f.baseFare,
      f.perKm,
      f.perMin,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "fare_scheme_report.csv";
    link.click();
  };

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Fare Scheme Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Scheme", "Vehicle", "Base Fare", "Per KM", "Per Min"]],
      body: data.map((f) => [
        f.schemeName,
        f.vehicleClass,
        `LKR ${f.baseFare}`,
        `LKR ${f.perKm}`,
        `LKR ${f.perMin}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("fare_scheme_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Fare Scheme Report</h1>
          <p className="text-muted-foreground text-sm">
            Manage base fares and distance/time charges
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={exportPDF} className="bg-[#6330B8] text-white">
            <FileText className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <BadgePercent className="h-5 w-5" />
            All Fare Schemes
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
            searchPlaceholder="Search scheme name or vehicle class..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}