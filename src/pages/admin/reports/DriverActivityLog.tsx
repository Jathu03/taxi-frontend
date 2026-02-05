import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet,
  Users,
  Clock,
  Car,
  MapPin,
  Phone,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type DriverActivity = {
  id: string;
  code: string;
  firstName: string;
  contactNumber: string;
  vehicleCode: string;
  vehicleModel: string;
  lastLocation: string;
  totalOnlineDuration: string;
  // Computed fields
  searchField: string;
  onlineStatus: "Online" | "Offline";
  durationMinutes: number; // For sorting/stats
};

// --- Mock Data ---
const rawActivityData = [
  {
    id: "a1",
    code: "DRV-001",
    firstName: "Sunil",
    contactNumber: "0771234567",
    vehicleCode: "CAB-1234",
    vehicleModel: "Toyota Prius",
    lastLocation: "Colombo 03",
    totalOnlineDuration: "8h 45m",
    onlineStatus: "Online",
    durationMinutes: 525,
  },
  {
    id: "a2",
    code: "DRV-002",
    firstName: "Nimal",
    contactNumber: "0719876543",
    vehicleCode: "ECO-5678",
    vehicleModel: "Suzuki Alto",
    lastLocation: "Nugegoda",
    totalOnlineDuration: "6h 30m",
    onlineStatus: "Online",
    durationMinutes: 390,
  },
  {
    id: "a3",
    code: "DRV-003",
    firstName: "Kamal",
    contactNumber: "0784447788",
    vehicleCode: "VAN-9012",
    vehicleModel: "Toyota KDH",
    lastLocation: "Kandy",
    totalOnlineDuration: "2h 15m",
    onlineStatus: "Offline",
    durationMinutes: 135,
  },
  {
    id: "a4",
    code: "DRV-004",
    firstName: "Saman",
    contactNumber: "0765551234",
    vehicleCode: "LUX-3456",
    vehicleModel: "BMW 520d",
    lastLocation: "Galle",
    totalOnlineDuration: "10h 20m",
    onlineStatus: "Online",
    durationMinutes: 620,
  },
  {
    id: "a5",
    code: "DRV-005",
    firstName: "Ranjith",
    contactNumber: "0723334455",
    vehicleCode: "CAB-7890",
    vehicleModel: "Honda Fit",
    lastLocation: "Negombo",
    totalOnlineDuration: "4h 50m",
    onlineStatus: "Offline",
    durationMinutes: 290,
  },
  {
    id: "a6",
    code: "DRV-006",
    firstName: "Chaminda",
    contactNumber: "0756667788",
    vehicleCode: "TUK-1111",
    vehicleModel: "Bajaj RE",
    lastLocation: "Matara",
    totalOnlineDuration: "1h 30m",
    onlineStatus: "Offline",
    durationMinutes: 90,
  },
  {
    id: "a7",
    code: "DRV-007",
    firstName: "Priyantha",
    contactNumber: "0778889900",
    vehicleCode: "ECO-2222",
    vehicleModel: "Suzuki WagonR",
    lastLocation: "Kurunegala",
    totalOnlineDuration: "7h 15m",
    onlineStatus: "Online",
    durationMinutes: 435,
  },
  {
    id: "a8",
    code: "DRV-008",
    firstName: "Anura",
    contactNumber: "0761112233",
    vehicleCode: "CAB-3333",
    vehicleModel: "Toyota Axio",
    lastLocation: "Colombo 07",
    totalOnlineDuration: "9h 00m",
    onlineStatus: "Online",
    durationMinutes: 540,
  },
  {
    id: "a9",
    code: "DRV-009",
    firstName: "Mahesh",
    contactNumber: "0774445566",
    vehicleCode: "VAN-4444",
    vehicleModel: "Nissan Caravan",
    lastLocation: "Jaffna",
    totalOnlineDuration: "3h 45m",
    onlineStatus: "Offline",
    durationMinutes: 225,
  },
  {
    id: "a10",
    code: "DRV-010",
    firstName: "Ruwan",
    contactNumber: "0712223344",
    vehicleCode: "LUX-5555",
    vehicleModel: "Mercedes E200",
    lastLocation: "Battaramulla",
    totalOnlineDuration: "11h 30m",
    onlineStatus: "Online",
    durationMinutes: 690,
  },
];

// Transform data - add searchField for combined search
const allActivityData: DriverActivity[] = rawActivityData.map((driver) => ({
  ...driver,
  searchField: `${driver.code} ${driver.firstName}`,
  onlineStatus: driver.onlineStatus as "Online" | "Offline",
}));

// --- Badge Helpers ---
const getOnlineStatusBadge = (status: string) => {
  if (status === "Online") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  return "bg-gray-100 text-gray-600 border-gray-200";
};

