"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type ManualDispatchedBooking = {
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

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<ManualDispatchedBooking>[] => [
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

const mockManualDispatchedBookings: ManualDispatchedBooking[] = [
  { 
    id: "1", 
    bookingId: "295749", 
    organization: "BCD Travels", 
    customerName: "BCD Travel", 
    passengerNumber: "0714788999", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 15:30", 
    pickupAddress: ",,,", 
    bookedBy: "devinda95", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "12/04/2025 15:00", 
    testBooking: "", 
    driverName: "4124 Tharanga", 
    vehicleNumber: "CBO-4831", 
    fareScheme: "Mileage Calculator" 
  },
  { 
    id: "2", 
    bookingId: "295745", 
    organization: "BCD Travels", 
    customerName: "BCD Travel", 
    passengerNumber: "0714788999", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 15:30", 
    pickupAddress: ",,,", 
    bookedBy: "devinda95", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "12/04/2025 14:48", 
    testBooking: "", 
    driverName: "361 Amara (Amara)", 
    vehicleNumber: "PE-3912", 
    fareScheme: "STANDARD" 
  },
  { 
    id: "3", 
    bookingId: "295744", 
    organization: "BCD Travels", 
    customerName: "BCD Travel", 
    passengerNumber: "0714788999", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 15:30", 
    pickupAddress: ",,,", 
    bookedBy: "devinda95", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "12/04/2025 14:47", 
    testBooking: "", 
    driverName: "3152 Shehan", 
    vehicleNumber: "CBC-9801", 
    fareScheme: "STANDARD" 
  },
  { 
    id: "4", 
    bookingId: "295743", 
    organization: "BCD Travels", 
    customerName: "BCD Travel", 
    passengerNumber: "0714788999", 
    hireType: "On The Meter", 
    pickupTime: "12/04/2025 15:30", 
    pickupAddress: ",,,", 
    bookedBy: "devinda95", 
    dispatchedBy: "devinda95", 
    dispatchedTime: "12/04/2025 14:46", 
    testBooking: "", 
    driverName: "3152 Shehan", 
    vehicleNumber: "CBC-9801", 
    fareScheme: "STANDARD" 
  },
];

export default function ManualDispatchedBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<ManualDispatchedBooking>({
    initialData: mockManualDispatchedBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manually Dispatched</h1>
          <p className="text-muted-foreground">Manually assigned bookings</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Active</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search manual bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
          {
            key: "dispatchedBy",
            label: "Dispatched By",
            options: [
              { value: "Admin User", label: "Admin User" },
              { value: "Dispatcher 1", label: "Dispatcher 1" },
            ],
          },
        ]}
      />
    </div>
  );
}
