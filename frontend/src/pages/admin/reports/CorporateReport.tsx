"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import corporateService from "@/services/corporate/corporateService";
import type { CorporateResponse } from "@/services/corporate/types";

// ============================================
// TYPE DEFINITION (Report Row)
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
// HELPERS
// ============================================

function extractCorporateList(response: any): CorporateResponse[] {
  // Handle direct array vs API wrapper
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  return [];
}

function toLocal(dt?: string) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function mapApiToReportRow(c: CorporateResponse): Corporate {
  const name = c.name || "N/A";
  const code = c.code || "-";
  const phone = c.phone || "-"; // Corrected: removed c.contactNumber
  const email = c.email || "-";
  const address = c.address || "-";
  const primaryContact = c.primaryContact || "-";

  // Use registrationDate if available, else createdAt
  const date = toLocal(c.registrationDate || c.createdAt);

  const cashDiscount = Number(c.cashDiscountRate || 0);
  const creditDiscount = Number(c.creditDiscountRate || 0);
  const quickBooking = Boolean(c.enableQuickBooking);
  const status = c.isActive ? "Active" : "Inactive";

  return {
    id: String(c.id),
    name,
    code,
    primaryContact,
    phone,
    email,
    address,
    date,
    cashDiscount,
    creditDiscount,
    quickBooking,
    status,
    searchField: `${name} ${code} ${email}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
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
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
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
    formatter: (value: number) => `${value}%`,
  },
  {
    header: "Credit Discount",
    dataKey: "creditDiscount",
    formatter: (value: number) => `${value}%`,
  },
  {
    header: "Quick Booking",
    dataKey: "quickBooking",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
  { header: "Status", dataKey: "status" },
];

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function CorporateReport() {
  const [allCorporateData, setAllCorporateData] = useState<Corporate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Your service method is getAllCorporates, not getAll
        const response: any = await corporateService.getAllCorporates();

        const rawList = extractCorporateList(response);
        setAllCorporateData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load corporate report");
        setAllCorporateData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ReportPageTemplate
      title="Corporate Partners Audit Report"
      data={allCorporateData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
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