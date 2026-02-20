"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Percent,
  CheckCircle,
  XCircle,
  Tag,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

// Services
import promoService from "@/services/promo-codes/promoService";
import classService from "@/services/vehicle-class/classService"; 
import type { PromoCodeResponse } from "@/services/promo-codes/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
export type PromoCode = {
  id: string;
  code: string;
  description: string;
  vehicleClasses: string[];
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  isFirstTimeOnly: boolean;
  maxAmount: number;
  maxCountPerUser: number;
  maxUsage: number;
  maxHireCount: number;
  minHireCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractList(response: any): any[] {
  if (response?.success && Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

// Updated to accept any type to fix TS error
function toLocal(dt: any) {
  if (!dt) return "-";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

function mapApiToReportRow(
  p: PromoCodeResponse,
  classMap: Record<number, string>
): PromoCode {
  const classNames = (p.vehicleClassIds || []).map(
    (id) => classMap[id] || `Class ${id}`
  );

  const discountType =
    p.discountType === "PERCENTAGE" ? "PERCENT" : "FIXED";

  return {
    id: String(p.id),
    code: p.code,
    description: p.description || "-",
    vehicleClasses: classNames.length > 0 ? classNames : ["All"],
    discountType,
    discountValue: p.discountValue,
    isFirstTimeOnly: p.isFirstTimeOnly,
    maxAmount: p.maxDiscountAmount || 0,
    maxCountPerUser: p.maxUsagePerCustomer || 0,
    maxUsage: p.maxUsage || 0,
    maxHireCount: p.maxHireCount || 0,
    minHireCount: p.minimumHireCount || 0,
    
    // Using any cast or allowing Date object input via updated helper
    startDate: toLocal(p.startDate),
    endDate: toLocal(p.endDate),
    
    isActive: p.isActive,
    searchField: `${p.code} ${p.description}`,
  };
}

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<PromoCode>[] = [
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
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <span className="font-mono font-bold text-violet-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => <span className="font-bold text-black">Description</span>,
  },
  {
    accessorKey: "vehicleClasses",
    header: () => <span className="font-bold text-black">Vehicle Classes</span>,
    cell: ({ row }) => {
      const classes = row.getValue("vehicleClasses") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {classes.map((vc) => (
            <Badge key={vc} variant="secondary">
              {vc}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "discountType",
    header: () => <span className="font-bold text-black">Discount In</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.getValue("discountType") === "PERCENT"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }
      >
        {row.getValue("discountType") === "PERCENT" ? "%" : "LKR"}
      </Badge>
    ),
  },
  {
    accessorKey: "discountValue",
    header: () => <span className="font-bold text-black">Discount Value</span>,
    cell: ({ row }) => {
      const type = row.original.discountType;
      const value = row.getValue("discountValue");
      return (
        <span className="font-bold text-green-700">
          {type === "PERCENT" ? `${value}%` : `LKR ${value}`}
        </span>
      );
    },
  },
  {
    accessorKey: "isFirstTimeOnly",
    header: () => <span className="font-bold text-black">First Time Only</span>,
    cell: ({ row }) =>
      row.getValue("isFirstTimeOnly") ? (
        <Badge variant="outline" className="text-green-700 bg-green-50 border-green-300">
          Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-300">
          No
        </Badge>
      ),
  },
  {
    accessorKey: "maxAmount",
    header: () => <span className="font-bold text-black">Max Amount</span>,
    cell: ({ row }) => `LKR ${row.getValue("maxAmount")}`,
  },
  {
    accessorKey: "maxCountPerUser",
    header: () => <span className="font-bold text-black">Max/User</span>,
  },
  {
    accessorKey: "startDate",
    header: () => <span className="font-bold text-black">Start Date</span>,
  },
  {
    accessorKey: "endDate",
    header: () => <span className="font-bold text-black">End Date</span>,
  },
  {
    accessorKey: "isActive",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) =>
      row.getValue("isActive") ? (
        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
          <CheckCircle className="h-3 w-3 mr-1" /> Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
          <XCircle className="h-3 w-3 mr-1" /> Inactive
        </Badge>
      ),
  },
];

// ============================================
// EXPORT COLUMNS
// ============================================
const exportColumns = [
  { header: "Code", dataKey: "code" },
  { header: "Description", dataKey: "description" },
  {
    header: "Vehicle Classes",
    dataKey: "vehicleClasses",
    formatter: (value: string[]) => value.join(" / "),
  },
  { header: "Discount Type", dataKey: "discountType" },
  { header: "Discount Value", dataKey: "discountValue" },
  {
    header: "First Time Only",
    dataKey: "isFirstTimeOnly",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
  { header: "Max Amount", dataKey: "maxAmount" },
  { header: "Max Count Per User", dataKey: "maxCountPerUser" },
  { header: "Max Usage", dataKey: "maxUsage" },
  { header: "Start Date", dataKey: "startDate" },
  { header: "End Date", dataKey: "endDate" },
  {
    header: "Is Active",
    dataKey: "isActive",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function PromoStatistics({ data }: { data: PromoCode[] }) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((p) => p.isActive).length,
      inactive: data.filter((p) => !p.isActive).length,
      percentType: data.filter((p) => p.discountType === "PERCENT").length,
      firstTimeOnly: data.filter((p) => p.isFirstTimeOnly).length,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Promo Codes</CardTitle>
          <Tag className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All promotional offers</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently available</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Percentage Type</CardTitle>
          <Percent className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.percentType}</div>
          <p className="text-xs text-muted-foreground">% based discounts</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">First Time Only</CardTitle>
          <Users className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{stats.firstTimeOnly}</div>
          <p className="text-xs text-muted-foreground">New user offers</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function PromoCodeReport() {
  const [allPromoData, setAllPromoData] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [promoRes, classRes] = await Promise.all([
          promoService.getAll({ size: 1000, sortBy: "createdAt", sortDir: "desc" }),
          classService.getAll(),
        ]);

        const promoList = extractList(promoRes);
        const classList = extractList(classRes);

        const classMap: Record<number, string> = {};
        classList.forEach((c: any) => {
          if (c.id) classMap[c.id] = c.className || c.name || "Unknown";
        });

        setAllPromoData(promoList.map((p) => mapApiToReportRow(p, classMap)));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load promo code report");
        setAllPromoData([]);
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
    <div className="space-y-6">
      <PromoStatistics data={allPromoData} />

      <ReportPageTemplate
        title="Promo Code Audit Report"
        data={allPromoData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="PromoCodeReport.pdf"
        filters={[
          {
            key: "isActive",
            label: "Status",
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active Only", value: "true" },
              { label: "Inactive Only", value: "false" },
            ],
            defaultValue: "all",
          },
          {
            key: "discountType",
            label: "Discount Type",
            options: [
              { label: "All Types", value: "all" },
              { label: "Percentage Only", value: "PERCENT" },
              { label: "Fixed Amount Only", value: "FIXED" },
            ],
            defaultValue: "all",
          },
          {
            key: "isFirstTimeOnly",
            label: "User Type",
            options: [
              { label: "All Users", value: "all" },
              { label: "First Time Only", value: "true" },
              { label: "Repeat Users", value: "false" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}