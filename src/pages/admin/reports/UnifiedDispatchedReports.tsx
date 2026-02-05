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
  CheckCircle2,
  User,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type DispatchedBooking = {
  id: string;
  refNumber: string;
  organization?: string;
  customer: string;
  contact: string;
  hireType?: string;
  pickupTime: string;
  pickup: string;
  bookedBy?: string;
  dispatchedBy: string;
  dispatchedTime: string;
  driver: string;
  vehicle: string;
  vehicleType?: string; // Added to distinguish vehicle types
  fareScheme?: string;
  source: "Portal" | "App";
  platform?: "Android" | "iOS";
  status: "Dispatched";
};

// --- Mock Data ---

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL/PORTAL DISPATCHED (Non-Tuk Vehicles)
// ═══════════════════════════════════════════════════════════════════════════
const portalDispatchedData = [
  {
    id: "pd1",
    bookingNumber: "295105",
    organization: "PGIE",
    customer: "Ms. Shiromi",
    passengerNumber: "0766117723",
    hireType: "One Way",
    pickupTime: "11/27/2025 15:58",
    pickupAddress: "Nawala",
    bookedBy: "Admin User",
    dispatchedBy: "John Dispatcher",
    dispatchedTime: "11/27/2025 15:45",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
    fareScheme: "Standard Fare",
  },
  {
    id: "pd2",
    bookingNumber: "295651",
    organization: "Corporate",
    customer: "John Silva",
    passengerNumber: "0771234567",
    hireType: "Round Trip",
    pickupTime: "12/03/2025 10:30",
    pickupAddress: "Airport",
    bookedBy: "Receptionist",
    dispatchedBy: "Sarah Dispatcher",
    dispatchedTime: "12/03/2025 10:15",
    driver: "Kumar Perera",
    vehicle: "LUX-5678",
    vehicleClass: "Luxury",
    fareScheme: "Airport Special",
  },
  {
    id: "pd3",
    bookingNumber: "295701",
    organization: "Hotel Grand",
    customer: "Sarah Connor",
    passengerNumber: "0772345678",
    hireType: "One Way",
    pickupTime: "12/04/2025 08:00",
    pickupAddress: "Colombo 07",
    bookedBy: "Manager",
    dispatchedBy: "Mike Dispatcher",
    dispatchedTime: "12/04/2025 07:45",
    driver: "Nimal Fernando",
    vehicle: "STD-9012",
    vehicleClass: "STANDARD",
    fareScheme: "Hotel Package",
  },
  {
    id: "pd4",
    bookingNumber: "295751",
    organization: "Tech Corp",
    customer: "Mike Ross",
    passengerNumber: "0773456789",
    hireType: "Hourly",
    pickupTime: "12/04/2025 09:30",
    pickupAddress: "Rajagiriya",
    bookedBy: "HR Dept",
    dispatchedBy: "Lisa Dispatcher",
    dispatchedTime: "12/04/2025 09:20",
    driver: "Kamal Silva",
    vehicle: "ECO-3456",
    vehicleClass: "ECONOMY",
    fareScheme: "Hourly Rate",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TUK DISPATCHED (Manual/Portal + Tuk)
// ═══════════════════════════════════════════════════════════════════════════
const tukDispatchedData = [
  {
    id: "td1",
    bookingNumber: "TUK-D001",
    organization: "",
    customer: "Kumara Bandara",
    passengerNumber: "0712345678",
    hireType: "One Way",
    pickupTime: "12/05/2025 09:30",
    pickupAddress: "Pettah",
    bookedBy: "Call Center",
    dispatchedBy: "Tuk Dispatch",
    dispatchedTime: "12/05/2025 09:25",
    driver: "Ranjith Tuk",
    tukNumber: "TUK-111",
    vehicleClass: "Tuk",
    fareScheme: "Tuk Standard",
  },
  {
    id: "td2",
    bookingNumber: "TUK-D002",
    organization: "Small Shop",
    customer: "Nimal Perera",
    passengerNumber: "0723456789",
    hireType: "Round Trip",
    pickupTime: "12/05/2025 11:00",
    pickupAddress: "Maradana",
    bookedBy: "Admin",
    dispatchedBy: "Tuk Central",
    dispatchedTime: "12/05/2025 10:50",
    driver: "Sunil Tuk",
    tukNumber: "TUK-222",
    vehicleClass: "Tuk",
    fareScheme: "Tuk Round",
  },
  {
    id: "td3",
    bookingNumber: "TUK-D003",
    organization: "",
    customer: "Sunil Fernando",
    passengerNumber: "0734567890",
    hireType: "One Way",
    pickupTime: "12/05/2025 11:30",
    pickupAddress: "Borella",
    bookedBy: "Reception",
    dispatchedBy: "Tuk Dispatch",
    dispatchedTime: "12/05/2025 11:25",
    driver: "Kamal Tuk",
    tukNumber: "TUK-333",
    vehicleClass: "Tuk",
    fareScheme: "Tuk Standard",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// APP DISPATCHED (Non-Tuk Vehicles)
// ═══════════════════════════════════════════════════════════════════════════
const appDispatchedData = [
  {
    id: "ad1",
    bookingId: "APP-D001",
    customerName: "David Lee",
    phoneNumber: "0777890123",
    pickupLocation: "Galle Face",
    pickupTime: "2024-03-15 12:30",
    appPlatform: "Android",
    dispatchedBy: "Auto Dispatch",
    dispatchedTime: "2024-03-15 12:25",
    driver: "Asanka Silva",
    vehicle: "ECO-7890",
    vehicleType: "ECONOMY",
    fareScheme: "App Standard",
  },
  {
    id: "ad2",
    bookingId: "APP-D002",
    customerName: "Sophia Wang",
    phoneNumber: "0718901234",
    pickupLocation: "Fort",
    pickupTime: "2024-03-15 16:00",
    appPlatform: "iOS",
    dispatchedBy: "Auto Dispatch",
    dispatchedTime: "2024-03-15 15:50",
    driver: "Bandara Perera",
    vehicle: "STD-4567",
    vehicleType: "STANDARD",
    fareScheme: "App Premium",
  },
  {
    id: "ad3",
    bookingId: "APP-D003",
    customerName: "James Wilson",
    phoneNumber: "0779012345",
    pickupLocation: "Bambalapitiya",
    pickupTime: "2024-03-16 10:00",
    appPlatform: "Android",
    dispatchedBy: "Manual Override",
    dispatchedTime: "2024-03-16 09:45",
    driver: "Chaminda Fernando",
    vehicle: "LUX-1234",
    vehicleType: "Luxury",
    fareScheme: "App Luxury",
  },
  {
    id: "ad4",
    bookingId: "APP-D004",
    customerName: "Emma Davis",
    phoneNumber: "0780123456",
    pickupLocation: "Wellawatte",
    pickupTime: "2024-03-16 14:30",
    appPlatform: "iOS",
    dispatchedBy: "Auto Dispatch",
    dispatchedTime: "2024-03-16 14:20",
    driver: "Dinesh Kumar",
    vehicle: "BUS-5678",
    vehicleType: "Bus",
    fareScheme: "App Bus Rate",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TUK APP DISPATCHED (App + Tuk)
// ═══════════════════════════════════════════════════════════════════════════
const tukAppDispatchedData = [
  {
    id: "tad1",
    bookingId: "TAPP-D001",
    customerName: "Kasun Perera",
    phoneNumber: "0777890123",
    pickupLocation: "Pettah",
    pickupTime: "2024-03-15 12:30",
    appPlatform: "Android",
    dispatchedBy: "Tuk Auto",
    dispatchedTime: "2024-03-15 12:25",
    driver: "Eranga Tuk",
    tukNumber: "TUK-444",
    vehicleType: "Tuk",
    fareScheme: "App Tuk Rate",
  },
  {
    id: "tad2",
    bookingId: "TAPP-D002",
    customerName: "Nimali Silva",
    phoneNumber: "0718901234",
    pickupLocation: "Borella",
    pickupTime: "2024-03-15 16:00",
    appPlatform: "iOS",
    dispatchedBy: "Tuk Auto",
    dispatchedTime: "2024-03-15 15:55",
    driver: "Fazil Tuk",
    tukNumber: "TUK-555",
    vehicleType: "Tuk",
    fareScheme: "App Tuk Rate",
  },
  {
    id: "tad3",
    bookingId: "TAPP-D003",
    customerName: "Ranjith Fernando",
    phoneNumber: "0761234567",
    pickupLocation: "Maradana",
    pickupTime: "2024-03-15 17:00",
    appPlatform: "Android",
    dispatchedBy: "Tuk Manual",
    dispatchedTime: "2024-03-15 16:50",
    driver: "Gayan Tuk",
    tukNumber: "TUK-666",
    vehicleType: "Tuk",
    fareScheme: "App Tuk Special",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM DATA TO UNIFIED FORMAT
// ═══════════════════════════════════════════════════════════════════════════

// Portal Dispatched (Non-Tuk)
const portalDispatchedBookings: DispatchedBooking[] = portalDispatchedData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  organization: item.organization,
  customer: item.customer,
  contact: item.passengerNumber,
  hireType: item.hireType,
  pickupTime: item.pickupTime,
  pickup: item.pickupAddress,
  bookedBy: item.bookedBy,
  dispatchedBy: item.dispatchedBy,
  dispatchedTime: item.dispatchedTime,
  driver: item.driver,
  vehicle: item.vehicle,
  vehicleType: item.vehicleClass,
  fareScheme: item.fareScheme,
  source: "Portal" as const,
  status: "Dispatched" as const,
}));

// Tuk Dispatched (Manual + Tuk)
const tukDispatchedBookings: DispatchedBooking[] = tukDispatchedData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  organization: item.organization,
  customer: item.customer,
  contact: item.passengerNumber,
  hireType: item.hireType,
  pickupTime: item.pickupTime,
  pickup: item.pickupAddress,
  bookedBy: item.bookedBy,
  dispatchedBy: item.dispatchedBy,
  dispatchedTime: item.dispatchedTime,
  driver: item.driver,
  vehicle: item.tukNumber,
  vehicleType: "Tuk",
  fareScheme: item.fareScheme,
  source: "Portal" as const,
  status: "Dispatched" as const,
}));

// App Dispatched (Non-Tuk)
const appDispatchedBookings: DispatchedBooking[] = appDispatchedData.map((item) => ({
  id: item.id,
  refNumber: item.bookingId,
  customer: item.customerName,
  contact: item.phoneNumber,
  pickupTime: item.pickupTime,
  pickup: item.pickupLocation,
  dispatchedBy: item.dispatchedBy,
  dispatchedTime: item.dispatchedTime,
  driver: item.driver,
  vehicle: item.vehicle,
  vehicleType: item.vehicleType,
  fareScheme: item.fareScheme,
  source: "App" as const,
  platform: item.appPlatform as "Android" | "iOS",
  status: "Dispatched" as const,
}));

// Tuk App Dispatched
const tukAppDispatchedBookings: DispatchedBooking[] = tukAppDispatchedData.map((item) => ({
  id: item.id,
  refNumber: item.bookingId,
  customer: item.customerName,
  contact: item.phoneNumber,
  pickupTime: item.pickupTime,
  pickup: item.pickupLocation,
  dispatchedBy: item.dispatchedBy,
  dispatchedTime: item.dispatchedTime,
  driver: item.driver,
  vehicle: item.tukNumber,
  vehicleType: "Tuk",
  fareScheme: item.fareScheme,
  source: "App" as const,
  platform: item.appPlatform as "Android" | "iOS",
  status: "Dispatched" as const,
}));

// Combined data
const allDispatchedData = [
  ...portalDispatchedBookings,
  ...tukDispatchedBookings,
  ...appDispatchedBookings,
  ...tukAppDispatchedBookings,
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const selectColumn: ColumnDef<DispatchedBooking> = {
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

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL/PORTAL DISPATCHED COLUMNS (Non-Tuk)
// ═══════════════════════════════════════════════════════════════════════════
const manualDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Booking",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "organization",
    header: "Org",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.organization || (
          <span className="text-muted-foreground italic">Individual</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Passenger",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "hireType",
    header: "Hire Type",
    cell: ({ row }) => {
      const hireType = row.original.hireType;
      return (
        <Badge variant="secondary" className="text-xs">
          {hireType || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pickupTime",
    header: "Pickup Time",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: "Pickup Address",
  },
  {
    accessorKey: "bookedBy",
    header: "Booked By",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.bookedBy || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: "Dispatched By",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">
          {row.getValue("dispatchedBy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dispatchedTime",
    header: "Dispatched Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {row.getValue("dispatchedTime")}
        </span>
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
    accessorKey: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      const vehicleType = row.original.vehicleType;
      return (
        <div className="space-y-1">
          <span className="font-mono text-sm">{vehicle}</span>
          <Badge className={`${getVehicleBadgeClass(vehicleType || "")} text-xs`}>
            {vehicleType}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "fareScheme",
    header: "Fare Scheme",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.fareScheme || "Standard"}
      </Badge>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TUK MANUAL DISPATCHED COLUMNS
// ═══════════════════════════════════════════════════════════════════════════
const tukDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Booking",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "organization",
    header: "Org",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.organization || (
          <span className="text-muted-foreground italic">Individual</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Passenger",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "hireType",
    header: "Hire Type",
    cell: ({ row }) => {
      const hireType = row.original.hireType;
      return (
        <Badge variant="secondary" className="text-xs">
          {hireType || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "pickupTime",
    header: "Pickup Time",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: "Pickup Address",
  },
  {
    accessorKey: "bookedBy",
    header: "Booked By",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.bookedBy || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: "Dispatched By",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">
          {row.getValue("dispatchedBy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dispatchedTime",
    header: "Dispatched Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {row.getValue("dispatchedTime")}
        </span>
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
    accessorKey: "vehicle",
    header: "Tuk Number",
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Car className="h-3 w-3 mr-1" />
          {vehicle}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fareScheme",
    header: "Fare Scheme",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.fareScheme || "Tuk Standard"}
      </Badge>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED/ALL COLUMNS (Common fields for all dispatched bookings)
// ═══════════════════════════════════════════════════════════════════════════
const combinedDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Ref ID",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const source = row.original.source;
      const platform = row.original.platform;
      const vehicleType = row.original.vehicleType;
      const isTuk = vehicleType === "Tuk";

      if (source === "App") {
        return (
          <Badge
            variant="outline"
            className={`gap-1 ${
              isTuk
                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                : platform === "iOS"
                ? "border-gray-500 text-gray-700 bg-gray-50"
                : "border-green-600 text-green-700 bg-green-50"
            }`}
          >
            {isTuk ? (
              <Car className="h-3 w-3" />
            ) : (
              <Smartphone className="h-3 w-3" />
            )}
            {isTuk ? `Tuk App (${platform})` : `App (${platform})`}
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            isTuk
              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
              : "border-blue-500 text-blue-700 bg-blue-50"
          }`}
        >
          {isTuk ? <Car className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
          {isTuk ? "Tuk (Manual)" : "Manual/Portal"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "pickupTime",
    header: "Pickup Time",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: "Dispatched By",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">
          {row.getValue("dispatchedBy")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dispatchedTime",
    header: "Dispatched Time",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {row.getValue("dispatchedTime")}
        </span>
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
];

// ═══════════════════════════════════════════════════════════════════════════
// FILTER STATE TYPE
// ═══════════════════════════════════════════════════════════════════════════
type SourceFilter = "all" | "Portal" | "App";
type VehicleFilter = "all" | "Tuk" | "nonTuk";

// Determine which column set to use based on filters
const getColumnSet = (
  sourceFilter: SourceFilter,
  vehicleFilter: VehicleFilter
): "manual" | "tuk" | "combined" => {
  // If source is Portal/Manual and vehicle is Tuk
  if (sourceFilter === "Portal" && vehicleFilter === "Tuk") {
    return "tuk";
  }

  // If source is specifically Portal/Manual (non-tuk)
  if (sourceFilter === "Portal" && vehicleFilter === "nonTuk") {
    return "manual";
  }

  // For all other cases, show combined columns
  return "combined";
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function UnifiedDispatchedReports() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  // All data combined
  const allBookingsData = useMemo(() => allDispatchedData, []);

  // Filter data based on source and vehicle filters
  const filteredData = useMemo(() => {
    let result = [...allBookingsData];

    // Filter by source
    if (sourceFilter === "Portal") {
      result = result.filter((item) => item.source === "Portal");
    } else if (sourceFilter === "App") {
      result = result.filter((item) => item.source === "App");
    }

    // Filter by vehicle
    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicleType === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicleType !== "Tuk");
    }

    return result;
  }, [allBookingsData, sourceFilter, vehicleFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const all = allBookingsData;
    const portal = all.filter((d) => d.source === "Portal");
    const app = all.filter((d) => d.source === "App");
    const tuk = all.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = all.filter((d) => d.vehicleType !== "Tuk");

    return {
      total: all.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicleType === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicleType !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicleType === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicleType !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      android: all.filter((d) => d.platform === "Android").length,
      ios: all.filter((d) => d.platform === "iOS").length,
      filtered: filteredData.length,
    };
  }, [allBookingsData, filteredData]);

  // Get columns based on current filter state
  const currentColumns = useMemo(() => {
    const columnSet = getColumnSet(sourceFilter, vehicleFilter);

    switch (columnSet) {
      case "manual":
        return manualDispatchedColumns;
      case "tuk":
        return tukDispatchedColumns;
      default:
        return combinedDispatchedColumns;
    }
  }, [sourceFilter, vehicleFilter]);

  // Get dynamic filters for the table
  const tableFilters = useMemo(() => {
    const filters = [];

    // Source filter (only in combined view)
    if (sourceFilter === "all") {
      filters.push({
        key: "source",
        label: "Booking Source",
        options: [
          { value: "Portal", label: "Manual / Portal" },
          { value: "App", label: "App" },
        ],
      });
    }

    // Vehicle type filter
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

    // Platform filter (only for App view)
    if (sourceFilter === "App") {
      filters.push({
        key: "platform",
        label: "Platform",
        options: [
          { value: "Android", label: "Android" },
          { value: "iOS", label: "iOS" },
        ],
      });
    }

    return filters;
  }, [sourceFilter]);

  // Get title based on filters
  const getTitle = () => {
    if (sourceFilter === "Portal" && vehicleFilter === "Tuk") {
      return "Tuk Dispatched (Manual)";
    }
    if (sourceFilter === "Portal" && vehicleFilter === "nonTuk") {
      return "Dispatched (Manual - Non Tuk)";
    }
    if (sourceFilter === "Portal") {
      return "Dispatched (Manual/Portal)";
    }
    if (sourceFilter === "App" && vehicleFilter === "Tuk") {
      return "Tuk App Dispatched";
    }
    if (sourceFilter === "App" && vehicleFilter === "nonTuk") {
      return "App Dispatched (Non Tuk)";
    }
    if (sourceFilter === "App") {
      return "App Dispatched";
    }
    if (vehicleFilter === "Tuk") {
      return "All Tuk Dispatched";
    }
    if (vehicleFilter === "nonTuk") {
      return "All Non-Tuk Dispatched";
    }
    return "All Dispatched Bookings";
  };

  // Get subtitle
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

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Green for dispatched
    doc.text("Dispatched Booking Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`View: ${getTitle()}`, 14, 36);
    doc.text(`Total Records: ${filteredData.length}`, 14, 42);

    let tableColumn: string[];
    let tableRows: string[][];

    const columnSet = getColumnSet(sourceFilter, vehicleFilter);

    switch (columnSet) {
      case "manual":
        tableColumn = [
          "Booking",
          "Org",
          "Customer",
          "Passenger",
          "Hire Type",
          "Pickup Time",
          "Pickup",
          "Booked By",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Vehicle",
          "Fare Scheme",
        ];
        tableRows = filteredData.map((item) => [
          item.refNumber,
          item.organization || "Individual",
          item.customer,
          item.contact,
          item.hireType || "N/A",
          item.pickupTime,
          item.pickup,
          item.bookedBy || "N/A",
          item.dispatchedBy,
          item.dispatchedTime,
          item.driver,
          `${item.vehicle} (${item.vehicleType})`,
          item.fareScheme || "Standard",
        ]);
        break;
      case "tuk":
        tableColumn = [
          "Booking",
          "Org",
          "Customer",
          "Passenger",
          "Hire Type",
          "Pickup Time",
          "Pickup",
          "Booked By",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Tuk Number",
          "Fare Scheme",
        ];
        tableRows = filteredData.map((item) => [
          item.refNumber,
          item.organization || "Individual",
          item.customer,
          item.contact,
          item.hireType || "N/A",
          item.pickupTime,
          item.pickup,
          item.bookedBy || "N/A",
          item.dispatchedBy,
          item.dispatchedTime,
          item.driver,
          item.vehicle,
          item.fareScheme || "Tuk Standard",
        ]);
        break;
      default:
        tableColumn = [
          "Ref ID",
          "Source",
          "Customer",
          "Contact",
          "Pickup Time",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Vehicle Type",
          "Vehicle #",
        ];
        tableRows = filteredData.map((item) => {
          const isTuk = item.vehicleType === "Tuk";
          const sourceLabel =
            item.source === "App"
              ? isTuk
                ? `Tuk App (${item.platform})`
                : `App (${item.platform})`
              : isTuk
              ? "Tuk (Manual)"
              : "Manual/Portal";
          return [
            item.refNumber,
            sourceLabel,
            item.customer,
            item.contact,
            item.pickupTime,
            item.dispatchedBy,
            item.dispatchedTime,
            item.driver,
            item.vehicleType || "N/A",
            item.vehicle,
          ];
        });
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 48,
      headStyles: {
        fillColor: [34, 197, 94], // Green for dispatched
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 250, 245],
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
    });

    doc.save(`dispatched_report_${sourceFilter}_${vehicleFilter}.pdf`);
  };

  // CSV Export
  const exportCSV = () => {
    let headers: string[];
    let rows: string[][];

    const columnSet = getColumnSet(sourceFilter, vehicleFilter);

    switch (columnSet) {
      case "manual":
        headers = [
          "Booking",
          "Organization",
          "Customer",
          "Passenger #",
          "Hire Type",
          "Pickup Time",
          "Pickup Address",
          "Booked By",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Vehicle",
          "Vehicle Type",
          "Fare Scheme",
        ];
        rows = filteredData.map((row) => [
          row.refNumber,
          row.organization || "Individual",
          `"${row.customer}"`,
          row.contact,
          row.hireType || "N/A",
          row.pickupTime,
          `"${row.pickup}"`,
          row.bookedBy || "N/A",
          row.dispatchedBy,
          row.dispatchedTime,
          `"${row.driver}"`,
          row.vehicle,
          row.vehicleType || "N/A",
          row.fareScheme || "Standard",
        ]);
        break;
      case "tuk":
        headers = [
          "Booking",
          "Organization",
          "Customer",
          "Passenger #",
          "Hire Type",
          "Pickup Time",
          "Pickup Address",
          "Booked By",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Tuk Number",
          "Fare Scheme",
        ];
        rows = filteredData.map((row) => [
          row.refNumber,
          row.organization || "Individual",
          `"${row.customer}"`,
          row.contact,
          row.hireType || "N/A",
          row.pickupTime,
          `"${row.pickup}"`,
          row.bookedBy || "N/A",
          row.dispatchedBy,
          row.dispatchedTime,
          `"${row.driver}"`,
          row.vehicle,
          row.fareScheme || "Tuk Standard",
        ]);
        break;
      default:
        headers = [
          "Ref ID",
          "Source",
          "Customer",
          "Contact",
          "Pickup Time",
          "Dispatched By",
          "Dispatched Time",
          "Driver",
          "Vehicle Type",
          "Vehicle #",
        ];
        rows = filteredData.map((row) => {
          const isTuk = row.vehicleType === "Tuk";
          const sourceLabel =
            row.source === "App"
              ? isTuk
                ? `Tuk App (${row.platform})`
                : `App (${row.platform})`
              : isTuk
              ? "Tuk (Manual)"
              : "Manual/Portal";
          return [
            row.refNumber,
            sourceLabel,
            `"${row.customer}"`,
            row.contact,
            row.pickupTime,
            row.dispatchedBy,
            row.dispatchedTime,
            `"${row.driver}"`,
            row.vehicleType || "N/A",
            row.vehicle,
          ];
        });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dispatched_report_${sourceFilter}_${vehicleFilter}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset all filters
  const resetFilters = () => {
    setSourceFilter("all");
    setVehicleFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            Dispatched Bookings Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Summary and report view of all dispatched bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={exportPDF}
          >
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Cards - Source Filter */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Source
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* All Sources */}
          <Card
            className={`cursor-pointer transition-all ${
              sourceFilter === "all"
                ? "ring-2 ring-green-600 bg-green-50/50 border-green-600"
                : "hover:bg-green-50/30"
            }`}
            onClick={() => setSourceFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers
                className={`h-4 w-4 ${
                  sourceFilter === "all"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Combined view of all sources
              </p>
            </CardContent>
          </Card>

          {/* Manual/Portal */}
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

          {/* App */}
          <Card
            className={`cursor-pointer transition-all ${
              sourceFilter === "App"
                ? "ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-500"
                : "hover:bg-emerald-50/30"
            }`}
            onClick={() => setSourceFilter("App")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">App</CardTitle>
              <Smartphone
                className={`h-4 w-4 ${
                  sourceFilter === "App"
                    ? "text-emerald-500"
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
          {/* All Vehicles */}
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
                All vehicle types dispatched
              </p>
            </CardContent>
          </Card>

          {/* Tuk Only */}
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
                Three-wheeler dispatched
              </p>
            </CardContent>
          </Card>

          {/* Non-Tuk */}
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
                Regular vehicles dispatched
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
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            Dispatched
          </Badge>
          <span className="text-muted-foreground">•</span>
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
          <Badge className="bg-green-600">{stats.filtered} records</Badge>
        </div>
        {(sourceFilter !== "all" || vehicleFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            {/* Column set indicator */}
            <Badge variant="outline" className="self-start">
              {getColumnSet(sourceFilter, vehicleFilter) === "manual"
                ? "13 Columns (Manual Format)"
                : getColumnSet(sourceFilter, vehicleFilter) === "tuk"
                ? "13 Columns (Tuk Format)"
                : "10 Columns (Combined)"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key forces re-render when filters change */}
          <EnhancedDataTable
            key={`${sourceFilter}-${vehicleFilter}-dispatched`}
            columns={currentColumns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search by customer name..."
            enableColumnVisibility={true}
            pageSize={10}
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}