import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet,
  Layers,
  Car,
  Clock,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type WaitingBooking = {
  id: string;
  refNumber: string;
  customer: string;
  phone: string;
  driver: string;
  vehicle: string;
  vehicleType?: string;
  location: string;
  arrivalTime: string;
  waiting: string;
  status: "Waiting";
};

// --- Mock Data ---
const enRouteData = [
  {
    id: "e1",
    bookingNumber: "295105",
    customer: "Ms. Shiromi",
    phone: "+94 77 123 4567",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
    location: "Nawala",
    arrivalTime: "14:32",
    waiting: "12 mins",
  },
  {
    id: "e2",
    bookingNumber: "295651",
    customer: "John Silva",
    phone: "+94 71 987 6543",
    driver: "Kumar Perera",
    vehicle: "LUX-5678",
    vehicleClass: "Luxury",
    location: "Airport",
    arrivalTime: "09:15",
    waiting: "45 mins",
  },
  {
    id: "e3",
    bookingNumber: "295701",
    customer: "Sarah Connor",
    phone: "+94 76 555 1122",
    driver: "Nimal Fernando",
    vehicle: "STD-9012",
    vehicleClass: "STANDARD",
    location: "Colombo 07",
    arrivalTime: "18:04",
    waiting: "8 mins",
  },
  {
    id: "e4",
    bookingNumber: "295751",
    customer: "Mike Ross",
    phone: "+94 70 888 9999",
    driver: "Kamal Silva",
    vehicle: "ECO-3456",
    vehicleClass: "ECONOMY",
    location: "Rajagiriya",
    arrivalTime: "11:27",
    waiting: "23 mins",
  },
  {
    id: "te1",
    bookingNumber: "TUK-W001",
    customer: "Kasun Perera",
    phone: "+94 78 444 7788",
    driver: "Ranjith Tuk",
    vehicle: "TUK-111",
    vehicleType: "Tuk",
    location: "Pettah",
    arrivalTime: "16:51",
    waiting: "5 mins",
  },
  {
    id: "te2",
    bookingNumber: "TUK-W002",
    customer: "Nimali Silva",
    phone: "+94 72 999 0001",
    driver: "Fazil Tuk",
    vehicle: "TUK-555",
    vehicleType: "Tuk",
    location: "Borella",
    arrivalTime: "13:10",
    waiting: "35 mins",
  },
];

// Transform to unified format
const regularWaitingBookings = enRouteData
  .filter((item) => !item.vehicleType)
  .map((item) => ({
    id: item.id,
    refNumber: item.bookingNumber,
    customer: item.customer,
    phone: item.phone,
    driver: item.driver,
    vehicle: item.vehicle,
    vehicleType: item.vehicleClass,
    location: item.location,
    arrivalTime: item.arrivalTime,
    waiting: item.waiting,
    status: "Waiting" as const,
  }));

const tukWaitingBookings = enRouteData
  .filter((item) => item.vehicleType === "Tuk")
  .map((item) => ({
    id: item.id,
    refNumber: item.bookingNumber,
    customer: item.customer,
    phone: item.phone,
    driver: item.driver,
    vehicle: item.vehicle,
    vehicleType: "Tuk",
    location: item.location,
    arrivalTime: item.arrivalTime,
    waiting: item.waiting,
    status: "Waiting" as const,
  }));

const allWaitingData = [...regularWaitingBookings, ...tukWaitingBookings];

// Helpers
const getVehicleBadgeClass = (vehicleType: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
  };
  return colorMap[vehicleType] || "bg-gray-100 text-gray-800";
};

const getWaitingBadgeClass = (waiting: string) => {
  const minutes = parseInt(waiting);
  if (minutes <= 10) return "bg-green-100 text-green-800 border-green-300";
  if (minutes <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-red-100 text-red-800 border-red-300";
};

// Select column
const selectColumn: ColumnDef<WaitingBooking> = {
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

// Combined Columns (All vehicles) - EXACTLY as you requested
const combinedWaitingColumns: ColumnDef<WaitingBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Booking ID",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("customer")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-sm">{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const vehicleType = row.original.vehicleType as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicleType)}>
          {vehicleType === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicleType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle/Tuk #",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.getValue("vehicle")}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono">{row.getValue("arrivalTime")}</span>
      </div>
    ),
  },
  {
    accessorKey: "waiting",
    header: "Waiting",
    cell: ({ row }) => {
      const waiting = row.getValue("waiting") as string;
      return (
        <Badge variant="outline" className={getWaitingBadgeClass(waiting)}>
          <Clock className="h-3 w-3 mr-1" />
          {waiting}
        </Badge>
      );
    },
  },
];

type VehicleFilter = "all" | "Tuk" | "nonTuk";

