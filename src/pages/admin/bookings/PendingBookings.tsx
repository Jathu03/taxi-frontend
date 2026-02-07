"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash, Edit } from "lucide-react"; // Removed MoreHorizontal
// Removed DropdownMenu imports
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type PendingBooking = {
  id: string;
  bookingNumber: string;
  isAdvance: string;
  organization: string;
  customer: string;
  passengerNumber: string;
  hireType: string;
  clientRemarks: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dropAddress: string;
  vehicleClass: string;
};

const columns = (
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<PendingBooking>[] => [
  { 
    accessorKey: "bookingNumber", 
    header: () => <span className="font-bold text-black">Booking #</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col gap-2">
          <span className="font-mono font-bold text-primary">
            {booking.bookingNumber}
          </span>
          <Button 
            size="sm" 
            className="h-7 bg-green-600 hover:bg-green-700 text-xs gap-1.5 px-2 w-fit"
            onClick={() => navigate('/admin/bookings/dispatch-vehicle', { state: { booking } })}
          >
            <Send className="h-3 w-3" />
            Dispatch
          </Button>
        </div>
      );
    }
  },
  { accessorKey: "isAdvance", header: "Is Adv" },
  { accessorKey: "organization", header: "Organization" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "passengerNumber", header: "Passenger #" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "clientRemarks", header: "Client Remarks" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  { accessorKey: "bookedBy", header: "Booked By" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "pickupAddress", header: "Pickup Address" },
  { accessorKey: "dropAddress", header: "Drop Address" },
  { accessorKey: "vehicleClass", header: "Vehicle Class" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex items-center gap-2">
          {/* Edit Button - Redirects to Add/Edit Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/bookings/add-new-booking', { state: { booking } })}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>

          {/* Cancel Button - Redirects to Cancel Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/bookings/cancel-booking', { state: { booking } })}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      );
    },
  },
];

const mockPendingBookings: PendingBooking[] = [
  { 
    id: "1", 
    bookingNumber: "295104", 
    isAdvance: "", 
    organization: "PGIE", 
    customer: "Ms. Shiromi Herath", 
    passengerNumber: "0766117723", 
    hireType: "On The Meter", 
    clientRemarks: "(Hire Postpone) Nawala to Waskaduwa", 
    bookingTime: "11/27/2025 15:58", 
    bookedBy: "insaaf", 
    pickupTime: "12/02/2025 08:00", 
    pickupAddress: "83 Liyanage Mawatha, Kotte", 
    dropAddress: "", 
    vehicleClass: "Bus" 
  },
  { 
    id: "2", 
    bookingNumber: "295731", 
    isAdvance: "", 
    organization: "Inbay", 
    customer: "Hameed", 
    passengerNumber: "0770383078", 
    hireType: "On The Meter", 
    clientRemarks: "Pick From Dehiwala", 
    bookingTime: "12/04/2025 08:20", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 20:45", 
    pickupAddress: "59/4 Rahula Rd, Dehiwala", 
    dropAddress: "", 
    vehicleClass: "ECO" 
  },
];

export default function PendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<PendingBooking>({
    initialData: mockPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending bookings awaiting assignment</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)}
        data={data}
        searchKey="customer"
        searchPlaceholder="Search by customer name..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
          {
            key: "vehicleClass",
            label: "Vehicle Class",
            options: [
              { value: "Bus", label: "Bus" },
              { value: "Van", label: "Van" },
              { value: "ECO", label: "ECO" },
              { value: "EX", label: "EX" },
              { value: "Luxury", label: "Luxury" },
              { value: "Standard", label: "Standard" },
            ],
          },
          {
            key: "hireType",
            label: "Hire Type",
            options: [
              { value: "On The Meter", label: "On The Meter" },
              { value: "Fixed Rate", label: "Fixed Rate" },
            ],
          },
        ]}
      />
    </div>
  );
}