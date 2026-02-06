"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  FileText,
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  Printer,
  Filter,
  Users,
  Crown,
  Briefcase,
  Car as CarIcon,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type ---
type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "Administrator" | "Corporate" | "Driver" | "Manager" | "Operator";
  status: "Active" | "Inactive";
  searchField?: string;
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

// --- Sample Data ---
const mockUsers: User[] = [
  {
    id: "u1",
    username: "admin",
    email: "admin@example.com",
    firstName: "Nuwan",
    lastName: "Perera",
    phoneNumber: "0771234567",
    role: "Administrator",
    status: "Active",
  },
  {
    id: "u2",
    username: "anna.d",
    email: "anna@company.com",
    firstName: "Anna",
    lastName: "Dias",
    phoneNumber: "0712345678",
    role: "Corporate",
    status: "Active",
  },
  {
    id: "u3",
    username: "driver01",
    email: "kamal@drivers.lk",
    firstName: "Kamal",
    lastName: "Fernando",
    phoneNumber: "0755558888",
    role: "Driver",
    status: "Active",
  },
  {
    id: "u4",
    username: "manager01",
    email: "sarah@company.com",
    firstName: "Sarah",
    lastName: "Silva",
    phoneNumber: "0761234567",
    role: "Manager",
    status: "Active",
  },
  {
    id: "u5",
    username: "operator01",
    email: "john@company.com",
    firstName: "John",
    lastName: "Wickramasinghe",
    phoneNumber: "0752345678",
    role: "Operator",
    status: "Inactive",
  },
  {
    id: "u6",
    username: "driver02",
    email: "nimal@drivers.lk",
    firstName: "Nimal",
    lastName: "Bandara",
    phoneNumber: "0743456789",
    role: "Driver",
    status: "Inactive",
  },
];

// Badge helper
const getRoleBadgeClass = (role: string) => {
  const colorMap: Record<string, string> = {
    Administrator: "bg-red-100 text-red-800 border-red-300",
    Manager: "bg-blue-100 text-blue-800 border-blue-300",
    Corporate: "bg-purple-100 text-purple-800 border-purple-300",
    Operator: "bg-green-100 text-green-800 border-green-300",
    Driver: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };
  return colorMap[role] || "bg-gray-100 text-gray-800";
};

// --- Column Definitions ---
const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
      />
    ),
  },
  {
    accessorKey: "username",
    header: () => <span className="font-bold text-black">User Name</span>,
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("username")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-blue-500" />
        {row.getValue("email")}
      </div>
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
    accessorKey: "phoneNumber",
    header: () => <span className="font-bold text-black">Phone Number</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <span className="font-bold text-black">Role</span>,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant="outline" className={getRoleBadgeClass(role)}>
          <ShieldCheck className="h-3 w-3 mr-1" />
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return status === "Active" ? (
        <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-300">
          Inactive
        </Badge>
      );
    },
  },
];

// --- Filter Types ---
type StatusFilter = "all" | "active" | "inactive";
type RoleFilter = "all" | "Administrator" | "Manager" | "Corporate" | "Operator" | "Driver";

