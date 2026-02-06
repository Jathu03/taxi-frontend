"use client";
import { useState, useMemo } from "react";
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
  Printer,
  Filter,
  Car,
  Bus,
  Layers,
  Crown,
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
  vehicleClass: "ECONOMY" | "LUXURY" | "VAN" | "TUK" | "STANDARD";
  baseFare: number;
  perKm: number;
  perMin: number;
  searchField?: string;
};

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
    img.onerror = (error) => reject(error);
    img.src = url;
  });
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
  {
    id: "4",
    schemeName: "Budget Tuk",
    vehicleClass: "TUK",
    baseFare: 100,
    perKm: 30,
    perMin: 3,
  },
  {
    id: "5",
    schemeName: "City Standard",
    vehicleClass: "STANDARD",
    baseFare: 200,
    perKm: 60,
    perMin: 6,
  },
  {
    id: "6",
    schemeName: "Economy Plus",
    vehicleClass: "ECONOMY",
    baseFare: 180,
    perKm: 55,
    perMin: 5,
  },
  {
    id: "7",
    schemeName: "Premium Van",
    vehicleClass: "VAN",
    baseFare: 400,
    perKm: 90,
    perMin: 10,
  },
  {
    id: "8",
    schemeName: "Luxury Elite",
    vehicleClass: "LUXURY",
    baseFare: 600,
    perKm: 120,
    perMin: 20,
  },
];

// --- Badge Helpers ---
const getVehicleClassBadge = (vehicleClass: string) => {
  const classMap: Record<string, string> = {
    ECONOMY: "bg-green-100 text-green-800 border-green-300",
    LUXURY: "bg-purple-100 text-purple-800 border-purple-300",
    VAN: "bg-blue-100 text-blue-800 border-blue-300",
    TUK: "bg-yellow-100 text-yellow-800 border-yellow-300",
    STANDARD: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return classMap[vehicleClass] || "bg-gray-100 text-gray-800";
};

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
    header: () => <span className="font-bold text-black">Scheme Name</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-violet-700">{row.getValue("schemeName")}</span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className={`uppercase ${getVehicleClassBadge(row.getValue("vehicleClass"))}`}>
        {row.getValue("vehicleClass")}
      </Badge>
    ),
  },
  {
    accessorKey: "baseFare",
    header: () => <span className="font-bold text-black">Base Fare</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-green-600" />
        <span className="font-bold text-green-700">LKR {row.getValue("baseFare")}</span>
      </div>
    ),
  },
  {
    accessorKey: "perKm",
    header: () => <span className="font-bold text-black">Per KM</span>,
    cell: ({ row }) => (
      <span className="font-semibold">LKR {row.getValue("perKm")}</span>
    ),
  },
  {
    accessorKey: "perMin",
    header: () => <span className="font-bold text-black">Per Min</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-blue-600" />
        <span className="font-semibold">LKR {row.getValue("perMin")}</span>
      </div>
    ),
  },
];

// --- Filter Type ---
type VehicleClassFilter = "all" | "ECONOMY" | "LUXURY" | "VAN" | "TUK" | "STANDARD";

