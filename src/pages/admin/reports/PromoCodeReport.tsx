"use client";
import { useMemo } from "react";
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
  DollarSign,
  Users,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
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
// MOCK DATA
// ============================================
const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "NEW10",
    description: "10% off for first rides",
    vehicleClasses: ["ECONOMY", "STANDARD"],
    discountType: "PERCENT",
    discountValue: 10,
    isFirstTimeOnly: true,
    maxAmount: 500,
    maxCountPerUser: 1,
    maxUsage: 100,
    maxHireCount: 1,
    minHireCount: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "FIX200",
    description: "LKR 200 Flat off for Vans",
    vehicleClasses: ["VAN"],
    discountType: "FIXED",
    discountValue: 200,
    isFirstTimeOnly: false,
    maxAmount: 200,
    maxCountPerUser: 3,
    maxUsage: 500,
    maxHireCount: 3,
    minHireCount: 1,
    startDate: "2024-05-01",
    endDate: "2024-07-01",
    isActive: false,
  },
  {
    id: "3",
    code: "SUMMER25",
    description: "25% off summer special",
    vehicleClasses: ["ECONOMY", "STANDARD", "LUXURY"],
    discountType: "PERCENT",
    discountValue: 25,
    isFirstTimeOnly: false,
    maxAmount: 1000,
    maxCountPerUser: 5,
    maxUsage: 200,
    maxHireCount: 5,
    minHireCount: 0,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
  },
  {
    id: "4",
    code: "FLAT500",
    description: "LKR 500 off on luxury rides",
    vehicleClasses: ["LUXURY"],
    discountType: "FIXED",
    discountValue: 500,
    isFirstTimeOnly: true,
    maxAmount: 500,
    maxCountPerUser: 1,
    maxUsage: 50,
    maxHireCount: 1,
    minHireCount: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
  },
  {
    id: "5",
    code: "WEEK15",
    description: "15% off weekday rides",
    vehicleClasses: ["ECONOMY", "STANDARD"],
    discountType: "PERCENT",
    discountValue: 15,
    isFirstTimeOnly: false,
    maxAmount: 750,
    maxCountPerUser: 10,
    maxUsage: 1000,
    maxHireCount: 10,
    minHireCount: 0,
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    isActive: false,
  },
];

const allPromoData: PromoCode[] = mockPromoCodes.map((promo) => ({
  ...promo,
  searchField: `${promo.code} ${promo.description}`,
}));

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
    accessorKey: "maxUsage",
    header: () => <span className="font-bold text-black">Max Usage</span>,
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
// EXPORT COLUMNS (Unified)
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
  { header: "Max Hire Count", dataKey: "maxHireCount" },
  { header: "Min Hire Count", dataKey: "minHireCount" },
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
function PromoStatistics() {
  const stats = useMemo(() => {
    const active = allPromoData.filter((p) => p.isActive).length;
    const inactive = allPromoData.filter((p) => p.isActive === false).length;
    const percentType = allPromoData.filter((p) => p.discountType === "PERCENT").length;
    const firstTimeOnly = allPromoData.filter((p) => p.isFirstTimeOnly).length;

    return {
      total: allPromoData.length,
      active,
      inactive,
      percentType,
      firstTimeOnly,
    };
  }, []);

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
  return (
    <div className="space-y-6">
      <PromoStatistics />

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