// --- Component ---
export default function UserReport() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const allData = useMemo(
    () =>
      mockUsers.map((u) => ({
        ...u,
        searchField: `${u.username} ${u.email} ${u.firstName} ${u.lastName} ${u.phoneNumber} ${u.role}`,
      })),
    []
  );

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...allData];

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((u) => u.status === "Active");
    } else if (statusFilter === "inactive") {
      result = result.filter((u) => u.status === "Inactive");
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    return result;
  }, [statusFilter, roleFilter, allData]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: allData.length,
      active: allData.filter((u) => u.status === "Active").length,
      inactive: allData.filter((u) => u.status === "Inactive").length,
      administrator: allData.filter((u) => u.role === "Administrator").length,
      manager: allData.filter((u) => u.role === "Manager").length,
      corporate: allData.filter((u) => u.role === "Corporate").length,
      operator: allData.filter((u) => u.role === "Operator").length,
      driver: allData.filter((u) => u.role === "Driver").length,
    };
  }, [allData]);

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
    doc.setTextColor(99, 48, 184); // Purple
    doc.text("User Accounts Audit Report", 40, 22);

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
    const statusText =
      statusFilter === "all"
        ? "All Statuses"
        : statusFilter === "active"
        ? "Active Only"
        : "Inactive Only";
    const roleText = roleFilter === "all" ? "All Roles" : `${roleFilter} Only`;

    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`Role Filter: ${roleText}`, 14, 53);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);
    doc.text(
      `Active: ${stats.active} | Inactive: ${stats.inactive} | Admin: ${stats.administrator} | Manager: ${stats.manager}`,
      14,
      68
    );

    // 5. Table
    autoTable(doc, {
      head: [["Username", "Email", "First Name", "Last Name", "Phone", "Role", "Status"]],
      body: filteredData.map((u) => [
        u.username,
        u.email,
        u.firstName,
        u.lastName,
        u.phoneNumber,
        u.role,
        u.status,
      ]),
      startY: 75,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`UserReport_${statusFilter}_${roleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["Username", "Email", "First Name", "Last Name", "Phone Number", "Role", "Status"];
    const rows = filteredData.map((u) =>
      [u.username, u.email, u.firstName, u.lastName, u.phoneNumber, u.role, u.status]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `UserReport_${statusFilter}_${roleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setRoleFilter("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-slate-50/30 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">User Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== "all" || roleFilter !== "all") && " (filtered)"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={() => generateReport("save")} className="bg-purple-600 hover:bg-purple-700">
            <FileText className="h-4 w-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All user accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Crown className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.administrator}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drivers</CardTitle>
            <CarIcon className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.driver}</div>
            <p className="text-xs text-muted-foreground">Driver accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1" /> Status:
          </span>
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            <Users className="mr-2 h-4 w-4" /> All Users
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <UserCircle className="mr-2 h-4 w-4" /> Active Only
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Inactive Only
          </Button>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <ShieldCheck className="h-4 w-4 mr-1" /> Role:
          </span>
          <Button
            variant={roleFilter === "all" ? "default" : "outline"}
            onClick={() => setRoleFilter("all")}
            className={roleFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All Roles
          </Button>
          <Button
            variant={roleFilter === "Administrator" ? "default" : "outline"}
            onClick={() => setRoleFilter("Administrator")}
            className={roleFilter === "Administrator" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            <Crown className="mr-2 h-4 w-4" /> Admin ({stats.administrator})
          </Button>
          <Button
            variant={roleFilter === "Manager" ? "default" : "outline"}
            onClick={() => setRoleFilter("Manager")}
            className={roleFilter === "Manager" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            size="sm"
          >
            <Briefcase className="mr-2 h-4 w-4" /> Manager ({stats.manager})
          </Button>
          <Button
            variant={roleFilter === "Corporate" ? "default" : "outline"}
            onClick={() => setRoleFilter("Corporate")}
            className={roleFilter === "Corporate" ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
            size="sm"
          >
            Corporate ({stats.corporate})
          </Button>
          <Button
            variant={roleFilter === "Operator" ? "default" : "outline"}
            onClick={() => setRoleFilter("Operator")}
            className={roleFilter === "Operator" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            Operator ({stats.operator})
          </Button>
          <Button
            variant={roleFilter === "Driver" ? "default" : "outline"}
            onClick={() => setRoleFilter("Driver")}
            className={roleFilter === "Driver" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
            size="sm"
          >
            <CarIcon className="mr-2 h-4 w-4" /> Driver ({stats.driver})
          </Button>
        </div>
      </div>

      {/* Active Filter Summary */}
      {(statusFilter !== "all" || roleFilter !== "all") && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {statusFilter !== "all" && (
              <Badge variant="secondary">{statusFilter === "active" ? "Active" : "Inactive"}</Badge>
            )}
            {roleFilter !== "all" && <Badge variant="secondary">{roleFilter}</Badge>}
            <span className="text-muted-foreground">=</span>
            <Badge className="bg-purple-600">{filteredData.length} records</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-purple-600" />
            User Accounts Registry
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredData.length} Users
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${roleFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search by name, username, email..."
          />
        </CardContent>
      </Card>
    </div>
  );
}