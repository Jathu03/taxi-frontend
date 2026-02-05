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
  Ban,
  Clock,
  XCircle,
  User,
  ShieldAlert,
  Headset,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type CancelledBooking = {
  id: string;
  bookingNumber: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  testBooking: string;
  cancelledTime: string;
  cancelledType: "Customer" | "Driver" | "System" | "No Show";
  cancelledAgent: string;
  driver: string;
  vehicle: string;
  vehicleType: string; // Used for Logic/Filtering
};

// --- Mock Data ---
const rawCancelledData = [
  {
    id: "c1",
    bookingNumber: "295001",
    org: "Alpha Corp",
    customer: "Ms. Shiromi",
    passenger: "0771234567",
    hireType: "Corporate",
    bookingTime: "10:00 AM",
    testBooking: "No",
    cancelledTime: "10:15 AM",
    cancelledType: "Customer",
    cancelledAgent: "Web App",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
  },
  {
    id: "c2",
    bookingNumber: "295005",
    org: "Personal",
    customer: "John Silva",
    passenger: "0719876543",
    hireType: "Budget",
    bookingTime: "11:30 AM",
    testBooking: "No",
    cancelledTime: "11:40 AM",
    cancelledType: "Driver",
    cancelledAgent: "Driver App",
    driver: "Nimal Fernando",
    vehicle: "ECO-5678",
    vehicleClass: "ECONOMY",
  },
  {
    id: "ct1",
    bookingNumber: "TUK-C001",
    org: "Personal",
    customer: "Kamal Perera",
    passenger: "0784447788",
    hireType: "Tuk-Hire",
    bookingTime: "09:00 AM",
    testBooking: "No",
    cancelledTime: "09:05 AM",
    cancelledType: "System",
    cancelledAgent: "Auto-Cancel",
    driver: "Saman Tuk",
    vehicle: "TUK-111",
    vehicleType: "Tuk",
  },
];

// Core logic: Transform data
const regularCancelled = rawCancelledData
  .filter((item) => !item.vehicleType)
  .map((item) => ({
    ...item,
    vehicleType: item.vehicleClass || "Standard",
  }));

const tukCancelled = rawCancelledData.filter((item) => item.vehicleType === "Tuk");

const allCancelledData = [...regularCancelled, ...tukCancelled] as CancelledBooking[];

// Helpers
const getVehicleBadgeClass = (type: string) => {
  const map: Record<string, string> = {
    Tuk: "bg-yellow-100 text-yellow-800",
    Bus: "bg-orange-100 text-orange-800",
    ECONOMY: "bg-green-100 text-green-800",
    Standard: "bg-blue-100 text-blue-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
};

const getCancelTypeBadge = (type: string) => {
  const map: Record<string, string> = {
    Customer: "bg-blue-100 text-blue-800",
    Driver: "bg-red-100 text-red-800",
    System: "bg-gray-100 text-gray-800",
    "No Show": "bg-orange-100 text-orange-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
};

// --- Column Definitions (Exactly as requested) ---
const columns: ColumnDef<CancelledBooking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
  },
  { accessorKey: "bookingNumber", header: "Booking #" },
  { accessorKey: "org", header: "Org" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "passenger", header: "Passenger #" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  { 
    accessorKey: "testBooking", 
    header: "Test Booking",
    cell: ({ row }) => (
        <Badge variant={row.getValue("testBooking") === "Yes" ? "destructive" : "outline"}>
            {row.getValue("testBooking")}
        </Badge>
    )
  },
  { accessorKey: "cancelledTime", header: "Cancelled Time" },
  { 
    accessorKey: "cancelledType", 
    header: "Cancelled Type",
    cell: ({ row }) => (
        <Badge className={getCancelTypeBadge(row.getValue("cancelledType"))}>
            {row.getValue("cancelledType")}
        </Badge>
    )
  },
  { 
    accessorKey: "cancelledAgent", 
    header: "Cancelled Agent",
    cell: ({ row }) => (
        <div className="flex items-center gap-1">
            <Headset className="h-3 w-3 text-muted-foreground" />
            <span>{row.getValue("cancelledAgent")}</span>
        </div>
    )
  },
  { accessorKey: "driver", header: "Driver" },
  { 
    accessorKey: "vehicle", 
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs">{row.getValue("vehicle")}</span>
        <Badge className={`${getVehicleBadgeClass(row.original.vehicleType)} text-[10px]`}>
          {row.original.vehicleType}
        </Badge>
      </div>
    )
  },
];

