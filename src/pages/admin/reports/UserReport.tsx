"use client";
import { useMemo } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
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

const allUserData: User[] = mockUsers.map((u) => ({
  ...u,
  searchField: `${u.username} ${u.email} ${u.firstName} ${u.lastName} ${u.phoneNumber} ${u.role}`,
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
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

// ============================================
// TABLE COLUMNS
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
// PDF COLUMNS
// ============================================
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
// STATISTICS COMPONENT
// ============================================
function UserStatistics() {
  const stats = useMemo(() => {
    return {
      total: allUserData.length,
      active: allUserData.filter((u) => u.status === "Active").length,
      inactive: allUserData.filter((u) => u.status === "Inactive").length,
      administrator: allUserData.filter((u) => u.role === "Administrator").length,
      manager: allUserData.filter((u) => u.role === "Manager").length,
      corporate: allUserData.filter((u) => u.role === "Corporate").length,
      operator: allUserData.filter((u) => u.role === "Operator").length,
      driver: allUserData.filter((u) => u.role === "Driver").length,
    };
  }, []);

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
// MAIN COMPONENT
// ============================================
export default function UserReport() {
  return (
    <div className="space-y-6">
      <UserStatistics />

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
            options: [
              { label: "All Roles", value: "all" },
              { label: "Administrator", value: "Administrator" },
              { label: "Manager", value: "Manager" },
              { label: "Corporate", value: "Corporate" },
              { label: "Operator", value: "Operator" },
              { label: "Driver", value: "Driver" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}