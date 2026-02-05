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
  CheckCircle2,
  Clock,
  MapPin,
  User,
  DollarSign,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type CompletedBooking = {
  id: string;
  booking: string;
  voucher: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dispatchedTime: string;
  dispatchedBy: string;
  startTime: string;
  completedTime: string;
  totalDistance: string;
  totalFare: string;
  waitingTime: string;
  billedWaitTime: string;
  waitingFee: string;
  testBooking: string;
  driver: string;
  vehicle: string;
  vehicleType: string; // Used for filtering logic
  fareScheme: string;
  status: "Completed";
};

// --- Mock Data ---
const rawData = [
  {
    id: "c1",
    booking: "295001",
    voucher: "V-102",
    org: "Corporate Alpha",
    customer: "Ms. Shiromi",
    passenger: "Jane Doe",
    hireType: "Point-to-Point",
    bookingTime: "10:00 AM",
    bookedBy: "App",
    pickupTime: "10:15 AM",
    pickupAddress: "Nawala",
    dispatchedTime: "10:05 AM",
    dispatchedBy: "Admin01",
    startTime: "10:20 AM",
    completedTime: "10:45 AM",
    totalDistance: "12.5 km",
    totalFare: "1,250.00",
    waitingTime: "5 mins",
    billedWaitTime: "2 mins",
    waitingFee: "50.00",
    testBooking: "No",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
    fareScheme: "Standard-KM",
  },
  {
    id: "ct1",
    booking: "TUK-C001",
    voucher: "N/A",
    org: "Personal",
    customer: "John Silva",
    passenger: "John Silva",
    hireType: "Budget",
    bookingTime: "11:00 AM",
    bookedBy: "Web",
    pickupTime: "11:10 AM",
    pickupAddress: "Pettah",
    dispatchedTime: "11:02 AM",
    dispatchedBy: "Dispatcher05",
    startTime: "11:15 AM",
    completedTime: "11:35 AM",
    totalDistance: "4.2 km",
    totalFare: "450.00",
    waitingTime: "2 mins",
    billedWaitTime: "0 mins",
    waitingFee: "0.00",
    testBooking: "No",
    driver: "Ranjith Tuk",
    vehicle: "TUK-111",
    vehicleType: "Tuk",
    fareScheme: "Tuk-Flat",
  },
];

// Transform to unified format (Core Logic preserved)
const regularCompleted = rawData
  .filter((item) => !item.vehicleType)
  .map((item) => ({
    ...item,
    vehicleType: item.vehicleClass,
    status: "Completed" as const,
  }));

const tukCompleted = rawData
  .filter((item) => item.vehicleType === "Tuk")
  .map((item) => ({
    ...item,
    status: "Completed" as const,
  }));

const allCompletedData = [...regularCompleted, ...tukCompleted] as CompletedBooking[];

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

// Select column
const selectColumn: ColumnDef<CompletedBooking> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
  enableSorting: false,
  enableHiding: false,
};

// --- Column Definitions (All 23 Columns) ---
const combinedCompletedColumns: ColumnDef<CompletedBooking>[] = [
  selectColumn,
  { accessorKey: "booking", header: "Booking" },
  { accessorKey: "voucher", header: "Voucher" },
  { accessorKey: "org", header: "Org" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "passenger", header: "Passenger" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  { accessorKey: "bookedBy", header: "Booked By" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "pickupAddress", header: "Pickup Address" },
  { accessorKey: "dispatchedTime", header: "Dispatched Time" },
  { accessorKey: "dispatchedBy", header: "Dispatched By" },
  { accessorKey: "startTime", header: "Start Time" },
  { accessorKey: "completedTime", header: "Completed Time" },
  { accessorKey: "totalDistance", header: "Total Distance" },
  { 
    accessorKey: "totalFare", 
    header: "Total Fare",
    cell: ({ row }) => <span className="font-bold text-green-700">{row.getValue("totalFare")}</span>
  },
  { accessorKey: "waitingTime", header: "Waiting Time" },
  { accessorKey: "billedWaitTime", header: "Billed Wait Time" },
  { accessorKey: "waitingFee", header: "Waiting Fee" },
  { accessorKey: "testBooking", header: "Test Booking" },
  { accessorKey: "driver", header: "Driver" },
  { 
    accessorKey: "vehicle", 
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs">{row.getValue("vehicle")}</span>
        <Badge className={getVehicleBadgeClass(row.original.vehicleType)}>{row.original.vehicleType}</Badge>
      </div>
    )
  },
  { accessorKey: "fareScheme", header: "Fare Scheme" },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type Filter",
    enableHiding: true,
    filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(id));
    },
  }
];

