"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Car,
  MapPin,
  Phone,
  Wifi,
  WifiOff,
  Users,
} from "lucide-react";
import { useMemo } from "react";

// ============================================
// TYPE DEFINITION
// ============================================
export type DriverActivity = {
  id: string;
  code: string;
  firstName: string;
  contactNumber: string;
  vehicleCode: string;
  vehicleModel: string;
  lastLocation: string;
  totalOnlineDuration: string;
  searchField?: string;
  onlineStatus: "Online" | "Offline";
  durationMinutes: number;
};

// ============================================
// MOCK DATA
// ============================================
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

const allActivityData: DriverActivity[] = rawActivityData.map((driver) => ({
  ...driver,
  searchField: `${driver.code} ${driver.firstName} ${driver.vehicleCode}`,
  onlineStatus: driver.onlineStatus as "Online" | "Offline",
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
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

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<DriverActivity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${row.original.onlineStatus === "Online"
              ? "bg-green-500 animate-pulse"
              : "bg-gray-400"
            }`}
        />
        <span className="font-mono font-semibold text-purple-700">
          {row.getValue("code")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <span className="font-bold text-black">First Name</span>,
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
    header: () => <span className="font-bold text-black">Contact Number</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-green-600" />
        <span>{row.getValue("contactNumber")}</span>
      </div>
    ),
  },
  {
    accessorKey: "vehicleCode",
    header: () => <span className="font-bold text-black">Vehicle Code</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getVehicleTypeBadge(row.getValue("vehicleCode"))}
      >
        <Car className="h-3 w-3 mr-1" />
        {row.getValue("vehicleCode")}
      </Badge>
    ),
  },
  {
    accessorKey: "vehicleModel",
    header: () => <span className="font-bold text-black">Vehicle Model</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("vehicleModel")}
      </span>
    ),
  },
  {
    accessorKey: "lastLocation",
    header: () => <span className="font-bold text-black">Last Location</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-blue-500" />
        <span>{row.getValue("lastLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "totalOnlineDuration",
    header: () => <span className="font-bold text-black">Total Online Duration</span>,
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
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getOnlineStatusBadge(row.getValue("onlineStatus"))}
      >
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

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Code", dataKey: "code" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Contact Number", dataKey: "contactNumber" },
  { header: "Vehicle Code", dataKey: "vehicleCode" },
  { header: "Vehicle Model", dataKey: "vehicleModel" },
  { header: "Last Location", dataKey: "lastLocation" },
  { header: "Total Online Duration", dataKey: "totalOnlineDuration" },
  { header: "Status", dataKey: "onlineStatus" },
];

// ============================================
// STATISTICS COMPONENT (Custom)
// ============================================
function ActivityStatistics({ data }: { data: DriverActivity[] }) {
  const stats = useMemo(() => {
    const totalMinutes = data.reduce((sum, d) => sum + d.durationMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      total: allActivityData.length,
      online: allActivityData.filter((d) => d.onlineStatus === "Online").length,
      offline: allActivityData.filter((d) => d.onlineStatus === "Offline").length,
      totalDuration: `${hours}h ${minutes}m`,
      avgDuration:
        data.length > 0
          ? `${Math.floor(totalMinutes / data.length / 60)}h ${Math.floor(
            (totalMinutes / data.length) % 60
          )}m`
          : "0h 0m",
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All logged drivers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Online Now</CardTitle>
          <Wifi className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.online}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card>
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
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DriverActivityLog() {
  return (
    <div className="space-y-6">
      <ActivityStatistics data={allActivityData} />

      <ReportPageTemplate
        title="Driver Activity Log Audit Report"
        data={allActivityData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="DriverActivityLog.pdf"
        filters={[
          {
            key: "onlineStatus",
            label: "Status",
            options: [
              { label: "All Drivers", value: "all" },
              { label: "Online Only", value: "Online" },
              { label: "Offline Only", value: "Offline" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}