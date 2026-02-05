"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type DispatchedBooking = {
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

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<DispatchedBooking>[] => [
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
  { accessorKey: "vehicleNumber", header: "Vehicle" },
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

const mockDispatchedBookings: DispatchedBooking[] = [
  { 
    id: "1", 
    bookingId: "289264", 
    organization: "Central Bank", 
    customerName: "Menusha", 
    passengerNumber: "0715527165", 
    hireType: "On The Meter", 
    pickupTime: "09/19/2025 20:00", 
    pickupAddress: ",30 Janadhipathi Mawatha, Colombo,,", 
    bookedBy: "Nirash", 
    dispatchedBy: "nethma", 
    dispatchedTime: "09/19/2025 19:06", 
    testBooking: "", 
    driverName: "375 Ranga", 
    vehicleNumber: "PJ-4093", 
    fareScheme: "CBSL Budget" 
  },
  { 
    id: "2", 
    bookingId: "288668", 
    organization: "Central Bank", 
    customerName: "Kasuni", 
    passengerNumber: "0774180836", 
    hireType: "On The Meter", 
    pickupTime: "09/12/2025 20:15", 
    pickupAddress: ",30 Janadhipathi Mawatha, Colombo,,", 
    bookedBy: "nethma", 
    dispatchedBy: "nethma", 
    dispatchedTime: "09/12/2025 19:21", 
    testBooking: "", 
    driverName: "375 Ranga", 
    vehicleNumber: "PJ-4093", 
    fareScheme: "Mileage Calculator" 
  },
  { 
    id: "3", 
    bookingId: "288557", 
    organization: "CBSL Package", 
    customerName: "Virendra", 
    passengerNumber: "0761880700", 
    hireType: "On The Meter", 
    pickupTime: "09/12/2025 08:00", 
    pickupAddress: ",,,", 
    bookedBy: "Haroon", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "09/12/2025 07:05", 
    testBooking: "", 
    driverName: "375 Ranga", 
    vehicleNumber: "PJ-4093", 
    fareScheme: "STANDARD" 
  },
  { 
    id: "4", 
    bookingId: "288141", 
    organization: "KINGSBURY HOTEL", 
    customerName: "Azeem Kingsbury", 
    passengerNumber: "0772170000", 
    hireType: "On The Meter", 
    pickupTime: "09/06/2025 10:00", 
    pickupAddress: ",48 Janadhipathi Mawatha, Colombo,,", 
    bookedBy: "srikanthan", 
    dispatchedBy: "srikanthan", 
    dispatchedTime: "09/06/2025 09:29", 
    testBooking: "", 
    driverName: "3106 Company Vehicle", 
    vehicleNumber: "CBB-8659", 
    fareScheme: "CBSL Budget" 
  },
  { 
    id: "5", 
    bookingId: "287894", 
    organization: "Hayleys Fentons", 
    customerName: "Mrs.Kethmini", 
    passengerNumber: "0770876451", 
    hireType: "On The Meter", 
    pickupTime: "09/03/2025 07:00", 
    pickupAddress: ",WVF8+HMX, Colombo 01000,,", 
    bookedBy: "shamalka", 
    dispatchedBy: "Haroon", 
    dispatchedTime: "09/03/2025 06:33", 
    testBooking: "", 
    driverName: "494 Ravi", 
    vehicleNumber: "PF-2287", 
    fareScheme: "STANDARD" 
  },
];

export default function DispatchedBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<DispatchedBooking>({
    initialData: mockDispatchedBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dispatched Bookings</h1>
          <p className="text-muted-foreground">Track dispatched bookings</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Active</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search dispatched bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
