"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet,
  Layers,
  Smartphone,
  Globe,
  Car,
  User,
  Bot,
  Wrench,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- NEW Types for Modification Report ---
export type UnifiedModification = {
  id: string;
  bookingId: string;
  modifiedOn: string;
  modifiedByType: "USER" | "DRIVER" | "SYSTEM";
  modifiedByName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  reason: string;
  bookingSource: "Portal" | "App";
  bookingVehicleClass: string;
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

// --- NEW Mock Data for Modifications ---
const modificationData: UnifiedModification[] = [
  // Manual/Portal Modifications
  {
    id: "m1",
    bookingId: "295104",
    modifiedOn: "11/27/2025 10:45 AM",
    modifiedByType: "USER",
    modifiedByName: "Sarah Smith",
    fieldName: "Pickup Time",
    oldValue: "11/27/2025 15:58",
    newValue: "11/27/2025 16:30",
    reason: "Customer requested delay due to a meeting.",
    bookingSource: "Portal",
    bookingVehicleClass: "Bus",
  },
  {
    id: "m2",
    bookingId: "295650",
    modifiedOn: "12/03/2025 09:00 AM",
    modifiedByType: "USER",
    modifiedByName: "Admin User",
    fieldName: "Driver",
    oldValue: "Not Assigned",
    newValue: "D-001 - John Perera",
    reason: "Dispatching available driver.",
    bookingSource: "Portal",
    bookingVehicleClass: "Luxury",
  },
  {
    id: "m3",
    bookingId: "295700",
    modifiedOn: "12/04/2025 07:30 AM",
    modifiedByType: "SYSTEM",
    modifiedByName: "System",
    fieldName: "Status",
    oldValue: "Pending",
    newValue: "Dispatched",
    reason: "Automatic status update on driver assignment.",
    bookingSource: "Portal",
    bookingVehicleClass: "STANDARD",
  },
  // Tuk Manual Modifications
  {
    id: "m4",
    bookingId: "TUK-001",
    modifiedOn: "12/05/2025 09:05 AM",
    modifiedByType: "USER",
    modifiedByName: "Call Center Agent",
    fieldName: "Drop Address",
    oldValue: "Fort",
    newValue: "Pettah Bus Stand",
    reason: "Customer clarified the exact drop-off point.",
    bookingSource: "Portal",
    bookingVehicleClass: "Tuk",
  },
  // App Modifications
  {
    id: "m5",
    bookingId: "APP-001",
    modifiedOn: "2024-03-15 12:31 PM",
    modifiedByType: "USER",
    modifiedByName: "David Lee",
    fieldName: "Pickup Location",
    oldValue: "Galle Face Green",
    newValue: "Galle Face Hotel Entrance",
    reason: "Customer corrected pickup point via app.",
    bookingSource: "App",
    bookingVehicleClass: "ECONOMY",
  },
  {
    id: "m6",
    bookingId: "APP-002",
    modifiedOn: "2024-03-15 04:05 PM",
    modifiedByType: "DRIVER",
    modifiedByName: "Driver-456 (Rohan)",
    fieldName: "Status",
    oldValue: "Enroute",
    newValue: "Waiting For Customer",
    reason: "Driver arrived at pickup location.",
    bookingSource: "App",
    bookingVehicleClass: "STANDARD",
  },
  // Tuk App Modifications
  {
    id: "m7",
    bookingId: "TAPP-001",
    modifiedOn: "2024-03-15 12:35 PM",
    modifiedByType: "DRIVER",
    modifiedByName: "Driver-789 (Kamal)",
    fieldName: "Status",
    oldValue: "Passenger Onboard",
    newValue: "Completed",
    reason: "Trip finished successfully.",
    bookingSource: "App",
    bookingVehicleClass: "Tuk",
  },
  {
    id: "m8",
    bookingId: "TAPP-002",
    modifiedOn: "2024-03-15 04:01 PM",
    modifiedByType: "SYSTEM",
    modifiedByName: "System",
    fieldName: "Fare",
    oldValue: "LKR 450.00",
    newValue: "LKR 480.00",
    reason: "Fare updated based on actual distance/time.",
    bookingSource: "App",
    bookingVehicleClass: "Tuk",
  },
  // More data for variety
  {
    id: "m9",
    bookingId: "BK-2024-8871",
    modifiedOn: "2024-03-16 11:00 AM",
    modifiedByType: "USER",
    modifiedByName: "Jane Doe",
    fieldName: "Vehicle Class",
    oldValue: "ECONOMY",
    newValue: "VAN",
    reason: "Customer requested a larger vehicle for luggage.",
    bookingSource: "Portal",
    bookingVehicleClass: "VAN",
  },
  {
    id: "m10",
    bookingId: "APP-004",
    modifiedOn: "2024-03-16 02:31 PM",
    modifiedByType: "USER",
    modifiedByName: "Emma Davis",
    fieldName: "Status",
    oldValue: "Pending",
    newValue: "Cancelled by Customer",
    reason: "Customer cancelled the trip.",
    bookingSource: "App",
    bookingVehicleClass: "Bus",
  },
];

// Helper functions
const getModifiedByIcon = (type: string) => {
  switch (type) {
    case "USER":
      return <User className="h-4 w-4" />;
    case "DRIVER":
      return <Wrench className="h-4 w-4" />;
    case "SYSTEM":
      return <Bot className="h-4 w-4" />;
    default:
      return null;
  }
};

const getModifiedByBadgeClass = (type: string) => {
  const colorMap: Record<string, string> = {
    USER: "bg-blue-100 text-blue-800",
    DRIVER: "bg-green-100 text-green-800",
    SYSTEM: "bg-gray-100 text-gray-800",
  };
  return colorMap[type] || "bg-gray-100 text-gray-800";
};

const getVehicleBadgeClass = (vehicle: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    VAN: "bg-indigo-100 text-indigo-800",
  };
  return colorMap[vehicle] || "bg-gray-100 text-gray-800";
};

