"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  FileText,
  Building2,
  Phone,
  User,
  Mail,
  Printer,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Type ---
type Corporate = {
  id: string;
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  cashDiscount: number;
  creditDiscount: number;
  quickBooking: boolean;
  status: "Active" | "Inactive";
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

// --- Mock Data ---
const mockCorporateList: Corporate[] = [
  {
    id: "c1",
    name: "ABC Holdings",
    code: "CORP-001",
    primaryContact: "Supun Perera",
    phone: "0771234567",
    email: "supun@abc.lk",
    address: "No 12, Park Street, Colombo 02",
    date: "2024-01-10",
    cashDiscount: 10,
    creditDiscount: 5,
    quickBooking: true,
    status: "Active",
  },
  {
    id: "c2",
    name: "SoftLab Pvt Ltd",
    code: "CORP-002",
    primaryContact: "Nisansala Fernando",
    phone: "0719876543",
    email: "nisansala@softlab.com",
    address: "Level 3, Orion Tower, Colombo 09",
    date: "2024-01-18",
    cashDiscount: 8,
    creditDiscount: 7,
    quickBooking: false,
    status: "Active",
  },
  {
    id: "c3",
    name: "Lanka Tech",
    code: "CORP-003",
    primaryContact: "Ruwan Jayasinghe",
    phone: "0702345678",
    email: "ruwan@lankatech.lk",
    address: "21 Lake Road, Kandy",
    date: "2024-02-05",
    cashDiscount: 5,
    creditDiscount: 0,
    quickBooking: true,
    status: "Active",
  },
  {
    id: "c4",
    name: "Global Services",
    code: "CORP-004",
    primaryContact: "Kamani Silva",
    phone: "0768901234",
    email: "kamani@global.lk",
    address: "45 Main Street, Galle",
    date: "2023-12-20",
    cashDiscount: 0,
    creditDiscount: 0,
    quickBooking: false,
    status: "Inactive",
  },
];

// --- Column Definitions ---
const columns: ColumnDef<Corporate>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "name",
    header: () => <span className="font-bold text-black">Name</span>,
    cell: ({ row }) => (
      <span className="font-semibold text-blue-800">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
    cell: ({ row }) => (
      <span className="font-mono text-purple-700">{row.getValue("code")}</span>
    ),
  },
  {
    accessorKey: "primaryContact",
    header: () => <span className="font-bold text-black">Primary Contact</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        {row.getValue("primaryContact")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => <span className="font-bold text-black">Phone</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-green-600" />
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-purple-500" />
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => <span className="font-bold text-black">Address</span>,
  },
  {
    accessorKey: "cashDiscount",
    header: () => <span className="font-bold text-black">Cash Discount</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">{row.getValue("cashDiscount")}%</span>
    ),
  },
  {
    accessorKey: "creditDiscount",
    header: () => <span className="font-bold text-black">Credit Discount</span>,
    cell: ({ row }) => (
      <span className="font-bold text-blue-700">{row.getValue("creditDiscount")}%</span>
    ),
  },
  {
    accessorKey: "quickBooking",
    header: () => <span className="font-bold text-black">Quick Booking</span>,
    cell: ({ row }) =>
      row.getValue("quickBooking") ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Enabled
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-600 bg-gray-50">
          Disabled
        </Badge>
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
        <Badge variant="outline" className="text-red-600 border-red-300">Inactive</Badge>
      );
    },
  },
];

