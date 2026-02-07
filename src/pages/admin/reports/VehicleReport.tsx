// src/pages/VehicleReport.tsx

"use client";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CarFront,
  CalendarClock,
  ShieldCheck,
  Factory,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// ============================================
// TYPE DEFINITION
// ============================================
type Vehicle = {
  id: string;
  registrationNo: string;
  code: string;
  vehicleClass: string;
  manufacture: string;
  model: string;
  insuranceExpiry: string;
  licenseExpiry: string;
  insuranceStatus: "Valid" | "Expired";
  searchField?: string;
};

// ============================================
// MOCK DATA
// ============================================
const mockVehicleData = [
  {
    id: "v1",
    registrationNo: "CAB-1234",
    code: "VEH-001",
    vehicleClass: "ECONOMY",
    manufacture: "Toyota",
    model: "Axio",
    insuranceExpiry: "2024-12-31",
    licenseExpiry: "2024-10-15",
  },
  {
    id: "v2",
    registrationNo: "LUX-5678",
    code: "VEH-002",
    vehicleClass: "LUXURY",
    manufacture: "BMW",
    model: "5 Series",
    insuranceExpiry: "2025-01-20",
    licenseExpiry: "2024-11-10",
  },
  {
    id: "v3",
    registrationNo: "BUS-9090",
    code: "VEH-003",
    vehicleClass: "BUS",
    manufacture: "Nissan",
    model: "Civilian",
    insuranceExpiry: "2025-03-15",
    licenseExpiry: "2024-12-01",
  },
  {
    id: "v4",
    registrationNo: "ECO-2345",
    code: "VEH-004",
    vehicleClass: "ECONOMY",
    manufacture: "Suzuki",
    model: "Alto",
    insuranceExpiry: "2025-02-01",
    licenseExpiry: "2024-10-01",
  },
];

// Transform data with computed fields
const today = new Date().toISOString().split("T")[0];
const allVehicleData: Vehicle[] = mockVehicleData.map((v) => ({
  ...v,
  insuranceStatus: v.insuranceExpiry >= today ? "Valid" : "Expired",
  searchField: `${v.registrationNo} ${v.code} ${v.model} ${v.manufacture}`,
}));

// Get unique values for dynamic filters
const uniqueClasses = [...new Set(allVehicleData.map((d) => d.vehicleClass))].sort();
const uniqueManufactures = [...new Set(allVehicleData.map((d) => d.manufacture))].sort();

// ============================================
// TABLE COLUMNS
// ============================================
const tableColumns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "registrationNo",
    header: () => <span className="font-bold text-black">Registration No</span>,
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-blue-700">
        {row.getValue("registrationNo")}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: () => <span className="font-bold text-black">Class</span>,
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("vehicleClass")}</Badge>
    ),
  },
  {
    accessorKey: "manufacture",
    header: () => <span className="font-bold text-black">Manufacture</span>,
  },
  {
    accessorKey: "model",
    header: () => <span className="font-bold text-black">Model</span>,
  },
  {
    accessorKey: "insuranceExpiry",
    header: () => <span className="font-bold text-black">Insurance Expiry</span>,
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("insuranceExpiry")}</Badge>
    ),
  },
  {
    accessorKey: "licenseExpiry",
    header: () => <span className="font-bold text-black">License Expiry</span>,
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("licenseExpiry")}</Badge>
    ),
  },
  {
    accessorKey: "insuranceStatus",
    header: () => <span className="font-bold text-black">Insurance Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("insuranceStatus") as string;
      return status === "Valid" ? (
        <Badge className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      ) : (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    },
  },
];

// ============================================
// PDF COLUMNS
// ============================================
// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Reg No", dataKey: "registrationNo" },
  { header: "Code", dataKey: "code" },
  { header: "Class", dataKey: "vehicleClass" },
  { header: "Make", dataKey: "manufacture" },
  { header: "Model", dataKey: "model" },
  { header: "Insurance Expiry", dataKey: "insuranceExpiry" },
  { header: "License Expiry", dataKey: "licenseExpiry" },
  { header: "Insurance Status", dataKey: "insuranceStatus" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function VehicleStatistics() {
  const stats = useMemo(() => {
    return {
      total: allVehicleData.length,
      validInsurance: allVehicleData.filter((v) => v.insuranceStatus === "Valid").length,
      expiredInsurance: allVehicleData.filter((v) => v.insuranceStatus === "Expired").length,
      classCount: uniqueClasses.length,
      manufacturerCount: uniqueManufactures.length,
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <CarFront className="h-4 w-4 text-purple-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Registered vehicles</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Valid Insurance</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.validInsurance}</div>
          <p className="text-xs text-muted-foreground">Vehicles insured</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expired Insurance</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{stats.expiredInsurance}</div>
          <p className="text-xs text-muted-foreground">Need renewal</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Vehicle Classes</CardTitle>
          <ShieldCheck className="h-4 w-4 text-blue-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats.classCount}</div>
          <p className="text-xs text-muted-foreground">Different classes</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VehicleReport() {
  // Build dynamic filter options
  const classOptions = useMemo(
    () => [
      { label: "All Classes", value: "all" },
      ...uniqueClasses.map((cls) => ({ label: cls, value: cls })),
    ],
    []
  );

  const manufactureOptions = useMemo(
    () => [
      { label: "All Manufacturers", value: "all" },
      ...uniqueManufactures.map((mfr) => ({ label: mfr, value: mfr })),
    ],
    []
  );

  return (
    <div className="space-y-6">
      <VehicleStatistics />

      <ReportPageTemplate
        title="Vehicle Report"
        data={allVehicleData}
        tableColumns={tableColumns}
        exportColumns={exportColumns}
        searchKey="searchField"
        fileName="VehicleReport.pdf"
        filters={[
          {
            key: "vehicleClass",
            label: "Vehicle Class",
            options: classOptions,
            defaultValue: "all",
          },
          {
            key: "manufacture",
            label: "Manufacturer",
            options: manufactureOptions,
            defaultValue: "all",
          },
          {
            key: "insuranceStatus",
            label: "Insurance Status",
            options: [
              { label: "All", value: "all" },
              { label: "Valid Insurance", value: "Valid" },
              { label: "Expired Insurance", value: "Expired" },
            ],
            defaultValue: "all",
          },
        ]}
      />
    </div>
  );
}