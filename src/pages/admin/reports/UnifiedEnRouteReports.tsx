"use client";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Layers,
  Car,
  Navigation,
  MapPin,
  Clock,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
export type EnRouteBooking = {
  id: string;
  refNumber: string;
  customer: string;
  driver: string;
  vehicle: string;
  vehicleType?: string;
  pickup: string;
  currentLocation: string;
  eta: string;
  status: "EnRoute";
};

// ============================================
// MOCK DATA
// ============================================
const enRouteData = [
  {
    id: "e1",
    bookingNumber: "295105",
    customer: "Ms. Shiromi",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
    pickupAddress: "Nawala",
    currentLocation: "Rajagiriya Junction",
    eta: "5 mins",
  },
  {
    id: "e2",
    bookingNumber: "295651",
    customer: "John Silva",
    driver: "Kumar Perera",
    vehicle: "LUX-5678",
    vehicleClass: "Luxury",
    pickupAddress: "Airport",
    currentLocation: "Seeduwa",
    eta: "12 mins",
  },
  {
    id: "e3",
    bookingNumber: "295701",
    customer: "Sarah Connor",
    driver: "Nimal Fernando",
    vehicle: "STD-9012",
    vehicleClass: "STANDARD",
    pickupAddress: "Colombo 07",
    currentLocation: "Liberty Plaza",
    eta: "3 mins",
  },
  {
    id: "e4",
    bookingNumber: "295751",
    customer: "Mike Ross",
    driver: "Kamal Silva",
    vehicle: "ECO-3456",
    vehicleClass: "ECONOMY",
    pickupAddress: "Rajagiriya",
    currentLocation: "Battaramulla",
    eta: "8 mins",
  },
  {
    id: "e5",
    bookingNumber: "APP-E001",
    customer: "David Lee",
    driver: "Asanka Silva",
    vehicle: "ECO-7890",
    vehicleClass: "ECONOMY",
    pickupAddress: "Galle Face",
    currentLocation: "Kollupitiya Junction",
    eta: "6 mins",
  },
  {
    id: "e6",
    bookingNumber: "APP-E002",
    customer: "Sophia Wang",
    driver: "Bandara Perera",
    vehicle: "STD-4567",
    vehicleClass: "STANDARD",
    pickupAddress: "Fort",
    currentLocation: "Pettah Bus Stand",
    eta: "10 mins",
  },
  {
    id: "e7",
    bookingNumber: "APP-E003",
    customer: "James Wilson",
    driver: "Chaminda Fernando",
    vehicle: "LUX-1234",
    vehicleClass: "Luxury",
    pickupAddress: "Bambalapitiya",
    currentLocation: "Wellawatte",
    eta: "7 mins",
  },
  {
    id: "e8",
    bookingNumber: "APP-E004",
    customer: "Emma Davis",
    driver: "Dinesh Kumar",
    vehicle: "BUS-5678",
    vehicleClass: "Bus",
    pickupAddress: "Wellawatte",
    currentLocation: "Dehiwala Junction",
    eta: "15 mins",
  },
];

const tukEnRouteData = [
  {
    id: "te1",
    bookingNumber: "TUK-E001",
    customer: "Kumara Bandara",
    driver: "Ranjith Tuk",
    tukNumber: "TUK-111",
    pickupAddress: "Pettah",
    currentLocation: "Manning Market",
    eta: "2 mins",
  },
  {
    id: "te2",
    bookingNumber: "TUK-E002",
    customer: "Nimal Perera",
    driver: "Sunil Tuk",
    tukNumber: "TUK-222",
    pickupAddress: "Maradana",
    currentLocation: "Technical Junction",
    eta: "4 mins",
  },
  {
    id: "te3",
    bookingNumber: "TUK-E003",
    customer: "Sunil Fernando",
    driver: "Kamal Tuk",
    tukNumber: "TUK-333",
    pickupAddress: "Borella",
    currentLocation: "Punchi Borella",
    eta: "1 min",
  },
  {
    id: "te4",
    bookingNumber: "TAPP-E001",
    customer: "Kasun Perera",
    driver: "Eranga Tuk",
    tukNumber: "TUK-444",
    pickupAddress: "Pettah",
    currentLocation: "Old Town Hall",
    eta: "3 mins",
  },
  {
    id: "te5",
    bookingNumber: "TAPP-E002",
    customer: "Nimali Silva",
    driver: "Fazil Tuk",
    tukNumber: "TUK-555",
    pickupAddress: "Borella",
    currentLocation: "Borella Cemetery",
    eta: "2 mins",
  },
  {
    id: "te6",
    bookingNumber: "TAPP-E003",
    customer: "Ranjith Fernando",
    driver: "Gayan Tuk",
    tukNumber: "TUK-666",
    pickupAddress: "Maradana",
    currentLocation: "Dematagoda",
    eta: "5 mins",
  },
];

