"use client";
import { useMemo, useState, type ReactNode } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Monitor,
  Wifi,
  WifiOff,
  CalendarCheck2,
  CalendarX2,
  Truck,
  User,
  Smartphone,
  Printer,
  Filter,
  CheckCircle,
  XCircle,
  Tablet,
  Radio,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type Device = {
  id: string;
  deviceId: string;
  deviceType: "Mobile - Android" | "Mobile - iOS" | "Tablet" | "Tracker Unit";
  driverName: string;
  vehicleReg: string;
  status: "Active" | "Inactive";
  lastActive: string;
  installDate: string;
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

// --- Mock Data ---
const mockDevices: Device[] = [
  {
    id: "d1",
    deviceId: "DEV-001",
    deviceType: "Mobile - Android",
    driverName: "Sunil Silva",
    vehicleReg: "CAB-1234",
    status: "Active",
    lastActive: "2024-11-28 08:30 AM",
    installDate: "2023-11-15",
  },
  {
    id: "d2",
    deviceId: "DEV-002",
    deviceType: "Tablet",
    driverName: "Kamal Perera",
    vehicleReg: "VAN-4567",
    status: "Inactive",
    lastActive: "2024-10-01 06:00 PM",
    installDate: "2023-11-05",
  },
  {
    id: "d3",
    deviceId: "DEV-003",
    deviceType: "Mobile - iOS",
    driverName: "Shanaka Fernando",
    vehicleReg: "LUX-9898",
    status: "Active",
    lastActive: "2024-12-03 11:45 AM",
    installDate: "2024-01-10",
  },
  {
    id: "d4",
    deviceId: "DEV-004",
    deviceType: "Tracker Unit",
    driverName: "Ravi Jayasuriya",
    vehicleReg: "TUK-5566",
    status: "Inactive",
    lastActive: "2024-09-15 01:22 AM",
    installDate: "2023-10-10",
  },
  {
    id: "d5",
    deviceId: "DEV-005",
    deviceType: "Mobile - Android",
    driverName: "Nimal Bandara",
    vehicleReg: "CAB-5678",
    status: "Active",
    lastActive: "2024-12-05 09:15 AM",
    installDate: "2024-02-20",
  },
  {
    id: "d6",
    deviceId: "DEV-006",
    deviceType: "Tablet",
    driverName: "Pradeep Kumar",
    vehicleReg: "VAN-8901",
    status: "Active",
    lastActive: "2024-12-04 03:30 PM",
    installDate: "2024-03-15",
  },
];

// --- Column Definitions ---
const columns: ColumnDef<Device>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "deviceId",
    header: () => <span className="font-bold text-black">Device ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("deviceId")}
      </span>
    ),
  },
  {
    accessorKey: "deviceType",
    header: () => <span className="font-bold text-black">Device Type</span>,
    cell: ({ row }) => {
      const type = row.getValue("deviceType") as string;
      const iconMap: Record<string, ReactNode> = {
        "Mobile - Android": <Smartphone className="h-4 w-4 text-green-600" />,
        "Mobile - iOS": <Smartphone className="h-4 w-4 text-blue-600" />,
        "Tablet": <Tablet className="h-4 w-4 text-purple-600" />,
        "Tracker Unit": <Radio className="h-4 w-4 text-orange-600" />,
      };
      return (
        <div className="flex items-center gap-2">
          {iconMap[type] || <Smartphone className="h-4 w-4 text-muted-foreground" />}
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "driverName",
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-blue-500" />
        {row.getValue("driverName")}
      </div>
    ),
  },
  {
    accessorKey: "vehicleReg",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Truck className="h-3 w-3 text-green-600" />
        <span className="font-mono text-sm font-bold">{row.getValue("vehicleReg")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isActive = status === "Active";
      return (
        <Badge
          variant="outline"
          className={`${
            isActive
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          {isActive ? (
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3" /> Active
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: () => <span className="font-bold text-black">Last Active</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarX2 className="h-3 w-3" />
        {row.getValue("lastActive")}
      </div>
    ),
  },
  {
    accessorKey: "installDate",
    header: () => <span className="font-bold text-black">Install Date</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarCheck2 className="h-3 w-3" />
        {row.getValue("installDate")}
      </div>
    ),
  },
];

// --- Component ---
export default function DeviceDetailsReport() {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<"all" | "Mobile - Android" | "Mobile - iOS" | "Tablet" | "Tracker Unit">("all");

  const allData = useMemo(
    () =>
      mockDevices.map((d) => ({
        ...d,
        searchField: `${d.deviceId} ${d.driverName} ${d.vehicleReg} ${d.deviceType}`,
      })),
    []
  );

  const filteredData = useMemo(() => {
    let result = [...allData];

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((item) => item.status === "Active");
    } else if (statusFilter === "inactive") {
      result = result.filter((item) => item.status === "Inactive");
    }

    // Device Type filter
    if (deviceTypeFilter !== "all") {
      result = result.filter((item) => item.deviceType === deviceTypeFilter);
    }

    return result;
  }, [statusFilter, deviceTypeFilter, allData]);

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
    doc.text("Device Details Audit Report", 40, 22);

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
    const deviceTypeText = deviceTypeFilter === "all" ? "All Device Types" : deviceTypeFilter;

    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`Device Type Filter: ${deviceTypeText}`, 14, 53);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);

    // 5. Table
    autoTable(doc, {
      head: [["Device ID", "Type", "Driver", "Vehicle", "Status", "Last Active", "Installed"]],
      body: filteredData.map((d) => [
        d.deviceId,
        d.deviceType,
        d.driverName,
        d.vehicleReg,
        d.status,
        d.lastActive,
        d.installDate,
      ]),
      startY: 70,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`DeviceReport_${statusFilter}_${deviceTypeFilter.replace(/\s/g, "-")}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Device ID", "Device Type", "Driver", "Vehicle", "Status", "Last Active", "Install Date"];
    const rows = filteredData.map((d) =>
      [d.deviceId, d.deviceType, d.driverName, d.vehicleReg, d.status, d.lastActive, d.installDate]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DeviceReport_${statusFilter}_${deviceTypeFilter.replace(/\s/g, "-")}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Device Details Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== "all" || deviceTypeFilter !== "all") &&
              ` (filtered by ${statusFilter !== "all" ? statusFilter : ""} ${
                deviceTypeFilter !== "all" ? deviceTypeFilter : ""
              })`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
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
            <Monitor className="mr-2 h-4 w-4" /> All Devices
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Active Only
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Inactive Only
          </Button>
        </div>

        {/* Device Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Smartphone className="h-4 w-4 mr-1" /> Device Type:
          </span>
          <Button
            variant={deviceTypeFilter === "all" ? "default" : "outline"}
            onClick={() => setDeviceTypeFilter("all")}
            className={deviceTypeFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All Types
          </Button>
          <Button
            variant={deviceTypeFilter === "Mobile - Android" ? "default" : "outline"}
            onClick={() => setDeviceTypeFilter("Mobile - Android")}
            className={deviceTypeFilter === "Mobile - Android" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <Smartphone className="mr-2 h-4 w-4" /> Android
          </Button>
          <Button
            variant={deviceTypeFilter === "Mobile - iOS" ? "default" : "outline"}
            onClick={() => setDeviceTypeFilter("Mobile - iOS")}
            className={deviceTypeFilter === "Mobile - iOS" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            size="sm"
          >
            <Smartphone className="mr-2 h-4 w-4" /> iOS
          </Button>
          <Button
            variant={deviceTypeFilter === "Tablet" ? "default" : "outline"}
            onClick={() => setDeviceTypeFilter("Tablet")}
            className={deviceTypeFilter === "Tablet" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            size="sm"
          >
            <Tablet className="mr-2 h-4 w-4" /> Tablet
          </Button>
          <Button
            variant={deviceTypeFilter === "Tracker Unit" ? "default" : "outline"}
            onClick={() => setDeviceTypeFilter("Tracker Unit")}
            className={deviceTypeFilter === "Tracker Unit" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
            size="sm"
          >
            <Radio className="mr-2 h-4 w-4" /> Tracker
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="h-5 w-5 text-purple-600" />
            Device Registry
          </CardTitle>
          <Badge variant="outline">Fleet Management</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${deviceTypeFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search by device ID, driver, or vehicle..."
          />
        </CardContent>
      </Card>
    </div>
  );
}