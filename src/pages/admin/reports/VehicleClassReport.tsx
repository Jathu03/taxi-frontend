"use client";
import { useState, useMemo } from "react";
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
  Printer,
  Filter,
  Layers,
  Smartphone,
  Car,
  Percent,
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
  status: "Active" | "Inactive";
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
    status: "Active",
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
    status: "Active",
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
    status: "Active",
  },
  {
    id: "4",
    className: "Standard",
    classCode: "STD",
    showInApp: true,
    fareScheme: "StandardFareD",
    corporateFareScheme: "CorporateFA4",
    roadTripFareScheme: "RoadTripFA4",
    appFareScheme: "AppFA4",
    commission: 8,
    status: "Active",
  },
  {
    id: "5",
    className: "Bus",
    classCode: "BUS",
    showInApp: true,
    fareScheme: "StandardFareE",
    corporateFareScheme: "CorporateFA5",
    roadTripFareScheme: "RoadTripFA5",
    appFareScheme: "AppFA5",
    commission: 18,
    status: "Active",
  },
  {
    id: "6",
    className: "Tuk",
    classCode: "TUK",
    showInApp: true,
    fareScheme: "TukFare",
    corporateFareScheme: "TukCorporate",
    roadTripFareScheme: "TukRoadTrip",
    appFareScheme: "TukApp",
    commission: 5,
    status: "Active",
  },
  {
    id: "7",
    className: "Premium",
    classCode: "PRE",
    showInApp: false,
    fareScheme: "PremiumFare",
    corporateFareScheme: "PremiumCorporate",
    roadTripFareScheme: "PremiumRoadTrip",
    appFareScheme: "PremiumApp",
    commission: 20,
    status: "Inactive",
  },
];

// Badge helper
const getClassBadgeClass = (className: string) => {
  const colorMap: Record<string, string> = {
    Economy: "bg-green-100 text-green-800",
    Luxury: "bg-purple-100 text-purple-800",
    "Mini Van": "bg-blue-100 text-blue-800",
    Standard: "bg-gray-100 text-gray-800",
    Bus: "bg-orange-100 text-orange-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    Premium: "bg-pink-100 text-pink-800",
  };
  return colorMap[className] || "bg-gray-100 text-gray-800";
};

// --- Columns ---
const columns: ColumnDef<VehicleClass>[] = [
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
    accessorKey: "className",
    header: () => <span className="font-bold text-black">Class Name</span>,
    cell: ({ row }) => {
      const className = row.getValue("className") as string;
      return (
        <Badge className={getClassBadgeClass(className)}>
          <Car className="h-3 w-3 mr-1" />
          {className}
        </Badge>
      );
    },
  },
  {
    accessorKey: "classCode",
    header: () => <span className="font-bold text-black">Class Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold text-purple-700">
        {row.getValue("classCode")}
      </span>
    ),
  },
  {
    accessorKey: "showInApp",
    header: () => <span className="font-bold text-black">Show in App</span>,
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
    header: () => <span className="font-bold text-black">Fare Scheme</span>,
  },
  {
    accessorKey: "corporateFareScheme",
    header: () => <span className="font-bold text-black">Corporate Fare</span>,
  },
  {
    accessorKey: "roadTripFareScheme",
    header: () => <span className="font-bold text-black">RoadTrip Fare</span>,
  },
  {
    accessorKey: "appFareScheme",
    header: () => <span className="font-bold text-black">App Fare</span>,
  },
  {
    accessorKey: "commission",
    header: () => <span className="font-bold text-black">Commission (%)</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">{row.getValue("commission")}%</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return status === "Active" ? (
        <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-300">
          Inactive
        </Badge>
      );
    },
  },
];

// --- Filter Types ---
type StatusFilter = "all" | "active" | "inactive";
type AppVisibilityFilter = "all" | "visible" | "hidden";

