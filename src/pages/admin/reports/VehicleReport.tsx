import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  CarFront,
  CalendarClock,
  Printer,
  Factory,
  ShieldCheck,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
};

// --- Types ---
export type Vehicle = {
  id: string;
  registrationNo: string;
  code: string;
  vehicleClass: string;
  manufacture: string;
  model: string;
  insuranceExpiry: string;
  licenseExpiry: string;
  searchField?: string;
};

// --- Sample Data ---
const mockVehicleData: Vehicle[] = [
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

// --- Column Definitions ---
const columns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    header: "Registration No",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-blue-700">
        {row.getValue("registrationNo")}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "vehicleClass",
    header: "Class",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("vehicleClass")}</Badge>
    ),
  },
  {
    accessorKey: "manufacture",
    header: "Manufacture",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "insuranceExpiry",
    header: "Insurance Expiry Date",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("insuranceExpiry")}</Badge>
    ),
  },
  {
    accessorKey: "licenseExpiry",
    header: "Revenue License Exp Date",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("licenseExpiry")}</Badge>
    ),
  },
];

// --- Component ---
export default function VehicleReport() {
  const [classFilter, setClassFilter] = useState<string>("all");
  const [manufactureFilter, setManufactureFilter] = useState<string>("all");
  const [insuranceStatusFilter, setInsuranceStatusFilter] = useState<
    "all" | "expired" | "valid"
  >("all");

  const allData = useState<Vehicle[]>(() =>
    mockVehicleData.map((v) => ({
      ...v,
      searchField: `${v.registrationNo} ${v.code} ${v.model}`,
    }))
  )[0];

  // Get unique values for filter buttons
  const uniqueClasses = useMemo(() => {
    const classes = [...new Set(allData.map((d) => d.vehicleClass))];
    return classes.sort();
  }, [allData]);

  const uniqueManufactures = useMemo(() => {
    const manufactures = [...new Set(allData.map((d) => d.manufacture))];
    return manufactures.sort();
  }, [allData]);

  // Filtered data based on all active filters
  const filteredData = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let result = allData;

    if (classFilter !== "all") {
      result = result.filter((item) => item.vehicleClass === classFilter);
    }

    if (manufactureFilter !== "all") {
      result = result.filter((item) => item.manufacture === manufactureFilter);
    }

    if (insuranceStatusFilter === "expired") {
      result = result.filter((item) => item.insuranceExpiry < today);
    } else if (insuranceStatusFilter === "valid") {
      result = result.filter((item) => item.insuranceExpiry >= today);
    }

    return result;
  }, [classFilter, manufactureFilter, insuranceStatusFilter, allData]);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Registration No",
      "Code",
      "Class",
      "Manufacture",
      "Model",
      "Insurance Expiry",
      "License Expiry",
    ];
    const rows = filteredData.map((v) => [
      v.registrationNo,
      v.code,
      v.vehicleClass,
      v.manufacture,
      v.model,
      v.insuranceExpiry,
      v.licenseExpiry,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VehicleReport_${new Date().getTime()}.csv`;
    link.click();
  };

  // PDF Report Generation (save or print)
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
    doc.setTextColor(99, 48, 184);
    doc.text("Vehicle Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");

    const classText =
      classFilter === "all" ? "All Classes" : classFilter;
    const manufactureText =
      manufactureFilter === "all" ? "All Manufacturers" : manufactureFilter;
    const insuranceText =
      insuranceStatusFilter === "all"
        ? "All"
        : insuranceStatusFilter === "expired"
        ? "Expired Insurance Only"
        : "Valid Insurance Only";

    doc.text(`Vehicle Class Filter: ${classText}`, 14, 48);
    doc.text(`Manufacturer Filter: ${manufactureText}`, 14, 53);
    doc.text(`Insurance Status Filter: ${insuranceText}`, 14, 58);
    doc.text(`Total Records in Database: ${allData.length}`, 160, 48);
    doc.text(`Filtered Records: ${filteredData.length}`, 160, 53);

    // 5. Table
    autoTable(doc, {
      startY: 65,
      head: [
        [
          "Reg No",
          "Code",
          "Class",
          "Make",
          "Model",
          "Insurance Expiry",
          "License Expiry",
        ],
      ],
      body: filteredData.map((v) => [
        v.registrationNo,
        v.code,
        v.vehicleClass,
        v.manufacture,
        v.model,
        v.insuranceExpiry,
        v.licenseExpiry,
      ]),
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [99, 48, 184],
        textColor: [255, 255, 255],
      },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`VehicleReport_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Report</h1>
          <p className="text-muted-foreground mt-1">
            All registered vehicles summary
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-100"
            onClick={exportCSV}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-blue-600 text-blue-700 hover:bg-blue-100"
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            onClick={() => generateReport("save")}
          >
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="border-purple-200">
        <CardHeader className="border-b">
          <CardTitle className="text-[#6330B8]">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Vehicle Class Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Vehicle Class
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={classFilter === "all" ? "default" : "outline"}
                onClick={() => setClassFilter("all")}
                className={
                  classFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All Classes
              </Button>
              {uniqueClasses.map((cls) => (
                <Button
                  key={cls}
                  variant={classFilter === cls ? "default" : "outline"}
                  onClick={() => setClassFilter(cls)}
                  className={
                    classFilter === cls
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }
                  size="sm"
                >
                  {cls}
                </Button>
              ))}
            </div>
          </div>

          {/* Manufacturer Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Manufacturer
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={manufactureFilter === "all" ? "default" : "outline"}
                onClick={() => setManufactureFilter("all")}
                className={
                  manufactureFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All Manufacturers
              </Button>
              {uniqueManufactures.map((mfr) => (
                <Button
                  key={mfr}
                  variant={manufactureFilter === mfr ? "default" : "outline"}
                  onClick={() => setManufactureFilter(mfr)}
                  className={
                    manufactureFilter === mfr
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : ""
                  }
                  size="sm"
                >
                  {mfr}
                </Button>
              ))}
            </div>
          </div>

          {/* Insurance Status Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Insurance Status
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={insuranceStatusFilter === "all" ? "default" : "outline"}
                onClick={() => setInsuranceStatusFilter("all")}
                className={
                  insuranceStatusFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All
              </Button>
              <Button
                variant={
                  insuranceStatusFilter === "valid" ? "default" : "outline"
                }
                onClick={() => setInsuranceStatusFilter("valid")}
                className={
                  insuranceStatusFilter === "valid"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
                size="sm"
              >
                Valid Insurance
              </Button>
              <Button
                variant={
                  insuranceStatusFilter === "expired" ? "default" : "outline"
                }
                onClick={() => setInsuranceStatusFilter("expired")}
                className={
                  insuranceStatusFilter === "expired"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : ""
                }
                size="sm"
              >
                Expired Insurance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <CarFront className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {allData.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="h-8 px-3">
                Filtered
              </Badge>
              <div>
                <p className="text-sm text-muted-foreground">
                  Filtered Records
                </p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {filteredData.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Vehicle Classes
                </p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {uniqueClasses.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarClock className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-semibold text-[#6330B8]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <CarFront className="h-5 w-5" />
            Vehicle Details
            <Badge variant="outline" className="text-muted-foreground ml-2">
              {filteredData.length} Records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search vehicle by reg no, code, or model..."
            enableColumnVisibility
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}