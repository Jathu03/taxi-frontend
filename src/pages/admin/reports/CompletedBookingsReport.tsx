"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// ============================================
// TYPE DEFINITION
// ============================================
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

// ============================================
// MOCK DATA
// ============================================
const rawData = [
  { 
    id: "c1", 
    booking: "295001", 
    voucher: "V-102", 
    org: "Corporate Alpha", 
    customer: "Ms. Shiromi", 
    passenger: "Jane Doe", 
    hireType: "Point-to-Point", 
    bookingTime: "10:00 AM", 
    pickupAddress: "Nawala", 
    totalDistance: "12.5 km", 
    totalFare: "1,250.00", 
    driver: "Sunil Silva", 
    vehicle: "CAB-1234", 
    vehicleClass: "Bus", 
    completedTime: "10:45 AM",
    bookedBy: "Admin",
    pickupTime: "10:15 AM",
    dispatchedTime: "10:20 AM",
    dispatchedBy: "Dispatcher 1",
    startTime: "10:25 AM",
    waitingTime: "5 mins",
    billedWaitTime: "5 mins",
    waitingFee: "50.00",
    testBooking: "No",
    fareScheme: "Standard"
  },
  { 
    id: "ct1", 
    booking: "TUK-C001", 
    voucher: "N/A", 
    org: "Personal", 
    customer: "John Silva", 
    passenger: "John Silva", 
    hireType: "Budget", 
    bookingTime: "11:00 AM", 
    pickupAddress: "Pettah", 
    totalDistance: "4.2 km", 
    totalFare: "450.00", 
    driver: "Ranjith Tuk", 
    vehicle: "TUK-111", 
    vehicleType: "Tuk", 
    completedTime: "11:35 AM",
    bookedBy: "App User",
    pickupTime: "11:10 AM",
    dispatchedTime: "11:12 AM",
    dispatchedBy: "Auto Dispatch",
    startTime: "11:15 AM",
    waitingTime: "2 mins",
    billedWaitTime: "0 mins",
    waitingFee: "0.00",
    testBooking: "No",
    fareScheme: "Budget"
  },
];

const allCompletedData: CompletedBooking[] = rawData.map(item => ({
  ...item,
  vehicleType: item.vehicleType || (item as any).vehicleClass || "Standard",
  status: "Completed" as const,
  voucher: item.voucher || "N/A",
  bookedBy: item.bookedBy || "Unknown",
  pickupTime: item.pickupTime || "N/A",
  dispatchedTime: item.dispatchedTime || "N/A",
  dispatchedBy: item.dispatchedBy || "N/A",
  startTime: item.startTime || "N/A",
  waitingTime: item.waitingTime || "0",
  billedWaitTime: item.billedWaitTime || "0",
  waitingFee: item.waitingFee || "0",
  testBooking: item.testBooking || "No",
  fareScheme: item.fareScheme || "Standard",
}));

// ============================================
// TABLE COLUMNS (For UI DataTable)
// ============================================
const tableColumns: ColumnDef<CompletedBooking>[] = [
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
    accessorKey: "booking",
    header: () => <span className="font-bold text-black">Booking</span>,
  },
  {
    accessorKey: "org",
    header: () => <span className="font-bold text-black">Org</span>,
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
  },
  {
    accessorKey: "pickupAddress",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "totalDistance",
    header: () => <span className="font-bold text-black">Distance</span>,
  },
  {
    accessorKey: "totalFare",
    header: () => <span className="font-bold text-black">Fare</span>,
    cell: ({ row }) => (
      <span className="font-bold text-green-700">
        Rs. {row.getValue("totalFare")}
      </span>
    ),
  },
  {
    accessorKey: "driver",
    header: () => <span className="font-bold text-black">Driver</span>,
  },
  {
    accessorKey: "vehicle",
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold">
        {row.getValue("vehicle")}
      </span>
    ),
  },
];

// ============================================
// PDF COLUMNS (For PDF Export)
// ============================================
const pdfColumns = [
  { header: "Booking", dataKey: "booking" },
  { header: "Customer", dataKey: "customer" },
  { header: "Pickup Address", dataKey: "pickupAddress" },
  { header: "End Time", dataKey: "completedTime" },
  { header: "Distance", dataKey: "totalDistance" },
  { header: "Fare", dataKey: "totalFare" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle", dataKey: "vehicle" },
];

// ============================================
// CSV COLUMNS (For CSV Export - More Detailed)
// ============================================
const csvColumns = [
  { header: "Booking", dataKey: "booking" },
  { header: "Voucher", dataKey: "voucher" },
  { header: "Organization", dataKey: "org" },
  { header: "Customer", dataKey: "customer" },
  { header: "Passenger", dataKey: "passenger" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Pickup Address", dataKey: "pickupAddress" },
  { header: "Booking Time", dataKey: "bookingTime" },
  { header: "Pickup Time", dataKey: "pickupTime" },
  { header: "Start Time", dataKey: "startTime" },
  { header: "Completed Time", dataKey: "completedTime" },
  { header: "Total Distance", dataKey: "totalDistance" },
  { header: "Total Fare", dataKey: "totalFare" },
  { header: "Waiting Time", dataKey: "waitingTime" },
  { header: "Billed Wait Time", dataKey: "billedWaitTime" },
  { header: "Waiting Fee", dataKey: "waitingFee" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
  { header: "Fare Scheme", dataKey: "fareScheme" },
  { header: "Test Booking", dataKey: "testBooking" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function CompletedBookingsReport() {
  return (
    <ReportPageTemplate
      title="Completed Bookings Audit Report"
      data={allCompletedData}
      tableColumns={tableColumns}
      pdfColumns={pdfColumns}
      csvColumns={csvColumns}
      searchKey="customer"
      fileName="CompletedBookings.pdf"
      filters={[
        {
          key: "vehicleType",
          label: "Vehicle Type",
          options: [
            { label: "All Vehicles", value: "all" },
            { label: "Tuk Only", value: "Tuk" },
            { label: "Cars/Buses Only", value: "Standard" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}