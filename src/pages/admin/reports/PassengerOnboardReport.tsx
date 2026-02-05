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
  Clock,
  MapPin,
  MapPinned,
  Navigation,
  Gauge,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type OnboardBooking = {
  id: string;
  refNumber: string;
  customer: string;
  driver: string;
  vehicle: string;
  vehicleType?: string;
  from: string;
  to: string;
  currentLocation: string;
  distance: string;
  eta: string;
  status: "Onboard";
};

// --- Mock Data ---
const rawOnboardData = [
  {
    id: "o1",
    bookingNumber: "295801",
    customer: "Ms. Shiromi",
    driver: "Sunil Silva",
    vehicle: "CAB-1234",
    vehicleClass: "Bus",
    from: "Nawala",
    to: "Fort",
    currentLocation: "Borella Junction",
    distance: "5.2 km",
    eta: "12 mins",
  },
  {
    id: "o2",
    bookingNumber: "295850",
    customer: "John Silva",
    driver: "Kumar Perera",
    vehicle: "LUX-5678",
    vehicleClass: "Luxury",
    from: "Airport",
    to: "Colombo 07",
    currentLocation: "Seeduwa",
    distance: "22.1 km",
    eta: "35 mins",
  },
  {
    id: "o3",
    bookingNumber: "295900",
    customer: "Sarah Connor",
    driver: "Nimal Fernando",
    vehicle: "STD-9012",
    vehicleClass: "STANDARD",
    from: "Bambalapitiya",
    to: "Mount Lavinia",
    currentLocation: "Wellawatte",
    distance: "3.5 km",
    eta: "8 mins",
  },
  {
    id: "to1",
    bookingNumber: "TUK-O001",
    customer: "Kasun Perera",
    driver: "Ranjith Tuk",
    vehicle: "TUK-111",
    vehicleType: "Tuk",
    from: "Pettah",
    to: "Maradana",
    currentLocation: "Technical Junction",
    distance: "1.2 km",
    eta: "4 mins",
  },
  {
    id: "to2",
    bookingNumber: "TUK-O002",
    customer: "Nimali Silva",
    driver: "Fazil Tuk",
    vehicle: "TUK-555",
    vehicleType: "Tuk",
    from: "Borella",
    to: "Rajagiriya",
    currentLocation: "Ayurveda Junction",
    distance: "2.8 km",
    eta: "9 mins",
  },
];

// Transform to unified format (Core Logic preserved)
const regularOnboard = rawOnboardData
  .filter((item) => !item.vehicleType)
  .map((item) => ({
    id: item.id,
    refNumber: item.bookingNumber,
    customer: item.customer,
    driver: item.driver,
    vehicle: item.vehicle,
    vehicleType: item.vehicleClass,
    from: item.from,
    to: item.to,
    currentLocation: item.currentLocation,
    distance: item.distance,
    eta: item.eta,
    status: "Onboard" as const,
  }));

const tukOnboard = rawOnboardData
  .filter((item) => item.vehicleType === "Tuk")
  .map((item) => ({
    id: item.id,
    refNumber: item.bookingNumber,
    customer: item.customer,
    driver: item.driver,
    vehicle: item.vehicle,
    vehicleType: "Tuk",
    from: item.from,
    to: item.to,
    currentLocation: item.currentLocation,
    distance: item.distance,
    eta: item.eta,
    status: "Onboard" as const,
  }));

const allOnboardData = [...regularOnboard, ...tukOnboard];

// Helpers
const getVehicleBadgeClass = (type: string) => {
  const map: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
};

