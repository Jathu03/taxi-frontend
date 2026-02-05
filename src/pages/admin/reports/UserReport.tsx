// src/pages/UserReport.tsx

import { useState } from "react";
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
} from "lucide-react";
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
  role: string;
  searchField?: string;
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
  },
  {
    id: "u2",
    username: "anna.d",
    email: "anna@company.com",
    firstName: "Anna",
    lastName: "Dias",
    phoneNumber: "0712345678",
    role: "Corporate",
  },
  {
    id: "u3",
    username: "driver01",
    email: "kamal@drivers.lk",
    firstName: "Kamal",
    lastName: "Fernando",
    phoneNumber: "0755558888",
    role: "Driver",
  },
];

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
    header: "User Name",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-purple-700">
        {row.getValue("username")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-blue-500" />
        {row.getValue("email")}
      </div>
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
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        {row.getValue("role")}
      </div>
    ),
  },
];

// --- Component ---
export default function UserReport() {
  const [data] = useState<User[]>(
    mockUsers.map((u) => ({
      ...u,
      searchField: `${u.username} ${u.email} ${u.firstName} ${u.lastName} ${u.phoneNumber} ${u.role}`,
    }))
  );

  const exportCSV = () => {
    const headers = [
      "Username",
      "Email",
      "First Name",
      "Last Name",
      "Phone Number",
      "Role",
    ];
    const rows = data.map((u) => [
      u.username,
      u.email,
      u.firstName,
      u.lastName,
      u.phoneNumber,
      u.role,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_report.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("User Report", 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [["Username", "Email", "First", "Last", "Phone", "Role"]],
      body: data.map((u) => [
        u.username,
        u.email,
        u.firstName,
        u.lastName,
        u.phoneNumber,
        u.role,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("user_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-slate-50/30 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">User Report</h1>
          <p className="text-sm text-muted-foreground">View all user accounts and assigned roles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} className="bg-[#6330B8] text-white">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <UserCircle className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search by name, username, email..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}