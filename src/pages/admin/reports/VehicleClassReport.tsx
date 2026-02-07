"use client";
import { useMemo } from "react";
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
} from "lucide-react";

// ============================================
// TYPE DEFINITION
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
// MOCK DATA
// ============================================
const mockVehicleClasses: VehicleClass[] = [
  {
    id: "1",
    className: "Economy",
    classCode: "ECO",
    showInApp: true,
    fareScheme: "StandardFareA",
    corporateFareScheme: "CorporateFA1",
    roadTripFareScheme: "RoadTripFA1",
    appFareScheme: "AppFA1",
    commission: 10,
    status: "Active",
  },
  {
    id: "2",
    className: "Luxury",
    classCode: "LUX",
    showInApp: true,
    fareScheme: "StandardFareB",
    corporateFareScheme: "CorporateFA2",
    roadTripFareScheme: "RoadTripFA2",
    appFareScheme: "AppFA2",
    commission: 15,
    status: "Active",
  },
  {
    id: "3",
    className: "Mini Van",
    classCode: "MNV",
    showInApp: false,
    fareScheme: "StandardFareC",
    corporateFareScheme: "CorporateFA3",
    roadTripFareScheme: "RoadTripFA3",
    appFareScheme: "AppFA3",
    commission: 12,
    status: "Active",
  },
  {
    id: "4",
    className: "Standard",
    classCode: "STD",
    showInApp: true,
    fareScheme: "StandardFareD",
    corporateFareScheme: "CorporateFA4",
    roadTripFareScheme: "RoadTripFA4",
    appFareScheme: "AppFA4",
    commission: 8,
    status: "Active",
  },
  {
    id: "5",
    className: "Bus",
    classCode: "BUS",
    showInApp: true,
    fareScheme: "StandardFareE",
    corporateFareScheme: "CorporateFA5",
    roadTripFareScheme: "RoadTripFA5",
    appFareScheme: "AppFA5",
    commission: 18,
    status: "Active",
  },
  {
    id: "6",
    className: "Tuk",
    classCode: "TUK",
    showInApp: true,
    fareScheme: "TukFare",
    corporateFareScheme: "TukCorporate",
    roadTripFareScheme: "TukRoadTrip",
    appFareScheme: "TukApp",
    commission: 5,
    status: "Active",
  },
  {
    id: "7",
    className: "Premium",
    classCode: "PRE",
    showInApp: false,
    fareScheme: "PremiumFare",
    corporateFareScheme: "PremiumCorporate",
    roadTripFareScheme: "PremiumRoadTrip",
    appFareScheme: "PremiumApp",
    commission: 20,
    status: "Inactive",
  },
];

const allVehicleClassData: VehicleClass[] = mockVehicleClasses.map((item) => ({
  ...item,
  searchField: `${item.className} ${item.classCode}`,
}));

// ============================================
// HELPER FUNCTIONS
// ============================================
const getClassBadgeClass = (className: string) => {
  const colorMap: Record<string, string> = {
    Economy: "bg-green-100 text-green-800",
    Luxury: "bg-purple-100 text-purple-800",
    "Mini Van": "bg-blue-100 text-blue-800",
    Standard: "bg-gray-100 text-gray-800",
    Bus: "bg-orange-100 text-orange-800",
    Tuk: "bg-yellow-100 text-yellow-800",
    Premium: "bg-pink-100 text-pink-800",
  };
  return colorMap[className] || "bg-gray-100 text-gray-800";
};

// ============================================
// TABLE COLUMNS
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
// PDF COLUMNS
// ============================================
const pdfColumns = [
  { header: "Class", dataKey: "className" },
  { header: "Code", dataKey: "classCode" },
  { header: "In App", dataKey: "showInApp" },
  { header: "Fare", dataKey: "fareScheme" },
  { header: "Corporate", dataKey: "corporateFareScheme" },
  { header: "RoadTrip", dataKey: "roadTripFareScheme" },
  { header: "App Fare", dataKey: "appFareScheme" },
  { header: "Commission", dataKey: "commission" },
  { header: "Status", dataKey: "status" },
];

// ============================================
// CSV COLUMNS
// ============================================
const csvColumns = [
  { header: "Class Name", dataKey: "className" },
  { header: "Class Code", dataKey: "classCode" },
  {
    header: "Show in App",
    dataKey: "showInApp",
    formatter: (value: boolean) => (value ? "Yes" : "No"),
  },
  { header: "Fare Scheme", dataKey: "fareScheme" },
  { header: "Corporate Fare Scheme", dataKey: "corporateFareScheme" },
  { header: "RoadTrip Fare Scheme", dataKey: "roadTripFareScheme" },
  { header: "App Fare Scheme", dataKey: "appFareScheme" },
  {
    header: "Commission",
    dataKey: "commission",
    formatter: (value: number) => `${value}%`,
  },
  { header: "Status", dataKey: "status" },
];

// ============================================
// STATISTICS COMPONENT
// ============================================
function VehicleClassStatistics() {
  const stats = useMemo(() => {
    const avgCommission =
      allVehicleClassData.length > 0
        ? Math.round(
            allVehicleClassData.reduce((sum, v) => sum + v.commission, 0) /
              allVehicleClassData.length
          )
        : 0;

    return {
      total: allVehicleClassData.length,
      active: allVehicleClassData.filter((v) => v.status === "Active").length,
      inactive: allVehicleClassData.filter((v) => v.status === "Inactive").length,
      showInApp: allVehicleClassData.filter((v) => v.showInApp === true).length,
      hiddenInApp: allVehicleClassData.filter((v) => v.showInApp === false).length,
      avgCommission,
    };
  }, []);

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
// MAIN COMPONENT
// ============================================
export default function VehicleClassReport() {
  return (
    <div className="space-y-6">
      <VehicleClassStatistics />

      <ReportPageTemplate
        title="Vehicle Class Audit Report"
        data={allVehicleClassData}
        tableColumns={tableColumns}
        pdfColumns={pdfColumns}
        csvColumns={csvColumns}
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