const getETABadgeClass = (eta: string) => {
  const mins = parseInt(eta);
  if (mins <= 10) return "bg-green-100 text-green-800 border-green-300";
  if (mins <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-orange-100 text-orange-800 border-orange-300";
};

// Select column
const selectColumn: ColumnDef<OnboardBooking> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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

// --- NEW PASSENGER ONBOARD COLUMNS ---
const onboardColumns: ColumnDef<OnboardBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: "Booking ID",
    cell: ({ row }) => <span className="font-mono font-medium text-primary">{row.getValue("refNumber")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("customer")}</span>
      </div>
    ),
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => <span className="font-medium">{row.getValue("driver")}</span>,
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    filterFn: (row, id, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const type = row.original.vehicleType as string;
      return (
        <Badge className={getVehicleBadgeClass(type)}>
          {type === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vehicle",
    header: "Vehicle #",
    cell: ({ row }) => <span className="font-mono text-sm">{row.getValue("vehicle")}</span>,
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5 text-green-600" />
        <span className="text-sm">{row.getValue("from")}</span>
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPinned className="h-3.5 w-3.5 text-red-600" />
        <span className="text-sm">{row.getValue("to")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: "Current Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("distance")}</span>
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

type VehicleFilter = "all" | "Tuk" | "nonTuk";

export default function UnifiedOnboardReports() {
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");

  const allBookingsData = useMemo(() => allOnboardData, []);

  const filteredData = useMemo(() => {
    let result = [...allBookingsData];
    if (vehicleFilter === "Tuk") {
      result = result.filter((item) => item.vehicleType === "Tuk");
    } else if (vehicleFilter === "nonTuk") {
      result = result.filter((item) => item.vehicleType !== "Tuk");
    }
    return result;
  }, [allBookingsData, vehicleFilter]);

  const stats = useMemo(() => {
    const all = allBookingsData;
    const urgent = all.filter((d) => parseInt(d.eta) <= 10);
    const near = all.filter((d) => parseInt(d.eta) > 10 && parseInt(d.eta) <= 20);
    const normal = all.filter((d) => parseInt(d.eta) > 20);

    return {
      total: all.length,
      tuk: all.filter((d) => d.vehicleType === "Tuk").length,
      nonTuk: all.filter((d) => d.vehicleType !== "Tuk").length,
      urgent: urgent.length,
      near: near.length,
      normal: normal.length,
      filtered: filteredData.length,
    };
  }, [allBookingsData, filteredData]);

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

  const getTitle = () => {
    if (vehicleFilter === "Tuk") return "Onboard – Tuk Only";
    if (vehicleFilter === "nonTuk") return "Onboard – Non-Tuk";
    return "All Passenger Onboard";
  };

  const getSubtitle = () => `${vehicleFilter === "all" ? "All Vehicles" : vehicleFilter === "Tuk" ? "Tuk Only" : "Non-Tuk"} • ${stats.filtered} active trips`;

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // Green
    doc.text("Passenger Onboard Report", 14, 22);
    autoTable(doc, {
      head: [["Booking ID", "Customer", "Driver", "Vehicle Type", "Vehicle #", "From", "To", "Location", "Distance", "ETA"]],
      body: filteredData.map(item => [item.refNumber, item.customer, item.driver, item.vehicleType || "", item.vehicle, item.from, item.to, item.currentLocation, item.distance, item.eta]),
      startY: 35,
      headStyles: { fillColor: [34, 197, 94] }
    });
    doc.save(`onboard_report.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Booking ID,Customer,Driver,Vehicle Type,Vehicle #,From,To,Location,Distance,ETA"];
    const rows = filteredData.map(r => `${r.refNumber},"${r.customer}","${r.driver}",${r.vehicleType},${r.vehicle},"${r.from}","${r.to}","${r.currentLocation}",${r.distance},${r.eta}`);
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `onboard_report.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Passenger Onboard</h1>
          <p className="text-muted-foreground mt-1">Live tracking of ongoing passenger trips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-green-600 text-green-700" onClick={exportCSV}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={exportPDF}><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-700">Arriving ≤ 10 mins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-700">{stats.urgent}</div></CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-700">11-20 mins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-700">{stats.near}</div></CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-orange-700">&gt; 20 mins</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-700">{stats.normal}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "all" ? "ring-2 ring-green-600 bg-green-50" : ""}`} onClick={() => setVehicleFilter("all")}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">All Vehicles</CardTitle><Layers className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "Tuk" ? "ring-2 ring-yellow-500 bg-yellow-50" : ""}`} onClick={() => setVehicleFilter("Tuk")}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Tuk Only</CardTitle><Car className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.tuk}</div></CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${vehicleFilter === "nonTuk" ? "ring-2 ring-purple-500 bg-purple-50" : ""}`} onClick={() => setVehicleFilter("nonTuk")}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Non-Tuk</CardTitle><Car className="h-4 w-4" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.nonTuk}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div><CardTitle>{getTitle()}</CardTitle><p className="text-sm text-muted-foreground">{getSubtitle()}</p></div>
            <Badge variant="outline">10 Columns</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            key={vehicleFilter}
            columns={onboardColumns}
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