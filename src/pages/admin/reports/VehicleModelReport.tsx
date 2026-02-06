import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileSpreadsheet,
  FileText,
  Car,
  CalendarClock,
  Settings,
  Printer,
  Factory,
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

// --- Type Definition ---
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
  comments: string;
  dateModified: string;
  searchField?: string;
};

// --- Mock Data ---
const mockVehicleModels: VehicleModel[] = [
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

// --- Column Definition ---
const columns: ColumnDef<VehicleModel>[] = [
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
    accessorKey: "manufacturer",
    header: "Manufacturer",
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-700">
        {row.getValue("model")}
      </span>
    ),
  },
  {
    accessorKey: "modelCode",
    header: "Model Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("modelCode")}</span>
    ),
  },
  {
    accessorKey: "frame",
    header: "Frame",
  },
  {
    accessorKey: "transmissionType",
    header: "Transmission Type",
  },
  {
    accessorKey: "trimLevel",
    header: "Trim Level",
  },
  {
    accessorKey: "fuelInjectionType",
    header: "Fuel Injection Type",
  },
  {
    accessorKey: "turbo",
    header: "Turbo",
    cell: ({ row }) =>
      row.getValue("turbo") ? (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Yes
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200"
        >
          No
        </Badge>
      ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "dateModified",
    header: "Date Modified",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <CalendarClock className="h-3 w-3" />
        {row.getValue("dateModified")}
      </div>
    ),
  },
];

// --- Main Component ---
export default function VehicleModelReport() {
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  const [turboFilter, setTurboFilter] = useState<"all" | "yes" | "no">("all");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("all");

  const allData = useState<VehicleModel[]>(
    mockVehicleModels.map((item) => ({
      ...item,
      searchField: `${item.manufacturer} ${item.model} ${item.modelCode}`,
    }))
  )[0];

  // Get unique manufacturers and transmission types for filter buttons
  const uniqueManufacturers = useMemo(() => {
    const manufacturers = [...new Set(allData.map((d) => d.manufacturer))];
    return manufacturers.sort();
  }, [allData]);

  const uniqueTransmissions = useMemo(() => {
    const transmissions = [...new Set(allData.map((d) => d.transmissionType))];
    return transmissions.sort();
  }, [allData]);

  // Filtered data based on all active filters
  const filteredData = useMemo(() => {
    let result = allData;

    if (manufacturerFilter !== "all") {
      result = result.filter((item) => item.manufacturer === manufacturerFilter);
    }

    if (turboFilter !== "all") {
      result = result.filter((item) =>
        turboFilter === "yes" ? item.turbo : !item.turbo
      );
    }

    if (transmissionFilter !== "all") {
      result = result.filter(
        (item) => item.transmissionType === transmissionFilter
      );
    }

    return result;
  }, [manufacturerFilter, turboFilter, transmissionFilter, allData]);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Manufacturer",
      "Model",
      "Model Code",
      "Frame",
      "Transmission Type",
      "Trim Level",
      "Fuel Injection Type",
      "Turbo",
      "Comments",
      "Modified",
    ];
    const rows = filteredData.map((m) => [
      m.manufacturer,
      m.model,
      m.modelCode,
      m.frame,
      m.transmissionType,
      m.trimLevel,
      m.fuelInjectionType,
      m.turbo ? "Yes" : "No",
      m.comments,
      m.dateModified,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VehicleModelReport_${new Date().getTime()}.csv`;
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
    doc.text("Vehicle Model Report", 40, 22);

    // 3. Metadata
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 28);

    // 4. --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 35, 283, 35); // Horizontal line (landscape width)

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 42);

    doc.setFont("helvetica", "normal");

    const manufacturerText =
      manufacturerFilter === "all"
        ? "All Manufacturers"
        : manufacturerFilter;
    const turboText =
      turboFilter === "all"
        ? "All"
        : turboFilter === "yes"
        ? "Turbo Only"
        : "Non-Turbo Only";
    const transmissionText =
      transmissionFilter === "all"
        ? "All Transmissions"
        : transmissionFilter;

    doc.text(`Manufacturer Filter: ${manufacturerText}`, 14, 48);
    doc.text(`Turbo Filter: ${turboText}`, 14, 53);
    doc.text(`Transmission Filter: ${transmissionText}`, 14, 58);
    doc.text(`Total Records in Database: ${allData.length}`, 150, 48);
    doc.text(`Filtered Records: ${filteredData.length}`, 150, 53);

    // 5. Table
    autoTable(doc, {
      startY: 65,
      head: [
        [
          "Manufacturer",
          "Model",
          "Model Code",
          "Frame",
          "Transmission",
          "Trim",
          "Fuel Type",
          "Turbo",
          "Comments",
          "Modified",
        ],
      ],
      body: filteredData.map((m) => [
        m.manufacturer,
        m.model,
        m.modelCode,
        m.frame,
        m.transmissionType,
        m.trimLevel,
        m.fuelInjectionType,
        m.turbo ? "Yes" : "No",
        m.comments,
        m.dateModified,
      ]),
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [99, 48, 184],
        textColor: [255, 255, 255],
      },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`VehicleModelReport_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Vehicle Model Report
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage and view vehicle model specs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportCSV}
            className="border-green-600 text-green-700"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => generateReport("print")}
            className="border-blue-600 text-blue-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={() => generateReport("save")}
            className="bg-[#6330B8] text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="border-purple-200">
        <CardHeader className="border-b">
          <CardTitle className="text-[#6330B8]">Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Manufacturer Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Manufacturer
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={manufacturerFilter === "all" ? "default" : "outline"}
                onClick={() => setManufacturerFilter("all")}
                className={
                  manufacturerFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All Manufacturers
              </Button>
              {uniqueManufacturers.map((mfr) => (
                <Button
                  key={mfr}
                  variant={manufacturerFilter === mfr ? "default" : "outline"}
                  onClick={() => setManufacturerFilter(mfr)}
                  className={
                    manufacturerFilter === mfr
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }
                  size="sm"
                >
                  {mfr}
                </Button>
              ))}
            </div>
          </div>

          {/* Turbo Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Turbo
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={turboFilter === "all" ? "default" : "outline"}
                onClick={() => setTurboFilter("all")}
                className={
                  turboFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All
              </Button>
              <Button
                variant={turboFilter === "yes" ? "default" : "outline"}
                onClick={() => setTurboFilter("yes")}
                className={
                  turboFilter === "yes"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
                size="sm"
              >
                Turbo Only
              </Button>
              <Button
                variant={turboFilter === "no" ? "default" : "outline"}
                onClick={() => setTurboFilter("no")}
                className={
                  turboFilter === "no"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : ""
                }
                size="sm"
              >
                Non-Turbo Only
              </Button>
            </div>
          </div>

          {/* Transmission Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Transmission Type
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={transmissionFilter === "all" ? "default" : "outline"}
                onClick={() => setTransmissionFilter("all")}
                className={
                  transmissionFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All Transmissions
              </Button>
              {uniqueTransmissions.map((t) => (
                <Button
                  key={t}
                  variant={transmissionFilter === t ? "default" : "outline"}
                  onClick={() => setTransmissionFilter(t)}
                  className={
                    transmissionFilter === t
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : ""
                  }
                  size="sm"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Total Models</p>
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
              <Factory className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Manufacturers</p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {uniqueManufacturers.length}
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
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-[#6330B8] text-lg">
            <Settings className="h-5 w-5" />
            Model List
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
            searchPlaceholder="Search by model code or manufacturer..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}