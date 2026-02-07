// src/pages/UnifiedWaitingReports.tsx

"use client";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  AlertTriangle,
  Timer,
  CheckCircle,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
type WaitingBooking = {
  id: string;
  refNumber: string;
  customer: string;
  phone: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
  vehicleCategory: "Tuk" | "nonTuk";
  location: string;
  arrivalTime: string;
  waiting: string;
  waitingMinutes: number;
  urgencyLevel: "normal" | "near" | "urgent";
  urgencyDisplay: string;
  status: "Waiting";
  searchField?: string;
};

// ============================================
// MOCK DATA
// ============================================
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

// Helper function to parse waiting time
const parseWaitingMinutes = (waiting: string): number => {
  return parseInt(waiting) || 0;
};

// Helper function to determine urgency level
const getUrgencyLevel = (minutes: number): "normal" | "near" | "urgent" => {
  if (minutes <= 10) return "normal";
  if (minutes <= 20) return "near";
  return "urgent";
};

// Helper function for urgency display text
const getUrgencyDisplay = (level: "normal" | "near" | "urgent"): string => {
  switch (level) {
    case "normal":
      return "Normal (≤10 min)";
    case "near":
      return "Near Urgent (11-20 min)";
    case "urgent":
      return "Urgent (>20 min)";
  }
};

// Transform raw data to unified format with computed fields
const allWaitingData: WaitingBooking[] = enRouteData.map((item) => {
  const vehicleType = item.vehicleType === "Tuk" ? "Tuk" : (item.vehicleClass || "Unknown");
  const vehicleCategory: "Tuk" | "nonTuk" = item.vehicleType === "Tuk" ? "Tuk" : "nonTuk";
  const waitingMinutes = parseWaitingMinutes(item.waiting);
  const urgencyLevel = getUrgencyLevel(waitingMinutes);

  return {
    id: item.id,
    refNumber: item.bookingNumber,
    customer: item.customer,
    phone: item.phone,
    driver: item.driver,
    vehicle: item.vehicle,
    vehicleType,
    vehicleCategory,
    location: item.location,
    arrivalTime: item.arrivalTime,
    waiting: item.waiting,
    waitingMinutes,
    urgencyLevel,
    urgencyDisplay: getUrgencyDisplay(urgencyLevel),
    status: "Waiting" as const,
    searchField: `${item.bookingNumber} ${item.customer} ${item.phone} ${item.driver} ${item.vehicle}`,
  };
});

// Get unique values for dynamic filters
const uniqueLocations = [...new Set(allWaitingData.map((d) => d.location))].sort();
const uniqueVehicleTypes = [...new Set(allWaitingData.map((d) => d.vehicleType))].sort();

// ============================================
// HELPER FUNCTIONS FOR STYLING
// ============================================
const getVehicleBadgeClass = (vehicleType: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800 border-orange-300",
    Luxury: "bg-purple-100 text-purple-800 border-purple-300",
    ECONOMY: "bg-green-100 text-green-800 border-green-300",
    STANDARD: "bg-blue-100 text-blue-800 border-blue-300",
    Tuk: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };
  return colorMap[vehicleType] || "bg-gray-100 text-gray-800";
};

