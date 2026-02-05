// src/pages/CorporateReport.tsx

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  FileText,
  Building2,
  Phone,
  User,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type ---
type Corporate = {
  id: string;
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  cashDiscount: number;
  creditDiscount: number;
  quickBooking: boolean;
  searchField?: string;
};

// --- Mock Data ---
const mockCorporateList: Corporate[] = [
  {
    id: "c1",
    name: "ABC Holdings",
    code: "CORP-001",
    primaryContact: "Supun Perera",
    phone: "0771234567",
    email: "supun@abc.lk",
    address: "No 12, Park Street, Colombo 02",
    date: "2024-01-10",
    cashDiscount: 10,
    creditDiscount: 5,
    quickBooking: true,
  },
  {
    id: "c2",
    name: "SoftLab Pvt Ltd",
    code: "CORP-002",
    primaryContact: "Nisansala Fernando",
    phone: "0719876543",
    email: "nisansala@softlab.com",
    address: "Level 3, Orion Tower, Colombo 09",
    date: "2024-01-18",
    cashDiscount: 8,
    creditDiscount: 7,
    quickBooking: false,
  },
  {
    id: "c3",
    name: "Lanka Tech",
    code: "CORP-003",
    primaryContact: "Ruwan Jayasinghe",
    phone: "0702345678",
    email: "ruwan@lankatech.lk",
    address: "21 Lake Road, Kandy",
    date: "2024-02-05",
    cashDiscount: 5,
    creditDiscount: 0,
    quickBooking: true,
  },
];

// --- Column Definitions ---
const columns: ColumnDef<Corporate>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-purple-700">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: "Primary Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "cashDiscount",
    header: "Cash Discount",
    cell: ({ row }) => `${row.getValue("cashDiscount")}%`,
  },
  {
    accessorKey: "creditDiscount",
    header: "Credit Discount",
    cell: ({ row }) => `${row.getValue("creditDiscount")}%`,
  },
  {
    accessorKey: "quickBooking",
    header: "Quick Booking",
    cell: ({ row }) =>
      row.getValue("quickBooking") ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Enabled
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 bg-gray-50">
          Disabled
        </Badge>
      ),
  },
];

// --- Component ---
export default function CorporateReport() {
  const [data] = useState<Corporate[]>(
    mockCorporateList.map((corp) => ({
      ...corp,
      searchField: `${corp.name} ${corp.code} ${corp.email}`,
    }))
  );

  const exportCSV = () => {
    const headers = [
      "Name",
      "Code",
      "Primary Contact",
      "Phone",
      "Email",
      "Address",
      "Date",
      "Cash Discount",
      "Credit Discount",
      "Quick Booking",
    ];
    const rows = data.map((c) => [
      c.name,
      c.code,
      c.primaryContact,
      c.phone,
      c.email,
      c.address,
      c.date,
      `${c.cashDiscount}%`,
      `${c.creditDiscount}%`,
      c.quickBooking ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "corporate_report.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Corporate Report", 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Name",
          "Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Address",
          "Date",
          "Cash Disc.",
          "Credit Disc.",
          "Quick Booking",
        ],
      ],
      body: data.map((c) => [
        c.name,
        c.code,
        c.primaryContact,
        c.phone,
        c.email,
        c.address,
        c.date,
        `${c.cashDiscount}%`,
        `${c.creditDiscount}%`,
        c.quickBooking ? "Yes" : "No",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("corporate_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Report</h1>
          <p className="text-muted-foreground text-sm">
            All active corporate partners and discounts
          </p>
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
            <Building2 className="h-5 w-5" />
            Corporate Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search by name, code, or email..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}