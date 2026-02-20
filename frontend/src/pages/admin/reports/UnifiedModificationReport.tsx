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
  Bot,
  Wrench,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
export type UnifiedModification = {
  id: string;
  bookingId: string;
  modifiedOn: string;
  modifiedByType: "USER" | "DRIVER" | "SYSTEM";
  modifiedByName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  reason: string;
  bookingSource: "Portal" | "App";
  bookingVehicleClass: string;
};

// ============================================
// MOCK DATA
// ============================================
const modificationData: UnifiedModification[] = [
  // Manual/Portal Modifications
  {
    id: "m1",
    bookingId: "295104",
    modifiedOn: "11/27/2025 10:45 AM",
    modifiedByType: "USER",
    modifiedByName: "Sarah Smith",
    fieldName: "Pickup Time",
    oldValue: "11/27/2025 15:58",
    newValue: "11/27/2025 16:30",
    reason: "Customer requested delay due to a meeting.",
    bookingSource: "Portal",
    bookingVehicleClass: "Bus",
  },
  {
    id: "m2",
    bookingId: "295650",
    modifiedOn: "12/03/2025 09:00 AM",
    modifiedByType: "USER",
    modifiedByName: "Admin User",
    fieldName: "Driver",
    oldValue: "Not Assigned",
    newValue: "D-001 - John Perera",
    reason: "Dispatching available driver.",
    bookingSource: "Portal",
    bookingVehicleClass: "Luxury",
  },
  {
    id: "m3",
    bookingId: "295700",
    modifiedOn: "12/04/2025 07:30 AM",
    modifiedByType: "SYSTEM",
    modifiedByName: "System",
    fieldName: "Status",
    oldValue: "Pending",
    newValue: "Dispatched",
    reason: "Automatic status update on driver assignment.",
    bookingSource: "Portal",
    bookingVehicleClass: "STANDARD",
  },
  // Tuk Manual Modifications
  {
    id: "m4",
    bookingId: "TUK-001",
    modifiedOn: "12/05/2025 09:05 AM",
    modifiedByType: "USER",
    modifiedByName: "Call Center Agent",
    fieldName: "Drop Address",
    oldValue: "Fort",
    newValue: "Pettah Bus Stand",
    reason: "Customer clarified the exact drop-off point.",
    bookingSource: "Portal",
    bookingVehicleClass: "Tuk",
  },
  // App Modifications
  {
    id: "m5",
    bookingId: "APP-001",
    modifiedOn: "2024-03-15 12:31 PM",
    modifiedByType: "USER",
    modifiedByName: "David Lee",
    fieldName: "Pickup Location",
    oldValue: "Galle Face Green",
    newValue: "Galle Face Hotel Entrance",
    reason: "Customer corrected pickup point via app.",
    bookingSource: "App",
    bookingVehicleClass: "ECONOMY",
  },
  {
    id: "m6",
    bookingId: "APP-002",
    modifiedOn: "2024-03-15 04:05 PM",
    modifiedByType: "DRIVER",
    modifiedByName: "Driver-456 (Rohan)",
    fieldName: "Status",
    oldValue: "Enroute",
    newValue: "Waiting For Customer",
    reason: "Driver arrived at pickup location.",
    bookingSource: "App",
    bookingVehicleClass: "STANDARD",
  },
  // Tuk App Modifications
  {
    id: "m7",
    bookingId: "TAPP-001",
    modifiedOn: "2024-03-15 12:35 PM",
    modifiedByType: "DRIVER",
    modifiedByName: "Driver-789 (Kamal)",
    fieldName: "Status",
    oldValue: "Passenger Onboard",
    newValue: "Completed",
    reason: "Trip finished successfully.",
    bookingSource: "App",
    bookingVehicleClass: "Tuk",
  },
  {
    id: "m8",
    bookingId: "TAPP-002",
    modifiedOn: "2024-03-15 04:01 PM",
    modifiedByType: "SYSTEM",
    modifiedByName: "System",
    fieldName: "Fare",
    oldValue: "LKR 450.00",
    newValue: "LKR 480.00",
    reason: "Fare updated based on actual distance/time.",
    bookingSource: "App",
    bookingVehicleClass: "Tuk",
  },
  // More data for variety
  {
    id: "m9",
    bookingId: "BK-2024-8871",
    modifiedOn: "2024-03-16 11:00 AM",
    modifiedByType: "USER",
    modifiedByName: "Jane Doe",
    fieldName: "Vehicle Class",
    oldValue: "ECONOMY",
    newValue: "VAN",
    reason: "Customer requested a larger vehicle for luggage.",
    bookingSource: "Portal",
    bookingVehicleClass: "VAN",
  },
  {
    id: "m10",
    bookingId: "APP-004",
    modifiedOn: "2024-03-16 02:31 PM",
    modifiedByType: "USER",
    modifiedByName: "Emma Davis",
    fieldName: "Status",
    oldValue: "Pending",
    newValue: "Cancelled by Customer",
    reason: "Customer cancelled the trip.",
    bookingSource: "App",
    bookingVehicleClass: "Bus",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const getModifiedByIcon = (type: string) => {
  switch (type) {
    case "USER":
      return <User className="h-4 w-4" />;
    case "DRIVER":
      return <Wrench className="h-4 w-4" />;
    case "SYSTEM":
      return <Bot className="h-4 w-4" />;
    default:
      return null;
  }
};

const getModifiedByBadgeClass = (type: string) => {
  const colorMap: Record<string, string> = {
    USER: "bg-blue-100 text-blue-800",
    DRIVER: "bg-green-100 text-green-800",
    SYSTEM: "bg-gray-100 text-gray-800",
  };
  return colorMap[type] || "bg-gray-100 text-gray-800";
};

const getVehicleBadgeClass = (vehicle: string) => {
  const colorMap: Record<string, string> = {
    Bus: "bg-orange-100 text-orange-800",
    Luxury: "bg-purple-100 text-purple-800",
    ECONOMY: "bg-green-100 text-green-800",
    STANDARD: "bg-blue-100 text-blue-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    VAN: "bg-indigo-100 text-indigo-800",
  };
  return colorMap[vehicle] || "bg-gray-100 text-gray-800";
};

// ============================================
// TABLE COLUMNS
// ============================================
const selectColumn: ColumnDef<UnifiedModification> = {
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

const tableColumns: ColumnDef<UnifiedModification>[] = [
  selectColumn,
  {
    accessorKey: "bookingId",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-mono font-medium text-primary">
        {row.getValue("bookingId")}
      </span>
    ),
  },
  {
    accessorKey: "modifiedOn",
    header: () => <span className="font-bold text-black">Modified On</span>,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("modifiedOn")}
      </span>
    ),
  },
  {
    accessorKey: "modifiedByName",
    header: () => <span className="font-bold text-black">Modified By</span>,
    cell: ({ row }) => {
      const type = row.original.modifiedByType;
      const name = row.original.modifiedByName;
      return (
        <Badge className={`gap-1 ${getModifiedByBadgeClass(type)}`}>
          {getModifiedByIcon(type)}
          {name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fieldName",
    header: () => <span className="font-bold text-black">Field Changed</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("fieldName")}</span>
    ),
  },
  {
    id: "change",
    header: () => <span className="font-bold text-black">Change</span>,
    cell: ({ row }) => {
      const oldValue = row.original.oldValue;
      const newValue = row.original.newValue;
      return (
        <div className="text-sm">
          <span className="text-muted-foreground line-through">{oldValue}</span>
          <span className="mx-2">→</span>
          <span className="font-medium text-green-700">{newValue}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: () => <span className="font-bold text-black">Reason</span>,
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <span
          className="text-sm text-muted-foreground max-w-[200px] truncate block"
          title={reason}
        >
          {reason || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "bookingSource",
    header: () => <span className="font-bold text-black">Booking Source</span>,
    cell: ({ row }) => {
      const source = row.original.bookingSource;
      const vehicle = row.original.bookingVehicleClass;
      const isTuk = vehicle === "Tuk";
      return (
        <Badge
          variant="outline"
          className={`gap-1 ${source === "App"
            ? isTuk
              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
              : "border-green-600 text-green-700 bg-green-50"
            : isTuk
              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
              : "border-blue-500 text-blue-700 bg-blue-50"
            }`}
        >
          {source === "App" ? (
            <Smartphone className="h-3 w-3" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
          {isTuk ? `Tuk (${source})` : source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "bookingVehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => {
      const vehicle = row.getValue("bookingVehicleClass") as string;
      return (
        <Badge className={getVehicleBadgeClass(vehicle)}>
          {vehicle === "Tuk" && <Car className="h-3 w-3 mr-1" />}
          {vehicle}
        </Badge>
      );
    },
  },
];

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Booking ID", dataKey: "bookingId" },
  { header: "Modified On", dataKey: "modifiedOn" },
  { header: "Modified By Type", dataKey: "modifiedByType" },
  { header: "Modified By Name", dataKey: "modifiedByName" },
  { header: "Field Changed", dataKey: "fieldName" },
  { header: "Old Value", dataKey: "oldValue" },
  { header: "New Value", dataKey: "newValue" },
  { header: "Reason", dataKey: "reason" },
  { header: "Booking Source", dataKey: "bookingSource" },
  { header: "Vehicle Class", dataKey: "bookingVehicleClass" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function ModificationStatistics() {
  const stats = useMemo(() => {
    const portal = modificationData.filter((d) => d.bookingSource === "Portal");
    const app = modificationData.filter((d) => d.bookingSource === "App");
    const tuk = modificationData.filter((d) => d.bookingVehicleClass === "Tuk");
    const nonTuk = modificationData.filter(
      (d) => d.bookingVehicleClass !== "Tuk"
    );

    return {
      total: modificationData.length,
      portal: portal.length,
      portalTuk: portal.filter((d) => d.bookingVehicleClass === "Tuk").length,
      portalNonTuk: portal.filter((d) => d.bookingVehicleClass !== "Tuk").length,
      app: app.length,
      appTuk: app.filter((d) => d.bookingVehicleClass === "Tuk").length,
      appNonTuk: app.filter((d) => d.bookingVehicleClass !== "Tuk").length,
      tuk: tuk.length,
      nonTuk: nonTuk.length,
      user: modificationData.filter((d) => d.modifiedByType === "USER").length,
      driver: modificationData.filter((d) => d.modifiedByType === "DRIVER")
        .length,
      system: modificationData.filter((d) => d.modifiedByType === "SYSTEM")
        .length,
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
                Total modifications
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
                Three-wheeler modifications
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
                Bus, Luxury, Standard, Economy, Van
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modified By Type Statistics */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          By Modifier Type
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                User Changes
              </CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.user}</div>
              <p className="text-xs text-blue-600">Admin/Agent modifications</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Driver Changes
              </CardTitle>
              <Wrench className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {stats.driver}
              </div>
              <p className="text-xs text-green-600">Driver app changes</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                System Changes
              </CardTitle>
              <Bot className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-700">
                {stats.system}
              </div>
              <p className="text-xs text-gray-600">Automatic updates</p>
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
export default function BookingModificationReport() {
  return (
    <div className="space-y-6">
      <ModificationStatistics />

      <ReportPageTemplate
        title="Booking Modification Audit Report"
        data={modificationData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="fieldName"
        fileName="BookingModifications.pdf"
        filters={[
          {
            key: "bookingSource",
            label: "Booking Source",
            options: [
              { label: "All Sources", value: "all" },
              { label: "Manual / Portal", value: "Portal" },
              { label: "App", value: "App" },
            ],
            defaultValue: "all",
          },
          {
            key: "bookingVehicleClass",
            label: "Vehicle Class",
            options: [
              { label: "All Vehicles", value: "all" },
              { label: "Bus", value: "Bus" },
              { label: "Luxury", value: "Luxury" },
              { label: "Economy", value: "ECONOMY" },
              { label: "Standard", value: "STANDARD" },
              { label: "Tuk", value: "Tuk" },
              { label: "Van", value: "VAN" },
            ],
            defaultValue: "all",
          },
          {
            key: "modifiedByType",
            label: "Modified By",
            options: [
              { label: "All Types", value: "all" },
              { label: "User (Admin/Agent)", value: "USER" },
              { label: "Driver", value: "DRIVER" },
              { label: "System", value: "SYSTEM" },
            ],
            defaultValue: "all",
          },
          {
            key: "fieldName",
            label: "Field Changed",
            options: [
              { label: "All Fields", value: "all" },
              { label: "Status", value: "Status" },
              { label: "Pickup Time", value: "Pickup Time" },
              { label: "Pickup Location", value: "Pickup Location" },
              { label: "Drop Address", value: "Drop Address" },
              { label: "Driver", value: "Driver" },
              { label: "Fare", value: "Fare" },
              { label: "Vehicle Class", value: "Vehicle Class" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}