// --- Component ---
export default function CorporateReport() {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [quickBookingFilter, setQuickBookingFilter] = useState<"all" | "enabled" | "disabled">("all");

  const allData = useMemo(() => 
    mockCorporateList.map((corp) => ({
      ...corp,
      searchField: `${corp.name} ${corp.code} ${corp.email}`,
    })),
    []
  );

  const filteredData = useMemo(() => {
    let result = [...allData];
    
    // Status filter
    if (statusFilter === "active") {
      result = result.filter(item => item.status === "Active");
    } else if (statusFilter === "inactive") {
      result = result.filter(item => item.status === "Inactive");
    }
    
    // Quick Booking filter
    if (quickBookingFilter === "enabled") {
      result = result.filter(item => item.quickBooking === true);
    } else if (quickBookingFilter === "disabled") {
      result = result.filter(item => item.quickBooking === false);
    }
    
    return result;
  }, [statusFilter, quickBookingFilter, allData]);

  // --- PDF & Print Logic ---
  const generateReport = async (action: 'save' | 'print') => {
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
    doc.text("Corporate Partners Audit Report", 40, 22);

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
    const statusText = statusFilter === "all" ? "All Statuses" : statusFilter === "active" ? "Active Only" : "Inactive Only";
    const quickBookingText = quickBookingFilter === "all" ? "All" : quickBookingFilter === "enabled" ? "Enabled Only" : "Disabled Only";
    
    doc.text(`Status Filter: ${statusText}`, 14, 48);
    doc.text(`Quick Booking Filter: ${quickBookingText}`, 14, 53);
    doc.text(`Total Records in Database: ${allData.length}`, 14, 58);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 63);

    // 5. Table
    autoTable(doc, {
      head: [["Name", "Code", "Contact", "Phone", "Email", "Address", "Cash Disc.", "Credit Disc.", "Quick Booking", "Status"]],
      body: filteredData.map(c => [
        c.name,
        c.code,
        c.primaryContact,
        c.phone,
        c.email,
        c.address,
        `${c.cashDiscount}%`,
        `${c.creditDiscount}%`,
        c.quickBooking ? "Yes" : "No",
        c.status
      ]),
      startY: 70,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === 'save') {
      doc.save(`CorporateReport_${statusFilter}_${quickBookingFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Code", "Primary Contact", "Phone", "Email", "Address", "Date", "Cash Discount", "Credit Discount", "Quick Booking", "Status"];
    const rows = filteredData.map(c => [
      c.name,
      c.code,
      c.primaryContact,
      c.phone,
      c.email,
      c.address,
      c.date,
      c.cashDiscount,
      c.creditDiscount,
      c.quickBooking ? "Yes" : "No",
      c.status
    ].map(cell => `"${cell}"`).join(","));
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CorporateReport_${statusFilter}_${quickBookingFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Corporate Partners Report</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {(statusFilter !== 'all' || quickBookingFilter !== 'all') && 
              ` (filtered by ${statusFilter !== 'all' ? statusFilter : ''} ${quickBookingFilter !== 'all' ? quickBookingFilter : ''})`
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={() => generateReport('print')} className="border-purple-600 text-purple-700 hover:bg-purple-50">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => generateReport('save')}>
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className={statusFilter === "all" ? "bg-purple-600" : ""}
          >
            <Filter className="mr-2 h-4 w-4" /> All Status
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            className={statusFilter === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Active Only
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            className={statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            <XCircle className="mr-2 h-4 w-4" /> Inactive Only
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={quickBookingFilter === "all" ? "default" : "outline"}
            onClick={() => setQuickBookingFilter("all")}
            className={quickBookingFilter === "all" ? "bg-purple-600" : ""}
            size="sm"
          >
            All Quick Booking
          </Button>
          <Button
            variant={quickBookingFilter === "enabled" ? "default" : "outline"}
            onClick={() => setQuickBookingFilter("enabled")}
            className={quickBookingFilter === "enabled" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
            size="sm"
          >
            Quick Booking Enabled
          </Button>
          <Button
            variant={quickBookingFilter === "disabled" ? "default" : "outline"}
            onClick={() => setQuickBookingFilter("disabled")}
            className={quickBookingFilter === "disabled" ? "bg-gray-600 hover:bg-gray-700 text-white" : ""}
            size="sm"
          >
            Quick Booking Disabled
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Corporate Partners Registry
          </CardTitle>
          <Badge variant="outline">Management View</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={`${statusFilter}-${quickBookingFilter}`}
            columns={columns}
            data={filteredData}
            searchKey="searchField"
            searchPlaceholder="Search by name, code, or email..."
          />
        </CardContent>
      </Card>
    </div>
  );
}