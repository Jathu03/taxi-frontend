import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet,
  Users,
  UserCheck,
  UserX,
  Phone,
  MapPin,
  Smartphone,
  Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
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
  // Computed for search
  fullName: string;
};

// --- Mock Data ---
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

// Transform data - add fullName for combined search
const allDriverData: Driver[] = rawDriverData.map((driver) => ({
  ...driver,
  fullName: `${driver.firstName} ${driver.lastName}`,
  manualDispatch: driver.manualDispatch as "Yes" | "No",
  blocked: driver.blocked as "Yes" | "No",
}));

// --- Badge Helpers ---
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

// --- Column Definitions ---
const columns: ColumnDef<Driver>[] = [
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
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-700 font-semibold text-xs">
            {row.original.firstName[0]}{row.original.lastName[0]}
          </span>
        </div>
        <span className="font-medium">{row.getValue("fullName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "nic",
    header: "NIC",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("nic")}</span>
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
    accessorKey: "emergencyContactNumber",
    header: "Emergency Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-red-500" />
        <span className="text-muted-foreground">{row.getValue("emergencyContactNumber")}</span>
      </div>
    ),
  },
  {
    accessorKey: "manualDispatch",
    header: "Manual Dispatch",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <Badge variant="outline" className={getManualDispatchBadge(row.getValue("manualDispatch"))}>
        {row.getValue("manualDispatch")}
      </Badge>
    ),
  },
  {
    accessorKey: "blocked",
    header: "Blocked",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <Badge variant="outline" className={getBlockedBadge(row.getValue("blocked"))}>
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
    header: "Last Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-blue-500" />
        <span>{row.getValue("lastLocation")}</span>
      </div>
    ),
  },
  {
    accessorKey: "appVersion",
    header: "App Ver",
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

// --- Filter Types ---
type StatusFilter = "all" | "active" | "blocked";

export default function DriverReport() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter data based on selected status
  const filteredData = useMemo(() => {
    let result = [...allDriverData];
    if (statusFilter === "active") {
      result = result.filter((d) => d.blocked === "No");
    } else if (statusFilter === "blocked") {
      result = result.filter((d) => d.blocked === "Yes");
    }
    return result;
  }, [statusFilter]);

  // Calculate statistics
  const stats = useMemo(
    () => ({
      total: allDriverData.length,
      active: allDriverData.filter((d) => d.blocked === "No").length,
      blocked: allDriverData.filter((d) => d.blocked === "Yes").length,
      manualDispatch: filteredData.filter((d) => d.manualDispatch === "Yes").length,
    }),
    [filteredData]
  );

  // Table filters (dropdown in table header)
  const tableFilters = useMemo(
    () => [
      {
        key: "blocked",
        label: "Status",
        options: [
          { value: "No", label: "Active" },
          { value: "Yes", label: "Blocked" },
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
    doc.setTextColor(99, 48, 184); // Purple
    doc.text("Driver Report", 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Total: ${filteredData.length} drivers`, 14, 22);

    // Table
    autoTable(doc, {
      head: [["Code", "First Name", "Last Name", "NIC", "Contact", "Emergency", "Manual", "Blocked", "Location", "App Ver"]],
      body: filteredData.map((d) => [
        d.code,
        d.firstName,
        d.lastName,
        d.nic,
        d.contactNumber,
        d.emergencyContactNumber,
        d.manualDispatch,
        d.blocked,
        d.lastLocation,
        d.appVersion,
      ]),
      startY: 28,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] }, // Purple header
    });

    doc.save("driver_report.pdf");
  };

  const exportCSV = () => {
    const headers = "Code,First Name,Last Name,NIC,Contact Number,Emergency Contact,Manual Dispatch,Blocked,Last Location,App Version";
    const rows = filteredData.map(
      (d) =>
        `${d.code},${d.firstName},${d.lastName},${d.nic},${d.contactNumber},${d.emergencyContactNumber},${d.manualDispatch},${d.blocked},${d.lastLocation},${d.appVersion}`
    );
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "driver_report.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Driver Report</h1>
          <p className="text-muted-foreground mt-1">View and analyze driver information</p>
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
            <p className="text-xs text-muted-foreground">All registered drivers</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "active" ? "ring-2 ring-green-500 bg-green-50/50" : ""
          }`}
          onClick={() => setStatusFilter("active")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            statusFilter === "blocked" ? "ring-2 ring-red-500 bg-red-50/50" : ""
          }`}
          onClick={() => setStatusFilter("blocked")}
        >
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
            <div className="text-2xl font-bold text-blue-600">{stats.manualDispatch}</div>
            <p className="text-xs text-muted-foreground">Enabled for manual</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8]">
            <Users className="h-5 w-5" />
            Driver Directory
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredData.length} Drivers
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={statusFilter} // Re-render table when filter changes
            columns={columns}
            data={filteredData}
            searchKey="fullName" // Search by full name
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