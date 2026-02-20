"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  UserCircle,
  Mail,
  Phone,
  ShieldCheck,
  Users,
  Crown,
  Briefcase,
  Car as CarIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { userService } from "@/services/user/userService";
import type { UserResponse } from "@/services/user/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string; // Dynamic role string from backend
  status: "Active" | "Inactive";
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractUserList(response: any): UserResponse[] {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.content && Array.isArray(response.content)) return response.content;
  return [];
}

function getRoleBadgeClass(role: string) {
  const r = role.toUpperCase();
  if (r.includes("ADMIN")) return "bg-red-100 text-red-800 border-red-300";
  if (r.includes("MANAGER")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (r.includes("CORPORATE")) return "bg-purple-100 text-purple-800 border-purple-300";
  if (r.includes("OPERATOR")) return "bg-green-100 text-green-800 border-green-300";
  if (r.includes("DRIVER")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-gray-100 text-gray-800 border-gray-300";
}

function mapApiToReportRow(u: UserResponse): User {
  const username = u.username || "N/A";
  const email = u.email || "N/A";
  const firstName = u.firstName || "N/A";
  const lastName = u.lastName || "N/A";
  const phoneNumber = u.phoneNumber || "N/A";
  const status = u.isActive ? "Active" : "Inactive";

  // Join roles into a single string or pick primary
  const roles = u.roles?.map((r) => r.roleName).join(", ") || "No Role";

  return {
    id: String(u.id),
    username,
    email,
    firstName,
    lastName,
    phoneNumber,
    role: roles,
    status,
    searchField: `${username} ${email} ${firstName} ${lastName} ${phoneNumber} ${roles}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<User>[] = [
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

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Username", dataKey: "username" },
  { header: "Email", dataKey: "email" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Last Name", dataKey: "lastName" },
  { header: "Phone", dataKey: "phoneNumber" },
  { header: "Role", dataKey: "role" },
  { header: "Status", dataKey: "status" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function UserStatistics({ data }: { data: User[] }) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((u) => u.status === "Active").length,
      inactive: data.filter((u) => u.status === "Inactive").length,
      administrator: data.filter((u) => u.role.toUpperCase().includes("ADMIN")).length,
      manager: data.filter((u) => u.role.toUpperCase().includes("MANAGER")).length,
      corporate: data.filter((u) => u.role.toUpperCase().includes("CORPORATE")).length,
      operator: data.filter((u) => u.role.toUpperCase().includes("OPERATOR")).length,
      driver: data.filter((u) => u.role.toUpperCase().includes("DRIVER")).length,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
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
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function UserReport() {
  const [allUserData, setAllUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic role options
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(allUserData.map((u) => u.role))).sort();
    return [
      { label: "All Roles", value: "all" },
      ...roles.map((r) => ({ label: r, value: r })),
    ];
  }, [allUserData]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);

        const response: any = await userService.getAll();
        const rawList = extractUserList(response);

        setAllUserData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load user report");
        setAllUserData([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserStatistics data={allUserData} />

      <ReportPageTemplate
        title="User Accounts Audit Report"
        data={allUserData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="UserReport.pdf"
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active Only", value: "Active" },
              { label: "Inactive Only", value: "Inactive" },
            ],
            defaultValue: "all",
          },
          {
            key: "role",
            label: "Role",
            options: roleOptions,
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}