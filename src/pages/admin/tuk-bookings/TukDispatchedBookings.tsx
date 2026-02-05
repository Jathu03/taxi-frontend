"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type TukDispatchedBooking = {
  id: string;
  bookingId: string;
  organization: string;
  customerName: string;
  passengerNumber: string;
  hireType: string;
  pickupTime: string;
  pickupAddress: string;
  bookedBy: string;
  dispatchedBy: string;
  dispatchedTime: string;
  testBooking: string;
  driverName: string;
  vehicleNumber: string;
  fareScheme: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<TukDispatchedBooking>[] => [
  { 
    accessorKey: "bookingId", 
    header: "Booking",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <span>{row.original.bookingId}</span>
        <Button
          size="sm"
          variant="outline"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() =>
            navigate("/admin/bookings/dispatch-vehicle", {
              state: { booking: row.original },
            })
          }
        >
          <RefreshCw className="mr-2 h-3 w-3" /> Redispatch
        </Button>
      </div>
    ),
  },
  { accessorKey: "organization", header: "Org" },
  { 
    accessorKey: "customerName", 
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customerName;
      const org = row.original.organization;
      return `${customer} ${org}(${customer})`;
    },
  },
  { accessorKey: "passengerNumber", header: "Passenger" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "pickupAddress", header: "Pickup Address" },
  { accessorKey: "bookedBy", header: "Booked By" },
  { accessorKey: "dispatchedBy", header: "Dispatched By" },
  { accessorKey: "dispatchedTime", header: "Dispatched Time" },
  { accessorKey: "testBooking", header: "Test Booking" },
  { accessorKey: "driverName", header: "Driver" },
  { accessorKey: "vehicleNumber", header: "Tuk Number" },
  { accessorKey: "fareScheme", header: "Fare Scheme" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={() =>
              navigate("/admin/bookings/complete-booking", {
                state: { booking: row.original },
              })
            }
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Complete
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              navigate("/admin/bookings/cancel-booking", {
                state: { booking: row.original },
              })
            }
          >
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/bookings/view/${row.original.bookingId}`, {
                state: { booking: row.original },
              })
            }
          >
            <Eye className="mr-2 h-4 w-4" /> View Hire
          </Button>
        </div>
      );
    },
  },
];

const mockTukDispatchedBookings: TukDispatchedBooking[] = [
  { 
    id: "1", 
    bookingId: "TUK-289264", 
    organization: "Tuk Services", 
    customerName: "Nimal Perera", 
    passengerNumber: "0715527165", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 20:00", 
    pickupAddress: "Pettah Market, Colombo", 
    bookedBy: "Nirash", 
    dispatchedBy: "nethma", 
    dispatchedTime: "12/04/2025 19:06", 
    testBooking: "", 
    driverName: "TUK-375 Ranga", 
    vehicleNumber: "WP PJ-4093", 
    fareScheme: "Tuk Standard" 
  },
  { 
    id: "2", 
    bookingId: "TUK-288668", 
    organization: "Quick Tuk", 
    customerName: "Kasuni Silva", 
    passengerNumber: "0774180836", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 20:15", 
    pickupAddress: "Maradana Station", 
    bookedBy: "nethma", 
    dispatchedBy: "nethma", 
    dispatchedTime: "12/04/2025 19:21", 
    testBooking: "", 
    driverName: "TUK-401 Sunil", 
    vehicleNumber: "WP CAB-2156", 
    fareScheme: "Tuk Standard" 
  },
  { 
    id: "3", 
    bookingId: "TUK-288557", 
    organization: "City Tuk", 
    customerName: "Virendra Fernando", 
    passengerNumber: "0761880700", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 08:00", 
    pickupAddress: "Fort Railway Station", 
    bookedBy: "Haroon", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "12/04/2025 07:05", 
    testBooking: "", 
    driverName: "TUK-512 Kamal", 
    vehicleNumber: "WP CBB-8659", 
    fareScheme: "Tuk Standard" 
  },
];

export default function TukDispatchedBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukDispatchedBooking>({
    initialData: mockTukDispatchedBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tuk Dispatched Bookings</h1>
          <p className="text-muted-foreground">Track dispatched tuk bookings</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Active</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search dispatched tuk bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
