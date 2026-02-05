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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type UnifiedBooking = {
  id: string;
  refNumber: string;
  customer: string;
  contact: string;
  pickup: string;
  drop: string;
  vehicle: string;
  dateTime: string;
  source: "Portal" | "App";
  platform?: "Android" | "iOS";
  organization?: string;
  bookedBy?: string;
  pickupTime?: string;
  status: "Pending";
  hireType?: string;
  clientRemarks?: string;
  isAdvance?: string;
  bookingTime?: string;
};

// --- Mock Data ---

// ═══════════════════════════════════════════════════════════════════════════
// MANUAL/PORTAL PENDING (Non-Tuk Vehicles)
// Columns: Booking #, Is Adv, Organization, Customer, Passenger #, Hire Type,
//          Client Remarks, Booking Time, Booked By, Pickup Time, Pickup Address,
//          Drop Address, Vehicle Class
// ═══════════════════════════════════════════════════════════════════════════
const portalPendingData = [
  {
    id: "p1",
    bookingNumber: "295104",
    isAdvance: "Yes",
    organization: "PGIE",
    customer: "Ms. Shiromi",
    passengerNumber: "0766117723",
    hireType: "One Way",
    clientRemarks: "VIP Customer",
    bookingTime: "11/27/2025 10:30",
    bookedBy: "Admin User",
    pickupTime: "11/27/2025 15:58",
    pickupAddress: "Nawala",
    dropAddress: "Waskaduwa",
    vehicleClass: "Bus",
  },
  {
    id: "p2",
    bookingNumber: "295650",
    isAdvance: "No",
    organization: "Corporate",
    customer: "John Silva",
    passengerNumber: "0771234567",
    hireType: "Round Trip",
    clientRemarks: "Airport pickup",
    bookingTime: "12/03/2025 08:00",
    bookedBy: "Receptionist",
    pickupTime: "12/03/2025 10:30",
    pickupAddress: "Airport",
    dropAddress: "Colombo 03",
    vehicleClass: "Luxury",
  },
  {
    id: "p3",
    bookingNumber: "295700",
    isAdvance: "Yes",
    organization: "Hotel Grand",
    customer: "Sarah Connor",
    passengerNumber: "0772345678",
    hireType: "One Way",
    clientRemarks: "Hotel guest transfer",
    bookingTime: "12/04/2025 06:00",
    bookedBy: "Manager",
    pickupTime: "12/04/2025 08:00",
    pickupAddress: "Colombo 07",
    dropAddress: "Negombo",
    vehicleClass: "STANDARD",
  },
  {
    id: "p4",
    bookingNumber: "295750",
    isAdvance: "No",
    organization: "Tech Corp",
    customer: "Mike Ross",
    passengerNumber: "0773456789",
    hireType: "Hourly",
    clientRemarks: "Meeting transport",
    bookingTime: "12/04/2025 07:00",
    bookedBy: "HR Dept",
    pickupTime: "12/04/2025 09:30",
    pickupAddress: "Rajagiriya",
    dropAddress: "Maharagama",
    vehicleClass: "ECONOMY",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TUK PENDING (Manual/Portal + Tuk)
// Columns: Booking #, Is Adv, Organization, Customer, Passenger #, Hire Type,
//          Client Remarks, Booking Time, Booked By, Pickup Time, Pickup Address,
//          Drop Address, Vehicle Class
// ═══════════════════════════════════════════════════════════════════════════
const tukPendingData = [
  {
    id: "tp1",
    bookingNumber: "TUK-001",
    isAdvance: "No",
    organization: "",
    customer: "Kumara Bandara",
    passengerNumber: "0712345678",
    hireType: "One Way",
    clientRemarks: "Short distance",
    bookingTime: "12/05/2025 09:00",
    bookedBy: "Call Center",
    pickupTime: "12/05/2025 09:30",
    pickupAddress: "Pettah",
    dropAddress: "Fort",
    vehicleClass: "Tuk",
  },
  {
    id: "tp2",
    bookingNumber: "TUK-002",
    isAdvance: "Yes",
    organization: "Small Shop",
    customer: "Nimal Perera",
    passengerNumber: "0723456789",
    hireType: "Round Trip",
    clientRemarks: "Wait at destination",
    bookingTime: "12/05/2025 10:00",
    bookedBy: "Admin",
    pickupTime: "12/05/2025 11:00",
    pickupAddress: "Maradana",
    dropAddress: "Kotahena",
    vehicleClass: "Tuk",
  },
  {
    id: "tp3",
    bookingNumber: "TUK-003",
    isAdvance: "No",
    organization: "",
    customer: "Sunil Fernando",
    passengerNumber: "0734567890",
    hireType: "One Way",
    clientRemarks: "",
    bookingTime: "12/05/2025 11:00",
    bookedBy: "Reception",
    pickupTime: "12/05/2025 11:30",
    pickupAddress: "Borella",
    dropAddress: "Narahenpita",
    vehicleClass: "Tuk",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// APP PENDING (Non-Tuk Vehicles)
// Columns: Booking ID, Customer, Phone, Pickup, Drop, Vehicle, Time, Platform
// ═══════════════════════════════════════════════════════════════════════════
const appPendingData = [
  {
    id: "a1",
    bookingId: "APP-001",
    customerName: "David Lee",
    phoneNumber: "0777890123",
    pickupLocation: "Galle Face",
    dropLocation: "Mt Lavinia",
    vehicleType: "ECONOMY",
    bookingTime: "2024-03-15 12:30",
    appPlatform: "Android",
  },
  {
    id: "a2",
    bookingId: "APP-002",
    customerName: "Sophia Wang",
    phoneNumber: "0718901234",
    pickupLocation: "Fort",
    dropLocation: "Dehiwala",
    vehicleType: "STANDARD",
    bookingTime: "2024-03-15 16:00",
    appPlatform: "iOS",
  },
  {
    id: "a3",
    bookingId: "APP-003",
    customerName: "James Wilson",
    phoneNumber: "0779012345",
    pickupLocation: "Bambalapitiya",
    dropLocation: "Nugegoda",
    vehicleType: "Luxury",
    bookingTime: "2024-03-16 10:00",
    appPlatform: "Android",
  },
  {
    id: "a4",
    bookingId: "APP-004",
    customerName: "Emma Davis",
    phoneNumber: "0780123456",
    pickupLocation: "Wellawatte",
    dropLocation: "Kottawa",
    vehicleType: "Bus",
    bookingTime: "2024-03-16 14:30",
    appPlatform: "iOS",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TUK APP PENDING (App + Tuk)
// Columns: Booking ID, Customer, Phone, Pickup, Drop, Vehicle, Time, Platform
// ═══════════════════════════════════════════════════════════════════════════
const tukAppPendingData = [
  {
    id: "ta1",
    bookingId: "TAPP-001",
    customerName: "Kasun Perera",
    phoneNumber: "0777890123",
    pickupLocation: "Pettah",
    dropLocation: "Fort",
    vehicleType: "Tuk",
    bookingTime: "2024-03-15 12:30 PM",
    appPlatform: "Android",
  },
  {
    id: "ta2",
    bookingId: "TAPP-002",
    customerName: "Nimali Silva",
    phoneNumber: "0718901234",
    pickupLocation: "Borella",
    dropLocation: "Nugegoda",
    vehicleType: "Tuk",
    bookingTime: "2024-03-15 04:00 PM",
    appPlatform: "iOS",
  },
  {
    id: "ta3",
    bookingId: "TAPP-003",
    customerName: "Ranjith Fernando",
    phoneNumber: "0761234567",
    pickupLocation: "Maradana",
    dropLocation: "Dehiwala",
    vehicleType: "Tuk",
    bookingTime: "2024-03-15 05:00 PM",
    appPlatform: "Android",
  },
  {
    id: "ta4",
    bookingId: "TAPP-004",
    customerName: "Sanduni Wickrama",
    phoneNumber: "0752345678",
    pickupLocation: "Kollupitiya",
    dropLocation: "Wellawatta",
    vehicleType: "Tuk",
    bookingTime: "2024-03-15 06:00 PM",
    appPlatform: "iOS",
  },
  {
    id: "ta5",
    bookingId: "TAPP-005",
    customerName: "Tharindu Gamage",
    phoneNumber: "0743456789",
    pickupLocation: "Bambalapitiya",
    dropLocation: "Mount Lavinia",
    vehicleType: "Tuk",
    bookingTime: "2024-03-15 07:00 PM",
    appPlatform: "Android",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM DATA TO UNIFIED FORMAT
// ═══════════════════════════════════════════════════════════════════════════

// Portal Pending (Non-Tuk) - Manual source
const portalBookings: UnifiedBooking[] = portalPendingData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  isAdvance: item.isAdvance,
  organization: item.organization,
  customer: item.customer,
  contact: item.passengerNumber,
  hireType: item.hireType,
  clientRemarks: item.clientRemarks,
  bookingTime: item.bookingTime,
  bookedBy: item.bookedBy,
  pickupTime: item.pickupTime,
  pickup: item.pickupAddress,
  drop: item.dropAddress,
  vehicle: item.vehicleClass,
  dateTime: item.pickupTime,
  source: "Portal" as const,
  status: "Pending" as const,
}));

// Tuk Pending (Manual + Tuk) - Manual source with Tuk vehicle
const tukPendingBookings: UnifiedBooking[] = tukPendingData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  isAdvance: item.isAdvance,
  organization: item.organization,
  customer: item.customer,
  contact: item.passengerNumber,
  hireType: item.hireType,
  clientRemarks: item.clientRemarks,
  bookingTime: item.bookingTime,
  bookedBy: item.bookedBy,
  pickupTime: item.pickupTime,
  pickup: item.pickupAddress,
  drop: item.dropAddress,
  vehicle: item.vehicleClass,
  dateTime: item.pickupTime,
  source: "Portal" as const,
  status: "Pending" as const,
}));

// App Pending (Non-Tuk) - App source
const appBookings: UnifiedBooking[] = appPendingData.map((item) => ({
  id: item.id,
  refNumber: item.bookingId,
  customer: item.customerName,
  contact: item.phoneNumber,
  pickup: item.pickupLocation,
  drop: item.dropLocation,
  vehicle: item.vehicleType,
  dateTime: item.bookingTime,
  source: "App" as const,
  platform: item.appPlatform as "Android" | "iOS",
  status: "Pending" as const,
}));

// Tuk App Pending (App + Tuk) - App source with Tuk vehicle
const tukAppBookings: UnifiedBooking[] = tukAppPendingData.map((item) => ({
  id: item.id,
  refNumber: item.bookingId,
  customer: item.customerName,
  contact: item.phoneNumber,
  pickup: item.pickupLocation,
  drop: item.dropLocation,
  vehicle: item.vehicleType,
  dateTime: item.bookingTime,
  source: "App" as const,
  platform: item.appPlatform as "Android" | "iOS",
  status: "Pending" as const,
}));

// Combined data
const allData = [
  ...portalBookings,
  ...tukPendingBookings,
  ...appBookings,
  ...tukAppBookings,
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
const getVehicleBadgeClass = (vehicle: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
  };
  return colorMap[vehicle] || "bg-gray-100 text-gray-800";
};

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

const selectColumn: ColumnDef<UnifiedBooking> = {
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
// MANUAL/PORTAL COLUMNS (for both Tuk and Non-Tuk manual bookings)
// Columns: Booking #, Is Adv, Organization, Customer, Passenger #, Hire Type,
//          Client Remarks, Booking Time, Booked By, Pickup Time, Pickup Address,
//          Drop Address, Vehicle Class
// ═══════════════════════════════════════════════════════════════════════════
const manualColumns: ColumnDef<UnifiedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Booking #",
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "isAdvance",
    header: "Is Adv",
    cell: ({ row }) => {
      const isAdv = row.original.isAdvance;
      return (
        <Badge
          variant="outline"
          className={
            isAdv === "Yes"
              ? "border-green-500 text-green-700 bg-green-50"
              : "border-gray-400 text-gray-600"
          }
        >
          {isAdv || "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "organization",
    header: "Organization",
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
    header: "Passenger #",
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
    accessorKey: "clientRemarks",
    header: "Client Remarks",
    cell: ({ row }) => {
      const remarks = row.original.clientRemarks;
      if (!remarks) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <span
          className="text-sm text-muted-foreground max-w-[200px] truncate block"
          title={remarks}
        >
          {remarks}
        </span>
      );
    },
  },
  {
    accessorKey: "bookingTime",
    header: "Booking Time",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.bookingTime || "N/A"}</span>
    ),
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
    accessorKey: "pickupTime",
    header: "Pickup Time",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.pickupTime || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: "Pickup Address",
  },
  {
    accessorKey: "drop",
    header: "Drop Address",
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle Class",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// APP COLUMNS (for both Tuk App and Non-Tuk App bookings)
// Columns: Booking ID, Customer, Phone, Pickup, Drop, Vehicle, Time, Platform
// ═══════════════════════════════════════════════════════════════════════════
const appColumns: ColumnDef<UnifiedBooking>[] = [
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
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: "Pickup",
  },
  {
    accessorKey: "drop",
    header: "Drop",
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dateTime",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("dateTime")}
      </span>
    ),
  },
  {
    accessorKey: "platform",
    header: "Platform",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const platform = row.original.platform;
      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            platform === "iOS"
              ? "border-gray-500 text-gray-700 bg-gray-50"
              : "border-green-600 text-green-700 bg-green-50"
          }`}
        >
          <Smartphone className="h-3 w-3" /> {platform}
        </Badge>
      );
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED/ALL COLUMNS (Intersection - Common fields only)
// Used when both sources are selected or no filter
// Columns: Ref ID, Source, Customer, Contact, Pickup, Drop, Vehicle, Date/Time
// ═══════════════════════════════════════════════════════════════════════════
const combinedColumns: ColumnDef<UnifiedBooking>[] = [
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
      const vehicle = row.original.vehicle;
      const isTuk = vehicle === "Tuk";

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
    accessorKey: "pickup",
    header: "Pickup",
  },
  {
    accessorKey: "drop",
    header: "Drop",
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dateTime",
    header: "Date/Time",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("dateTime")}
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
): "manual" | "app" | "combined" => {
  // If source is specifically Portal/Manual
  if (sourceFilter === "Portal") {
    return "manual";
  }

  // If source is specifically App
  if (sourceFilter === "App") {
    return "app";
  }

  // If source is "all" (both), show combined/intersection columns
  return "combined";
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function UnifiedPendingReports() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  // All data combined
  const allBookingsData = useMemo(() => allData, []);

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
      result = result.filter((item) => item.vehicle === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicle !== "Tuk");
    }

    return result;
  }, [allBookingsData, sourceFilter, vehicleFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const all = allBookingsData;
    const portal = all.filter((d) => d.source === "Portal");
    const app = all.filter((d) => d.source === "App");
    const tuk = all.filter((d) => d.vehicle === "Tuk");
    const nonTuk = all.filter((d) => d.vehicle !== "Tuk");

    return {
      total: all.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicle === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicle !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicle === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicle !== "Tuk").length,
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
        return manualColumns;
      case "app":
        return appColumns;
      default:
        return combinedColumns;
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

    // Vehicle filter
    const vehicleOptions = [
      { value: "Bus", label: "Bus" },
      { value: "Luxury", label: "Luxury" },
      { value: "ECONOMY", label: "Economy" },
      { value: "STANDARD", label: "Standard" },
      { value: "Tuk", label: "Tuk" },
    ];

    filters.push({
      key: "vehicle",
      label: "Vehicle Class",
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
      return "Tuk Pending (Manual)";
    }
    if (sourceFilter === "Portal" && vehicleFilter === "nonTuk") {
      return "Pending (Manual - Non Tuk)";
    }
    if (sourceFilter === "Portal") {
      return "Pending (Manual/Portal)";
    }
    if (sourceFilter === "App" && vehicleFilter === "Tuk") {
      return "Tuk App Pending";
    }
    if (sourceFilter === "App" && vehicleFilter === "nonTuk") {
      return "App Pending (Non Tuk)";
    }
    if (sourceFilter === "App") {
      return "App Pending";
    }
    if (vehicleFilter === "Tuk") {
      return "All Tuk Pending";
    }
    if (vehicleFilter === "nonTuk") {
      return "All Non-Tuk Pending";
    }
    return "All Pending Bookings";
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
    doc.setTextColor(99, 48, 184);
    doc.text("Pending Booking Report", 14, 22);

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
          "Booking #",
          "Is Adv",
          "Organization",
          "Customer",
          "Passenger #",
          "Hire Type",
          "Client Remarks",
          "Booking Time",
          "Booked By",
          "Pickup Time",
          "Pickup",
          "Drop",
          "Vehicle",
        ];
        tableRows = filteredData.map((item) => [
          item.refNumber,
          item.isAdvance || "No",
          item.organization || "Individual",
          item.customer,
          item.contact,
          item.hireType || "N/A",
          item.clientRemarks || "-",
          item.bookingTime || "N/A",
          item.bookedBy || "N/A",
          item.pickupTime || "N/A",
          item.pickup,
          item.drop,
          item.vehicle,
        ]);
        break;
      case "app":
        tableColumn = [
          "Booking ID",
          "Customer",
          "Phone",
          "Pickup",
          "Drop",
          "Vehicle",
          "Time",
          "Platform",
        ];
        tableRows = filteredData.map((item) => [
          item.refNumber,
          item.customer,
          item.contact,
          item.pickup,
          item.drop,
          item.vehicle,
          item.dateTime,
          item.platform || "N/A",
        ]);
        break;
      default:
        tableColumn = [
          "Ref ID",
          "Source",
          "Customer",
          "Contact",
          "Pickup",
          "Drop",
          "Vehicle",
          "Date/Time",
        ];
        tableRows = filteredData.map((item) => {
          const isTuk = item.vehicle === "Tuk";
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
            item.pickup,
            item.drop,
            item.vehicle,
            item.dateTime,
          ];
        });
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 48,
      headStyles: {
        fillColor: [99, 48, 184],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 250],
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
    });

    doc.save(`pending_report_${sourceFilter}_${vehicleFilter}.pdf`);
  };

  // CSV Export
  const exportCSV = () => {
    let headers: string[];
    let rows: string[][];

    const columnSet = getColumnSet(sourceFilter, vehicleFilter);

    switch (columnSet) {
      case "manual":
        headers = [
          "Booking #",
          "Is Advance",
          "Organization",
          "Customer",
          "Passenger #",
          "Hire Type",
          "Client Remarks",
          "Booking Time",
          "Booked By",
          "Pickup Time",
          "Pickup Address",
          "Drop Address",
          "Vehicle Class",
        ];
        rows = filteredData.map((row) => [
          row.refNumber,
          row.isAdvance || "No",
          row.organization || "Individual",
          `"${row.customer}"`,
          row.contact,
          row.hireType || "N/A",
          `"${row.clientRemarks || ""}"`,
          row.bookingTime || "N/A",
          row.bookedBy || "N/A",
          row.pickupTime || "N/A",
          `"${row.pickup}"`,
          `"${row.drop}"`,
          row.vehicle,
        ]);
        break;
      case "app":
        headers = [
          "Booking ID",
          "Customer",
          "Phone",
          "Pickup",
          "Drop",
          "Vehicle",
          "Time",
          "Platform",
        ];
        rows = filteredData.map((row) => [
          row.refNumber,
          `"${row.customer}"`,
          row.contact,
          `"${row.pickup}"`,
          `"${row.drop}"`,
          row.vehicle,
          row.dateTime,
          row.platform || "N/A",
        ]);
        break;
      default:
        headers = [
          "Ref ID",
          "Source",
          "Customer",
          "Contact",
          "Pickup",
          "Drop",
          "Vehicle",
          "Date/Time",
        ];
        rows = filteredData.map((row) => {
          const isTuk = row.vehicle === "Tuk";
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
            `"${row.pickup}"`,
            `"${row.drop}"`,
            row.vehicle,
            row.dateTime,
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
      `pending_report_${sourceFilter}_${vehicleFilter}.csv`
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Pending Bookings Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Summary and report view of all pending bookings
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
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
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
                ? "ring-2 ring-[#6330B8] bg-purple-50/50 border-[#6330B8]"
                : "hover:bg-purple-50/30"
            }`}
            onClick={() => setSourceFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers
                className={`h-4 w-4 ${
                  sourceFilter === "all"
                    ? "text-[#6330B8]"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Combined view (intersection columns)
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
                All vehicle types
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
                Three-wheeler bookings
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
                Bus, Luxury, Standard, Economy
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
          <Badge className="bg-[#6330B8]">{stats.filtered} records</Badge>
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
              <CardTitle>{getTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            {/* Column set indicator */}
            <Badge variant="outline" className="self-start">
              {getColumnSet(sourceFilter, vehicleFilter) === "manual"
                ? "13 Columns (Manual Format)"
                : getColumnSet(sourceFilter, vehicleFilter) === "app"
                ? "8 Columns (App Format)"
                : "8 Columns (Combined/Intersection)"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key forces re-render when filters change */}
          <EnhancedDataTable
            key={`${sourceFilter}-${vehicleFilter}`}
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