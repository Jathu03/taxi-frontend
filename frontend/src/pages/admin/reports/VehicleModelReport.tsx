"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Car,
  Factory,
  Settings,
  Zap,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import modelService from "@/services/vehicle-model/modelService";
import type { VehicleModelResponse } from "@/services/vehicle-model/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type VehicleModel = {
  id: string;
  manufacturer: string;
  model: string;
  modelCode: string;
  frame: string;
  transmissionType: string;
  trimLevel: string;
  fuelInjectionType: string;
  turbo: boolean;
  turboDisplay: string;
  comments: string;
  dateModified: string;
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractModelList(response: any): VehicleModelResponse[] {
  let list: VehicleModelResponse[] = [];

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

function mapApiToReportRow(m: VehicleModelResponse): VehicleModel {
  // If your backend doesn't have these specific fields, provide safe defaults
  // `m.makeName` is used for manufacturer (from your ManageModels code)
  const manufacturer = m.makeName || "N/A";
  const model = m.model || "N/A";
  const modelCode = (m as any).modelCode || "N/A";
  const frame = (m as any).frame || "N/A";
  const transmissionType = (m as any).transmissionType || "N/A";
  const trimLevel = (m as any).trimLevel || "N/A";
  const fuelInjectionType = (m as any).fuelInjectionType || "N/A";
  const turbo = Boolean((m as any).turbo);
  const comments = (m as any).comments || "";
  const dateModified = toLocal(m.updatedAt);

  return {
    id: String(m.id),
    manufacturer,
    model,
    modelCode,
    frame,
    transmissionType,
    trimLevel,
    fuelInjectionType,
    turbo,
    turboDisplay: turbo ? "Yes" : "No",
    comments,
    dateModified,
    searchField: `${manufacturer} ${model} ${modelCode}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<VehicleModel>[] = [
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
  },
  {
    accessorKey: "model",
    header: () => <span className="font-bold text-black">Model</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-blue-700">
        {row.getValue("model")}
      </span>
    ),
  },
  {
    accessorKey: "modelCode",
    header: () => <span className="font-bold text-black">Model Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("modelCode")}</span>
    ),
  },
  {
    accessorKey: "frame",
    header: () => <span className="font-bold text-black">Frame</span>,
  },
  {
    accessorKey: "transmissionType",
    header: () => <span className="font-bold text-black">Transmission</span>,
  },
  {
    accessorKey: "trimLevel",
    header: () => <span className="font-bold text-black">Trim Level</span>,
  },
  {
    accessorKey: "fuelInjectionType",
    header: () => <span className="font-bold text-black">Fuel Injection</span>,
  },
  {
    accessorKey: "turboDisplay",
    header: () => <span className="font-bold text-black">Turbo</span>,
    cell: ({ row }) => {
      const turbo = row.original.turbo;
      return turbo ? (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <Zap className="h-3 w-3 mr-1" />
          Yes
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          No
        </Badge>
      );
    },
  },
  {
    accessorKey: "comments",
    header: () => <span className="font-bold text-black">Comments</span>,
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
  { header: "Model", dataKey: "model" },
  { header: "Model Code", dataKey: "modelCode" },
  { header: "Frame", dataKey: "frame" },
  { header: "Transmission", dataKey: "transmissionType" },
  { header: "Trim", dataKey: "trimLevel" },
  { header: "Fuel Type", dataKey: "fuelInjectionType" },
  { header: "Turbo", dataKey: "turboDisplay" },
  { header: "Comments", dataKey: "comments" },
  { header: "Modified", dataKey: "dateModified" },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function VehicleModelStatistics({
  data,
  uniqueManufacturers,
  uniqueTransmissions,
}: {
  data: VehicleModel[];
  uniqueManufacturers: string[];
  uniqueTransmissions: string[];
}) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      turboCount: data.filter((m) => m.turbo).length,
      nonTurboCount: data.filter((m) => !m.turbo).length,
      manufacturerCount: uniqueManufacturers.length,
      transmissionCount: uniqueTransmissions.length,
    };
  }, [data, uniqueManufacturers, uniqueTransmissions]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          <Car className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All vehicle models</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Manufacturers</CardTitle>
          <Factory className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.manufacturerCount}</div>
          <p className="text-xs text-muted-foreground">Unique manufacturers</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Turbo Models</CardTitle>
          <Zap className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.turboCount}</div>
          <p className="text-xs text-muted-foreground">With turbo engine</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Transmission Types</CardTitle>
          <Settings className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{stats.transmissionCount}</div>
          <p className="text-xs text-muted-foreground">Different types</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function VehicleModelReport() {
  const [allModelData, setAllModelData] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic filter options
  const uniqueManufacturers = useMemo(() => {
    return Array.from(new Set(allModelData.map((d) => d.manufacturer).filter(Boolean))).sort();
  }, [allModelData]);

  const uniqueTransmissions = useMemo(() => {
    return Array.from(new Set(allModelData.map((d) => d.transmissionType).filter(Boolean))).sort();
  }, [allModelData]);

  const manufacturerOptions = useMemo(
    () => [
      { label: "All Manufacturers", value: "all" },
      ...uniqueManufacturers.map((m) => ({ label: m, value: m })),
    ],
    [uniqueManufacturers]
  );

  const transmissionOptions = useMemo(
    () => [
      { label: "All Transmissions", value: "all" },
      ...uniqueTransmissions.map((t) => ({ label: t, value: t })),
    ],
    [uniqueTransmissions]
  );

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);

        const response: any = await modelService.getAll({
          size: 1000,
          sortBy: "updatedAt",
          sortDir: "desc",
        });

        const rawList = extractModelList(response);
        setAllModelData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load vehicle model report");
        setAllModelData([]);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
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
      <VehicleModelStatistics
        data={allModelData}
        uniqueManufacturers={uniqueManufacturers}
        uniqueTransmissions={uniqueTransmissions}
      />

      <ReportPageTemplate
        title="Vehicle Model Report"
        data={allModelData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="VehicleModelReport.pdf"
        filters={[
          {
            key: "manufacturer",
            label: "Manufacturer",
            options: manufacturerOptions,
            defaultValue: "all",
          },
          {
            key: "turboDisplay",
            label: "Turbo",
            options: [
              { label: "All", value: "all" },
              { label: "Turbo Only", value: "Yes" },
              { label: "Non-Turbo Only", value: "No" },
            ],
            defaultValue: "all",
          },
          {
            key: "transmissionType",
            label: "Transmission",
            options: transmissionOptions,
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}