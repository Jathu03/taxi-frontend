// src/pages/VehicleOwnerReport.tsx

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  FileText,
  FileSpreadsheet,
  Building2,
  CalendarClock,
  Mail,
  Phone,
  Contact,
  User,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
type VehicleOwner = {
  id: string;
  name: string; // Personal or Company Name
  registrationId: string; // NIC or Business Reg
  primaryContact: string;
  secondaryContact?: string;
  address: string;
  email: string;
  company: string;
  dateModified: string;
  searchField?: string;
};

// --- Sample Data ---
const mockOwners: VehicleOwner[] = [
  {
    id: "o1",
    name: "Sunil Silva",
    registrationId: "901234567V", // NIC
    primaryContact: "0771234567",
    secondaryContact: "0112345678",
    address: "No 25, Temple Road, Colombo 05",
    email: "sunil@email.com",
    company: "Individual",
    dateModified: "2024-01-20",
  },
  {
    id: "o2",
    name: "Lanka Tours (Pvt) Ltd",
    registrationId: "BR987654321",
    primaryContact: "0112223344",
    secondaryContact: "0777654321",
    address: "80/A Park Street, Colombo 02",
    email: "info@lankatours.lk",
    company: "Lanka Group",
    dateModified: "2024-02-13",
  },
  {
    id: "o3",
    name: "Amila Perera",
    registrationId: "932347891V",
    primaryContact: "0711234567",
    address: "276 Kandy Road, Gampaha",
    email: "amila.p@email.com",
    company: "Individual",
    dateModified: "2024-03-01",
  },
];

// --- Columns ---
const columns: ColumnDef<VehicleOwner>[] = [
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
    header: "Personal/Company Name",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "registrationId",
    header: "NIC/Business Registration",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("registrationId")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: "Primary Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-3 w-3 text-green-700" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "secondaryContact",
    header: "Secondary Contact",
    cell: ({ row }) =>
      row.getValue("secondaryContact") ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3 w-3" />
          {row.getValue("secondaryContact")}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs italic">Not Provided</span>
      ),
  },
  {
    accessorKey: "address",
    header: "Postal Address",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Building2 className="h-3 w-3 text-blue-500" />
        {row.getValue("company")}
      </div>
    ),
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarClock className="h-3 w-3" />
        {row.getValue("dateModified")}
      </div>
    ),
  },
];

// --- Component ---
export default function VehicleOwnerReport() {
  const [data] = useState<VehicleOwner[]>(
    mockOwners.map((owner) => ({
      ...owner,
      searchField: `${owner.name} ${owner.registrationId} ${owner.email}`,
    }))
  );

  const exportCSV = () => {
    const headers = [
      "Name",
      "NIC/B.Reg",
      "Primary Contact",
      "Secondary Contact",
      "Address",
      "Email",
      "Company",
      "Date Modified",
    ];
    const rows = data.map((o) => [
      o.name,
      o.registrationId,
      o.primaryContact,
      o.secondaryContact || "",
      o.address,
      o.email,
      o.company,
      o.dateModified,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vehicle_owner_report.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Owner Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [
        [
          "Name",
          "NIC / Bus. Reg",
          "Primary",
          "Secondary",
          "Address",
          "Email",
          "Company",
          "Modified",
        ],
      ],
      body: data.map((o) => [
        o.name,
        o.registrationId,
        o.primaryContact,
        o.secondaryContact || "-",
        o.address,
        o.email,
        o.company,
        o.dateModified,
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("vehicle_owner_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Owner Report</h1>
          <p className="text-muted-foreground text-sm">
            Overview of personal or company vehicle owners
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
            <User className="h-5 w-5" />
            Owners
            <Badge variant="outline" className="text-muted-foreground ml-2">
              {data.length} Records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search name, NIC, or email..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}