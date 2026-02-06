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
  Car,
  Clock,
  MapPin,
  MapPinned,
  Navigation,
  Gauge,
  User,
  Printer,
  Filter,
  Radio,
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

// --- PASSENGER ONBOARD COLUMNS ---
const onboardColumns: ColumnDef<OnboardBooking>[] = [
  selectColumn,
  {
    accessorKey: "refNumber",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => <span className="font-mono font-medium text-primary">{row.getValue("refNumber")}</span>,
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
    accessorKey: "driver",
    header: () => <span className="font-bold text-black">Driver</span>,
    cell: ({ row }) => <span className="font-medium">{row.getValue("driver")}</span>,
  },
  {
    accessorKey: "vehicleType",
    header: () => <span className="font-bold text-black">Vehicle Type</span>,
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
    header: () => <span className="font-bold text-black">Vehicle #</span>,
    cell: ({ row }) => <span className="font-mono text-sm font-bold">{row.getValue("vehicle")}</span>,
  },
  {
    accessorKey: "from",
    header: () => <span className="font-bold text-black">From</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5 text-green-600" />
        <span className="text-sm">{row.getValue("from")}</span>
      </div>
    ),
  },
  {
    accessorKey: "to",
    header: () => <span className="font-bold text-black">To</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPinned className="h-3.5 w-3.5 text-red-600" />
        <span className="text-sm">{row.getValue("to")}</span>
      </div>
    ),
  },
  {
    accessorKey: "currentLocation",
    header: () => <span className="font-bold text-black">Current Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Navigation className="h-3.5 w-3.5 text-blue-500" />
        <span className="text-sm">{row.getValue("currentLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "distance",
    header: () => <span className="font-bold text-black">Distance</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{row.getValue("distance")}</span>
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
    doc.text("Passenger Onboard Audit Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35); // Horizontal line

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");
    const vehicleText =
      vehicleFilter === "all"
        ? "All Vehicles"
        : vehicleFilter === "Tuk"
        ? "Tuk Only"
        : "Non-Tuk Vehicles";

    doc.text(`Vehicle Category Filter: ${vehicleText}`, 14, 48);
    doc.text(`Total Records in Database: ${allBookingsData.length}`, 14, 53);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 58);

    // 5. Table
    autoTable(doc, {
      head: [["Booking ID", "Customer", "Driver", "Vehicle Type", "Vehicle #", "From", "To", "Location", "Distance", "ETA"]],
      body: filteredData.map((item) => [
        item.refNumber,
        item.customer,
        item.driver,
        item.vehicleType || "",
        item.vehicle,
        item.from,
        item.to,
        item.currentLocation,
        item.distance,
        item.eta,
      ]),
      startY: 65,
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`OnboardReport_${vehicleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // --- Export CSV ---
  const exportCSV = () => {
    const headers = ["Booking ID", "Customer", "Driver", "Vehicle Type", "Vehicle #", "From", "To", "Current Location", "Distance", "ETA"];
    const rows = filteredData.map((r) =>
      [r.refNumber, r.customer, r.driver, r.vehicleType || "", r.vehicle, r.from, r.to, r.currentLocation, r.distance, r.eta]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `OnboardReport_${vehicleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  const getTitle = () => {
    if (vehicleFilter === "Tuk") return "Onboard – Tuk Only";
    if (vehicleFilter === "nonTuk") return "Onboard – Non-Tuk";
    return "All Passenger Onboard";
  };

  const getSubtitle = () => `${vehicleFilter === "all" ? "All Vehicles" : vehicleFilter === "Tuk" ? "Tuk Only" : "Non-Tuk"} • ${stats.filtered} active trips`;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Passenger Onboard</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {vehicleFilter !== "all" && ` (filtered by ${vehicleFilter})`}
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
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => generateReport("save")}>
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* ETA Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-green-700">Arriving ≤ 10 mins</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Urgent arrivals</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-yellow-700">11-20 mins</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.near}</div>
            <p className="text-xs text-muted-foreground">Near arrivals</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-orange-700">&gt; 20 mins</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.normal}</div>
            <p className="text-xs text-muted-foreground">Standard arrivals</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Filter Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            vehicleFilter === "all" ? "ring-2 ring-green-600 bg-green-50" : ""
          }`}
          onClick={() => setVehicleFilter("all")}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">All Vehicles</CardTitle>
            <Layers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total onboard trips</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            vehicleFilter === "Tuk" ? "ring-2 ring-yellow-500 bg-yellow-50" : ""
          }`}
          onClick={() => setVehicleFilter("Tuk")}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Tuk Only</CardTitle>
            <Car className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tuk}</div>
            <p className="text-xs text-muted-foreground">Tuk-tuk trips</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            vehicleFilter === "nonTuk" ? "ring-2 ring-purple-500 bg-purple-50" : ""
          }`}
          onClick={() => setVehicleFilter("nonTuk")}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Non-Tuk</CardTitle>
            <Car className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nonTuk}</div>
            <p className="text-xs text-muted-foreground">Car/Van/Bus trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1" /> Quick Filter:
        </span>
        <Button
          variant={vehicleFilter === "all" ? "default" : "outline"}
          onClick={() => setVehicleFilter("all")}
          className={vehicleFilter === "all" ? "bg-green-600" : ""}
          size="sm"
        >
          <Layers className="mr-2 h-4 w-4" /> All Vehicles
        </Button>
        <Button
          variant={vehicleFilter === "Tuk" ? "default" : "outline"}
          onClick={() => setVehicleFilter("Tuk")}
          className={vehicleFilter === "Tuk" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
          size="sm"
        >
          <Radio className="mr-2 h-4 w-4" /> Tuk Only
        </Button>
        <Button
          variant={vehicleFilter === "nonTuk" ? "default" : "outline"}
          onClick={() => setVehicleFilter("nonTuk")}
          className={vehicleFilter === "nonTuk" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
          size="sm"
        >
          <Car className="mr-2 h-4 w-4" /> Cars/Buses Only
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-green-700">{getTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{getSubtitle()}</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              <Radio className="h-3 w-3 mr-1" /> Live Tracking
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleFilter}
            columns={onboardColumns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search customer, driver, or location..."
          />
        </CardContent>
      </Card>
    </div>
  );
}