type VehicleFilter = "all" | "Tuk" | "nonTuk";

export default function CancelledHiresReport() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const filteredData = useMemo(() => {
    let result = [...allCancelledData];
    if (vehicleFilter === "Tuk") result = result.filter(d => d.vehicleType === "Tuk");
    else if (vehicleFilter === "nonTuk") result = result.filter(d => d.vehicleType !== "Tuk");
    return result;
  }, [vehicleFilter]);

  const stats = useMemo(() => ({
    total: allCancelledData.length,
    tuk: allCancelledData.filter(d => d.vehicleType === "Tuk").length,
    nonTuk: allCancelledData.filter(d => d.vehicleType !== "Tuk").length,
    customerCancel: filteredData.filter(d => d.cancelledType === "Customer").length,
    driverCancel: filteredData.filter(d => d.cancelledType === "Driver").length,
  }), [filteredData]);

  const tableFilters = useMemo(() => [{
    key: "vehicleType",
    label: "Vehicle Class",
    options: [
      { value: "Bus", label: "Bus" },
      { value: "Standard", label: "Standard" },
      { value: "ECONOMY", label: "Economy" },
      { value: "Tuk", label: "Tuk" },
    ],
  }], []);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Cancelled Hires Report", 14, 15);
    autoTable(doc, {
      head: [["Booking #", "Customer", "Time", "Type", "Agent", "Driver", "Vehicle"]],
      body: filteredData.map(d => [d.bookingNumber, d.customer, d.cancelledTime, d.cancelledType, d.cancelledAgent, d.driver, d.vehicle]),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [220, 38, 38] }
    });
    doc.save("cancelled_hires.pdf");
  };

  const exportCSV = () => {
    const headers = "Booking #,Org,Customer,Passenger #,Hire Type,Booking Time,Test Booking,Cancelled Time,Cancelled Type,Cancelled Agent,Driver,Vehicle";
    const rows = filteredData.map(d => `${d.bookingNumber},${d.org},${d.customer},${d.passenger},${d.hireType},${d.bookingTime},${d.testBooking},${d.cancelledTime},${d.cancelledType},${d.cancelledAgent},${d.driver},${d.vehicle}`);
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cancelled_hires.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-red-50/20 to-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Cancelled Hires</h1>
          <p className="text-muted-foreground mt-1">Audit and analyze booking cancellations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-red-200 text-red-700 hover:bg-red-50">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-red-700 uppercase">Total Cancelled</CardHeader>
          <CardContent><div className="text-2xl font-bold">{filteredData.length}</div></CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-blue-700 uppercase">By Customer</CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.customerCancel}</div></CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-orange-700 uppercase">By Driver</CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.driverCancel}</div></CardContent>
        </Card>
      </div>

      {/* Vehicle Filter Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className={`cursor-pointer transition-all ${vehicleFilter === "all" ? "ring-2 ring-red-600 bg-red-50/50" : ""}`}
          onClick={() => setVehicleFilter("all")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
            <Layers className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${vehicleFilter === "Tuk" ? "ring-2 ring-yellow-500 bg-yellow-50/50" : ""}`}
          onClick={() => setVehicleFilter("Tuk")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
            <Car className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.tuk}</div></CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${vehicleFilter === "nonTuk" ? "ring-2 ring-red-400 bg-red-50/50" : ""}`}
          onClick={() => setVehicleFilter("nonTuk")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
            <Car className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.nonTuk}</div></CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Ban className="h-5 w-5" />
            Cancellation Logs
          </CardTitle>
          <Badge variant="outline">12 Data Columns</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleFilter}
            columns={columns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search customer..."
            enableColumnVisibility={true}
            pageSize={10}
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}