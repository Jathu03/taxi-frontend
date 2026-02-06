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

export type AppPendingBooking = {
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
): ColumnDef<AppPendingBooking>[] => [
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
                  vehicleClass: booking.vehicleType,
                  pickupTime: booking.bookingTime,
                  clientRemarks: `App Booking from ${booking.appPlatform}`,
                  isAdvance: "No",
                  organization: ""
                }
              } 
            })}
          >
            <Send className="h-3 w-3" />
            Dispatch
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
            title={`Cancel Booking?`}
            description="This will cancel the app booking."
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

const mockAppPendingBookings: AppPendingBooking[] = [
  { id: "1", bookingId: "APP-001", customerName: "David Lee", phoneNumber: "+94 77 789 0123", pickupLocation: "Galle Face Green", dropLocation: "Mount Lavinia", vehicleType: "ECONOMY", bookingTime: "2024-03-15 12:30 PM", appPlatform: "Android" },
  { id: "2", bookingId: "APP-002", customerName: "Sophia Wang", phoneNumber: "+94 71 890 1234", pickupLocation: "Colombo Fort", dropLocation: "Dehiwala", vehicleType: "STANDARD", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "3", bookingId: "APP-003", customerName: "Oliver Chen", phoneNumber: "+94 76 123 4567", pickupLocation: "Nugegoda", dropLocation: "Kandy", vehicleType: "LUXURY", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
];

export default function AppPendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<AppPendingBooking>({
    initialData: mockAppPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">App Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">Bookings from mobile application</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search app bookings..."
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
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: [
              { value: "LUXURY", label: "Luxury" },
              { value: "STANDARD", label: "Standard" },
              { value: "ECONOMY", label: "Economy" },
            ],
          },
        ]}
      />
    </div>
  );
}