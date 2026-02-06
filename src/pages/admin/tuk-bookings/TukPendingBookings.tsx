"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash, Edit } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type TukPendingBooking = {
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
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<TukPendingBooking>[] => [
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
  { 
    accessorKey: "isAdvance", 
    header: () => <span className="font-bold text-black">Is Adv</span> 
  },
  { 
    accessorKey: "organization", 
    header: () => <span className="font-bold text-black">Organization</span> 
  },
  { 
    accessorKey: "customer", 
    header: () => <span className="font-bold text-black">Customer</span> 
  },
  { 
    accessorKey: "passengerNumber", 
    header: () => <span className="font-bold text-black">Passenger #</span> 
  },
  { 
    accessorKey: "hireType", 
    header: () => <span className="font-bold text-black">Hire Type</span> 
  },
  { 
    accessorKey: "clientRemarks", 
    header: () => <span className="font-bold text-black">Remarks</span> 
  },
  { 
    accessorKey: "bookingTime", 
    header: () => <span className="font-bold text-black">Booking Time</span> 
  },
  { 
    accessorKey: "bookedBy", 
    header: () => <span className="font-bold text-black">Booked By</span> 
  },
  { 
    accessorKey: "pickupTime", 
    header: () => <span className="font-bold text-black">Pickup Time</span> 
  },
  { 
    accessorKey: "pickupAddress", 
    header: () => <span className="font-bold text-black">Pickup Address</span> 
  },
  { 
    accessorKey: "dropAddress", 
    header: () => <span className="font-bold text-black">Drop Address</span> 
  },
  { 
    accessorKey: "vehicleClass", 
    header: () => <span className="font-bold text-black">Class</span> 
  },
  {
    id: "actions",
    header: () => <span className="font-bold text-black">Actions</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/bookings/add-new-booking', { state: { booking } })}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
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

const mockTukPendingBookings: TukPendingBooking[] = [
  { 
    id: "1", 
    bookingNumber: "TUK-295104", 
    isAdvance: "", 
    organization: "Tuk Services", 
    customer: "Ms. Nadeeka Silva", 
    passengerNumber: "0776234567", 
    hireType: "On The Meter", 
    clientRemarks: "Short trip to nearby market", 
    bookingTime: "11/27/2025 15:58", 
    bookedBy: "insaaf", 
    pickupTime: "12/02/2025 08:00", 
    pickupAddress: "45 Temple Road, Kotte", 
    dropAddress: "Kotte Market", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "2", 
    bookingNumber: "TUK-295731", 
    isAdvance: "", 
    organization: "Quick Rides", 
    customer: "Ravi Fernando", 
    passengerNumber: "0779876543", 
    hireType: "On The Meter", 
    clientRemarks: "Pick from home to railway station", 
    bookingTime: "12/04/2025 08:20", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 20:45", 
    pickupAddress: "78 Galle Road, Dehiwala", 
    dropAddress: "Fort Railway Station", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "3", 
    bookingNumber: "TUK-295661", 
    isAdvance: "Yes", 
    organization: "City Tuk", 
    customer: "Mr. Perera", 
    passengerNumber: "0771234589", 
    hireType: "Fixed Rate", 
    clientRemarks: "Hospital visit", 
    bookingTime: "12/03/2025 16:47", 
    bookedBy: "erandi", 
    pickupTime: "12/04/2025 21:00", 
    pickupAddress: "23 Ward Place, Colombo 7", 
    dropAddress: "General Hospital", 
    vehicleClass: "Tuk" 
  }
];

export default function TukPendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete, // Still available if needed for other logic
  } = useDataTable<TukPendingBooking>({
    initialData: mockTukPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Tuk Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending tuk bookings awaiting assignment</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customer"
        searchPlaceholder="Search by customer name..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
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