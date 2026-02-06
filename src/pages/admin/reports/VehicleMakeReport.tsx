// src/pages/VehicleMakeReport.tsx

import { useState, useMemo } from "react";
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
  Printer,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Helper for Logo ---
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};

// --- Type ---
type VehicleMake = {
  id: string;
  manufacturer: string;
  code: string;
  dateModified: string;
  status: "active" | "inactive";
  searchField?: string;
};

// --- Mock Data ---
const mockVehicleMakes: VehicleMake[] = [
  {
    id: "1",
    manufacturer: "Toyota",
    code: "TOY",
    dateModified: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    manufacturer: "Nissan",
    code: "NIS",
    dateModified: "2024-02-01",
    status: "active",
  },
  {
    id: "3",
    manufacturer: "Suzuki",
    code: "SUZ",
    dateModified: "2024-03-10",
    status: "inactive",
  },
  {
    id: "4",
    manufacturer: "Mitsubishi",
    code: "MIT",
    dateModified: "2024-01-28",
    status: "active",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
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
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const allData = useState<VehicleMake[]>(
    mockVehicleMakes.map((m) => ({
      ...m,
      searchField: `${m.manufacturer} ${m.code}`,
    }))
  )[0];

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return allData;
    return allData.filter((item) => item.status === statusFilter);
  }, [statusFilter, allData]);

  const exportCSV = () => {
    const headers = ["Manufacturer", "Code", "Status", "Date Modified"];
    const rows = filteredData.map((m) => [
      String(m.manufacturer),
      String(m.code),
      String(m.status),
      String(m.dateModified),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VehicleMakeReport_${statusFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  const generateReport = async (action: "save" | "print") => {
    const doc = new jsPDF({ orientation: "portrait" });

    // 1. Add Logo
    try {
      const logoData = await getBase64ImageFromURL("/logo.png");
      doc.addImage(logoData, "PNG", 14, 10, 20, 20);
    } catch (e) {
      console.error("Logo missing", e);
    }

    // 2. Main Title
    doc.setFontSize(22);
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Make Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 197, 35); // Horizontal line

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");
    const statusText = statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active Only" : "Inactive Only";
    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 53);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 58);

    // 5. Table
    autoTable(doc, {
      head: [["Manufacturer", "Code", "Status", "Date Modified"]],
      body: filteredData.map((m) => [m.manufacturer, m.code, m.status, m.dateModified]),
      startY: 65,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`VehicleMakeReport_${statusFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
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
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-blue-600 text-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => generateReport("save")} className="bg-[#6330B8] text-white">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="border-purple-200">
        <CardHeader className="border-b">
          <CardTitle className="text-[#6330B8]">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
              size="sm"
            >
              All Manufacturers
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              onClick={() => setStatusFilter("active")}
              className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              size="sm"
            >
              Active Only
            </Button>
            <Button
              variant={statusFilter === "inactive" ? "default" : "outline"}
              onClick={() => setStatusFilter("inactive")}
              className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              size="sm"
            >
              Inactive Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Factory className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Total Manufacturers</p>
                <p className="text-2xl font-bold text-[#6330B8]">{allData.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="h-8 px-3">
                Filtered
              </Badge>
              <div>
                <p className="text-sm text-muted-foreground">Filtered Records</p>
                <p className="text-2xl font-bold text-[#6330B8]">{filteredData.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-[#6330B8]">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Factory className="h-5 w-5" />
            Manufacturer List
            <Badge variant="outline" className="text-muted-foreground ml-2">
              {filteredData.length} Records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={filteredData}
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