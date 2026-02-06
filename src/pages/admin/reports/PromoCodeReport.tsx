"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  FileSpreadsheet,
  FileText,
  Percent,
  CheckCircle,
  XCircle,
  Printer,
  Filter,
  Tag,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Promo Code Type ---
export type PromoCode = {
  id: string;
  code: string;
  description: string;
  vehicleClasses: string[];
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  isFirstTimeOnly: boolean;
  maxAmount: number;
  maxCountPerUser: number;
  maxUsage: number;
  maxHireCount: number;
  minHireCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  searchField?: string;
};

// --- Helper for Logo ---
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      }
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

// --- Sample Data ---
const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "NEW10",
    description: "10% off for first rides",
    vehicleClasses: ["ECONOMY", "STANDARD"],
    discountType: "PERCENT",
    discountValue: 10,
    isFirstTimeOnly: true,
    maxAmount: 500,
    maxCountPerUser: 1,
    maxUsage: 100,
    maxHireCount: 1,
    minHireCount: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "FIX200",
    description: "LKR 200 Flat off for Vans",
    vehicleClasses: ["VAN"],
    discountType: "FIXED",
    discountValue: 200,
    isFirstTimeOnly: false,
    maxAmount: 200,
    maxCountPerUser: 3,
    maxUsage: 500,
    maxHireCount: 3,
    minHireCount: 1,
    startDate: "2024-05-01",
    endDate: "2024-07-01",
    isActive: false,
  },
  {
    id: "3",
    code: "SUMMER25",
    description: "25% off summer special",
    vehicleClasses: ["ECONOMY", "STANDARD", "LUXURY"],
    discountType: "PERCENT",
    discountValue: 25,
    isFirstTimeOnly: false,
    maxAmount: 1000,
    maxCountPerUser: 5,
    maxUsage: 200,
    maxHireCount: 5,
    minHireCount: 0,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
  },
  {
    id: "4",
    code: "FLAT500",
    description: "LKR 500 off on luxury rides",
    vehicleClasses: ["LUXURY"],
    discountType: "FIXED",
    discountValue: 500,
    isFirstTimeOnly: true,
    maxAmount: 500,
    maxCountPerUser: 1,
    maxUsage: 50,
    maxHireCount: 1,
    minHireCount: 0,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
  },
  {
    id: "5",
    code: "WEEK15",
    description: "15% off weekday rides",
    vehicleClasses: ["ECONOMY", "STANDARD"],
    discountType: "PERCENT",
    discountValue: 15,
    isFirstTimeOnly: false,
    maxAmount: 750,
    maxCountPerUser: 10,
    maxUsage: 1000,
    maxHireCount: 10,
    minHireCount: 0,
    startDate: "2024-03-01",
    endDate: "2024-12-31",
    isActive: false,
  },
];

