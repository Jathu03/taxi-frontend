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
  Printer,
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

// Transform data
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

const allData = [
  ...portalBookings,
  ...tukPendingBookings,
  ...appBookings,
  ...tukAppBookings,
];

// Helper functions
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

// Manual columns
const manualColumns: ColumnDef<UnifiedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking #</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
      </span>
    ),
  },
  {
    accessorKey: "isAdvance",
    header: () => <span className="font-bold text-black">Is Adv</span>,
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
    header: () => <span className="font-bold text-black">Organization</span>,
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
    header: () => <span className="font-bold text-black">Passenger #</span>,
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
    accessorKey: "clientRemarks",
    header: () => <span className="font-bold text-black">Client Remarks</span>,
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
    header: () => <span className="font-bold text-black">Booking Time</span>,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.bookingTime || "N/A"}</span>
    ),
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
    accessorKey: "pickupTime",
    header: () => <span className="font-bold text-black">Pickup Time</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.pickupTime || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "drop",
    header: () => <span className="font-bold text-black">Drop Address</span>,
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
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

// App columns
const appColumns: ColumnDef<UnifiedBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("refNumber")}
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
    header: () => <span className="font-bold text-black">Phone</span>,
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">
        {row.getValue("contact")}
      </span>
    ),
  },
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup</span>,
  },
  {
    accessorKey: "drop",
    header: () => <span className="font-bold text-black">Drop</span>,
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
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
    header: () => <span className="font-bold text-black">Time</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("dateTime")}
      </span>
    ),
  },
  {
    accessorKey: "platform",
    header: () => <span className="font-bold text-black">Platform</span>,
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

// Combined columns
const combinedColumns: ColumnDef<UnifiedBooking>[] = [
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
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup</span>,
  },
  {
    accessorKey: "drop",
    header: () => <span className="font-bold text-black">Drop</span>,
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
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
    header: () => <span className="font-bold text-black">Date/Time</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("dateTime")}
      </span>
    ),
  },
];

type SourceFilter = "all" | "Portal" | "App";
type VehicleFilter = "all" | "Tuk" | "nonTuk";

const getColumnSet = (
  sourceFilter: SourceFilter,
  vehicleFilter: VehicleFilter
): "manual" | "app" | "combined" => {
  if (sourceFilter === "Portal") {
    return "manual";
  }
  if (sourceFilter === "App") {
    return "app";
  }
  return "combined";
};

export default function UnifiedPendingReports() {
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const allBookingsData = useMemo(() => allData, []);

  const filteredData = useMemo(() => {
    let result = [...allBookingsData];

    if (sourceFilter === "Portal") {
      result = result.filter((item) => item.source === "Portal");
    } else if (sourceFilter === "App") {
      result = result.filter((item) => item.source === "App");
    }

    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicle === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicle !== "Tuk");
    }

    return result;
  }, [allBookingsData, sourceFilter, vehicleFilter]);

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
      key: "vehicle",
      label: "Vehicle Class",
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
    doc.text("Pending Bookings Audit Report", 40, 22);

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
      doc.save(`PendingReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.pdf`);
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
          String(row.refNumber),
          String(row.isAdvance || "No"),
          String(row.organization || "Individual"),
          String(row.customer),
          String(row.contact),
          String(row.hireType || "N/A"),
          String(row.clientRemarks || ""),
          String(row.bookingTime || "N/A"),
          String(row.bookedBy || "N/A"),
          String(row.pickupTime || "N/A"),
          String(row.pickup),
          String(row.drop),
          String(row.vehicle),
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
          String(row.refNumber),
          String(row.customer),
          String(row.contact),
          String(row.pickup),
          String(row.drop),
          String(row.vehicle),
          String(row.dateTime),
          String(row.platform || "N/A"),
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
            String(row.refNumber),
            String(sourceLabel),
            String(row.customer),
            String(row.contact),
            String(row.pickup),
            String(row.drop),
            String(row.vehicle),
            String(row.dateTime),
          ];
        });
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PendingReport_${sourceFilter}_${vehicleFilter}_${new Date().getTime()}.csv`;
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
            Pending Bookings Report
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
                Combined view (intersection columns)
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
                Three-wheeler bookings
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
              <CardTitle className="text-lg">{getTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            <Badge variant="outline" className="self-start">
              {getColumnSet(sourceFilter, vehicleFilter) === "manual"
                ? "13 Columns (Manual Format)"
                : getColumnSet(sourceFilter, vehicleFilter) === "app"
                ? "8 Columns (App Format)"
                : "8 Columns (Combined/Intersection)"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${sourceFilter}-${vehicleFilter}`}
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