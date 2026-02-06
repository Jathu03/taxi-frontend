"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash } from "lucide-react"; // Removed MoreHorizontal
// Removed DropdownMenu imports
import { DeleteDialog } from "@/components/DeleteDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type TukAppPendingBooking = {
  id: string;
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string;
  bookingTime: string;
  appPlatform: string;
};

const columns = (
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<TukAppPendingBooking>[] => [
  { 
    accessorKey: "bookingId", 
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col gap-2">
          <span className="font-mono font-bold text-primary">
            {booking.bookingId}
          </span>
          <Button 
            size="sm" 
            className="h-7 bg-green-600 hover:bg-green-700 text-xs gap-1.5 px-2 w-fit"
            onClick={() => navigate('/admin/bookings/dispatch-vehicle', { 
              state: { 
                booking: {
                  bookingNumber: booking.bookingId,
                  customer: booking.customerName,
                  passengerNumber: booking.phoneNumber,
                  pickupAddress: booking.pickupLocation,
                  dropAddress: booking.dropLocation,
                  vehicleClass: "Tuk",
                  pickupTime: booking.bookingTime,
                  clientRemarks: `Tuk App Booking from ${booking.appPlatform}`,
                  isAdvance: "No",
                  organization: ""
                }
              } 
            })}
          >
            <Send className="h-3 w-3" />
            Dispatch Tuk
          </Button>
        </div>
      );
    }
  },
  { 
    accessorKey: "customerName", 
    header: () => <span className="font-bold text-black">Customer</span> 
  },
  { 
    accessorKey: "phoneNumber", 
    header: () => <span className="font-bold text-black">Phone</span> 
  },
  { 
    accessorKey: "pickupLocation", 
    header: () => <span className="font-bold text-black">Pickup</span> 
  },
  { 
    accessorKey: "dropLocation", 
    header: () => <span className="font-bold text-black">Drop</span> 
  },
  { 
    accessorKey: "vehicleType", 
    header: () => <span className="font-bold text-black">Vehicle</span> 
  },
  { 
    accessorKey: "bookingTime", 
    header: () => <span className="font-bold text-black">Time</span> 
  },
  {
    accessorKey: "appPlatform",
    header: () => <span className="font-bold text-black">Platform</span>,
    cell: ({ row }) => {
      const platform = row.original.appPlatform;
      return <Badge variant="outline">{platform}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <span className="font-bold text-black text-right block">Actions</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex justify-end">
          <DeleteDialog
            title={`Cancel Tuk Booking?`}
            description="This will cancel the tuk app booking."
            onConfirm={() => onDelete(booking.id)}
            trigger={
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash className="mr-2 h-4 w-4" /> Cancel
              </Button>
            }
          />
        </div>
      );
    },
  },
];

const mockTukAppPendingBookings: TukAppPendingBooking[] = [
  { id: "1", bookingId: "TAPP-001", customerName: "Kasun Perera", phoneNumber: "+94 77 789 0123", pickupLocation: "Pettah", dropLocation: "Fort", vehicleType: "Tuk", bookingTime: "2024-03-15 12:30 PM", appPlatform: "Android" },
  { id: "2", bookingId: "TAPP-002", customerName: "Nimali Silva", phoneNumber: "+94 71 890 1234", pickupLocation: "Borella", dropLocation: "Nugegoda", vehicleType: "Tuk", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "3", bookingId: "TAPP-003", customerName: "Ranjith Fernando", phoneNumber: "+94 76 123 4567", pickupLocation: "Maradana", dropLocation: "Dehiwala", vehicleType: "Tuk", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
];

export default function TukAppPendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<TukAppPendingBooking>({
    initialData: mockTukAppPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Tuk App Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">Three-wheeler bookings from mobile application</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search tuk app bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
          {
            key: "appPlatform",
            label: "Platform",
            options: [
              { value: "Android", label: "Android" },
              { value: "iOS", label: "iOS" },
            ],
          },
        ]}
      />
    </div>
  );
}