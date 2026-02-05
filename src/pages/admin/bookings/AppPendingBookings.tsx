"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Send, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  { accessorKey: "bookingId", header: "Booking ID" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "phoneNumber", header: "Phone" },
  { accessorKey: "pickupLocation", header: "Pickup" },
  { accessorKey: "dropLocation", header: "Drop" },
  { accessorKey: "vehicleType", header: "Vehicle" },
  { accessorKey: "bookingTime", header: "Time" },
  {
    accessorKey: "appPlatform",
    header: "Platform",
    cell: ({ row }) => {
      const platform = row.original.appPlatform;
      return <Badge variant="outline">{platform}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/admin/bookings/dispatch-vehicle', { 
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
            })}>
              <Send className="mr-2 h-4 w-4" /> Dispatch
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDialog
              title={`Cancel Booking?`}
              description="This will cancel the app booking."
              onConfirm={() => onDelete(booking.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Cancel
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const mockAppPendingBookings: AppPendingBooking[] = [
  { id: "1", bookingId: "APP-001", customerName: "David Lee", phoneNumber: "+94 77 789 0123", pickupLocation: "Galle Face Green", dropLocation: "Mount Lavinia", vehicleType: "ECONOMY", bookingTime: "2024-03-15 12:30 PM", appPlatform: "Android" },
  { id: "2", bookingId: "APP-002", customerName: "Sophia Wang", phoneNumber: "+94 71 890 1234", pickupLocation: "Colombo Fort", dropLocation: "Dehiwala", vehicleType: "STANDARD", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "3", bookingId: "APP-003", customerName: "Oliver Chen", phoneNumber: "+94 76 123 4567", pickupLocation: "Nugegoda", dropLocation: "Kandy", vehicleType: "LUXURY", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
  { id: "4", bookingId: "APP-004", customerName: "Emma Wilson", phoneNumber: "+94 75 234 5678", pickupLocation: "Rajagiriya", dropLocation: "Galle", vehicleType: "STANDARD", bookingTime: "2024-03-15 06:00 PM", appPlatform: "iOS" },
  { id: "5", bookingId: "APP-005", customerName: "Liam Brown", phoneNumber: "+94 74 345 6789", pickupLocation: "Bambalapitiya", dropLocation: "Negombo", vehicleType: "ECONOMY", bookingTime: "2024-03-15 07:00 PM", appPlatform: "Android" },
  { id: "6", bookingId: "APP-006", customerName: "Ava Martinez", phoneNumber: "+94 73 456 7890", pickupLocation: "Wellawatta", dropLocation: "Kurunegala", vehicleType: "VAN", bookingTime: "2024-03-15 08:00 PM", appPlatform: "iOS" },
  { id: "7", bookingId: "APP-007", customerName: "Noah Garcia", phoneNumber: "+94 72 567 8901", pickupLocation: "Kollupitiya", dropLocation: "Matara", vehicleType: "MINI VAN", bookingTime: "2024-03-15 09:00 AM", appPlatform: "Android" },
  { id: "8", bookingId: "APP-008", customerName: "Isabella Rodriguez", phoneNumber: "+94 77 678 9012", pickupLocation: "Maradana", dropLocation: "Anuradhapura", vehicleType: "STANDARD", bookingTime: "2024-03-15 10:00 AM", appPlatform: "iOS" },
  { id: "9", bookingId: "APP-009", customerName: "Mason Hernandez", phoneNumber: "+94 71 789 0123", pickupLocation: "Fort", dropLocation: "Trincomalee", vehicleType: "LUXURY", bookingTime: "2024-03-15 11:00 AM", appPlatform: "Android" },
  { id: "10", bookingId: "APP-010", customerName: "Mia Lopez", phoneNumber: "+94 76 890 1234", pickupLocation: "Slave Island", dropLocation: "Jaffna", vehicleType: "ECONOMY", bookingTime: "2024-03-15 12:00 PM", appPlatform: "iOS" },
  { id: "11", bookingId: "APP-011", customerName: "Ethan Gonzalez", phoneNumber: "+94 75 901 2345", pickupLocation: "Kotahena", dropLocation: "Batticaloa", vehicleType: "STANDARD", bookingTime: "2024-03-15 01:00 PM", appPlatform: "Android" },
  { id: "12", bookingId: "APP-012", customerName: "Charlotte Wilson", phoneNumber: "+94 74 012 3456", pickupLocation: "Pettah", dropLocation: "Hambantota", vehicleType: "VAN", bookingTime: "2024-03-15 02:00 PM", appPlatform: "iOS" },
  { id: "13", bookingId: "APP-013", customerName: "James Anderson", phoneNumber: "+94 73 123 4567", pickupLocation: "Kelaniya", dropLocation: "Nuwara Eliya", vehicleType: "LUXURY", bookingTime: "2024-03-15 03:00 PM", appPlatform: "Android" },
  { id: "14", bookingId: "APP-014", customerName: "Amelia Thomas", phoneNumber: "+94 72 234 5678", pickupLocation: "Wattala", dropLocation: "Badulla", vehicleType: "ECONOMY", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "15", bookingId: "APP-015", customerName: "Benjamin Taylor", phoneNumber: "+94 77 345 6789", pickupLocation: "Ja-Ela", dropLocation: "Ratnapura", vehicleType: "MINI VAN", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
  { id: "16", bookingId: "APP-016", customerName: "Harper Moore", phoneNumber: "+94 71 456 7890", pickupLocation: "Colombo 02", dropLocation: "Chilaw", vehicleType: "STANDARD", bookingTime: "2024-03-15 06:00 PM", appPlatform: "iOS" },
  { id: "17", bookingId: "APP-017", customerName: "Lucas Jackson", phoneNumber: "+94 76 567 8901", pickupLocation: "Colombo 04", dropLocation: "Monaragala", vehicleType: "VAN", bookingTime: "2024-03-15 07:00 PM", appPlatform: "Android" },
  { id: "18", bookingId: "APP-018", customerName: "Evelyn Martin", phoneNumber: "+94 75 678 9012", pickupLocation: "Colombo 05", dropLocation: "Ampara", vehicleType: "LUXURY", bookingTime: "2024-03-15 08:00 PM", appPlatform: "iOS" },
  { id: "19", bookingId: "APP-019", customerName: "Alexander Lee", phoneNumber: "+94 74 789 0123", pickupLocation: "Colombo 07", dropLocation: "Mannar", vehicleType: "ECONOMY", bookingTime: "2024-03-15 09:00 PM", appPlatform: "Android" },
  { id: "20", bookingId: "APP-020", customerName: "Abigail White", phoneNumber: "+94 73 890 1234", pickupLocation: "Dehiwala", dropLocation: "Puttalam", vehicleType: "STANDARD", bookingTime: "2024-03-15 10:00 PM", appPlatform: "iOS" },
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
          <h1 className="text-2xl font-semibold">App Pending Bookings</h1>
          <p className="text-muted-foreground">Bookings from mobile application</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Pending</Badge>
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
