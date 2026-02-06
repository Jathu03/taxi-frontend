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
  CheckCircle2,
  User,
  Clock,
  Printer,
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
  vehicleType?: string;
  fareScheme?: string;
  source: "Portal" | "App";
  platform?: "Android" | "iOS";
  status: "Dispatched";
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

// Transform data
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

const allDispatchedData = [
  ...portalDispatchedBookings,
  ...tukDispatchedBookings,
  ...appDispatchedBookings,
  ...tukAppDispatchedBookings,
];

// Helper functions
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

// Manual/Portal columns
const manualDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "organization",
    header: () => <span className="font-bold text-black">Org</span>,
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
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: () => <span className="font-bold text-black">Passenger</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "hireType",
    header: () => <span className="font-bold text-black">Hire Type</span>,
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
    header: () => <span className="font-bold text-black">Pickup Time</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "bookedBy",
    header: () => <span className="font-bold text-black">Booked By</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.bookedBy || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: () => <span className="font-bold text-black">Dispatched By</span>,
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
    header: () => <span className="font-bold text-black">Dispatched Time</span>,
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
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => {
      const vehicle = row.getValue("vehicle") as string;
      const vehicleType = row.original.vehicleType;
      return (
        <div className="space-y-1">
          <span className="font-mono text-sm font-bold">{vehicle}</span>
          <Badge className={`${getVehicleBadgeClass(vehicleType || "")} text-xs`}>
            {vehicleType}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "fareScheme",
    header: () => <span className="font-bold text-black">Fare Scheme</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.fareScheme || "Standard"}
      </Badge>
    ),
  },
];

// Tuk columns
const tukDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "organization",
    header: () => <span className="font-bold text-black">Org</span>,
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
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: () => <span className="font-bold text-black">Passenger</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "hireType",
    header: () => <span className="font-bold text-black">Hire Type</span>,
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
    header: () => <span className="font-bold text-black">Pickup Time</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "bookedBy",
    header: () => <span className="font-bold text-black">Booked By</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.bookedBy || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: () => <span className="font-bold text-black">Dispatched By</span>,
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
    header: () => <span className="font-bold text-black">Dispatched Time</span>,
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
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Tuk Number</span>,
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
    header: () => <span className="font-bold text-black">Fare Scheme</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.fareScheme || "Tuk Standard"}
      </Badge>
    ),
  },
];

// Combined columns
const combinedDispatchedColumns: ColumnDef<DispatchedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Ref ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "source",
    header: () => <span className="font-bold text-black">Source</span>,
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
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("customer")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: () => <span className="font-bold text-black">Contact</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono text-sm">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "pickupTime",
    header: () => <span className="font-bold text-black">Pickup Time</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.getValue("pickupTime")}
      </span>
    ),
  },
  {
    accessorKey: "dispatchedBy",
    header: () => <span className="font-bold text-black">Dispatched By</span>,
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
    header: () => <span className="font-bold text-black">Dispatched Time</span>,
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
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: () => <span className="font-bold text-black">Vehicle Type</span>,
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
    header: () => <span className="font-bold text-black">Vehicle/Tuk #</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold">
        {row.getValue("vehicle")}
      </span>
    ),
  },
];

type SourceFilter = "all" | "Portal" | "App";
type VehicleFilter = "all" | "Tuk" | "nonTuk";

const getColumnSet = (
  sourceFilter: SourceFilter,
  vehicleFilter: VehicleFilter
): "manual" | "tuk" | "combined" => {
  if (sourceFilter === "Portal" && vehicleFilter === "Tuk") {
    return "tuk";
  }
  if (sourceFilter === "Portal" && vehicleFilter === "nonTuk") {
    return "manual";
  }
  return "combined";
};

export default function UnifiedDispatchedReports() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const allBookingsData = useMemo(() => allDispatchedData, []);

  const filteredData = useMemo(() => {
    let result = [...allBookingsData];

    if (sourceFilter === "Portal") {
      result = result.filter((item) => item.source === "Portal");
    } else if (sourceFilter === "App") {
      result = result.filter((item) => item.source === "App");
    }

    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicleType === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicleType !== "Tuk");
    }

    return result;
  }, [allBookingsData, sourceFilter, vehicleFilter]);

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

  const tableFilters = useMemo(() => {
    const filters = [];

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
    doc.setTextColor(34, 197, 94); // Green
    doc.text("Dispatched Bookings Audit Report", 40, 22);

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
    const sourceText = sourceFilter === "all" ? "All Sources" : sourceFilter === "Portal" ? "Manual/Portal" : "App";
    const vehicleText = vehicleFilter === "all" ? "All Vehicles" : vehicleFilter === "Tuk" ? "Tuk Only" : "Cars/Buses Only";
    
    doc.text(`Booking Source: ${sourceText}`, 14, 48);
    doc.text(`Vehicle Category: ${vehicleText}`, 14, 53);
    doc.text(`Total Records in Database: ${allBookingsData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);
    doc.text(`Portal: ${stats.portal} | App: ${stats.app} | Tuk: ${stats.tuk} | Non-Tuk: ${stats.nonTuk}`, 14, 68);

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

    // 5. Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 75,
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`DispatchedReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
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
          row.customer,
          row.contact,
          row.hireType || "N/A",
          row.pickupTime,
          row.pickup,
          row.bookedBy || "N/A",
          row.dispatchedBy,
          row.dispatchedTime,
          row.driver,
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
          row.customer,
          row.contact,
          row.hireType || "N/A",
          row.pickupTime,
          row.pickup,
          row.bookedBy || "N/A",
          row.dispatchedBy,
          row.dispatchedTime,
          row.driver,
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
            row.customer,
            row.contact,
            row.pickupTime,
            row.dispatchedBy,
            row.dispatchedTime,
            row.driver,
            row.vehicleType || "N/A",
            row.vehicle,
          ];
        });
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DispatchedReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

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
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
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
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            <Badge variant="outline" className="self-start">
              {getColumnSet(sourceFilter, vehicleFilter) === "manual"
                ? "13 Columns (Manual Format)"
                : getColumnSet(sourceFilter, vehicleFilter) === "tuk"
                ? "13 Columns (Tuk Format)"
                : "10 Columns (Combined)"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${sourceFilter}-${vehicleFilter}-dispatched`}
            columns={currentColumns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search by customer name..."
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}