// --- Component ---
export default function FareSchemeReport() {
  const [vehicleClassFilter, setVehicleClassFilter] = useState<VehicleClassFilter>("all");

  const allData = useMemo(
    () =>
      mockFareSchemes.map((f) => ({
        ...f,
        searchField: `${f.schemeName} ${f.vehicleClass}`,
      })),
    []
  );

  // Filter data based on vehicle class
  const filteredData = useMemo(() => {
    let result = [...allData];
    if (vehicleClassFilter !== "all") {
      result = result.filter((f) => f.vehicleClass === vehicleClassFilter);
    }
    return result;
  }, [vehicleClassFilter, allData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const avgBaseFare = filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, f) => sum + f.baseFare, 0) / filteredData.length)
      : 0;
    const avgPerKm = filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, f) => sum + f.perKm, 0) / filteredData.length)
      : 0;
    const avgPerMin = filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, f) => sum + f.perMin, 0) / filteredData.length)
      : 0;

    return {
      total: allData.length,
      economy: allData.filter((f) => f.vehicleClass === "ECONOMY").length,
      luxury: allData.filter((f) => f.vehicleClass === "LUXURY").length,
      van: allData.filter((f) => f.vehicleClass === "VAN").length,
      tuk: allData.filter((f) => f.vehicleClass === "TUK").length,
      standard: allData.filter((f) => f.vehicleClass === "STANDARD").length,
      avgBaseFare,
      avgPerKm,
      avgPerMin,
    };
  }, [filteredData, allData]);

  // --- PDF & Print Logic ---
  const generateReport = async (action: "save" | "print") => {
    const doc = new jsPDF({ orientation: "landscape" });

    // 1. Add Logo
    try {
      const logoData = await getBase64ImageFromURL("/logo.png");
      doc.addImage(logoData, "PNG", 14, 10, 20, 20);
    } catch (e) {
      console.error("Logo missing", e);
    }

    // 2. Main Title
    doc.setFontSize(22);
    doc.setTextColor(99, 48, 184); // Purple
    doc.text("Fare Scheme Audit Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35); // Horizontal line

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");
    const vehicleText = vehicleClassFilter === "all" ? "All Vehicle Classes" : vehicleClassFilter;

    doc.text(`Vehicle Class Filter: ${vehicleText}`, 14, 48);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 53);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 58);
    doc.text(`Avg Base Fare: LKR ${stats.avgBaseFare} | Avg Per KM: LKR ${stats.avgPerKm} | Avg Per Min: LKR ${stats.avgPerMin}`, 14, 63);

    // 5. Table
    autoTable(doc, {
      head: [["Scheme Name", "Vehicle Class", "Base Fare", "Per KM", "Per Min"]],
      body: filteredData.map((f) => [
        f.schemeName,
        f.vehicleClass,
        `LKR ${f.baseFare}`,
        `LKR ${f.perKm}`,
        `LKR ${f.perMin}`,
      ]),
      startY: 70,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`FareSchemeReport_${vehicleClassFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // --- Export CSV ---
  const exportCSV = () => {
    const headers = ["Scheme Name", "Vehicle Class", "Base Fare", "Per KM", "Per Min"];
    const rows = filteredData.map((f) =>
      [f.schemeName, f.vehicleClass, f.baseFare, f.perKm, f.perMin]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FareSchemeReport_${vehicleClassFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Fare Scheme Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {vehicleClassFilter !== "all" && ` (filtered by ${vehicleClassFilter})`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" /> CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button onClick={() => generateReport("save")} className="bg-purple-600 hover:bg-purple-700">
            <FileText className="h-4 w-4 mr-2" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
            <BadgePercent className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All fare schemes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Base Fare</CardTitle>
            <DollarSign className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">LKR {stats.avgBaseFare}</div>
            <p className="text-xs text-muted-foreground">Filtered average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Per KM</CardTitle>
            <CarFront className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">LKR {stats.avgPerKm}</div>
            <p className="text-xs text-muted-foreground">Distance rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Per Min</CardTitle>
            <Clock className="h-4 w-4 text-orange-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">LKR {stats.avgPerMin}</div>
            <p className="text-xs text-muted-foreground">Time rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1" /> Vehicle Class:
        </span>
        <Button
          variant={vehicleClassFilter === "all" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("all")}
          className={vehicleClassFilter === "all" ? "bg-purple-600" : ""}
          size="sm"
        >
          <CarFront className="mr-2 h-4 w-4" /> All Classes
        </Button>
        <Button
          variant={vehicleClassFilter === "ECONOMY" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("ECONOMY")}
          className={vehicleClassFilter === "ECONOMY" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          size="sm"
        >
          <Car className="mr-2 h-4 w-4" /> Economy ({stats.economy})
        </Button>
        <Button
          variant={vehicleClassFilter === "LUXURY" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("LUXURY")}
          className={vehicleClassFilter === "LUXURY" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
          size="sm"
        >
          <Crown className="mr-2 h-4 w-4" /> Luxury ({stats.luxury})
        </Button>
        <Button
          variant={vehicleClassFilter === "VAN" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("VAN")}
          className={vehicleClassFilter === "VAN" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          size="sm"
        >
          <Bus className="mr-2 h-4 w-4" /> Van ({stats.van})
        </Button>
        <Button
          variant={vehicleClassFilter === "TUK" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("TUK")}
          className={vehicleClassFilter === "TUK" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
          size="sm"
        >
          <Layers className="mr-2 h-4 w-4" /> Tuk ({stats.tuk})
        </Button>
        <Button
          variant={vehicleClassFilter === "STANDARD" ? "default" : "outline"}
          onClick={() => setVehicleClassFilter("STANDARD")}
          className={vehicleClassFilter === "STANDARD" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""}
          size="sm"
        >
          <Car className="mr-2 h-4 w-4" /> Standard ({stats.standard})
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-purple-600" />
            Fare Schemes Registry
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredData.length} Records
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleClassFilter}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search scheme name or vehicle class..."
          />
        </CardContent>
      </Card>
    </div>
  );
}