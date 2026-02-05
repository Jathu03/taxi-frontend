// src/pages/CorporateUserReport.tsx

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
} from "lucide-react";
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
  searchField?: string;
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
  },
  {
    id: "u2",
    username: "nisansala.f",
    email: "nisansala@softlab.com",
    firstName: "Nisansala",
    lastName: "Fernando",
    phoneNumber: "0719876543",
  },
  {
    id: "u3",
    username: "ruwan.j",
    email: "ruwan@lankatech.lk",
    firstName: "Ruwan",
    lastName: "Jayasinghe",
    phoneNumber: "0702345678",
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
];

// --- Component ---
export default function CorporateUserReport() {
  const [data] = useState<CorporateUser[]>(
    mockCorporateUsers.map((user) => ({
      ...user,
      searchField: `${user.username} ${user.email} ${user.firstName} ${user.lastName} ${user.phoneNumber}`,
    }))
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "User Name",
      "Email",
      "First Name",
      "Last Name",
      "Phone Number",
    ];
    const rows = data.map((u) => [
      u.username,
      u.email,
      u.firstName,
      u.lastName,
      u.phoneNumber,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "corporate_users.csv";
    link.click();
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Corporate Users Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Username", "Email", "First Name", "Last Name", "Phone"]],
      body: data.map((u) => [
        u.username,
        u.email,
        u.firstName,
        u.lastName,
        u.phoneNumber,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("corporate_users_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between flex-col md:flex-row gap-4 items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Users</h1>
          <p className="text-sm text-muted-foreground">
            List of all corporate portal user accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={exportPDF} className="bg-[#6330B8] text-white">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex gap-2 items-center text-[#6330B8] text-lg">
            <UserCircle className="h-5 w-5" />
            User Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search by username, email, or name..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}