"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Truck,
  CheckCircle,
  XCircle,
  Smartphone,
  Car,
  Percent,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import classService from "@/services/vehicle-class/classService";
import type { VehicleClassResponse } from "@/services/vehicle-class/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type VehicleClass = {
  id: string;
  className: string;
  classCode: string;
  showInApp: boolean;
  fareScheme: string;
  corporateFareScheme: string;
  roadTripFareScheme: string;
  appFareScheme: string;
  commission: number;
  status: "Active" | "Inactive";
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractClassList(response: any): VehicleClassResponse[] {
  if (response?.success && Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) return response;
  return [];
}

const getClassBadgeClass = (className: string) => {
  const name = (className || "").toUpperCase();
  if (name.includes("ECONOMY")) return "bg-green-100 text-green-800";
  if (name.includes("LUXURY")) return "bg-purple-100 text-purple-800";
  if (name.includes("VAN")) return "bg-blue-100 text-blue-800";
  if (name.includes("STANDARD")) return "bg-gray-100 text-gray-800";
  if (name.includes("BUS")) return "bg-orange-100 text-orange-800";
  if (name.includes("TUK")) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

function mapApiToReportRow(c: VehicleClassResponse): VehicleClass {
  const className = c.className || "N/A";
  const classCode = c.classCode || "-";
  
  // Assuming your backend has these fields. If not, use defaults or adjust mapping.
  const showInApp = Boolean((c as any).showInApp);
  const commission = Number((c as any).commissionRate || (c as any).commission || 0);
  const status = (c as any).status === "Inactive" ? "Inactive" : "Active"; 

  // Fare schemes might be nested or direct
  const fareScheme = (c as any).fareSchemeName || (c as any).defaultFareScheme || "Standard";
  const corporateFareScheme = (c as any).corporateFareSchemeName || "-";
  const roadTripFareScheme = (c as any).roadTripFareSchemeName || "-";
  const appFareScheme = (c as any).appFareSchemeName || "-";

  return {
    id: String(c.id),
    className,
    classCode,
    showInApp,
    fareScheme,
    corporateFareScheme,
    roadTripFareScheme,
    appFareScheme,
    commission,
    status,
    searchField: `${className} ${classCode}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<VehicleClass>[] = [
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
    accessorKey: "className",
    header: () => <span className="font-bold text-black">Class Name</span>,
    cell: ({ row }) => {
      const className = row.getValue("className") as string;
      return (
        <Badge className={getClassBadgeClass(className)}>
          <Car className="h-3 w-3 mr-1" />
          {className}
        </Badge>
      );
    },
  },
  {
    accessorKey: "classCode",
    header: () => <span className="font-bold text-black">Class Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm font-bold text-purple-700">
        {row.getValue("classCode")}
      </span>
    ),
  },
  {
    accessorKey: "showInApp",
    header: () => <span className="font-bold text-black">Show in App</span>,
    cell: ({ row }) =>
      row.getValue("showInApp") ? (
        <Badge variant="outline" className="text-green-700 bg-green-50 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-700 bg-red-50 border-red-300">
          <XCircle className="h-3 w-3 mr-1" /> No
        </Badge>
      ),
  },
  {
    accessorKey: "fareScheme",
    header: () => <span className="font-bold text-black">Fare Scheme</span>,
  },
  {
    accessorKey: "corporateFareScheme",
    header: () => <span className="font-bold text-black">Corporate Fare</span>,
  },
  {
    accessorKey: "roadTripFareScheme",
    header: () => <span className="font-bold text-black">RoadTrip Fare</span>,
  },
  {
    accessorKey: "appFareScheme",
    header: () => <span className="font-bold text-black">App Fare</span>,
  },
  {
    accessorKey: "commission",
    header: () => <span className="font-bold text-black">Commission (%)</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">{row.getValue("commission")}%</span>
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
  { header: "Class", dataKey: "className" },
  { header: "Code", dataKey: "classCode" },
  {
    header: "Show in App",
    dataKey: "showInApp",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
  { header: "Fare", dataKey: "fareScheme" },
  { header: "Corporate", dataKey: "corporateFareScheme" },
  { header: "RoadTrip", dataKey: "roadTripFareScheme" },
  { header: "App Fare", dataKey: "appFareScheme" },
  {
    header: "Commission",
    dataKey: "commission",
    formatter: (value: number) => `${value}%`,
  },
  { header: "Status", dataKey: "status" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function VehicleClassStatistics({ data }: { data: VehicleClass[] }) {
  const stats = useMemo(() => {
    const avgCommission =
      data.length > 0
        ? Math.round(data.reduce((sum, v) => sum + v.commission, 0) / data.length)
        : 0;

    return {
      total: data.length,
      active: data.filter((v) => v.status === "Active").length,
      inactive: data.filter((v) => v.status === "Inactive").length,
      showInApp: data.filter((v) => v.showInApp === true).length,
      avgCommission,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
          <Truck className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All vehicle classes</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Visible in App</CardTitle>
          <Smartphone className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.showInApp}</div>
          <p className="text-xs text-muted-foreground">Show in mobile app</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
          <Percent className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{stats.avgCommission}%</div>
          <p className="text-xs text-muted-foreground">Average rate</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function VehicleClassReport() {
  const [allClassData, setAllClassData] = useState<VehicleClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);

        const response: any = await classService.getAll();
        const rawList = extractClassList(response);

        setAllClassData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load vehicle class report");
        setAllClassData([]);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
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
      <VehicleClassStatistics data={allClassData} />

      <ReportPageTemplate
        title="Vehicle Class Audit Report"
        data={allClassData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="VehicleClassReport.pdf"
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
            key: "showInApp",
            label: "App Visibility",
            options: [
              { label: "All", value: "all" },
              { label: "Visible in App", value: "true" },
              { label: "Hidden in App", value: "false" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}