// --- Columns Configuration ---
const columns: ColumnDef<PromoCode>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <span className="font-mono font-bold text-violet-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: () => <span className="font-bold text-black">Description</span>,
  },
  {
    accessorKey: "vehicleClasses",
    header: () => <span className="font-bold text-black">Vehicle Classes</span>,
    cell: ({ row }) => {
      const classes = row.getValue("vehicleClasses") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {classes.map((vc) => (
            <Badge key={vc} variant="secondary">
              {vc}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "discountType",
    header: () => <span className="font-bold text-black">Discount In</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className={row.getValue("discountType") === "PERCENT" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
        {row.getValue("discountType") === "PERCENT" ? "%" : "LKR"}
      </Badge>
    ),
  },
  {
    accessorKey: "discountValue",
    header: () => <span className="font-bold text-black">Discount Value</span>,
    cell: ({ row }) => {
      const type = row.original.discountType;
      const value = row.getValue("discountValue");
      return <span className="font-bold text-green-700">{type === "PERCENT" ? `${value}%` : `LKR ${value}`}</span>;
    },
  },
  {
    accessorKey: "isFirstTimeOnly",
    header: () => <span className="font-bold text-black">First Time Only</span>,
    cell: ({ row }) =>
      row.getValue("isFirstTimeOnly") ? (
        <Badge variant="outline" className="text-green-700 bg-green-50 border-green-300">
          Yes
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-300">
          No
        </Badge>
      ),
  },
  {
    accessorKey: "maxAmount",
    header: () => <span className="font-bold text-black">Max Amount</span>,
    cell: ({ row }) => `LKR ${row.getValue("maxAmount")}`,
  },
  {
    accessorKey: "maxCountPerUser",
    header: () => <span className="font-bold text-black">Max/User</span>,
  },
  {
    accessorKey: "maxUsage",
    header: () => <span className="font-bold text-black">Max Usage</span>,
  },
  {
    accessorKey: "startDate",
    header: () => <span className="font-bold text-black">Start Date</span>,
  },
  {
    accessorKey: "endDate",
    header: () => <span className="font-bold text-black">End Date</span>,
  },
  {
    accessorKey: "isActive",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) =>
      row.getValue("isActive") ? (
        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
          <CheckCircle className="h-3 w-3 mr-1" /> Active
        </Badge>
      ) : (
        <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">
          <XCircle className="h-3 w-3 mr-1" /> Inactive
        </Badge>
      ),
  },
];

// --- Filter Types ---
type StatusFilter = "all" | "active" | "inactive";
type DiscountTypeFilter = "all" | "PERCENT" | "FIXED";
type FirstTimeFilter = "all" | "yes" | "no";

// --- Main Component ---
export default function PromoCodeReport() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState<DiscountTypeFilter>("all");
  const [firstTimeFilter, setFirstTimeFilter] = useState<FirstTimeFilter>("all");

  const allData = useMemo(
    () =>
      mockPromoCodes.map((promo) => ({
        ...promo,
        searchField: `${promo.code} ${promo.description}`,
      })),
    []
  );

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...allData];

    // Status filter
    if (statusFilter === "active") {
      result = result.filter((p) => p.isActive === true);
    } else if (statusFilter === "inactive") {
      result = result.filter((p) => p.isActive === false);
    }

    // Discount type filter
    if (discountTypeFilter !== "all") {
      result = result.filter((p) => p.discountType === discountTypeFilter);
    }

    // First time filter
    if (firstTimeFilter === "yes") {
      result = result.filter((p) => p.isFirstTimeOnly === true);
    } else if (firstTimeFilter === "no") {
      result = result.filter((p) => p.isFirstTimeOnly === false);
    }

    return result;
  }, [statusFilter, discountTypeFilter, firstTimeFilter, allData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const active = allData.filter((p) => p.isActive).length;
    const inactive = allData.filter((p) => p.isActive === false).length;
    const percentType = allData.filter((p) => p.discountType === "PERCENT").length;
    const fixedType = allData.filter((p) => p.discountType === "FIXED").length;
    const firstTimeOnly = allData.filter((p) => p.isFirstTimeOnly).length;

    return {
      total: allData.length,
      active,
      inactive,
      percentType,
      fixedType,
      firstTimeOnly,
    };
  }, [allData]);

  // --- PDF & Print Logic ---
  const generateReport = async (action: "save" | "print") => {
    const doc = new jsPDF({ orientation: "landscape" });

    // 1. Add Logo
    try {
      const logoData = await getBase64ImageFromURL("/logo.png");
      doc.addImage(logoData, "PNG", 14, 10, 20, 20);
    } catch (e) {
      console.error("Logo missing", e);
    }

    // 2. Main Title
    doc.setFontSize(22);
    doc.setTextColor(99, 48, 184); // Purple
    doc.text("Promo Code Audit Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35); // Horizontal line

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");
    const statusText =
      statusFilter === "all" ? "All Statuses" : statusFilter === "active" ? "Active Only" : "Inactive Only";
    const discountText =
      discountTypeFilter === "all" ? "All Discount Types" : discountTypeFilter === "PERCENT" ? "Percentage Only" : "Fixed Amount Only";
    const firstTimeText =
      firstTimeFilter === "all" ? "All Users" : firstTimeFilter === "yes" ? "First Time Only" : "Repeat Users";

    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`Discount Type Filter: ${discountText}`, 14, 53);
    doc.text(`User Type Filter: ${firstTimeText}`, 14, 58);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 63);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 68);
    doc.text(`Active: ${stats.active} | Inactive: ${stats.inactive} | First Time Only: ${stats.firstTimeOnly}`, 14, 73);

    // 5. Table
    autoTable(doc, {
      head: [
        [
          "Code",
          "Description",
          "Class",
          "Type",
          "Value",
          "First Time",
          "Max Amt",
          "Max/User",
          "Usage",
          "Start",
          "End",
          "Active",
        ],
      ],
      body: filteredData.map((p) => [
        p.code,
        p.description,
        p.vehicleClasses.join("/"),
        p.discountType,
        p.discountType === "PERCENT" ? `${p.discountValue}%` : `LKR ${p.discountValue}`,
        p.isFirstTimeOnly ? "Yes" : "No",
        p.maxAmount,
        p.maxCountPerUser,
        p.maxUsage,
        p.startDate,
        p.endDate,
        p.isActive ? "Yes" : "No",
      ]),
      startY: 80,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`PromoCodeReport_${statusFilter}_${discountTypeFilter}_${firstTimeFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  // --- CSV Export ---
  const exportCSV = () => {
    const headers = [
      "Code",
      "Description",
      "Vehicle Classes",
      "Discount Type",
      "Discount Value",
      "First Time Only",
      "Max Amount",
      "Max Count Per User",
      "Max Usage",
      "Max Hire Count",
      "Min Hire Count",
      "Start Date",
      "End Date",
      "Is Active",
    ];
    const rows = filteredData.map((p) =>
      [
        p.code,
        p.description,
        p.vehicleClasses.join(" / "),
        p.discountType,
        p.discountValue,
        p.isFirstTimeOnly ? "Yes" : "No",
        p.maxAmount,
        p.maxCountPerUser,
        p.maxUsage,
        p.maxHireCount,
        p.minHireCount,
        p.startDate,
        p.endDate,
        p.isActive ? "Yes" : "No",
      ]
        .map((cell) => `"${cell}"`)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `PromoCodeReport_${statusFilter}_${discountTypeFilter}_${firstTimeFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Promo Code Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== "all" || discountTypeFilter !== "all" || firstTimeFilter !== "all") &&
              ` (filtered)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-purple-600 text-purple-700 hover:bg-purple-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => generateReport("save")}>
            <FileText className="h-4 w-4 mr-2" />
            PDF Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Promo Codes</CardTitle>
            <Tag className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All promotional offers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Codes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Percentage Type</CardTitle>
            <Percent className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.percentType}</div>
            <p className="text-xs text-muted-foreground">% based discounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">First Time Only</CardTitle>
            <Users className="h-4 w-4 text-orange-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.firstTimeOnly}</div>
            <p className="text-xs text-muted-foreground">New user offers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-3">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1" /> Status:
          </span>
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            <Tag className="mr-2 h-4 w-4" /> All Codes
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Active Only
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
            size="sm"
          >
            <XCircle className="mr-2 h-4 w-4" /> Inactive Only
          </Button>
        </div>

        {/* Discount Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <DollarSign className="h-4 w-4 mr-1" /> Discount Type:
          </span>
          <Button
            variant={discountTypeFilter === "all" ? "default" : "outline"}
            onClick={() => setDiscountTypeFilter("all")}
            className={discountTypeFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All Types
          </Button>
          <Button
            variant={discountTypeFilter === "PERCENT" ? "default" : "outline"}
            onClick={() => setDiscountTypeFilter("PERCENT")}
            className={discountTypeFilter === "PERCENT" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            size="sm"
          >
            <Percent className="mr-2 h-4 w-4" /> Percentage ({stats.percentType})
          </Button>
          <Button
            variant={discountTypeFilter === "FIXED" ? "default" : "outline"}
            onClick={() => setDiscountTypeFilter("FIXED")}
            className={discountTypeFilter === "FIXED" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            size="sm"
          >
            <DollarSign className="mr-2 h-4 w-4" /> Fixed Amount ({stats.fixedType})
          </Button>
        </div>

        {/* First Time Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-600 flex items-center mr-2">
            <Users className="h-4 w-4 mr-1" /> User Type:
          </span>
          <Button
            variant={firstTimeFilter === "all" ? "default" : "outline"}
            onClick={() => setFirstTimeFilter("all")}
            className={firstTimeFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All Users
          </Button>
          <Button
            variant={firstTimeFilter === "yes" ? "default" : "outline"}
            onClick={() => setFirstTimeFilter("yes")}
            className={firstTimeFilter === "yes" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
            size="sm"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> First Time Only
          </Button>
          <Button
            variant={firstTimeFilter === "no" ? "default" : "outline"}
            onClick={() => setFirstTimeFilter("no")}
            className={firstTimeFilter === "no" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""}
            size="sm"
          >
            Repeat Users
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Percent className="h-5 w-5 text-purple-600" />
            Promo Code Registry
          </CardTitle>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredData.length} Records
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${discountTypeFilter}-${firstTimeFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search promo code or description..."
          />
        </CardContent>
      </Card>
    </div>
  );
}