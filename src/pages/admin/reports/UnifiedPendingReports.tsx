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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
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

const allPendingData: UnifiedBooking[] = [
  ...portalBookings,
  ...tukPendingBookings,
  ...appBookings,
  ...tukAppBookings,
];

// ============================================
// HELPER FUNCTIONS
// ============================================
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

// ============================================
// TABLE COLUMNS
// ============================================
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

const tableColumns: ColumnDef<UnifiedBooking>[] = [
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

// ============================================
// PDF COLUMNS
// ============================================
const pdfColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  { header: "Source", dataKey: "source" },
  { header: "Customer", dataKey: "customer" },
  { header: "Contact", dataKey: "contact" },
  { header: "Pickup", dataKey: "pickup" },
  { header: "Drop", dataKey: "drop" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Date/Time", dataKey: "dateTime" },
];

// ============================================
// CSV COLUMNS
// ============================================
const csvColumns = [
  { header: "Ref ID", dataKey: "refNumber" },
  {
    header: "Source",
    dataKey: "source",
    formatter: (value: string, row: UnifiedBooking) => {
      const isTuk = row.vehicle === "Tuk";
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
  { header: "Pickup", dataKey: "pickup" },
  { header: "Drop", dataKey: "drop" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Date/Time", dataKey: "dateTime" },
  { header: "Organization", dataKey: "organization" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Client Remarks", dataKey: "clientRemarks" },
  { header: "Booked By", dataKey: "bookedBy" },
  { header: "Is Advance", dataKey: "isAdvance" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function PendingStatistics() {
  const stats = useMemo(() => {
    const portal = allPendingData.filter((d) => d.source === "Portal");
    const app = allPendingData.filter((d) => d.source === "App");
    const tuk = allPendingData.filter((d) => d.vehicle === "Tuk");
    const nonTuk = allPendingData.filter((d) => d.vehicle !== "Tuk");

    return {
      total: allPendingData.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.vehicle === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.vehicle !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.vehicle === "Tuk").length,
      appNonTuk: app.filter((d) => d.vehicle !== "Tuk").length,
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
              <Layers className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Combined view (intersection columns)
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
              <Smartphone className="h-4 w-4 text-green-500" />
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
              <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
              <Layers className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All vehicle types</p>
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
                Three-wheeler bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cars & Buses</CardTitle>
              <Car className="h-4 w-4 text-purple-500" />
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
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PendingBookingsReport() {
  return (
    <div className="space-y-6">
      <PendingStatistics />

      <ReportPageTemplate
        title="Pending Bookings Audit Report"
        data={allPendingData}
        tableColumns={tableColumns}
        pdfColumns={pdfColumns}
        csvColumns={csvColumns}
        searchKey="customer"
        fileName="PendingBookings.pdf"
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
            key: "vehicle",
            label: "Vehicle Class",
            options: [
              { label: "All Vehicles", value: "all" },
              { label: "Bus", value: "Bus" },
              { label: "Luxury", value: "Luxury" },
              { label: "Economy", value: "ECONOMY" },
              { label: "Standard", value: "STANDARD" },
              { label: "Tuk", value: "Tuk" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}