type VehicleFilter = "all" | "Tuk" | "nonTuk";

export default function UnifiedCompletedReports() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const filteredData = useMemo(() => {
    let result = [...allCompletedData];
    if (vehicleFilter === "Tuk") result = result.filter(item => item.vehicleType === "Tuk");
    else if (vehicleFilter === "nonTuk") result = result.filter(item => item.vehicleType !== "Tuk");
    return result;
  }, [vehicleFilter]);

  const stats = useMemo(() => ({
    total: allCompletedData.length,
    tuk: allCompletedData.filter(d => d.vehicleType === "Tuk").length,
    nonTuk: allCompletedData.filter(d => d.vehicleType !== "Tuk").length,
    revenue: filteredData.reduce((acc, curr) => acc + parseFloat(curr.totalFare.replace(/,/g, '')), 0),
    distance: filteredData.reduce((acc, curr) => acc + parseFloat(curr.totalDistance), 0),
  }), [filteredData]);

  const tableFilters = useMemo(() => [{
    key: "vehicleType",
    label: "Vehicle Type",
    options: [
      { value: "Bus", label: "Bus" },
      { value: "Luxury", label: "Luxury" },
      { value: "ECONOMY", label: "Economy" },
      { value: "STANDARD", label: "Standard" },
      { value: "Tuk", label: "Tuk" },
    ],
  }], []);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Completed Bookings Report", 14, 15);
    autoTable(doc, {
      head: [["Booking", "Customer", "Driver", "Vehicle", "Fare", "Distance", "Date"]],
      body: filteredData.map(d => [d.booking, d.customer, d.driver, d.vehicle, d.totalFare, d.totalDistance, d.completedTime]),
      startY: 25,
      styles: { fontSize: 8 }
    });
    doc.save("completed_report.pdf");
  };

  const exportCSV = () => {
    const headers = "Booking,Voucher,Org,Customer,Passenger,Hire Type,Booking Time,Booked By,Pickup Time,Pickup Address,Dispatched Time,Dispatched By,Start Time,Completed Time,Total Distance,Total Fare,Waiting Time,Billed Wait Time,Waiting Fee,Test Booking,Driver,Vehicle,Fare Scheme";
    const rows = filteredData.map(d => `${d.booking},${d.voucher},${d.org},${d.customer},${d.passenger},${d.hireType},${d.bookingTime},${d.bookedBy},${d.pickupTime},${d.pickupAddress},${d.dispatchedTime},${d.dispatchedBy},${d.startTime},${d.completedTime},${d.totalDistance},${d.totalFare},${d.waitingTime},${d.billedWaitTime},${d.waitingFee},${d.testBooking},${d.driver},${d.vehicle},${d.fareScheme}`);
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "completed_report.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-indigo-50/30 to-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Completed Bookings</h1>
          <p className="text-muted-foreground mt-1">History and billing details of finished trips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-indigo-600 text-indigo-700">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-indigo-700 uppercase">Total Revenue</CardHeader>
          <CardContent><div className="text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-green-700 uppercase">Total Distance</CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.distance.toFixed(1)} km</div></CardContent>
        </Card>
        <Card className="border-slate-200 bg-slate-50/50">
          <CardHeader className="pb-2 text-xs font-semibold text-slate-700 uppercase">Status</CardHeader>
          <CardContent><div className="text-2xl font-bold text-indigo-600">Completed</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "all" ? "ring-2 ring-indigo-600 bg-indigo-50" : ""}`} onClick={() => setVehicleFilter("all")}>
          <CardHeader className="pb-2 flex justify-between items-center"><CardTitle className="text-sm">All Vehicles</CardTitle><Layers className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "Tuk" ? "ring-2 ring-yellow-500 bg-yellow-50" : ""}`} onClick={() => setVehicleFilter("Tuk")}>
          <CardHeader className="pb-2 flex justify-between items-center"><CardTitle className="text-sm">Tuk Only</CardTitle><Car className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.tuk}</div></CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "nonTuk" ? "ring-2 ring-indigo-400 bg-indigo-50" : ""}`} onClick={() => setVehicleFilter("nonTuk")}>
          <CardHeader className="pb-2 flex justify-between items-center"><CardTitle className="text-sm">Non-Tuk</CardTitle><Car className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.nonTuk}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-indigo-600" /> Trip Logs</CardTitle>
          <Badge variant="outline">23 Data Columns</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleFilter}
            columns={combinedCompletedColumns}
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