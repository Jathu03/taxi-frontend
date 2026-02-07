"use client";
import { useMemo } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
type FareScheme = {
  id: string;
  schemeName: string;
  vehicleClass: "ECONOMY" | "LUXURY" | "VAN" | "TUK" | "STANDARD";
  baseFare: number;
  perKm: number;
  perMin: number;
  searchField?: string;
};

// ============================================
// MOCK DATA
// ============================================
const mockFareSchemes: FareScheme[] = [
  {
    id: "1",
    schemeName: "Standard Scheme A",
    vehicleClass: "ECONOMY",
    baseFare: 150,
    perKm: 50,
    perMin: 5,
  },
  {
    id: "2",
    schemeName: "Corporate Executive",
    vehicleClass: "LUXURY",
    baseFare: 450,
    perKm: 100,
    perMin: 15,
  },
  {
    id: "3",
    schemeName: "Weekend Special",
    vehicleClass: "VAN",
    baseFare: 300,
    perKm: 80,
    perMin: 8,
  },
  {
    id: "4",
    schemeName: "Budget Tuk",
    vehicleClass: "TUK",
    baseFare: 100,
    perKm: 30,
    perMin: 3,
  },
  {
    id: "5",
    schemeName: "City Standard",
    vehicleClass: "STANDARD",
    baseFare: 200,
    perKm: 60,
    perMin: 6,
  },
  {
    id: "6",
    schemeName: "Economy Plus",
    vehicleClass: "ECONOMY",
    baseFare: 180,
    perKm: 55,
    perMin: 5,
  },
  {
    id: "7",
    schemeName: "Premium Van",
    vehicleClass: "VAN",
    baseFare: 400,
    perKm: 90,
    perMin: 10,
  },
  {
    id: "8",
    schemeName: "Luxury Elite",
    vehicleClass: "LUXURY",
    baseFare: 600,
    perKm: 120,
    perMin: 20,
  },
];

const allFareData: FareScheme[] = mockFareSchemes.map((f) => ({
  ...f,
  searchField: `${f.schemeName} ${f.vehicleClass}`,
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
const getVehicleClassBadge = (vehicleClass: string) => {
  const classMap: Record<string, string> = {
    ECONOMY: "bg-green-100 text-green-800 border-green-300",
    LUXURY: "bg-purple-100 text-purple-800 border-purple-300",
    VAN: "bg-blue-100 text-blue-800 border-blue-300",
    TUK: "bg-yellow-100 text-yellow-800 border-yellow-300",
    STANDARD: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return classMap[vehicleClass] || "bg-gray-100 text-gray-800";
};

// ============================================
// TABLE COLUMNS
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
// PDF COLUMNS
// ============================================
const pdfColumns = [
  { header: "Scheme Name", dataKey: "schemeName" },
  { header: "Vehicle Class", dataKey: "vehicleClass" },
  { header: "Base Fare", dataKey: "baseFare" },
  { header: "Per KM", dataKey: "perKm" },
  { header: "Per Min", dataKey: "perMin" },
];

// ============================================
// CSV COLUMNS
// ============================================
const csvColumns = [
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
];

// ============================================
// STATISTICS COMPONENT
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
      total: allFareData.length,
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
// MAIN COMPONENT
// ============================================
export default function FareSchemeReport() {
  return (
    <div className="space-y-6">
      <FareStatistics data={allFareData} />

      <ReportPageTemplate
        title="Fare Scheme Audit Report"
        data={allFareData}
        tableColumns={tableColumns}
        pdfColumns={pdfColumns}
        csvColumns={csvColumns}
        searchKey="searchField"
        fileName="FareSchemeReport.pdf"
        filters={[
          {
            key: "vehicleClass",
            label: "Vehicle Class",
            options: [
              { label: "All Classes", value: "all" },
              { label: "Economy", value: "ECONOMY" },
              { label: "Luxury", value: "LUXURY" },
              { label: "Van", value: "VAN" },
              { label: "Tuk", value: "TUK" },
              { label: "Standard", value: "STANDARD" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}