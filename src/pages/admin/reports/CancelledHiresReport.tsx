"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet, // For CSV icon
  Layers,
  Car,
  Ban,
  Headset,
  Printer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type CancelledBooking = {
  id: string;
  bookingNumber: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  testBooking: string;
  cancelledTime: string;
  cancelledType: "Customer" | "Driver" | "System" | "No Show";
  cancelledAgent: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
};

// --- Helper to convert your public/logo.png to Base64 for jsPDF ---
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
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      }
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

// --- Mock Data ---
const rawCancelledData = [
  { id: "c1", bookingNumber: "295001", org: "Alpha Corp", customer: "Ms. Shiromi", passenger: "0771234567", hireType: "Corporate", bookingTime: "10:00 AM", testBooking: "No", cancelledTime: "10:15 AM", cancelledType: "Customer", cancelledAgent: "Web App", driver: "Sunil Silva", vehicle: "CAB-1234", vehicleClass: "Bus" },
  { id: "c2", bookingNumber: "295005", org: "Personal", customer: "John Silva", passenger: "0719876543", hireType: "Budget", bookingTime: "11:30 AM", testBooking: "No", cancelledTime: "11:40 AM", cancelledType: "Driver", cancelledAgent: "Driver App", driver: "Nimal Fernando", vehicle: "ECO-5678", vehicleClass: "ECONOMY" },
  { id: "ct1", bookingNumber: "TUK-C001", org: "Personal", customer: "Kamal Perera", passenger: "0784447788", hireType: "Tuk-Hire", bookingTime: "09:00 AM", testBooking: "No", cancelledTime: "09:05 AM", cancelledType: "System", cancelledAgent: "Auto-Cancel", driver: "Saman Tuk", vehicle: "TUK-111", vehicleType: "Tuk" },
];

const allCancelledData = rawCancelledData.map(item => ({
  ...item,
  vehicleType: item.vehicleType || (item as any).vehicleClass || "Standard"
})) as CancelledBooking[];

