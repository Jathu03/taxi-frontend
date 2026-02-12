"use client";
import { useMemo } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
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
// MOCK DATA
// ============================================
const mockVehicleMakes: VehicleMake[] = [
  {
    id: "1",
    manufacturer: "Toyota",
    code: "TOY",
    dateModified: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    manufacturer: "Nissan",
    code: "NIS",
    dateModified: "2024-02-01",
    status: "active",
  },
  {
    id: "3",
    manufacturer: "Suzuki",
    code: "SUZ",
    dateModified: "2024-03-10",
    status: "inactive",
  },
  {
    id: "4",
    manufacturer: "Mitsubishi",
    code: "MIT",
    dateModified: "2024-01-28",
    status: "active",
  },
];

const allMakeData: VehicleMake[] = mockVehicleMakes.map((m) => ({
  ...m,
  searchField: `${m.manufacturer} ${m.code}`,
}));

// ============================================
// TABLE COLUMNS
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
// PDF COLUMNS
// ============================================
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
// STATISTICS COMPONENT
// ============================================
function VehicleMakeStatistics() {
  const stats = useMemo(() => {
    return {
      total: allMakeData.length,
      active: allMakeData.filter((m) => m.status === "active").length,
      inactive: allMakeData.filter((m) => m.status === "inactive").length,
    };
  }, []);

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
// MAIN COMPONENT
// ============================================
export default function VehicleMakeReport() {
  return (
    <div className="space-y-6">
      <VehicleMakeStatistics />

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