"use client";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Layers,
  Smartphone,
  Globe,
  Car,
  User,
  Clock,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
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
];

// Transform data
const portalDispatchedBookings: DispatchedBooking[] = portalDispatchedData.map(
  (item) => ({
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
  })
);

const tukDispatchedBookings: DispatchedBooking[] = tukDispatchedData.map(
  (item) => ({
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
  })
);

const appDispatchedBookings: DispatchedBooking[] = appDispatchedData.map(
  (item) => ({
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
  })
);

const tukAppDispatchedBookings: DispatchedBooking[] = tukAppDispatchedData.map(
  (item) => ({
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
  })
);

const allDispatchedData: DispatchedBooking[] = [
  ...portalDispatchedBookings,
  ...tukDispatchedBookings,
  ...appDispatchedBookings,
  ...tukAppDispatchedBookings,
];

// ============================================
// HELPER FUNCTIONS
// ============================================
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

// ============================================
// TABLE COLUMNS
// ============================================
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

const tableColumns: ColumnDef<DispatchedBooking>[] = [
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
      <span className="text-sm font-medium">{row.getValue("pickupTime")}</span>
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
        <span className="text-sm">{row.getValue("dispatchedTime")}</span>
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

// ============================================
// PDF COLUMNS
// ============================================
const pdfColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  { header: "Source", dataKey: "source" },
  { header: "Customer", dataKey: "customer" },
  { header: "Contact", dataKey: "contact" },
  { header: "Pickup Time", dataKey: "pickupTime" },
  { header: "Dispatched By", dataKey: "dispatchedBy" },
  { header: "Dispatched Time", dataKey: "dispatchedTime" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
];

// ============================================
// CSV COLUMNS
// ============================================
const csvColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  {
    header: "Source",
    dataKey: "source",
    formatter: (value: string, row: DispatchedBooking) => {
      const isTuk = row.vehicleType === "Tuk";
      if (row.source === "App") {
        return isTuk
          ? `Tuk App (${row.platform})`
          : `App (${row.platform})`;
      }
      return isTuk ? "Tuk (Manual)" : "Manual/Portal";
    },
  },
  { header: "Customer", dataKey: "customer" },
  { header: "Contact", dataKey: "contact" },
  { header: "Pickup Time", dataKey: "pickupTime" },
  { header: "Dispatched By", dataKey: "dispatchedBy" },
  { header: "Dispatched Time", dataKey: "dispatchedTime" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Organization", dataKey: "organization" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Pickup Address", dataKey: "pickup" },
  { header: "Booked By", dataKey: "bookedBy" },
  { header: "Fare Scheme", dataKey: "fareScheme" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function DispatchedStatistics() {
  const stats = useMemo(() => {
    const portal = allDispatchedData.filter((d) => d.source === "Portal");
    const app = allDispatchedData.filter((d) => d.source === "App");
    const tuk = allDispatchedData.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = allDispatchedData.filter((d) => d.vehicleType !== "Tuk");

    return {
      total: allDispatchedData.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicleType === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicleType !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicleType === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicleType !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
    };
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Source Statistics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Source
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All Sources</CardTitle>
              <Layers className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Combined view of all sources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manual / Portal
              </CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portal}</div>
              <p className="text-xs text-muted-foreground">
                {stats.portalNonTuk} regular + {stats.portalTuk} tuk
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">App</CardTitle>
              <Smartphone className="h-4 w-4 text-emerald-500" />
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

      {/* Vehicle Type Statistics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Filter by Vehicle Type
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                All Vehicles
              </CardTitle>
              <Layers className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All vehicle types dispatched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
              <Car className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tuk}</div>
              <p className="text-xs text-muted-foreground">
                Three-wheeler dispatched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cars & Buses
              </CardTitle>
              <Car className="h-4 w-4 text-purple-500" />
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
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DispatchedBookingsReport() {
  return (
    <div className="space-y-6">
      <DispatchedStatistics />

      <ReportPageTemplate
        title="Dispatched Bookings Audit Report"
        data={allDispatchedData}
        tableColumns={tableColumns}
        pdfColumns={pdfColumns}
        csvColumns={csvColumns}
        searchKey="customer"
        fileName="DispatchedBookings.pdf"
        filters={[
          {
            key: "source",
            label: "Booking Source",
            options: [
              { label: "All Sources", value: "all" },
              { label: "Manual / Portal", value: "Portal" },
              { label: "App", value: "App" },
            ],
            defaultValue: "all",
          },
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: [
              { label: "All Vehicles", value: "all" },
              { label: "Tuk", value: "Tuk" },
              { label: "Bus", value: "Bus" },
              { label: "Luxury", value: "Luxury" },
              { label: "Economy", value: "ECONOMY" },
              { label: "Standard", value: "STANDARD" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}