// --- Column Definitions ---
const columns: ColumnDef<CancelledBooking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
  },
  { accessorKey: "bookingNumber", header: () => <span className="font-bold text-black">Booking #</span> },
  { accessorKey: "org", header: () => <span className="font-bold text-black">Org</span> },
  { accessorKey: "customer", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "passenger", header: () => <span className="font-bold text-black">Passenger #</span> },
  { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
  { accessorKey: "bookingTime", header: () => <span className="font-bold text-black">Booking Time</span> },
  { accessorKey: "cancelledTime", header: () => <span className="font-bold text-black">Cancelled At</span> },
  {
    accessorKey: "cancelledType",
    header: () => <span className="font-bold text-black">Type</span>,
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("cancelledType")}</Badge>
  },
  { accessorKey: "driver", header: () => <span className="font-bold text-black">Driver</span> },
  { accessorKey: "vehicle", header: () => <span className="font-bold text-black">Vehicle</span> },
];

export default function CancelledHiresReport() {
  const [vehicleFilter, setVehicleFilter] = useState<"all" | "Tuk" | "nonTuk">("all");

  const filteredData = useMemo(() => {
    let result = [...allCancelledData];
    if (vehicleFilter === "Tuk") result = result.filter(d => d.vehicleType === "Tuk");
    else if (vehicleFilter === "nonTuk") result = result.filter(d => d.vehicleType !== "Tuk");
    return result;
  }, [vehicleFilter]);

  // --- PDF & Print Logic with Image ---
  const generateReport = async (action: 'save' | 'print') => {
    const doc = new jsPDF({ orientation: "landscape" });

    try {
      // Path: public/logo.png
      const logoData = await getBase64ImageFromURL("/logo.png");
      doc.addImage(logoData, "PNG", 14, 10, 20, 20);
    } catch (error) {
      console.error("Logo failed to load", error);
    }

    doc.setFontSize(20);
    doc.setTextColor(99, 48, 184);
    doc.text("Cancelled Hires Audit Report", 40, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 26);

    // --- APPLIED FILTERS SECTION ---
    doc.setDrawColor(200);
    doc.line(14, 32, 283, 32);

    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Report Filters:", 14, 38);

    doc.setFont("helvetica", "normal");
    const vehicleText = vehicleFilter === "all" ? "All Vehicles" : vehicleFilter === "Tuk" ? "Tuk Only" : "Cars/Buses Only";
    doc.text(`Vehicle Category: ${vehicleText}`, 14, 43);
    doc.text(`Total Records in Database: ${allCancelledData.length}`, 14, 48);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 53);

    autoTable(doc, {
      head: [["Booking #", "Org", "Customer", "Cancelled Type", "Driver", "Vehicle", "Hire Type"]],
      body: filteredData.map(d => [d.bookingNumber, d.org, d.customer, d.cancelledType, d.driver, d.vehicle, d.hireType]),
      startY: 59,
      headStyles: { fillColor: [99, 48, 184], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === 'save') {
      doc.save(`CancelledHires_${vehicleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
  };

  // --- CSV Export Logic ---
  const exportCSV = () => {
    const headers = ["Booking #", "Organization", "Customer", "Passenger #", "Hire Type", "Booking Time", "Cancelled At", "Cancellation Type", "Cancelled Agent", "Driver", "Vehicle", "Vehicle Type", "Test Booking"];

    const csvRows = filteredData.map(d => [
      d.bookingNumber,
      d.org,
      d.customer,
      d.passenger,
      d.hireType,
      d.bookingTime,
      d.cancelledTime,
      d.cancelledType,
      d.cancelledAgent,
      d.driver,
      d.vehicle,
      d.vehicleType,
      d.testBooking
    ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(","));

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `CancelledHires_${vehicleFilter}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableFilters = useMemo(() => [
    { key: "vehicleType", label: "Vehicle Class", options: [{ value: "Bus", label: "Bus" }, { value: "Standard", label: "Standard" }, { value: "Tuk", label: "Tuk" }] },
    { key: "cancelledType", label: "Cancellation Type", options: [{ value: "Customer", label: "Customer" }, { value: "Driver", label: "Driver" }, { value: "System", label: "System" }] },
  ], []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-red-50/20 to-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Cancelled Hires</h1>
          <p className="text-muted-foreground mt-1">Audit and analyze booking cancellations</p>
        </div>
        <div className="flex gap-2">
          {/* CSV Button */}
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>

          {/* Print Button */}
          <Button variant="outline" onClick={() => generateReport('print')} className="border-[#6330B8] text-[#6330B8] hover:bg-purple-50">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>

          {/* PDF Button */}
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => generateReport('save')}>
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Vehicle Quick Filters */}
      <div className="flex gap-2">
        <Button
          variant={vehicleFilter === "all" ? "default" : "outline"}
          onClick={() => setVehicleFilter("all")}
          className={vehicleFilter === "all" ? "bg-[#6330B8]" : ""}
        >
          <Car className="mr-2 h-4 w-4" /> All Hires
        </Button>
        <Button
          variant={vehicleFilter === "Tuk" ? "default" : "outline"}
          onClick={() => setVehicleFilter("Tuk")}
          className={vehicleFilter === "Tuk" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
        >
          <Layers className="mr-2 h-4 w-4" /> Tuk Only
        </Button>
        <Button
          variant={vehicleFilter === "nonTuk" ? "default" : "outline"}
          onClick={() => setVehicleFilter("nonTuk")}
          className={vehicleFilter === "nonTuk" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
        >
          <Car className="mr-2 h-4 w-4" /> Cars/Buses Only
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-600" />
            Cancellation Logs
          </CardTitle>
          <Badge variant="outline">Audit Trail</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleFilter}
            columns={columns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search by customer..."
            filters={tableFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}