// Transform data
const regularEnRouteBookings: EnRouteBooking[] = enRouteData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  customer: item.customer,
  driver: item.driver,
  vehicle: item.vehicle,
  vehicleType: item.vehicleClass,
  pickup: item.pickupAddress,
  currentLocation: item.currentLocation,
  eta: item.eta,
  status: "EnRoute" as const,
}));

const tukEnRouteBookings: EnRouteBooking[] = tukEnRouteData.map((item) => ({
  id: item.id,
  refNumber: item.bookingNumber,
  customer: item.customer,
  driver: item.driver,
  vehicle: item.tukNumber,
  vehicleType: "Tuk",
  pickup: item.pickupAddress,
  currentLocation: item.currentLocation,
  eta: item.eta,
  status: "EnRoute" as const,
}));

const allEnRouteData: EnRouteBooking[] = [
  ...regularEnRouteBookings,
  ...tukEnRouteBookings,
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

const getETABadgeClass = (eta: string) => {
  const minutes = parseInt(eta);
  if (minutes <= 3) return "bg-green-100 text-green-800 border-green-300";
  if (minutes <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-orange-100 text-orange-800 border-orange-300";
};

// ============================================
// TABLE COLUMNS
// ============================================
const selectColumn: ColumnDef<EnRouteBooking> = {
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

const tableColumns: ColumnDef<EnRouteBooking>[] = [
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
  {
    accessorKey: "pickup",
    header: () => <span className="font-bold text-black">Pickup</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue("pickup")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: () => <span className="font-bold text-black">Current Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "eta",
    header: () => <span className="font-bold text-black">ETA</span>,
    cell: ({ row }) => {
      const eta = row.getValue("eta") as string;
      return (
        <Badge variant="outline" className={getETABadgeClass(eta)}>
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </Badge>
      );
    },
  },
];

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Booking ID", dataKey: "refNumber" },
  { header: "Customer", dataKey: "customer" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Vehicle #", dataKey: "vehicle" },
  { header: "Pickup", dataKey: "pickup" },
  { header: "Current Location", dataKey: "currentLocation" },
  { header: "ETA", dataKey: "eta" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function EnRouteStatistics() {
  const stats = useMemo(() => {
    const tuk = allEnRouteData.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = allEnRouteData.filter((d) => d.vehicleType !== "Tuk");

    const urgent = allEnRouteData.filter((d) => parseInt(d.eta) <= 3);
    const near = allEnRouteData.filter(
      (d) => parseInt(d.eta) > 3 && parseInt(d.eta) <= 7
    );
    const approaching = allEnRouteData.filter((d) => parseInt(d.eta) > 7);

    return {
      total: allEnRouteData.length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      urgent: urgent.length,
      near: near.length,
      approaching: approaching.length,
    };
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* ETA Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Arriving Soon
            </CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.urgent}</div>
            <p className="text-xs text-green-600">≤ 3 minutes</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Near Pickup
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-yellow-600">4-7 minutes</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Approaching
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {stats.approaching}
            </div>
            <p className="text-xs text-orange-600">&gt; 7 minutes</p>
          </CardContent>
        </Card>
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
              <Layers className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All vehicle types enroute
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
                Three-wheelers enroute
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
                Regular vehicles enroute
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
export default function EnRouteBookingsReport() {
  return (
    <div className="space-y-6">
      <EnRouteStatistics />

      <ReportPageTemplate
        title="EnRoute Bookings Audit Report"
        data={allEnRouteData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="customer"
        fileName="EnRouteBookings.pdf"
        filters={[
          {
            key: "vehicleType",
            label: "Vehicle Type",
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