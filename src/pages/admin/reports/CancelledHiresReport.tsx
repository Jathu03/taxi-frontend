"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ReportPageTemplate } from "@/components/ReportPageTemplate";
import { Badge } from "@/components/ui/badge";

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

const allCancelledData: CancelledBooking[] = [
  { id: "c1", bookingNumber: "295001", org: "Alpha Corp", customer: "Ms. Shiromi", passenger: "0771234567", hireType: "Corporate", bookingTime: "10:00 AM", testBooking: "No", cancelledTime: "10:15 AM", cancelledType: "Customer", cancelledAgent: "Web App", driver: "Sunil Silva", vehicle: "CAB-1234", vehicleType: "Bus" },
  { id: "c2", bookingNumber: "295005", org: "Personal", customer: "John Silva", passenger: "0719876543", hireType: "Budget", bookingTime: "11:30 AM", testBooking: "No", cancelledTime: "11:40 AM", cancelledType: "Driver", cancelledAgent: "Driver App", driver: "Nimal Fernando", vehicle: "ECO-5678", vehicleType: "ECONOMY" },
  { id: "ct1", bookingNumber: "TUK-C001", org: "Personal", customer: "Kamal Perera", passenger: "0784447788", hireType: "Tuk-Hire", bookingTime: "09:00 AM", testBooking: "No", cancelledTime: "09:05 AM", cancelledType: "System", cancelledAgent: "Auto-Cancel", driver: "Saman Tuk", vehicle: "TUK-111", vehicleType: "Tuk" },
];

const tableColumns: ColumnDef<CancelledBooking>[] = [
  { accessorKey: "bookingNumber", header: "Booking #" },
  { accessorKey: "org", header: "Org" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "cancelledTime", header: "Cancelled At" },
  {
    accessorKey: "cancelledType",
    header: "Type",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("cancelledType")}</Badge>,
  },
  { accessorKey: "driver", header: "Driver" },
  { accessorKey: "vehicle", header: "Vehicle" },
];

// ============================================
// EXPORT COLUMNS (Unified)
// ============================================
const exportColumns = [
  { header: "Booking Number", dataKey: "bookingNumber" },
  { header: "Organization", dataKey: "org" },
  { header: "Customer Name", dataKey: "customer" },
  { header: "Passenger Contact", dataKey: "passenger" },
  { header: "Hire Type", dataKey: "hireType" },
  { header: "Booking Time", dataKey: "bookingTime" },
  { header: "Cancelled Time", dataKey: "cancelledTime" },
  { header: "Cancellation Type", dataKey: "cancelledType" },
  { header: "Cancelled By", dataKey: "cancelledAgent" },
  { header: "Driver", dataKey: "driver" },
  { header: "Vehicle", dataKey: "vehicle" },
  { header: "Vehicle Type", dataKey: "vehicleType" },
];

export default function CancelledHiresReport() {
  return (
    <ReportPageTemplate
      title="Cancelled Hires Audit Report"
      data={allCancelledData}
      tableColumns={tableColumns}
      exportColumns={exportColumns}
      searchKey="customer"
      fileName="CancelledHires.csv" // Extension will be auto-adjusted
      filters={[
        {
          key: "vehicleType",
          label: "Vehicle Type",
          options: [
            { label: "All Vehicles", value: "all" },
            { label: "Tuk Only", value: "Tuk" },
            { label: "Cars/Buses", value: "ECONOMY" },
          ],
          defaultValue: "all",
        },
        {
          key: "cancelledType",
          label: "Cancellation Type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Customer", value: "Customer" },
            { label: "Driver", value: "Driver" },
            { label: "System", value: "System" },
            { label: "No Show", value: "No Show" },
          ],
          defaultValue: "all",
        },
        {
          key: "hireType",
          label: "Hire Type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Corporate", value: "Corporate" },
            { label: "Budget", value: "Budget" },
            { label: "Tuk-Hire", value: "Tuk-Hire" },
          ],
          defaultValue: "all",
        },
      ]}
    />
  );
}