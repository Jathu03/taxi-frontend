// src/pages/admin/reports/VehicleReport.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CarFront,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import vehicleService from "@/services/vehicles/vehicleService";
import type { VehicleResponse } from "@/services/vehicles/types";

// ============================================
// TYPE DEFINITION (report shape)
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
// HELPERS
// ============================================
function extractVehicleList(response: any): VehicleResponse[] {
  let rawList: VehicleResponse[] = [];

  if (response?.success === true && response?.data) {
    if (Array.isArray(response.data)) {
      rawList = response.data;
    } else if (Array.isArray(response.data?.content)) {
      rawList = response.data.content;
    }
  } else if (Array.isArray(response?.content)) {
    rawList = response.content;
  } else if (Array.isArray(response)) {
    rawList = response;
  }

  return rawList;
}

function toDateOnly(dt?: string) {
  if (!dt) return "N/A";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toISOString().slice(0, 10);
}

function computeInsuranceStatus(insuranceExpiry: string): "Valid" | "Expired" {
  if (!insuranceExpiry || insuranceExpiry === "N/A") return "Expired";
  const today = new Date().toISOString().slice(0, 10);
  return insuranceExpiry >= today ? "Valid" : "Expired";
}

function mapVehicleToReportRow(v: VehicleResponse): Vehicle {
  const registrationNo = v.registrationNumber || "N/A";
  const code = (v as any).vehicleCode || (v as any).code || `VEH-${v.id}`;
  const vehicleClass = v.className || "N/A";
  const manufacture = v.makeName || "N/A";
  const model = v.modelName || "N/A";

  // These field names can differ in your backend; adjust if needed:
  const insuranceExpiry = toDateOnly((v as any).insuranceExpiry || (v as any).insuranceExpiryDate);
  const licenseExpiry = toDateOnly((v as any).licenseExpiry || (v as any).licenseExpiryDate);

  return {
    id: String(v.id),
    registrationNo,
    code: String(code),
    vehicleClass,
    manufacture,
    model,
    insuranceExpiry,
    licenseExpiry,
    insuranceStatus: computeInsuranceStatus(insuranceExpiry),
    searchField: `${registrationNo} ${code} ${model} ${manufacture}`,
  };
}

// ============================================
// TABLE COLUMNS (same format)
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
// EXPORT COLUMNS
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
// STATISTICS COMPONENT (uses loaded data)
// ============================================
function VehicleStatistics({
  data,
  uniqueClasses,
  uniqueManufactures,
}: {
  data: Vehicle[];
  uniqueClasses: string[];
  uniqueManufactures: string[];
}) {
  const stats = useMemo(() => {
    return {
      total: data.length,
      validInsurance: data.filter((v) => v.insuranceStatus === "Valid").length,
      expiredInsurance: data.filter((v) => v.insuranceStatus === "Expired").length,
      classCount: uniqueClasses.length,
      manufacturerCount: uniqueManufactures.length,
    };
  }, [data, uniqueClasses, uniqueManufactures]);

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
// MAIN COMPONENT (backend integrated)
// ============================================
export default function VehicleReport() {
  const [allVehicleData, setAllVehicleData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const uniqueClasses = useMemo(() => {
    return Array.from(new Set(allVehicleData.map((v) => v.vehicleClass).filter(Boolean))).sort();
  }, [allVehicleData]);

  const uniqueManufactures = useMemo(() => {
    return Array.from(new Set(allVehicleData.map((v) => v.manufacture).filter(Boolean))).sort();
  }, [allVehicleData]);

  const classOptions = useMemo(
    () => [
      { label: "All Classes", value: "all" },
      ...uniqueClasses.map((cls) => ({ label: cls, value: cls })),
    ],
    [uniqueClasses]
  );

  const manufactureOptions = useMemo(
    () => [
      { label: "All Manufacturers", value: "all" },
      ...uniqueManufactures.map((mfr) => ({ label: mfr, value: mfr })),
    ],
    [uniqueManufactures]
  );

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);

        const response = await vehicleService.getAll({
          page: 0,
          size: 1000,
          sortBy: "id",
          sortDir: "desc",
        });

        const rawList = extractVehicleList(response);
        setAllVehicleData(rawList.map(mapVehicleToReportRow));
      } catch (e) {
        console.error(e);
        toast.error("Failed to load vehicle report");
        setAllVehicleData([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
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
      <VehicleStatistics
        data={allVehicleData}
        uniqueClasses={uniqueClasses}
        uniqueManufactures={uniqueManufactures}
      />

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