const getVehicleTypeBadge = (vehicleCode: string) => {
  if (vehicleCode.startsWith("LUX")) return "bg-purple-100 text-purple-800";
  if (vehicleCode.startsWith("VAN")) return "bg-blue-100 text-blue-800";
  if (vehicleCode.startsWith("TUK")) return "bg-yellow-100 text-yellow-800";
  if (vehicleCode.startsWith("ECO")) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

// --- Column Definitions ---
const columns: ColumnDef<DriverActivity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${row.original.onlineStatus === "Online" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
        <span className="font-mono font-semibold text-purple-700">
          {row.getValue("code")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-semibold text-xs">
            {(row.getValue("firstName") as string)[0]}
          </span>
        </div>
        <span className="font-medium">{row.getValue("firstName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-green-600" />
        <span>{row.getValue("contactNumber")}</span>
      </div>
    ),
  },
  {
    accessorKey: "vehicleCode",
    header: "Vehicle Code",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <Badge variant="outline" className={getVehicleTypeBadge(row.getValue("vehicleCode"))}>
        <Car className="h-3 w-3 mr-1" />
        {row.getValue("vehicleCode")}
      </Badge>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle Model",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue("vehicleModel")}</span>
    ),
  },
  {
    accessorKey: "lastLocation",
    header: "Last Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-blue-500" />
        <span>{row.getValue("lastLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalOnlineDuration",
    header: "Total Online Duration",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-orange-500" />
        <Badge variant="secondary" className="font-mono">
          {row.getValue("totalOnlineDuration")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "onlineStatus",
    header: "Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <Badge variant="outline" className={getOnlineStatusBadge(row.getValue("onlineStatus"))}>
        {row.getValue("onlineStatus") === "Online" ? (
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3" /> Online
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <WifiOff className="h-3 w-3" /> Offline
          </span>
        )}
      </Badge>
    ),
  },
];

// --- Filter Types ---
type StatusFilter = "all" | "online" | "offline";

export default function DriverActivityLog() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter data based on selected status
  const filteredData = useMemo(() => {
    let result = [...allActivityData];
    if (statusFilter === "online") {
      result = result.filter((d) => d.onlineStatus === "Online");
    } else if (statusFilter === "offline") {
      result = result.filter((d) => d.onlineStatus === "Offline");
    }
    return result;
  }, [statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMinutes = filteredData.reduce((sum, d) => sum + d.durationMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      total: allActivityData.length,
      online: allActivityData.filter((d) => d.onlineStatus === "Online").length,
      offline: allActivityData.filter((d) => d.onlineStatus === "Offline").length,
      totalDuration: `${hours}h ${minutes}m`,
      avgDuration: filteredData.length > 0 
        ? `${Math.floor(totalMinutes / filteredData.length / 60)}h ${Math.floor((totalMinutes / filteredData.length) % 60)}m`
        : "0h 0m",
    };
  }, [filteredData]);

  // Table filters
  const tableFilters = useMemo(
    () => [
      {
        key: "onlineStatus",
        label: "Status",
        options: [
          { value: "Online", label: "Online" },
          { value: "Offline", label: "Offline" },
        ],
      },
    ],
    []
  );

  // --- Export Functions ---
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Header
    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Driver Activity Log", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} | Total: ${filteredData.length} drivers | Online: ${stats.online}`,
      14,
      22
    );

    // Table
    autoTable(doc, {
      head: [["Code", "First Name", "Contact", "Vehicle Code", "Vehicle Model", "Last Location", "Online Duration"]],
      body: filteredData.map((d) => [
        d.code,
        d.firstName,
        d.contactNumber,
        d.vehicleCode,
        d.vehicleModel,
        d.lastLocation,
        d.totalOnlineDuration,
      ]),
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("driver_activity_log.pdf");
  };

  const exportCSV = () => {
    const headers = "Code,First Name,Contact Number,Vehicle Code,Vehicle Model,Last Location,Total Online Duration,Status";
    const rows = filteredData.map(
      (d) =>
        `${d.code},${d.firstName},${d.contactNumber},${d.vehicleCode},${d.vehicleModel},${d.lastLocation},${d.totalOnlineDuration},${d.onlineStatus}`
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "driver_activity_log.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Driver Activity Log</h1>
          <p className="text-muted-foreground mt-1">Monitor driver online status and activity duration</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "all" ? "ring-2 ring-[#6330B8] bg-purple-50/50" : ""
          }`}
          onClick={() => setStatusFilter("all")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Users className="h-4 w-4 text-[#6330B8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All logged drivers</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "online" ? "ring-2 ring-green-500 bg-green-50/50" : ""
          }`}
          onClick={() => setStatusFilter("online")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Online Now</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "offline" ? "ring-2 ring-gray-500 bg-gray-50/50" : ""
          }`}
          onClick={() => setStatusFilter("offline")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <WifiOff className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.offline}</div>
            <p className="text-xs text-muted-foreground">Currently inactive</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Online Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.avgDuration}</div>
            <p className="text-xs text-muted-foreground">Per driver average</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8]">
            <Activity className="h-5 w-5" />
            Activity Logs
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Wifi className="h-3 w-3 mr-1" /> {stats.online} Online
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {filteredData.length} Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={statusFilter}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search by name or code..."
            enableColumnVisibility={true}
            pageSize={10}
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}