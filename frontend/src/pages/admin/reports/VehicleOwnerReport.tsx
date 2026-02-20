"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Building2,
  CalendarClock,
  Mail,
  Phone,
  Users,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import ownerService from "@/services/vehicle-owner/ownerService";
import type { VehicleOwnerResponse } from "@/services/vehicle-owner/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type VehicleOwner = {
  id: string;
  name: string;
  registrationId: string;
  primaryContact: string;
  secondaryContact: string;
  hasSecondaryContact: "Yes" | "No";
  address: string;
  email: string;
  company: string;
  dateModified: string;
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractOwnerList(response: any): VehicleOwnerResponse[] {
  if (response?.success && Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) return response;
  return [];
}

function toLocal(dt?: string) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function mapApiToReportRow(o: VehicleOwnerResponse): VehicleOwner {
  const name = o.name || "N/A";
  const registrationId = o.nicOrBusinessReg || "-";
  const primaryContact = o.primaryContact || "-";
  const secondaryContact = o.secondaryContact || "";
  
  // Safe access using (o as any) in case 'address' is missing from type definition
  const address = (o as any).address || "-";
  const email = (o as any).email || "-"; 
  const company = (o as any).company || "Individual"; 
  
  const dateModified = toLocal(o.updatedAt);

  return {
    id: String(o.id),
    name,
    registrationId,
    primaryContact,
    secondaryContact,
    hasSecondaryContact: secondaryContact ? "Yes" : "No",
    address,
    email,
    company,
    dateModified,
    searchField: `${name} ${registrationId} ${email} ${company}`,
  };
}

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<VehicleOwner>[] = [
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
    accessorKey: "name",
    header: () => <span className="font-bold text-black">Personal/Company Name</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "registrationId",
    header: () => <span className="font-bold text-black">NIC/Business Reg</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("registrationId")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: () => <span className="font-bold text-black">Primary Contact</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-3 w-3 text-green-700" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "secondaryContact",
    header: () => <span className="font-bold text-black">Secondary Contact</span>,
    cell: ({ row }) => {
      const contact = row.getValue("secondaryContact") as string;
      return contact ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3 w-3" />
          {contact}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs italic">Not Provided</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <span className="font-bold text-black">Postal Address</span>,
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: () => <span className="font-bold text-black">Company</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Building2 className="h-3 w-3 text-blue-500" />
        {row.getValue("company")}
      </div>
    ),
  },
  {
    accessorKey: "dateModified",
    header: () => <span className="font-bold text-black">Date Modified</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarClock className="h-3 w-3" />
        {row.getValue("dateModified")}
      </div>
    ),
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Name", dataKey: "name" },
  { header: "NIC / Bus. Reg", dataKey: "registrationId" },
  { header: "Primary Contact", dataKey: "primaryContact" },
  { header: "Secondary Contact", dataKey: "secondaryContact" },
  { header: "Address", dataKey: "address" },
  { header: "Email", dataKey: "email" },
  { header: "Company", dataKey: "company" },
  { header: "Modified", dataKey: "dateModified" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function VehicleOwnerStatistics({ data, uniqueCompanies }: { data: VehicleOwner[]; uniqueCompanies: string[] }) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      withSecondary: data.filter((o) => o.hasSecondaryContact === "Yes").length,
      withoutSecondary: data.filter((o) => o.hasSecondaryContact === "No").length,
      companyCount: uniqueCompanies.length,
      individuals: data.filter((o) => o.company === "Individual").length,
    };
  }, [data, uniqueCompanies]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
          <Users className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Registered owners</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">With Secondary Contact</CardTitle>
          <UserCheck className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.withSecondary}</div>
          <p className="text-xs text-muted-foreground">Complete contact info</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Without Secondary</CardTitle>
          <UserX className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{stats.withoutSecondary}</div>
          <p className="text-xs text-muted-foreground">Missing secondary</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Companies</CardTitle>
          <Building2 className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.companyCount}</div>
          <p className="text-xs text-muted-foreground">Different companies</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VehicleOwnerReport() {
  const [allOwnerData, setAllOwnerData] = useState<VehicleOwner[]>([]);
  const [loading, setLoading] = useState(true);

  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(allOwnerData.map((d) => d.company).filter(Boolean))).sort();
  }, [allOwnerData]);

  const companyOptions = useMemo(
    () => [
      { label: "All Companies", value: "all" },
      ...uniqueCompanies.map((company) => ({ label: company, value: company })),
    ],
    [uniqueCompanies]
  );

  useEffect(() => {
    const loadOwners = async () => {
      try {
        setLoading(true);

        const response: any = await ownerService.getAll({
          size: 1000,
          sortBy: "updatedAt",
          sortDir: "desc",
        });

        const rawList = extractOwnerList(response);
        setAllOwnerData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load vehicle owner report");
        setAllOwnerData([]);
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
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
      <VehicleOwnerStatistics data={allOwnerData} uniqueCompanies={uniqueCompanies} />

      <ReportPageTemplate
        title="Vehicle Owner Report"
        data={allOwnerData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="VehicleOwnerReport.pdf"
        filters={[
          {
            key: "company",
            label: "Company",
            options: companyOptions,
            defaultValue: "all",
          },
          {
            key: "hasSecondaryContact",
            label: "Secondary Contact",
            options: [
              { label: "All", value: "all" },
              { label: "With Secondary Contact", value: "Yes" },
              { label: "Without Secondary Contact", value: "No" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}