const getUrgencyBadgeClass = (urgency: string) => {
  const colorMap: Record<string, string> = {
    normal: "bg-green-100 text-green-800 border-green-300",
    near: "bg-yellow-100 text-yellow-800 border-yellow-300",
    urgent: "bg-red-100 text-red-800 border-red-300",
  };
  return colorMap[urgency] || "bg-gray-100 text-gray-800";
};

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<WaitingBooking>[] = [
  {
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
  },
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-red-700">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("customer")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => <span className="font-bold text-black">Phone</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Phone className="h-3.5 w-3.5 text-green-600" />
        <span className="font-mono text-sm">{row.getValue("phone")}</span>
      </div>
    ),
  },
  {
    accessorKey: "driver",
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: () => <span className="font-bold text-black">Vehicle Type</span>,
    cell: ({ row }) => {
      const vehicleType = row.getValue("vehicleType") as string;
      return (
        <Badge variant="outline" className={getVehicleBadgeClass(vehicleType)}>
          {vehicleType === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicleType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle #</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("vehicle")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: () => <span className="font-bold text-black">Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-blue-500" />
        <span className="text-sm">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: () => <span className="font-bold text-black">Arrival Time</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono">{row.getValue("arrivalTime")}</span>
      </div>
    ),
  },
  {
    accessorKey: "waiting",
    header: () => <span className="font-bold text-black">Waiting</span>,
    cell: ({ row }) => {
      const urgency = row.original.urgencyLevel;
      return (
        <Badge variant="outline" className={getUrgencyBadgeClass(urgency)}>
          <Timer className="h-3 w-3 mr-1" />
          {row.getValue("waiting")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "urgencyLevel",
    header: () => <span className="font-bold text-black">Urgency</span>,
    cell: ({ row }) => {
      const urgency = row.getValue("urgencyLevel") as string;
      const icons: Record<string, JSX.Element> = {
        normal: <CheckCircle className="h-3 w-3 mr-1" />,
        near: <Clock className="h-3 w-3 mr-1" />,
        urgent: <AlertTriangle className="h-3 w-3 mr-1" />,
      };
      const labels: Record<string, string> = {
        normal: "Normal",
        near: "Near Urgent",
        urgent: "Urgent",
      };
      return (
        <Badge variant="outline" className={getUrgencyBadgeClass(urgency)}>
          {icons[urgency]}
          {labels[urgency]}
        </Badge>
      );
    },
  },
];

// ============================================
// PDF COLUMNS
// ============================================
const pdfColumns = [
  { header: "Booking ID", dataKey: "refNumber" },
  { header: "Customer", dataKey: "customer" },
  { header: "Phone", dataKey: "phone" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Location", dataKey: "location" },
  { header: "Arrival", dataKey: "arrivalTime" },
  { header: "Waiting", dataKey: "waiting" },
  { header: "Urgency", dataKey: "urgencyDisplay" },
];

// ============================================
// CSV COLUMNS
// ============================================
const csvColumns = pdfColumns;

// ============================================
// STATISTICS COMPONENT
// ============================================
function WaitingStatistics() {
  const stats = useMemo(() => {
    return {
      total: allWaitingData.length,
      tuk: allWaitingData.filter((d) => d.vehicleCategory === "Tuk").length,
      nonTuk: allWaitingData.filter((d) => d.vehicleCategory === "nonTuk").length,
      normal: allWaitingData.filter((d) => d.urgencyLevel === "normal").length,
      near: allWaitingData.filter((d) => d.urgencyLevel === "near").length,
      urgent: allWaitingData.filter((d) => d.urgencyLevel === "urgent").length,
      locationCount: uniqueLocations.length,
    };
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Urgency Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Normal (≤ 10 mins)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.normal}</div>
            <p className="text-xs text-green-600">Within acceptable time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Near Urgent (11-20 mins)
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-yellow-600">Approaching threshold</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Urgent (&gt; 20 mins)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.urgent}</div>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Type Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
            <Timer className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All bookings waiting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tuk Vehicles</CardTitle>
            <Car className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.tuk}</div>
            <p className="text-xs text-muted-foreground">Three-wheelers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
            <Car className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.nonTuk}</div>
            <p className="text-xs text-muted-foreground">Regular vehicles</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Locations</CardTitle>
            <MapPin className="h-4 w-4 text-indigo-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">{stats.locationCount}</div>
            <p className="text-xs text-muted-foreground">Active pickup points</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function UnifiedWaitingReports() {
  // Build dynamic filter options
  const locationOptions = useMemo(
    () => [
      { label: "All Locations", value: "all" },
      ...uniqueLocations.map((loc) => ({ label: loc, value: loc })),
    ],
    []
  );

  const vehicleTypeOptions = useMemo(
    () => [
      { label: "All Vehicle Types", value: "all" },
      ...uniqueVehicleTypes.map((type) => ({ label: type, value: type })),
    ],
    []
  );

  return (
    <div className="space-y-6">
      <WaitingStatistics />

      <ReportPageTemplate
        title="Driver Waiting Bookings Report"
        data={allWaitingData}
        tableColumns={tableColumns}
        pdfColumns={pdfColumns}
        csvColumns={csvColumns}
        searchKey="searchField"
        fileName="WaitingBookingsReport.pdf"
        filters={[
          {
            key: "vehicleCategory",
            label: "Vehicle Category",
            options: [
              { label: "All Vehicles", value: "all" },
              { label: "Tuk Only", value: "Tuk" },
              { label: "Cars & Buses (Non-Tuk)", value: "nonTuk" },
            ],
            defaultValue: "all",
          },
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: vehicleTypeOptions,
            defaultValue: "all",
          },
          {
            key: "location",
            label: "Location",
            options: locationOptions,
            defaultValue: "all",
          },
          {
            key: "urgencyLevel",
            label: "Waiting Urgency",
            options: [
              { label: "All Levels", value: "all" },
              { label: "Normal (≤ 10 mins)", value: "normal" },
              { label: "Near Urgent (11-20 mins)", value: "near" },
              { label: "Urgent (> 20 mins)", value: "urgent" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}