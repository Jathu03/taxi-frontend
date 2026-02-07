"use client";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Phone,
  MapPin,
  Smartphone,
  Shield,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
export type Driver = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  emergencyContactNumber: string;
  manualDispatch: "Yes" | "No";
  blocked: "Yes" | "No";
  lastLocation: string;
  appVersion: string;
  fullName: string;
};

// ============================================
// MOCK DATA
// ============================================
const rawDriverData = [
  {
    id: "d1",
    code: "DRV-001",
    firstName: "Sunil",
    lastName: "Silva",
    nic: "901234567V",
    contactNumber: "0771234567",
    emergencyContactNumber: "0112345678",
    manualDispatch: "Yes",
    blocked: "No",
    lastLocation: "Colombo 03",
    appVersion: "2.4.1",
  },
  {
    id: "d2",
    code: "DRV-002",
    firstName: "Nimal",
    lastName: "Fernando",
    nic: "851234567V",
    contactNumber: "0719876543",
    emergencyContactNumber: "0119876543",
    manualDispatch: "No",
    blocked: "No",
    lastLocation: "Nugegoda",
    appVersion: "2.4.0",
  },
  {
    id: "d3",
    code: "DRV-003",
    firstName: "Kamal",
    lastName: "Perera",
    nic: "881234567V",
    contactNumber: "0784447788",
    emergencyContactNumber: "0114447788",
    manualDispatch: "Yes",
    blocked: "Yes",
    lastLocation: "Kandy",
    appVersion: "2.3.5",
  },
  {
    id: "d4",
    code: "DRV-004",
    firstName: "Saman",
    lastName: "Jayawardena",
    nic: "921234567V",
    contactNumber: "0765551234",
    emergencyContactNumber: "0115551234",
    manualDispatch: "No",
    blocked: "No",
    lastLocation: "Galle",
    appVersion: "2.4.1",
  },
  {
    id: "d5",
    code: "DRV-005",
    firstName: "Ranjith",
    lastName: "Kumara",
    nic: "781234567V",
    contactNumber: "0723334455",
    emergencyContactNumber: "0113334455",
    manualDispatch: "Yes",
    blocked: "No",
    lastLocation: "Negombo",
    appVersion: "2.4.1",
  },
  {
    id: "d6",
    code: "DRV-006",
    firstName: "Chaminda",
    lastName: "Wijesinghe",
    nic: "801234567V",
    contactNumber: "0756667788",
    emergencyContactNumber: "0116667788",
    manualDispatch: "No",
    blocked: "Yes",
    lastLocation: "Matara",
    appVersion: "2.2.0",
  },
  {
    id: "d7",
    code: "DRV-007",
    firstName: "Priyantha",
    lastName: "Bandara",
    nic: "871234567V",
    contactNumber: "0778889900",
    emergencyContactNumber: "0118889900",
    manualDispatch: "Yes",
    blocked: "No",
    lastLocation: "Kurunegala",
    appVersion: "2.4.1",
  },
  {
    id: "d8",
    code: "DRV-008",
    firstName: "Anura",
    lastName: "Dissanayake",
    nic: "941234567V",
    contactNumber: "0761112233",
    emergencyContactNumber: "0111112233",
    manualDispatch: "No",
    blocked: "No",
    lastLocation: "Colombo 07",
    appVersion: "2.4.0",
  },
];

const allDriverData: Driver[] = rawDriverData.map((driver) => ({
  ...driver,
  fullName: `${driver.firstName} ${driver.lastName}`,
  manualDispatch: driver.manualDispatch as "Yes" | "No",
  blocked: driver.blocked as "Yes" | "No",
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
const getBlockedBadge = (blocked: string) => {
  if (blocked === "Yes") {
    return "bg-red-100 text-red-800 border-red-200";
  }
  return "bg-green-100 text-green-800 border-green-200";
};

const getManualDispatchBadge = (manual: string) => {
  if (manual === "Yes") {
    return "bg-blue-100 text-blue-800 border-blue-200";
  }
  return "bg-gray-100 text-gray-600 border-gray-200";
};

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<Driver>[] = [
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
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <span className="font-bold text-black">First Name</span>,
  },
  {
    accessorKey: "lastName",
    header: () => <span className="font-bold text-black">Last Name</span>,
  },
  {
    accessorKey: "fullName",
    header: () => <span className="font-bold text-black">Full Name</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-semibold text-xs">
            {row.original.firstName[0]}
            {row.original.lastName[0]}
          </span>
        </div>
        <span className="font-medium">{row.getValue("fullName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "nic",
    header: () => <span className="font-bold text-black">NIC</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("nic")}</span>
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
    accessorKey: "emergencyContactNumber",
    header: () => <span className="font-bold text-black">Emergency Contact</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-red-500" />
        <span className="text-muted-foreground">
          {row.getValue("emergencyContactNumber")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "manualDispatch",
    header: () => <span className="font-bold text-black">Manual Dispatch</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getManualDispatchBadge(row.getValue("manualDispatch"))}
      >
        {row.getValue("manualDispatch")}
      </Badge>
    ),
  },
  {
    accessorKey: "blocked",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={getBlockedBadge(row.getValue("blocked"))}
      >
        {row.getValue("blocked") === "Yes" ? (
          <span className="flex items-center gap-1">
            <UserX className="h-3 w-3" /> Blocked
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" /> Active
          </span>
        )}
      </Badge>
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
    accessorKey: "appVersion",
    header: () => <span className="font-bold text-black">App Ver</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Smartphone className="h-3 w-3 text-muted-foreground" />
        <Badge variant="secondary" className="text-xs">
          v{row.getValue("appVersion")}
        </Badge>
      </div>
    ),
  },
];

// ============================================
// PDF COLUMNS
// ============================================
// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Code", dataKey: "code" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Last Name", dataKey: "lastName" },
  { header: "NIC", dataKey: "nic" },
  { header: "Contact", dataKey: "contactNumber" },
  { header: "Emergency", dataKey: "emergencyContactNumber" },
  { header: "Manual", dataKey: "manualDispatch" },
  {
    header: "Status",
    dataKey: "blocked",
    formatter: (value: string) => (value === "Yes" ? "Blocked" : "Active"),
  },
  { header: "Location", dataKey: "lastLocation" },
  { header: "App Ver", dataKey: "appVersion" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function DriverStatistics() {
  const stats = useMemo(
    () => ({
      total: allDriverData.length,
      active: allDriverData.filter((d) => d.blocked === "No").length,
      blocked: allDriverData.filter((d) => d.blocked === "Yes").length,
      manualDispatch: allDriverData.filter((d) => d.manualDispatch === "Yes")
        .length,
    }),
    []
  );

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All registered drivers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Blocked Drivers</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          <p className="text-xs text-muted-foreground">Currently blocked</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Manual Dispatch</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.manualDispatch}
          </div>
          <p className="text-xs text-muted-foreground">Enabled for manual</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DriverReport() {
  return (
    <div className="space-y-6">
      <DriverStatistics />

      <ReportPageTemplate
        title="Driver Registry Audit Report"
        data={allDriverData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="fullName"
        fileName="DriverReport.pdf"
        filters={[
          {
            key: "blocked",
            label: "Status",
            options: [
              { label: "All Drivers", value: "all" },
              { label: "Active Only", value: "No" },
              { label: "Blocked Only", value: "Yes" },
            ],
            defaultValue: "all",
          },
          {
            key: "manualDispatch",
            label: "Dispatch Type",
            options: [
              { label: "All Types", value: "all" },
              { label: "Manual Dispatch", value: "Yes" },
              { label: "Auto Dispatch", value: "No" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}