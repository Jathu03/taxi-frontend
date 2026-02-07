"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Mail } from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
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
  status: "Active" | "Inactive";
  searchField?: string;
};

// ============================================
// MOCK DATA
// ============================================
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
    status: "Active",
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
    status: "Active",
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
    status: "Active",
  },
  {
    id: "c4",
    name: "Global Services",
    code: "CORP-004",
    primaryContact: "Kamani Silva",
    phone: "0768901234",
    email: "kamani@global.lk",
    address: "45 Main Street, Galle",
    date: "2023-12-20",
    cashDiscount: 0,
    creditDiscount: 0,
    quickBooking: false,
    status: "Inactive",
  },
];

const allCorporateData: Corporate[] = mockCorporateList.map((corp) => ({
  ...corp,
  searchField: `${corp.name} ${corp.code} ${corp.email}`,
}));

// ============================================
// TABLE COLUMNS (For UI DataTable)
// ============================================
const tableColumns: ColumnDef<Corporate>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: () => <span className="font-bold text-black">Name</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-purple-700">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: () => <span className="font-bold text-black">Primary Contact</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => <span className="font-bold text-black">Phone</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => <span className="font-bold text-black">Address</span>,
  },
  {
    accessorKey: "cashDiscount",
    header: () => <span className="font-bold text-black">Cash Discount</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">{row.getValue("cashDiscount")}%</span>
    ),
  },
  {
    accessorKey: "creditDiscount",
    header: () => <span className="font-bold text-black">Credit Discount</span>,
    cell: ({ row }) => (
      <span className="font-bold text-blue-700">{row.getValue("creditDiscount")}%</span>
    ),
  },
  {
    accessorKey: "quickBooking",
    header: () => <span className="font-bold text-black">Quick Booking</span>,
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
// PDF COLUMNS (For PDF Export)
// ============================================
const pdfColumns = [
  { header: "Name", dataKey: "name" },
  { header: "Code", dataKey: "code" },
  { header: "Contact", dataKey: "primaryContact" },
  { header: "Phone", dataKey: "phone" },
  { header: "Email", dataKey: "email" },
  { header: "Address", dataKey: "address" },
  { header: "Cash Disc.", dataKey: "cashDiscount" },
  { header: "Credit Disc.", dataKey: "creditDiscount" },
  { header: "Quick Booking", dataKey: "quickBooking" },
  { header: "Status", dataKey: "status" },
];

// ============================================
// CSV COLUMNS (For CSV Export - More Detailed)
// ============================================
const csvColumns = [
  { header: "Name", dataKey: "name" },
  { header: "Code", dataKey: "code" },
  { header: "Primary Contact", dataKey: "primaryContact" },
  { header: "Phone", dataKey: "phone" },
  { header: "Email", dataKey: "email" },
  { header: "Address", dataKey: "address" },
  { header: "Date", dataKey: "date" },
  { 
    header: "Cash Discount", 
    dataKey: "cashDiscount",
    formatter: (value: number) => `${value}%`
  },
  { 
    header: "Credit Discount", 
    dataKey: "creditDiscount",
    formatter: (value: number) => `${value}%`
  },
  { 
    header: "Quick Booking", 
    dataKey: "quickBooking",
    formatter: (value: boolean) => value ? "Yes" : "No"
  },
  { header: "Status", dataKey: "status" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function CorporateReport() {
  return (
    <ReportPageTemplate
      title="Corporate Partners Audit Report"
      data={allCorporateData}
      tableColumns={tableColumns}
      pdfColumns={pdfColumns}
      csvColumns={csvColumns}
      searchKey="searchField"
      fileName="CorporateReport.pdf"
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
          key: "quickBooking",
          label: "Quick Booking",
          options: [
            { label: "All", value: "all" },
            { label: "Enabled Only", value: "true" },
            { label: "Disabled Only", value: "false" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}