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
  Printer,
  CheckCircle,
  XCircle,
  Filter,
  Shield,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type Definition ---
type CorporateUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: "Admin" | "Manager" | "User";
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

// --- Sample Data (Mock) ---
const mockCorporateUsers: CorporateUser[] = [
  {
    id: "u1",
    username: "supun.p",
    email: "supun@abc.lk",
    firstName: "Supun",
    lastName: "Perera",
    phoneNumber: "0771234567",
    role: "Admin",
    status: "Active",
  },
  {
    id: "u2",
    username: "nisansala.f",
    email: "nisansala@softlab.com",
    firstName: "Nisansala",
    lastName: "Fernando",
    phoneNumber: "0719876543",
    role: "Manager",
    status: "Active",
  },
  {
    id: "u3",
    username: "ruwan.j",
    email: "ruwan@lankatech.lk",
    firstName: "Ruwan",
    lastName: "Jayasinghe",
    phoneNumber: "0702345678",
    role: "User",
    status: "Active",
  },
  {
    id: "u4",
    username: "kamani.s",
    email: "kamani@global.lk",
    firstName: "Kamani",
    lastName: "Silva",
    phoneNumber: "0768901234",
    role: "User",
    status: "Inactive",
  },
  {
    id: "u5",
    username: "dinesh.w",
    email: "dinesh@abc.lk",
    firstName: "Dinesh",
    lastName: "Wickrama",
    phoneNumber: "0751234567",
    role: "Manager",
    status: "Inactive",
  },
];

// --- Column Definitions ---
const columns: ColumnDef<CorporateUser>[] = [
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
      const colorMap: Record<string, string> = {
        Admin: "bg-red-100 text-red-700 border-red-300",
        Manager: "bg-blue-100 text-blue-700 border-blue-300",
        User: "bg-gray-100 text-gray-700 border-gray-300",
      };
      return (
        <Badge variant="outline" className={colorMap[role] || ""}>
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

// --- Component ---
export default function CorporateUserReport() {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "Admin" | "Manager" | "User">("all");

  const allData = useMemo(
    () =>
      mockCorporateUsers.map((user) => ({
        ...user,
        searchField: `${user.username} ${user.email} ${user.firstName} ${user.lastName} ${user.phoneNumber}`,
      })),
    []
  );

  const filteredData = useMemo(() => {
    let result = [...allData];

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((item) => item.status === "Active");
    } else if (statusFilter === "inactive") {
      result = result.filter((item) => item.status === "Inactive");
    }

    // Role filter
    if (roleFilter !== "all") {
      result = result.filter((item) => item.role === roleFilter);
    }

    return result;
  }, [statusFilter, roleFilter, allData]);

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
    doc.text("Corporate Users Audit Report", 40, 22);

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
      startY: 70,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`CorporateUsers_${statusFilter}_${roleFilter}_${new Date().getTime()}.pdf`);
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
    link.download = `CorporateUsers_${statusFilter}_${roleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Corporate Users Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== "all" || roleFilter !== "all") &&
              ` (filtered by ${statusFilter !== "all" ? statusFilter : ""} ${
                roleFilter !== "all" ? roleFilter : ""
              })`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => generateReport("save")}
          >
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
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
            <CheckCircle className="mr-2 h-4 w-4" /> Active Only
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
            <Shield className="h-4 w-4 mr-1" /> Role:
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
            variant={roleFilter === "Admin" ? "default" : "outline"}
            onClick={() => setRoleFilter("Admin")}
            className={roleFilter === "Admin" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            Admin
          </Button>
          <Button
            variant={roleFilter === "Manager" ? "default" : "outline"}
            onClick={() => setRoleFilter("Manager")}
            className={roleFilter === "Manager" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            size="sm"
          >
            Manager
          </Button>
          <Button
            variant={roleFilter === "User" ? "default" : "outline"}
            onClick={() => setRoleFilter("User")}
            className={roleFilter === "User" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""}
            size="sm"
          >
            User
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-purple-600" />
            User Accounts Registry
          </CardTitle>
          <Badge variant="outline">Access Control</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${roleFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search by username, email, or name..."
          />
        </CardContent>
      </Card>
    </div>
  );
}