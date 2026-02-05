
import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  FileSpreadsheet,
  FileText,
  Percent,
  CheckCircle,
  XCircle,
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
];

// --- Columns Configuration ---
const columns: ColumnDef<PromoCode>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-violet-700">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "vehicleClasses",
    header: "Vehicle Classes",
    // 🔧 Fixed the .map() issue by casting the value
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
    header: "Discount In",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("discountType") === "PERCENT" ? "%" : "LKR"}
      </Badge>
    ),
  },
  {
    accessorKey: "discountValue",
    header: "Discount Value",
    cell: ({ row }) => {
      const type = row.original.discountType;
      const value = row.getValue("discountValue");
      return type === "PERCENT" ? `${value}%` : `LKR ${value}`;
    },
  },
  {
    accessorKey: "isFirstTimeOnly",
    header: "First Time Only",
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
    header: "Max Amount",
    cell: ({ row }) => `LKR ${row.getValue("maxAmount")}`,
  },
  {
    accessorKey: "maxCountPerUser",
    header: "Max/User",
  },
  {
    accessorKey: "maxUsage",
    header: "Max Usage",
  },
  {
    accessorKey: "maxHireCount",
    header: "Max Hire Count",
  },
  {
    accessorKey: "minHireCount",
    header: "Min Hire Count",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "isActive",
    header: "Is Active",
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

// --- Main Component ---
export default function PromoCodeReport() {
  const [data] = useState<PromoCode[]>(
    mockPromoCodes.map((promo) => ({
      ...promo,
      searchField: `${promo.code} ${promo.description}`,
    }))
  );

  // --- CSV Export ---
  const exportCSV = () => {
    const headers =
      "Code,Description,Vehicle Classes,Discount Type,Discount Value,First Time Only,Max Amount,Max Count Per User,Max Usage,Max Hire Count,Min Hire Count,Start Date,End Date,Is Active";
    const rows = data.map(
      (p) =>
        `${p.code},${p.description},"${p.vehicleClasses.join(" / ")}",${p.discountType},${p.discountValue},${p.isFirstTimeOnly ? "Yes" : "No"},${p.maxAmount},${p.maxCountPerUser},${p.maxUsage},${p.maxHireCount},${p.minHireCount},${p.startDate},${p.endDate},${p.isActive ? "Yes" : "No"}`
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "promo_code_report.csv";
    link.click();
  };

  // --- PDF Export ---
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.setTextColor(99, 48, 184);
    doc.text("Promo Code Report", 14, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
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
          "Max Hire",
          "Min Hire",
          "Start",
          "End",
          "Active",
        ],
      ],
      body: data.map((p) => [
        p.code,
        p.description,
        p.vehicleClasses.join("/"),
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
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 48, 184] },
    });

    doc.save("promo_code_report.pdf");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Promo Code Report</h1>
          <p className="text-muted-foreground text-sm">
            View and export available promo code data
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="border-green-600 text-green-700">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-[#6330B8] text-white" onClick={exportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Percent className="h-5 w-5" />
            Promo Code List
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={data}
            searchKey="searchField"
            searchPlaceholder="Search promo code or description..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}