export default function UnifiedWaitingReports() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const allBookingsData = useMemo(() => allWaitingData, []);

  const filteredData = useMemo(() => {
    let result = [...allBookingsData];
    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicleType === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicleType !== "Tuk");
    }
    return result;
  }, [allBookingsData, vehicleFilter]);

  const stats = useMemo(() => {
    const all = allBookingsData;
    const tuk = all.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = all.filter((d) => d.vehicleType !== "Tuk");
    const urgent = all.filter((d) => parseInt(d.waiting) > 20);
    const near = all.filter((d) => parseInt(d.waiting) > 10 && parseInt(d.waiting) <= 20);
    const normal = all.filter((d) => parseInt(d.waiting) <= 10);

    return {
      total: all.length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      urgent: urgent.length,
      near: near.length,
      normal: normal.length,
      filtered: filteredData.length,
    };
  }, [allBookingsData, filteredData]);

  const currentColumns = combinedWaitingColumns;

  const tableFilters = useMemo(() => {
    const filters = [];
    const vehicleOptions = [
      { value: "Bus", label: "Bus" },
      { value: "Luxury", label: "Luxury" },
      { value: "ECONOMY", label: "Economy" },
      { value: "STANDARD", label: "Standard" },
      { value: "Tuk", label: "Tuk" },
    ];

    filters.push({
      key: "vehicleType",
      label: "Vehicle Type",
      options: vehicleOptions,
    });

    return filters;
  }, []);

  const getTitle = () => {
    if (vehicleFilter === "Tuk") return "Waiting Bookings – Tuk Only";
    if (vehicleFilter === "nonTuk") return "Waiting Bookings – Non-Tuk";
    return "All Waiting Bookings";
  };

  const getSubtitle = () => {
    const parts = [];
    if (vehicleFilter === "all") parts.push("All Vehicles");
    else if (vehicleFilter === "Tuk") parts.push("Tuk Only");
    else parts.push("Non-Tuk");
    parts.push(`${stats.filtered} waiting`);
    parts.push(`${stats.urgent} over 20 mins`);
    return parts.join(" • ");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(20);
    doc.setTextColor(239, 68, 68);
    doc.text("Waiting Booking Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`View: ${getTitle()}`, 14, 36);
    doc.text(`Total Records: ${filteredData.length}`, 14, 42);

    autoTable(doc, {
      head: [[
        "Booking ID",
        "Customer",
        "Phone",
        "Driver",
        "Vehicle Type",
        "Vehicle #",
        "Location",
        "Arrival Time",
        "Waiting",
      ]],
      body: filteredData.map((item) => [
        item.refNumber,
        item.customer,
        item.phone,
        item.driver,
        item.vehicleType || "N/A",
        item.vehicle,
        item.location,
        item.arrivalTime,
        item.waiting,
      ]),
      startY: 48,
      headStyles: {
        fillColor: [239, 68, 68],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      styles: { fontSize: 7, cellPadding: 2 },
    });

    doc.save(`waiting_report_${vehicleFilter}.pdf`);
  };

  const exportCSV = () => {
    const headers = [
      "Booking ID", "Customer", "Phone", "Driver", "Vehicle Type", "Vehicle #", "Location", "Arrival Time", "Waiting"
    ];
    const rows = filteredData.map((row) => [
      row.refNumber,
      `"${row.customer}"`,
      row.phone,
      `"${row.driver}"`,
      row.vehicleType || "N/A",
      row.vehicle,
      `"${row.location}"`,
      row.arrivalTime,
      row.waiting,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `waiting_report_${vehicleFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setVehicleFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-red-50/30 to-rose-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-700">
            Waiting Bookings Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Live tracking of all vehicles currently waiting at pickup
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-red-600 text-red-700 hover:bg-red-50"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={exportPDF}
          >
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Waiting Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Waiting ≤ 10 mins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.normal}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Waiting 11-20 mins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Waiting {">"} 20 mins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.urgent}</div>
            <p className="text-xs text-red-600">Requires attention</p>
          </CardContent>
        </Card>
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
                ? "ring-2 ring-red-600 bg-red-50/50 border-red-600"
                : "hover:bg-red-50/30"
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
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All vehicle types waiting
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
                Three-wheelers waiting
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
                Regular vehicles waiting
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
            <Clock className="h-3 w-3 text-red-600" />
            Waiting
          </Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary" className="gap-1">
            <Car className="h-3 w-3" />
            {vehicleFilter === "all"
              ? "All Vehicles"
              : vehicleFilter === "Tuk"
              ? "Tuk Only"
              : "Non-Tuk"}
          </Badge>
          <span className="text-muted-foreground">=</span>
          <Badge className="bg-red-600">{stats.filtered} waiting</Badge>
        </div>
        {vehicleFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-600" />
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            <Badge variant="outline" className="self-start">
              9 Columns (Combined)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            key={`${vehicleFilter}-waiting`}
            columns={currentColumns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search by customer name or phone..."
            enableColumnVisibility={true}
            pageSize={10}
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}