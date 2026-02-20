"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Factory,
  CalendarClock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import makeService from "@/services/vehicle-make/makeService";
import type { VehicleMakeResponse } from "@/services/vehicle-make/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type VehicleMake = {
  id: string;
  manufacturer: string;
  code: string;
  dateModified: string;
  status: "active" | "inactive";
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractMakeList(response: any): VehicleMakeResponse[] {
  let list: VehicleMakeResponse[] = [];

  if (response?.success === true && response?.data) {
    if (Array.isArray(response.data)) {
      list = response.data;
    } else if (Array.isArray(response.data?.content)) {
      list = response.data.content;
    }
  } else if (Array.isArray(response?.content)) {
    list = response.content;
  } else if (Array.isArray(response)) {
    list = response;
  }

  return list;
}

function toLocal(dt?: string) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
}

function mapApiToReportRow(m: VehicleMakeResponse): VehicleMake {
  const manufacturer = m.manufacturer || "N/A";
  const code = m.manufacturerCode || "-";
  const dateModified = toLocal(m.updatedAt);

  // If your backend doesn't have a status field, default to active or derive it.
  // Assuming 'active' for now as it's not in standard VehicleMakeResponse
  const status: "active" | "inactive" = (m as any).status === "inactive" ? "inactive" : "active";

  return {
    id: String(m.id),
    manufacturer,
    code,
    dateModified,
    status,
    searchField: `${manufacturer} ${code}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<VehicleMake>[] = [
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
    accessorKey: "manufacturer",
    header: () => <span className="font-bold text-black">Manufacturer</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-blue-700">
        {row.getValue("manufacturer")}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Manufacturer Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return status === "active" ? (
        <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
      ) : (
        <Badge variant="outline" className="text-red-600 border-red-300">
          Inactive
        </Badge>
      );
    },
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
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Manufacturer", dataKey: "manufacturer" },
  { header: "Code", dataKey: "code" },
  { header: "Status", dataKey: "status" },
  { header: "Date Modified", dataKey: "dateModified" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function VehicleMakeStatistics({ data }: { data: VehicleMake[] }) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      active: data.filter((m) => m.status === "active").length,
      inactive: data.filter((m) => m.status === "inactive").length,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Manufacturers</CardTitle>
          <Factory className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Registered manufacturers</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Active manufacturers</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          <XCircle className="h-4 w-4 text-red-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{stats.inactive}</div>
          <p className="text-xs text-muted-foreground">Inactive manufacturers</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function VehicleMakeReport() {
  const [allMakeData, setAllMakeData] = useState<VehicleMake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMakes = async () => {
      try {
        setLoading(true);

        const response: any = await makeService.getAll({
          size: 1000,
          sortBy: "updatedAt",
          sortDir: "desc",
        });

        const rawList = extractMakeList(response);
        setAllMakeData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load vehicle make report");
        setAllMakeData([]);
      } finally {
        setLoading(false);
      }
    };

    loadMakes();
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
      <VehicleMakeStatistics data={allMakeData} />

      <ReportPageTemplate
        title="Vehicle Make Report"
        data={allMakeData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="VehicleMakeReport.pdf"
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All Manufacturers", value: "all" },
              { label: "Active Only", value: "active" },
              { label: "Inactive Only", value: "inactive" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}