// --- Main Component ---
export default function VehicleClassReport() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [appVisibilityFilter, setAppVisibilityFilter] = useState<AppVisibilityFilter>("all");

  const allData = useMemo(
    () =>
      mockVehicleClasses.map((item) => ({
        ...item,
        searchField: `${item.className} ${item.classCode}`,
      })),
    []
  );

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...allData];

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((v) => v.status === "Active");
    } else if (statusFilter === "inactive") {
      result = result.filter((v) => v.status === "Inactive");
    }

    // App visibility filter
    if (appVisibilityFilter === "visible") {
      result = result.filter((v) => v.showInApp === true);
    } else if (appVisibilityFilter === "hidden") {
      result = result.filter((v) => v.showInApp === false);
    }

    return result;
  }, [statusFilter, appVisibilityFilter, allData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const avgCommission =
      allData.length > 0
        ? Math.round(allData.reduce((sum, v) => sum + v.commission, 0) / allData.length)
        : 0;

    return {
      total: allData.length,
      active: allData.filter((v) => v.status === "Active").length,
      inactive: allData.filter((v) => v.status === "Inactive").length,
      showInApp: allData.filter((v) => v.showInApp === true).length,
      hiddenInApp: allData.filter((v) => v.showInApp === false).length,
      avgCommission,
    };
  }, [allData]);

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
    doc.text("Vehicle Class Audit Report", 40, 22);

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
    const statusText =
      statusFilter === "all"
        ? "All Statuses"
        : statusFilter === "active"
        ? "Active Only"
        : "Inactive Only";
    const appText =
      appVisibilityFilter === "all"
        ? "All Visibility"
        : appVisibilityFilter === "visible"
        ? "Visible in App Only"
        : "Hidden in App Only";

    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`App Visibility Filter: ${appText}`, 14, 53);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);
    doc.text(
      `Active: ${stats.active} | Inactive: ${stats.inactive} | Show in App: ${stats.showInApp} | Avg Commission: ${stats.avgCommission}%`,
      14,
      68
    );

    // 5. Table
    autoTable(doc, {
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
          "Status",
        ],
      ],
      body: filteredData.map((v) => [
        v.className,
        v.classCode,
        v.showInApp ? "Yes" : "No",
        v.fareScheme,
        v.corporateFareScheme,
        v.roadTripFareScheme,
        v.appFareScheme,
        `${v.commission}%`,
        v.status,
      ]),
      startY: 75,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(
        `VehicleClassReport_${statusFilter}_${appVisibilityFilter}_${new Date().getTime()}.pdf`
      );
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

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
      "Status",
    ];
    const rows = filteredData.map((v) =>
      [
        v.className,
        v.classCode,
        v.showInApp ? "Yes" : "No",
        v.fareScheme,
        v.corporateFareScheme,
        v.roadTripFareScheme,
        v.appFareScheme,
        `${v.commission}%`,
        v.status,
      ]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VehicleClassReport_${statusFilter}_${appVisibilityFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setAppVisibilityFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Vehicle Class Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== "all" || appVisibilityFilter !== "all") && " (filtered)"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={() => generateReport("save")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Truck className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All vehicle classes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visible in App</CardTitle>
            <Smartphone className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.showInApp}</div>
            <p className="text-xs text-muted-foreground">Show in mobile app</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <Percent className="h-4 w-4 text-orange-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.avgCommission}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1" /> Status:
          </span>
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            <Layers className="mr-2 h-4 w-4" /> All Classes
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Active Only ({stats.active})
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Inactive Only ({stats.inactive})
          </Button>
        </div>

        {/* App Visibility Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Smartphone className="h-4 w-4 mr-1" /> App Visibility:
          </span>
          <Button
            variant={appVisibilityFilter === "all" ? "default" : "outline"}
            onClick={() => setAppVisibilityFilter("all")}
            className={appVisibilityFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={appVisibilityFilter === "visible" ? "default" : "outline"}
            onClick={() => setAppVisibilityFilter("visible")}
            className={
              appVisibilityFilter === "visible" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
            }
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Visible in App ({stats.showInApp})
          </Button>
          <Button
            variant={appVisibilityFilter === "hidden" ? "default" : "outline"}
            onClick={() => setAppVisibilityFilter("hidden")}
            className={
              appVisibilityFilter === "hidden" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""
            }
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Hidden in App ({stats.hiddenInApp})
          </Button>
        </div>
      </div>

      {/* Active Filter Summary */}
      {(statusFilter !== "all" || appVisibilityFilter !== "all") && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="secondary">{statusFilter === "active" ? "Active" : "Inactive"}</Badge>
            )}
            {appVisibilityFilter !== "all" && (
              <Badge variant="secondary">
                {appVisibilityFilter === "visible" ? "Visible in App" : "Hidden in App"}
              </Badge>
            )}
            <span className="text-muted-foreground">=</span>
            <Badge className="bg-purple-600">{filteredData.length} records</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-600" />
            Vehicle Class Registry
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredData.length} Classes
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${appVisibilityFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search class name or code..."
          />
        </CardContent>
      </Card>
    </div>
  );
}