// Columns
const selectColumn: ColumnDef<UnifiedModification> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

const modificationColumns: ColumnDef<UnifiedModification>[] = [
  selectColumn,
  {
    accessorKey: "bookingId",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("bookingId")}
      </span>
    ),
  },
  {
    accessorKey: "modifiedOn",
    header: () => <span className="font-bold text-black">Modified On</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue("modifiedOn")}</span>
    ),
  },
  {
    accessorKey: "modifiedByName",
    header: () => <span className="font-bold text-black">Modified By</span>,
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.original.modifiedByType);
    },
    cell: ({ row }) => {
      const type = row.original.modifiedByType;
      const name = row.original.modifiedByName;
      return (
        <Badge className={`gap-1 ${getModifiedByBadgeClass(type)}`}>
          {getModifiedByIcon(type)}
          {name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fieldName",
    header: () => <span className="font-bold text-black">Field Changed</span>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("fieldName")}</span>,
  },
  {
    id: "change",
    header: () => <span className="font-bold text-black">Change</span>,
    cell: ({ row }) => {
      const oldValue = row.original.oldValue;
      const newValue = row.original.newValue;
      return (
        <div className="text-sm">
          <span className="text-muted-foreground line-through">{oldValue}</span>
          <span className="mx-2">→</span>
          <span className="font-medium text-green-700">{newValue}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => <span className="font-bold text-black">Reason</span>,
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <span className="text-sm text-muted-foreground max-w-[200px] truncate block" title={reason}>
          {reason || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "bookingSource",
    header: () => <span className="font-bold text-black">Booking Source</span>,
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const source = row.original.bookingSource;
      const vehicle = row.original.bookingVehicleClass;
      const isTuk = vehicle === "Tuk";
      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            source === "App"
              ? isTuk
                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                : "border-green-600 text-green-700 bg-green-50"
              : isTuk
              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
              : "border-blue-500 text-blue-700 bg-blue-50"
          }`}
        >
          {source === "App" ? <Smartphone className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {isTuk ? `Tuk (${source})` : source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookingVehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const vehicle = row.getValue("bookingVehicleClass") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
];

type SourceFilter = "all" | "Portal" | "App";
type VehicleFilter = "all" | "Tuk" | "nonTuk";

export default function UnifiedModificationReport() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const allModificationsData = useMemo(() => modificationData, []);

  const filteredData = useMemo(() => {
    let result = [...allModificationsData];

    if (sourceFilter === "Portal") {
      result = result.filter((item) => item.bookingSource === "Portal");
    } else if (sourceFilter === "App") {
      result = result.filter((item) => item.bookingSource === "App");
    }

    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.bookingVehicleClass === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.bookingVehicleClass !== "Tuk");
    }

    return result;
  }, [allModificationsData, sourceFilter, vehicleFilter]);

  const stats = useMemo(() => {
    const all = allModificationsData;
    const portal = all.filter((d) => d.bookingSource === "Portal");
    const app = all.filter((d) => d.bookingSource === "App");
    const tuk = all.filter((d) => d.bookingVehicleClass === "Tuk");
    const nonTuk = all.filter((d) => d.bookingVehicleClass !== "Tuk");

    return {
      total: all.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.bookingVehicleClass === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.bookingVehicleClass !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.bookingVehicleClass === "Tuk").length,
      appNonTuk: app.filter((d) => d.bookingVehicleClass !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      user: all.filter((d) => d.modifiedByType === "USER").length,
      driver: all.filter((d) => d.modifiedByType === "DRIVER").length,
      system: all.filter((d) => d.modifiedByType === "SYSTEM").length,
      filtered: filteredData.length,
    };
  }, [allModificationsData, filteredData]);

  const currentColumns = useMemo(() => modificationColumns, []);

  const tableFilters = useMemo(() => {
    const filters = [];

    if (sourceFilter === "all") {
      filters.push({
        key: "bookingSource",
        label: "Booking Source",
        options: [
          { value: "Portal", label: "Manual / Portal" },
          { value: "App", label: "App" },
        ],
      });
    }

    const vehicleOptions = [
      { value: "Bus", label: "Bus" },
      { value: "Luxury", label: "Luxury" },
      { value: "ECONOMY", label: "Economy" },
      { value: "STANDARD", label: "Standard" },
      { value: "Tuk", label: "Tuk" },
      { value: "VAN", label: "Van" },
    ];

    filters.push({
      key: "bookingVehicleClass",
      label: "Vehicle Class",
      options: vehicleOptions,
    });

    filters.push({
      key: "modifiedByType",
      label: "Modified By",
      options: [
        { value: "USER", label: "User (Admin/Agent)" },
        { value: "DRIVER", label: "Driver" },
        { value: "SYSTEM", label: "System" },
      ],
    });

    return filters;
  }, [sourceFilter]);

  const getTitle = () => {
    if (sourceFilter === "Portal" && vehicleFilter === "Tuk") return "Tuk Modifications (Manual)";
    if (sourceFilter === "Portal" && vehicleFilter === "nonTuk") return "Modifications (Manual - Non Tuk)";
    if (sourceFilter === "Portal") return "Modifications (Manual/Portal)";
    if (sourceFilter === "App" && vehicleFilter === "Tuk") return "Tuk App Modifications";
    if (sourceFilter === "App" && vehicleFilter === "nonTuk") return "App Modifications (Non Tuk)";
    if (sourceFilter === "App") return "App Modifications";
    if (vehicleFilter === "Tuk") return "All Tuk Modifications";
    if (vehicleFilter === "nonTuk") return "All Non-Tuk Modifications";
    return "All Booking Modifications";
  };

  const getSubtitle = () => {
    const parts = [];
    if (sourceFilter === "all") parts.push("All Sources");
    else if (sourceFilter === "Portal") parts.push("Manual/Portal");
    else parts.push("App");

    if (vehicleFilter === "all") parts.push("All Vehicles");
    else if (vehicleFilter === "Tuk") parts.push("Tuk Only");
    else parts.push("Non-Tuk");

    return `${parts.join(" • ")} • ${stats.filtered} records`;
  };

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
    doc.text("Booking Modification Audit Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");
    const sourceText =
      sourceFilter === "all"
        ? "All Sources"
        : sourceFilter === "Portal"
        ? "Manual/Portal"
        : "App";
    const vehicleText =
      vehicleFilter === "all"
        ? "All Vehicles"
        : vehicleFilter === "Tuk"
        ? "Tuk Only"
        : "Cars/Buses Only";

    doc.text(`Booking Source: ${sourceText}`, 14, 48);
    doc.text(`Vehicle Category: ${vehicleText}`, 14, 53);
    doc.text(`Total Records in Database: ${allModificationsData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);
    doc.text(`User: ${stats.user} | Driver: ${stats.driver} | System: ${stats.system}`, 14, 68);

    const tableColumn = [
      "Booking ID",
      "Modified On",
      "Modified By",
      "Field Changed",
      "Old Value",
      "New Value",
      "Reason",
      "Source",
      "Vehicle",
    ];
    const tableRows = filteredData.map((item) => [
      item.bookingId,
      item.modifiedOn,
      item.modifiedByName,
      item.fieldName,
      item.oldValue,
      item.newValue,
      item.reason || "-",
      `${item.bookingSource} (${item.bookingVehicleClass})`,
      item.bookingVehicleClass,
    ]);

    // 5. Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`ModificationReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Booking ID",
      "Modified On",
      "Modified By Type",
      "Modified By Name",
      "Field Changed",
      "Old Value",
      "New Value",
      "Reason",
      "Booking Source",
      "Vehicle Class",
    ];
    const rows = filteredData.map((row) =>
      [
        row.bookingId,
        row.modifiedOn,
        row.modifiedByType,
        row.modifiedByName,
        row.fieldName,
        row.oldValue,
        row.newValue,
        row.reason,
        row.bookingSource,
        row.bookingVehicleClass,
      ]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ModificationReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  const resetFilters = () => {
    setSourceFilter("all");
    setVehicleFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            Booking Modification Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(sourceFilter !== "all" || vehicleFilter !== "all") && " (filtered)"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => generateReport("save")}
          >
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Filter Cards - Source Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Source
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className={`cursor-pointer transition-all ${
              sourceFilter === "all"
                ? "ring-2 ring-purple-600 bg-purple-50/50 border-purple-600"
                : "hover:bg-purple-50/30"
            }`}
            onClick={() => setSourceFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers
                className={`h-4 w-4 ${
                  sourceFilter === "all"
                    ? "text-purple-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Total modifications
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              sourceFilter === "Portal"
                ? "ring-2 ring-blue-500 bg-blue-50/50 border-blue-500"
                : "hover:bg-blue-50/30"
            }`}
            onClick={() => setSourceFilter("Portal")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manual / Portal
              </CardTitle>
              <Globe
                className={`h-4 w-4 ${
                  sourceFilter === "Portal"
                    ? "text-blue-500"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portal}</div>
              <p className="text-xs text-muted-foreground">
                {stats.portalNonTuk} regular + {stats.portalTuk} tuk
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              sourceFilter === "App"
                ? "ring-2 ring-green-500 bg-green-50/50 border-green-500"
                : "hover:bg-green-50/30"
            }`}
            onClick={() => setSourceFilter("App")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">App</CardTitle>
              <Smartphone
                className={`h-4 w-4 ${
                  sourceFilter === "App"
                    ? "text-green-500"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.app}</div>
              <p className="text-xs text-muted-foreground">
                {stats.appNonTuk} regular + {stats.appTuk} tuk
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Cards - Vehicle Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Vehicle Type
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className={`cursor-pointer transition-all ${
              vehicleFilter === "all"
                ? "ring-2 ring-gray-500 bg-gray-50/50 border-gray-500"
                : "hover:bg-gray-50/30"
            }`}
            onClick={() => setVehicleFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Vehicles
              </CardTitle>
              <Layers
                className={`h-4 w-4 ${
                  vehicleFilter === "all"
                    ? "text-gray-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All vehicle types
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              vehicleFilter === "Tuk"
                ? "ring-2 ring-yellow-500 bg-yellow-50/50 border-yellow-500"
                : "hover:bg-yellow-50/30"
            }`}
            onClick={() => setVehicleFilter("Tuk")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
              <Car
                className={`h-4 w-4 ${
                  vehicleFilter === "Tuk"
                    ? "text-yellow-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tuk}</div>
              <p className="text-xs text-muted-foreground">
                Three-wheeler modifications
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              vehicleFilter === "nonTuk"
                ? "ring-2 ring-purple-500 bg-purple-50/50 border-purple-500"
                : "hover:bg-purple-50/30"
            }`}
            onClick={() => setVehicleFilter("nonTuk")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cars & Buses
              </CardTitle>
              <Car
                className={`h-4 w-4 ${
                  vehicleFilter === "nonTuk"
                    ? "text-purple-500"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nonTuk}</div>
              <p className="text-xs text-muted-foreground">
                Bus, Luxury, Standard, Economy, Van
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Filter Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current View:</span>
          <Badge variant="secondary" className="gap-1">
            {sourceFilter === "all" ? (
              <Layers className="h-3 w-3" />
            ) : sourceFilter === "Portal" ? (
              <Globe className="h-3 w-3" />
            ) : (
              <Smartphone className="h-3 w-3" />
            )}
            {sourceFilter === "all"
              ? "All Sources"
              : sourceFilter === "Portal"
              ? "Manual/Portal"
              : "App"}
          </Badge>
          <span className="text-muted-foreground">+</span>
          <Badge variant="secondary" className="gap-1">
            <Car className="h-3 w-3" />
            {vehicleFilter === "all"
              ? "All Vehicles"
              : vehicleFilter === "Tuk"
              ? "Tuk Only"
              : "Non-Tuk"}
          </Badge>
          <span className="text-muted-foreground">=</span>
          <Badge className="bg-purple-600">{stats.filtered} records</Badge>
        </div>
        {(sourceFilter !== "all" || vehicleFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-600" />
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            <Badge variant="outline" className="self-start">
              9 Columns
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${sourceFilter}-${vehicleFilter}`}
            columns={currentColumns}
            data={filteredData}
            searchKey="fieldName"
            searchPlaceholder="Search by field name or booking ID..."
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}