"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Phone } from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
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

const allUserData: CorporateUser[] = mockCorporateUsers.map((user) => ({
  ...user,
  searchField: `${user.username} ${user.email} ${user.firstName} ${user.lastName} ${user.phoneNumber}`,
}));

// ============================================
// TABLE COLUMNS (For UI DataTable)
// ============================================
const tableColumns: ColumnDef<CorporateUser>[] = [
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

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Username", dataKey: "username" },
  { header: "Email", dataKey: "email" },
  { header: "First Name", dataKey: "firstName" },
  { header: "Last Name", dataKey: "lastName" },
  { header: "Phone Number", dataKey: "phoneNumber" },
  { header: "Role", dataKey: "role" },
  { header: "Status", dataKey: "status" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function CorporateUserReport() {
  return (
    <ReportPageTemplate
      title="Corporate Users Audit Report"
      data={allUserData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
      searchKey="searchField"
      fileName="CorporateUsers.pdf"
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
            { label: "Admin Only", value: "Admin" },
            { label: "Manager Only", value: "Manager" },
            { label: "User Only", value: "User" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}