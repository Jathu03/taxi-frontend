"use client";
import { useMemo } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
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
// MOCK DATA
// ============================================
const mockVehicleModels = [
  {
    id: "1",
    manufacturer: "Toyota",
    model: "Axio",
    modelCode: "NZE141",
    frame: "NZE141-1234567",
    transmissionType: "Automatic",
    trimLevel: "G",
    fuelInjectionType: "EFI",
    turbo: false,
    comments: "Standard Japanese import",
    dateModified: "2024-01-20",
  },
  {
    id: "2",
    manufacturer: "Nissan",
    model: "X-Trail",
    modelCode: "NT32",
    frame: "NT32-2345678",
    transmissionType: "CVT",
    trimLevel: "Hybrid",
    fuelInjectionType: "Direct Injection",
    turbo: true,
    comments: "Used in fleet",
    dateModified: "2024-03-18",
  },
  {
    id: "3",
    manufacturer: "Suzuki",
    model: "Wagon R",
    modelCode: "MH44S",
    frame: "MH44S-9876543",
    transmissionType: "Automatic",
    trimLevel: "FX",
    fuelInjectionType: "MPFI",
    turbo: false,
    comments: "",
    dateModified: "2024-02-10",
  },
];

const allModelData: VehicleModel[] = mockVehicleModels.map((item) => ({
  ...item,
  turboDisplay: item.turbo ? "Yes" : "No",
  searchField: `${item.manufacturer} ${item.model} ${item.modelCode}`,
}));

// Get unique values for dynamic filters
const uniqueManufacturers = [...new Set(allModelData.map((d) => d.manufacturer))].sort();
const uniqueTransmissions = [...new Set(allModelData.map((d) => d.transmissionType))].sort();

// ============================================
// TABLE COLUMNS
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
// PDF COLUMNS
// ============================================
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
// STATISTICS COMPONENT
// ============================================
function VehicleModelStatistics() {
  const stats = useMemo(() => {
    return {
      total: allModelData.length,
      turboCount: allModelData.filter((m) => m.turbo).length,
      nonTurboCount: allModelData.filter((m) => !m.turbo).length,
      manufacturerCount: uniqueManufacturers.length,
      transmissionCount: uniqueTransmissions.length,
    };
  }, []);

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
// MAIN COMPONENT
// ============================================
export default function VehicleModelReport() {
  // Build dynamic filter options
  const manufacturerOptions = useMemo(
    () => [
      { label: "All Manufacturers", value: "all" },
      ...uniqueManufacturers.map((m) => ({ label: m, value: m })),
    ],
    []
  );

  const transmissionOptions = useMemo(
    () => [
      { label: "All Transmissions", value: "all" },
      ...uniqueTransmissions.map((t) => ({ label: t, value: t })),
    ],
    []
  );

  return (
    <div className="space-y-6">
      <VehicleModelStatistics />

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