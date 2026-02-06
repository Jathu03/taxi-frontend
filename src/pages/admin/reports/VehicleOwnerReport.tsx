import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  FileText,
  FileSpreadsheet,
  Building2,
  CalendarClock,
  Mail,
  Phone,
  User,
  Printer,
  Users,
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
type VehicleOwner = {
  id: string;
  name: string;
  registrationId: string;
  primaryContact: string;
  secondaryContact?: string;
  address: string;
  email: string;
  company: string;
  dateModified: string;
  searchField?: string;
};

// --- Sample Data ---
const mockOwners: VehicleOwner[] = [
  {
    id: "o1",
    name: "Sunil Silva",
    registrationId: "901234567V",
    primaryContact: "0771234567",
    secondaryContact: "0112345678",
    address: "No 25, Temple Road, Colombo 05",
    email: "sunil@email.com",
    company: "Individual",
    dateModified: "2024-01-20",
  },
  {
    id: "o2",
    name: "Lanka Tours (Pvt) Ltd",
    registrationId: "BR987654321",
    primaryContact: "0112223344",
    secondaryContact: "0777654321",
    address: "80/A Park Street, Colombo 02",
    email: "info@lankatours.lk",
    company: "Lanka Group",
    dateModified: "2024-02-13",
  },
  {
    id: "o3",
    name: "Amila Perera",
    registrationId: "932347891V",
    primaryContact: "0711234567",
    address: "276 Kandy Road, Gampaha",
    email: "amila.p@email.com",
    company: "Individual",
    dateModified: "2024-03-01",
  },
];

// --- Columns ---
const columns: ColumnDef<VehicleOwner>[] = [
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
    accessorKey: "name",
    header: "Personal/Company Name",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "registrationId",
    header: "NIC/Business Registration",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("registrationId")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: "Primary Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-3 w-3 text-green-700" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "secondaryContact",
    header: "Secondary Contact",
    cell: ({ row }) =>
      row.getValue("secondaryContact") ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3 w-3" />
          {row.getValue("secondaryContact")}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs italic">Not Provided</span>
      ),
  },
  {
    accessorKey: "address",
    header: "Postal Address",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-3 w-3 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Building2 className="h-3 w-3 text-blue-500" />
        {row.getValue("company")}
      </div>
    ),
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

// --- Component ---
export default function VehicleOwnerReport() {
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [contactFilter, setContactFilter] = useState<"all" | "with_secondary" | "without_secondary">("all");

  const allData = useState<VehicleOwner[]>(
    mockOwners.map((owner) => ({
      ...owner,
      searchField: `${owner.name} ${owner.registrationId} ${owner.email}`,
    }))
  )[0];

  // Get unique companies for filter buttons
  const uniqueCompanies = useMemo(() => {
    const companies = [...new Set(allData.map((d) => d.company))];
    return companies.sort();
  }, [allData]);

  // Filtered data based on all active filters
  const filteredData = useMemo(() => {
    let result = allData;

    if (companyFilter !== "all") {
      result = result.filter((item) => item.company === companyFilter);
    }

    if (contactFilter === "with_secondary") {
      result = result.filter((item) => !!item.secondaryContact);
    } else if (contactFilter === "without_secondary") {
      result = result.filter((item) => !item.secondaryContact);
    }

    return result;
  }, [companyFilter, contactFilter, allData]);

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Name",
      "NIC/B.Reg",
      "Primary Contact",
      "Secondary Contact",
      "Address",
      "Email",
      "Company",
      "Date Modified",
    ];
    const rows = filteredData.map((o) => [
      o.name,
      o.registrationId,
      o.primaryContact,
      o.secondaryContact || "",
      o.address,
      o.email,
      o.company,
      o.dateModified,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `VehicleOwnerReport_${new Date().getTime()}.csv`;
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
    doc.text("Vehicle Owner Report", 40, 22);

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

    const companyText =
      companyFilter === "all" ? "All Companies" : companyFilter;
    const contactText =
      contactFilter === "all"
        ? "All Contacts"
        : contactFilter === "with_secondary"
        ? "With Secondary Contact Only"
        : "Without Secondary Contact Only";

    doc.text(`Company Filter: ${companyText}`, 14, 48);
    doc.text(`Contact Filter: ${contactText}`, 14, 53);
    doc.text(`Total Records in Database: ${allData.length}`, 150, 48);
    doc.text(`Filtered Records: ${filteredData.length}`, 150, 53);

    // 5. Table
    autoTable(doc, {
      startY: 62,
      head: [
        [
          "Name",
          "NIC / Bus. Reg",
          "Primary",
          "Secondary",
          "Address",
          "Email",
          "Company",
          "Modified",
        ],
      ],
      body: filteredData.map((o) => [
        o.name,
        o.registrationId,
        o.primaryContact,
        o.secondaryContact || "-",
        o.address,
        o.email,
        o.company,
        o.dateModified,
      ]),
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [99, 48, 184],
        textColor: [255, 255, 255],
      },
      margin: { left: 14, right: 14 },
    });

    if (action === "save") {
      doc.save(`VehicleOwnerReport_${new Date().getTime()}.pdf`);
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Owner Report</h1>
          <p className="text-muted-foreground text-sm">
            Overview of personal or company vehicle owners
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
          {/* Company Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Company
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={companyFilter === "all" ? "default" : "outline"}
                onClick={() => setCompanyFilter("all")}
                className={
                  companyFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All Companies
              </Button>
              {uniqueCompanies.map((company) => (
                <Button
                  key={company}
                  variant={companyFilter === company ? "default" : "outline"}
                  onClick={() => setCompanyFilter(company)}
                  className={
                    companyFilter === company
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : ""
                  }
                  size="sm"
                >
                  {company}
                </Button>
              ))}
            </div>
          </div>

          {/* Secondary Contact Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Secondary Contact
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={contactFilter === "all" ? "default" : "outline"}
                onClick={() => setContactFilter("all")}
                className={
                  contactFilter === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }
                size="sm"
              >
                All
              </Button>
              <Button
                variant={contactFilter === "with_secondary" ? "default" : "outline"}
                onClick={() => setContactFilter("with_secondary")}
                className={
                  contactFilter === "with_secondary"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
                size="sm"
              >
                With Secondary Contact
              </Button>
              <Button
                variant={contactFilter === "without_secondary" ? "default" : "outline"}
                onClick={() => setContactFilter("without_secondary")}
                className={
                  contactFilter === "without_secondary"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : ""
                }
                size="sm"
              >
                Without Secondary Contact
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
              <Users className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Total Owners</p>
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
                <p className="text-sm text-muted-foreground">Filtered Records</p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {filteredData.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-[#6330B8]" />
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold text-[#6330B8]">
                  {uniqueCompanies.length}
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
            <User className="h-5 w-5" />
            Owners
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
            searchPlaceholder="Search name, NIC, or email..."
            pageSize={10}
            enableColumnVisibility
          />
        </CardContent>
      </Card>
    </div>
  );
}