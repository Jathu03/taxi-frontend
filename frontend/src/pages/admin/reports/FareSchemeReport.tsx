"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BadgePercent,
  CarFront,
  DollarSign,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import fareService from "@/services/fare-schemes/fareService";
import type { FareSchemeResponse } from "@/services/fare-schemes/types";

// ============================================
// TYPE DEFINITION (Report Row)
// ============================================
type FareScheme = {
  id: string;
  schemeName: string;
  vehicleClass: string; // Not restricted to enum for report flexibility
  baseFare: number;
  perKm: number;
  perMin: number;
  metered: boolean;
  searchField?: string;
};

// ============================================
// HELPERS
// ============================================

function extractFareList(response: any): FareSchemeResponse[] {
  let list: FareSchemeResponse[] = [];

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

function mapApiToReportRow(f: FareSchemeResponse): FareScheme {
  const schemeName = f.fareCode || f.fareName || `Scheme ${f.id}`;
  
  // If your backend doesn't explicitly link class name in FareSchemeResponse,
  // we might need to derive or default it. Assuming `className` or generic.
  const vehicleClass = (f as any).className || (f as any).vehicleClass || "Standard";

  const baseFare = Number(f.minimumRate || 0);
  const perKm = Number(f.ratePerKm || 0);
  // If backend uses waiting charge as time charge:
  const perMin = Number((f as any).waitingChargePerMinute || (f as any).ratePerMin || 0);

  return {
    id: String(f.id),
    schemeName,
    vehicleClass,
    baseFare,
    perKm,
    perMin,
    metered: Boolean(f.isMetered),
    searchField: `${schemeName} ${vehicleClass}`,
  };
}

const getVehicleClassBadge = (vehicleClass: string) => {
  const cls = (vehicleClass || "").toUpperCase();
  if (cls.includes("ECONOMY")) return "bg-green-100 text-green-800 border-green-300";
  if (cls.includes("LUXURY")) return "bg-purple-100 text-purple-800 border-purple-300";
  if (cls.includes("VAN")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (cls.includes("TUK")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-gray-100 text-gray-800 border-gray-300";
};

// ============================================
// TABLE COLUMNS (same format)
// ============================================
const tableColumns: ColumnDef<FareScheme>[] = [
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
    accessorKey: "schemeName",
    header: () => <span className="font-bold text-black">Scheme Name</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-violet-700">
        {row.getValue("schemeName")}
      </span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`uppercase ${getVehicleClassBadge(row.getValue("vehicleClass"))}`}
      >
        {row.getValue("vehicleClass")}
      </Badge>
    ),
  },
  {
    accessorKey: "baseFare",
    header: () => <span className="font-bold text-black">Base Fare</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <DollarSign className="h-3 w-3 text-green-600" />
        <span className="font-bold text-green-700">
          LKR {row.getValue("baseFare")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "perKm",
    header: () => <span className="font-bold text-black">Per KM</span>,
    cell: ({ row }) => (
      <span className="font-semibold">LKR {row.getValue("perKm")}</span>
    ),
  },
  {
    accessorKey: "perMin",
    header: () => <span className="font-bold text-black">Per Min</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-blue-600" />
        <span className="font-semibold">LKR {row.getValue("perMin")}</span>
      </div>
    ),
  },
];

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Scheme Name", dataKey: "schemeName" },
  { header: "Vehicle Class", dataKey: "vehicleClass" },
  {
    header: "Base Fare",
    dataKey: "baseFare",
    formatter: (value: number) => `LKR ${value}`,
  },
  {
    header: "Per KM",
    dataKey: "perKm",
    formatter: (value: number) => `LKR ${value}`,
  },
  {
    header: "Per Min",
    dataKey: "perMin",
    formatter: (value: number) => `LKR ${value}`,
  },
  {
    header: "Metered",
    dataKey: "metered",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
];

// ============================================
// STATISTICS COMPONENT (uses live data)
// ============================================
function FareStatistics({ data }: { data: FareScheme[] }) {
  const stats = useMemo(() => {
    const avgBaseFare =
      data.length > 0
        ? Math.round(data.reduce((sum, f) => sum + f.baseFare, 0) / data.length)
        : 0;
    const avgPerKm =
      data.length > 0
        ? Math.round(data.reduce((sum, f) => sum + f.perKm, 0) / data.length)
        : 0;
    const avgPerMin =
      data.length > 0
        ? Math.round(data.reduce((sum, f) => sum + f.perMin, 0) / data.length)
        : 0;

    return {
      total: data.length,
      avgBaseFare,
      avgPerKm,
      avgPerMin,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Schemes</CardTitle>
          <BadgePercent className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All fare schemes</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Base Fare</CardTitle>
          <DollarSign className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            LKR {stats.avgBaseFare}
          </div>
          <p className="text-xs text-muted-foreground">Filtered average</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Per KM</CardTitle>
          <CarFront className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">LKR {stats.avgPerKm}</div>
          <p className="text-xs text-muted-foreground">Distance rate</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Per Min</CardTitle>
          <Clock className="h-4 w-4 text-orange-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            LKR {stats.avgPerMin}
          </div>
          <p className="text-xs text-muted-foreground">Time rate</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT (backend integrated)
// ============================================
export default function FareSchemeReport() {
  const [allFareData, setAllFareData] = useState<FareScheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic filter options
  const vehicleClassOptions = useMemo(() => {
    const unique = Array.from(new Set(allFareData.map(f => f.vehicleClass))).sort();
    return [
      { label: "All Classes", value: "all" },
      ...unique.map(c => ({ label: c, value: c }))
    ];
  }, [allFareData]);

  useEffect(() => {
    const loadFares = async () => {
      try {
        setLoading(true);

        const response: any = await fareService.getAll({
          size: 1000,
          sortBy: "fareCode",
          sortDir: "asc",
        });

        const rawList = extractFareList(response);
        setAllFareData(rawList.map(mapApiToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load fare scheme report");
        setAllFareData([]);
      } finally {
        setLoading(false);
      }
    };

    loadFares();
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
      <FareStatistics data={allFareData} />

      <ReportPageTemplate
        title="Fare Scheme Audit Report"
        data={allFareData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="FareSchemeReport.pdf"
        filters={[
          {
            key: "vehicleClass",
            label: "Vehicle Class",
            options: vehicleClassOptions,
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}