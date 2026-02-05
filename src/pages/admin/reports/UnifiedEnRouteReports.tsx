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
  Navigation,
  MapPin,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
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

// --- Mock Data ---

// ═══════════════════════════════════════════════════════════════════════════
// ENROUTE (Non-Tuk Vehicles)
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// TUK ENROUTE
// ═══════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM DATA TO UNIFIED FORMAT
// ═══════════════════════════════════════════════════════════════════════════

// Regular EnRoute
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

// Tuk EnRoute
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

// Combined data
const allEnRouteData = [
  ...regularEnRouteBookings,
  ...tukEnRouteBookings,
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

const getETABadgeClass = (eta: string) => {
  const minutes = parseInt(eta);
  if (minutes <= 3) return "bg-green-100 text-green-800 border-green-300";
  if (minutes <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-orange-100 text-orange-800 border-orange-300";
};

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// REGULAR ENROUTE COLUMNS (Non-Tuk)
// Columns: Booking ID, Customer, Driver, Vehicle, Pickup, Current Location, ETA
// ═══════════════════════════════════════════════════════════════════════════
const regularEnRouteColumns: ColumnDef<EnRouteBooking>[] = [
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
          {vehicleType && (
            <Badge className={`${getVehicleBadgeClass(vehicleType)} text-xs`}>
              {vehicleType}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "pickup",
    header: "Pickup",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>{row.getValue("pickup")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: "Current Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
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

// ═══════════════════════════════════════════════════════════════════════════
// TUK ENROUTE COLUMNS
// Columns: Booking ID, Customer, Driver, TUK Number, Pickup, Current Location, ETA
// ═══════════════════════════════════════════════════════════════════════════
const tukEnRouteColumns: ColumnDef<EnRouteBooking>[] = [
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
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("driver")}</span>
    ),
  },
  {
    accessorKey: "vehicle",
    header: "TUK Number",
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
    accessorKey: "pickup",
    header: "Pickup",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>{row.getValue("pickup")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: "Current Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
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

// ═══════════════════════════════════════════════════════════════════════════
// COMBINED COLUMNS (All vehicles)
// ═══════════════════════════════════════════════════════════════════════════
const combinedEnRouteColumns: ColumnDef<EnRouteBooking>[] = [
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
  {
    accessorKey: "pickup",
    header: "Pickup",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{row.getValue("pickup")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: "Current Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3 w-3 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
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

// ═══════════════════════════════════════════════════════════════════════════
// FILTER STATE TYPE
// ═══════════════════════════════════════════════════════════════════════════
type VehicleFilter = "all" | "Tuk" | "nonTuk";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function UnifiedEnRouteReports() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  // All data combined
  const allBookingsData = useMemo(() => allEnRouteData, []);

  // Filter data based on vehicle filters
  const filteredData = useMemo(() => {
    let result = [...allBookingsData];

    // Filter by vehicle
    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicleType === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicleType !== "Tuk");
    }

    return result;
  }, [allBookingsData, vehicleFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const all = allBookingsData;
    const tuk = all.filter((d) => d.vehicleType === "Tuk");
    const nonTuk = all.filter((d) => d.vehicleType !== "Tuk");
    
    // ETA stats
    const urgent = all.filter(d => parseInt(d.eta) <= 3);
    const near = all.filter(d => parseInt(d.eta) > 3 && parseInt(d.eta) <= 7);
    const approaching = all.filter(d => parseInt(d.eta) > 7);

    return {
      total: all.length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      urgent: urgent.length,
      near: near.length,
      approaching: approaching.length,
      filtered: filteredData.length,
    };
  }, [allBookingsData, filteredData]);

  // Get columns based on current filter state
  const currentColumns = useMemo(() => {
    if (vehicleFilter === "Tuk") {
      return tukEnRouteColumns;
    } else if (vehicleFilter === "nonTuk") {
      return regularEnRouteColumns;
    }
    return combinedEnRouteColumns;
  }, [vehicleFilter]);

  // Get dynamic filters for the table
  const tableFilters = useMemo(() => {
    const filters = [];

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

    return filters;
  }, []);

  // Get title based on filters
  const getTitle = () => {
    if (vehicleFilter === "Tuk") {
      return "Tuk EnRoute";
    }
    if (vehicleFilter === "nonTuk") {
      return "EnRoute (Non-Tuk)";
    }
    return "All EnRoute Bookings";
  };

  // Get subtitle
  const getSubtitle = () => {
    const parts = [];
    
    if (vehicleFilter === "all") parts.push("All Vehicles");
    else if (vehicleFilter === "Tuk") parts.push("Tuk Only");
    else parts.push("Non-Tuk");

    parts.push(`${stats.filtered} active`);
    parts.push(`${stats.urgent} arriving soon`);

    return parts.join(" • ");
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue for enroute
    doc.text("EnRoute Booking Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`View: ${getTitle()}`, 14, 36);
    doc.text(`Total Records: ${filteredData.length}`, 14, 42);

    let tableColumn: string[];
    let tableRows: string[][];

    if (vehicleFilter === "Tuk") {
      tableColumn = [
        "Booking ID",
        "Customer",
        "Driver",
        "TUK Number",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      tableRows = filteredData.map((item) => [
        item.refNumber,
        item.customer,
        item.driver,
        item.vehicle,
        item.pickup,
        item.currentLocation,
        item.eta,
      ]);
    } else if (vehicleFilter === "nonTuk") {
      tableColumn = [
        "Booking ID",
        "Customer",
        "Driver",
        "Vehicle",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      tableRows = filteredData.map((item) => [
        item.refNumber,
        item.customer,
        item.driver,
        `${item.vehicle} (${item.vehicleType})`,
        item.pickup,
        item.currentLocation,
        item.eta,
      ]);
    } else {
      tableColumn = [
        "Booking ID",
        "Customer",
        "Driver",
        "Vehicle Type",
        "Vehicle #",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      tableRows = filteredData.map((item) => [
        item.refNumber,
        item.customer,
        item.driver,
        item.vehicleType || "N/A",
        item.vehicle,
        item.pickup,
        item.currentLocation,
        item.eta,
      ]);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 48,
      headStyles: {
        fillColor: [59, 130, 246], // Blue for enroute
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
    });

    doc.save(`enroute_report_${vehicleFilter}.pdf`);
  };

  // CSV Export
  const exportCSV = () => {
    let headers: string[];
    let rows: string[][];

    if (vehicleFilter === "Tuk") {
      headers = [
        "Booking ID",
        "Customer",
        "Driver",
        "TUK Number",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      rows = filteredData.map((row) => [
        row.refNumber,
        `"${row.customer}"`,
        `"${row.driver}"`,
        row.vehicle,
        `"${row.pickup}"`,
        `"${row.currentLocation}"`,
        row.eta,
      ]);
    } else if (vehicleFilter === "nonTuk") {
      headers = [
        "Booking ID",
        "Customer",
        "Driver",
        "Vehicle",
        "Vehicle Type",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      rows = filteredData.map((row) => [
        row.refNumber,
        `"${row.customer}"`,
        `"${row.driver}"`,
        row.vehicle,
        row.vehicleType || "N/A",
        `"${row.pickup}"`,
        `"${row.currentLocation}"`,
        row.eta,
      ]);
    } else {
      headers = [
        "Booking ID",
        "Customer",
        "Driver",
        "Vehicle Type",
        "Vehicle #",
        "Pickup",
        "Current Location",
        "ETA",
      ];
      rows = filteredData.map((row) => [
        row.refNumber,
        `"${row.customer}"`,
        `"${row.driver}"`,
        row.vehicleType || "N/A",
        row.vehicle,
        `"${row.pickup}"`,
        `"${row.currentLocation}"`,
        row.eta,
      ]);
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
      `enroute_report_${vehicleFilter}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset all filters
  const resetFilters = () => {
    setVehicleFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50/30 to-sky-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            EnRoute Bookings Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Live tracking of all vehicles currently enroute to pickup
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-blue-600 text-blue-700 hover:bg-blue-50"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={exportPDF}
          >
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* ETA Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Arriving Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.urgent}</div>
            <p className="text-xs text-green-600">≤ 3 minutes</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Near Pickup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-yellow-600">4-7 minutes</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Approaching
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.approaching}</div>
            <p className="text-xs text-orange-600">&gt; 7 minutes</p>
          </CardContent>
        </Card>
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
                ? "ring-2 ring-blue-600 bg-blue-50/50 border-blue-600"
                : "hover:bg-blue-50/30"
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
                    ? "text-blue-600"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All vehicle types enroute
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
                Three-wheelers enroute
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
                Regular vehicles enroute
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
            <Navigation className="h-3 w-3 text-blue-600" />
            EnRoute
          </Badge>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary" className="gap-1">
            <Car className="h-3 w-3" />
            {vehicleFilter === "all"
              ? "All Vehicles"
              : vehicleFilter === "Tuk"
              ? "Tuk Only"
              : "Non-Tuk"}
          </Badge>
          <span className="text-muted-foreground">=</span>
          <Badge className="bg-blue-600">{stats.filtered} active</Badge>
        </div>
        {vehicleFilter !== "all" && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filter
          </Button>
        )}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                {getTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getSubtitle()}
              </p>
            </div>
            {/* Column set indicator */}
            <Badge variant="outline" className="self-start">
              {vehicleFilter === "Tuk"
                ? "7 Columns (Tuk Format)"
                : vehicleFilter === "nonTuk"
                ? "7 Columns (Regular Format)"
                : "8 Columns (Combined)"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key forces re-render when filters change */}
          <EnhancedDataTable
            key={`${vehicleFilter}-enroute`}
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