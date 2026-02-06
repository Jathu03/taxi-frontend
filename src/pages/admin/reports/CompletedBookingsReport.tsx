"use client";
import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/EnhancedDataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  FileSpreadsheet,
  Layers,
  Car,
  CheckCircle2,
  Printer,
  Headset,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Types ---
export type CompletedBooking = {
  id: string;
  booking: string;
  voucher: string;
  org: string;
  customer: string;
  passenger: string;
  hireType: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dispatchedTime: string;
  dispatchedBy: string;
  startTime: string;
  completedTime: string;
  totalDistance: string;
  totalFare: string;
  waitingTime: string;
  billedWaitTime: string;
  waitingFee: string;
  testBooking: string;
  driver: string;
  vehicle: string;
  vehicleType: string;
  fareScheme: string;
  status: "Completed";
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
const rawData = [
  { id: "c1", booking: "295001", voucher: "V-102", org: "Corporate Alpha", customer: "Ms. Shiromi", passenger: "Jane Doe", hireType: "Point-to-Point", bookingTime: "10:00 AM", pickupAddress: "Nawala", totalDistance: "12.5 km", totalFare: "1,250.00", driver: "Sunil Silva", vehicle: "CAB-1234", vehicleClass: "Bus", completedTime: "10:45 AM" },
  { id: "ct1", booking: "TUK-C001", voucher: "N/A", org: "Personal", customer: "John Silva", passenger: "John Silva", hireType: "Budget", bookingTime: "11:00 AM", pickupAddress: "Pettah", totalDistance: "4.2 km", totalFare: "450.00", driver: "Ranjith Tuk", vehicle: "TUK-111", vehicleType: "Tuk", completedTime: "11:35 AM" },
];

const allCompletedData = rawData.map(item => ({
  ...item,
  vehicleType: item.vehicleType || (item as any).vehicleClass || "Standard",
  status: "Completed" as const,
})) as CompletedBooking[];

// --- Column Definitions ---
const combinedCompletedColumns: ColumnDef<CompletedBooking>[] = [
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
  { accessorKey: "booking", header: () => <span className="font-bold text-black">Booking</span> },
  { accessorKey: "org", header: () => <span className="font-bold text-black">Org</span> },
  { accessorKey: "customer", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
  { accessorKey: "totalDistance", header: () => <span className="font-bold text-black">Distance</span> },
  {
    accessorKey: "totalFare",
    header: () => <span className="font-bold text-black">Fare</span>,
    cell: ({ row }) => <span className="font-bold text-green-700">Rs. {row.getValue("totalFare")}</span>
  },
  { accessorKey: "driver", header: () => <span className="font-bold text-black">Driver</span> },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => <span className="font-mono text-xs font-bold">{row.getValue("vehicle")}</span>
  },
];

export default function UnifiedCompletedReports() {
  const [vehicleFilter, setVehicleFilter] = useState<"all" | "Tuk" | "nonTuk">("all");

  const filteredData = useMemo(() => {
    let result = [...allCompletedData];
    if (vehicleFilter === "Tuk") result = result.filter(item => item.vehicleType === "Tuk");
    else if (vehicleFilter === "nonTuk") result = result.filter(item => item.vehicleType !== "Tuk");
    return result;
  }, [vehicleFilter]);

  // --- PDF & Print Logic ---
  const generateReport = async (action: 'save' | 'print') => {
    const doc = new jsPDF({ orientation: "landscape" });

    // 1. Add Logo
    try {
      const logoData = await getBase64ImageFromURL("/logo.png");
      doc.addImage(logoData, "PNG", 14, 10, 20, 20);
    } catch (e) { console.error("Logo missing", e); }

    // 2. Main Title
    doc.setFontSize(22);
    doc.setTextColor(67, 56, 202); // Indigo
    doc.text("Completed Bookings Audit Report", 40, 22);

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
    const vehicleText = vehicleFilter === "all" ? "All Vehicles" : vehicleFilter === "Tuk" ? "Tuk Only" : "Cars/Buses Only";
    doc.text(`Vehicle Category: ${vehicleText}`, 14, 48);
    doc.text(`Total Records in Database: ${allCompletedData.length}`, 14, 53);
    doc.text(`Filtered Records: ${filteredData.length}`, 14, 58);

    // 5. Table
    autoTable(doc, {
      head: [["Booking", "Customer", "Pickup Address", "End Time", "Distance", "Fare", "Driver", "Vehicle"]],
      body: filteredData.map(d => [d.booking, d.customer, d.pickupAddress, d.completedTime, d.totalDistance, `Rs. ${d.totalFare}`, d.driver, d.vehicle]),
      startY: 65, // Start after the filter summary
      headStyles: { fillColor: [67, 56, 202], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    if (action === 'save') {
      doc.save(`CompletedBookings_${vehicleFilter}_${new Date().getTime()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
  };

  const exportCSV = () => {
    const headers = ["Booking", "Organization", "Customer", "Passenger", "Pickup Address", "Total Distance", "Total Fare", "Driver", "Vehicle", "Vehicle Type", "Hire Type", "Booking Time", "Completed Time"];
    const rows = filteredData.map(d => [d.booking, d.org, d.customer, d.passenger, d.pickupAddress, d.totalDistance, d.totalFare, d.driver, d.vehicle, d.vehicleType, d.hireType, d.bookingTime, d.completedTime].map(cell => `"${cell}"`).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `CompletedBookings_${vehicleFilter}_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-indigo-50/30 to-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Completed Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Viewing {filteredData.length} records
            {vehicleFilter !== 'all' && ` filtered by ${vehicleFilter}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="border-green-600 text-green-700 hover:bg-green-50">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" onClick={() => generateReport('print')} className="border-indigo-600 text-indigo-700 hover:bg-indigo-50">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => generateReport('save')}>
            <FileText className="mr-2 h-4 w-4" /> PDF Report
          </Button>
        </div>
      </div>

      {/* Vehicle Filters */}
      <div className="flex gap-2">
        <Button
          variant={vehicleFilter === "all" ? "default" : "outline"}
          onClick={() => setVehicleFilter("all")}
          className={vehicleFilter === "all" ? "bg-indigo-600" : ""}
        >
          <Car className="mr-2 h-4 w-4" /> All Vehicles
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
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            Execution Logs
          </CardTitle>
          <Badge variant="outline">Billing Ready</Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <EnhancedDataTable
            key={vehicleFilter}
            columns={combinedCompletedColumns}
            data={filteredData}
            searchKey="customer"
            searchPlaceholder="Search customer or booking..."
          />
        </CardContent>
      </Card>
    </div>
  );
}