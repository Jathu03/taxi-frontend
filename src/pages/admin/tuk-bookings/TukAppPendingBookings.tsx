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
                  vehicleClass: "Tuk",
                  pickupTime: booking.bookingTime,
                  clientRemarks: `Tuk App Booking from ${booking.appPlatform}`,
                  isAdvance: "No",
                  organization: ""
                }
              } 
            })}>
              <Send className="mr-2 h-4 w-4" /> Dispatch Tuk
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteDialog
              title={`Cancel Tuk Booking?`}
              description="This will cancel the tuk app booking."
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

const mockTukAppPendingBookings: TukAppPendingBooking[] = [
  { id: "1", bookingId: "TAPP-001", customerName: "Kasun Perera", phoneNumber: "+94 77 789 0123", pickupLocation: "Pettah", dropLocation: "Fort", vehicleType: "Tuk", bookingTime: "2024-03-15 12:30 PM", appPlatform: "Android" },
  { id: "2", bookingId: "TAPP-002", customerName: "Nimali Silva", phoneNumber: "+94 71 890 1234", pickupLocation: "Borella", dropLocation: "Nugegoda", vehicleType: "Tuk", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "3", bookingId: "TAPP-003", customerName: "Ranjith Fernando", phoneNumber: "+94 76 123 4567", pickupLocation: "Maradana", dropLocation: "Dehiwala", vehicleType: "Tuk", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
  { id: "4", bookingId: "TAPP-004", customerName: "Sanduni Wickrama", phoneNumber: "+94 75 234 5678", pickupLocation: "Kollupitiya", dropLocation: "Wellawatta", vehicleType: "Tuk", bookingTime: "2024-03-15 06:00 PM", appPlatform: "iOS" },
  { id: "5", bookingId: "TAPP-005", customerName: "Tharindu Gamage", phoneNumber: "+94 74 345 6789", pickupLocation: "Bambalapitiya", dropLocation: "Mount Lavinia", vehicleType: "Tuk", bookingTime: "2024-03-15 07:00 PM", appPlatform: "Android" },
  { id: "6", bookingId: "TAPP-006", customerName: "Gayani Mendis", phoneNumber: "+94 73 456 7890", pickupLocation: "Rajagiriya", dropLocation: "Kotte", vehicleType: "Tuk", bookingTime: "2024-03-15 08:00 PM", appPlatform: "iOS" },
  { id: "7", bookingId: "TAPP-007", customerName: "Dinesh Rathnayake", phoneNumber: "+94 72 567 8901", pickupLocation: "Kelaniya", dropLocation: "Kiribathgoda", vehicleType: "Tuk", bookingTime: "2024-03-15 09:00 AM", appPlatform: "Android" },
  { id: "8", bookingId: "TAPP-008", customerName: "Malini Jayasinghe", phoneNumber: "+94 77 678 9012", pickupLocation: "Maharagama", dropLocation: "Piliyandala", vehicleType: "Tuk", bookingTime: "2024-03-15 10:00 AM", appPlatform: "iOS" },
  { id: "9", bookingId: "TAPP-009", customerName: "Asanka Kumar", phoneNumber: "+94 71 789 0123", pickupLocation: "Wattala", dropLocation: "Ja-Ela", vehicleType: "Tuk", bookingTime: "2024-03-15 11:00 AM", appPlatform: "Android" },
  { id: "10", bookingId: "TAPP-010", customerName: "Nadeeka Dissanayake", phoneNumber: "+94 76 890 1234", pickupLocation: "Moratuwa", dropLocation: "Panadura", vehicleType: "Tuk", bookingTime: "2024-03-15 12:00 PM", appPlatform: "iOS" },
  { id: "11", bookingId: "TAPP-011", customerName: "Pradeep Seneviratne", phoneNumber: "+94 75 901 2345", pickupLocation: "Kotahena", dropLocation: "Slave Island", vehicleType: "Tuk", bookingTime: "2024-03-15 01:00 PM", appPlatform: "Android" },
  { id: "12", bookingId: "TAPP-012", customerName: "Chandima Perera", phoneNumber: "+94 74 012 3456", pickupLocation: "Pelawatte", dropLocation: "Battaramulla", vehicleType: "Tuk", bookingTime: "2024-03-15 02:00 PM", appPlatform: "iOS" },
  { id: "13", bookingId: "TAPP-013", customerName: "Buddhika Bandara", phoneNumber: "+94 73 123 4567", pickupLocation: "Nawala", dropLocation: "Hokandara", vehicleType: "Tuk", bookingTime: "2024-03-15 03:00 PM", appPlatform: "Android" },
  { id: "14", bookingId: "TAPP-014", customerName: "Amali Gunasekara", phoneNumber: "+94 72 234 5678", pickupLocation: "Kirulapone", dropLocation: "Narahenpita", vehicleType: "Tuk", bookingTime: "2024-03-15 04:00 PM", appPlatform: "iOS" },
  { id: "15", bookingId: "TAPP-015", customerName: "Roshan Jayawardena", phoneNumber: "+94 77 345 6789", pickupLocation: "Kaduwela", dropLocation: "Malabe", vehicleType: "Tuk", bookingTime: "2024-03-15 05:00 PM", appPlatform: "Android" },
  { id: "16", bookingId: "TAPP-016", customerName: "Kumari Silva", phoneNumber: "+94 71 456 7890", pickupLocation: "Homagama", dropLocation: "Kottawa", vehicleType: "Tuk", bookingTime: "2024-03-15 06:00 PM", appPlatform: "iOS" },
  { id: "17", bookingId: "TAPP-017", customerName: "Lakshan Wijesinghe", phoneNumber: "+94 76 567 8901", pickupLocation: "Gampaha", dropLocation: "Negombo Road", vehicleType: "Tuk", bookingTime: "2024-03-15 07:00 PM", appPlatform: "Android" },
  { id: "18", bookingId: "TAPP-018", customerName: "Pavithra Rathnayake", phoneNumber: "+94 75 678 9012", pickupLocation: "Kadawatha", dropLocation: "Ragama", vehicleType: "Tuk", bookingTime: "2024-03-15 08:00 PM", appPlatform: "iOS" },
  { id: "19", bookingId: "TAPP-019", customerName: "Sachith Mendis", phoneNumber: "+94 74 789 0123", pickupLocation: "Negombo", dropLocation: "Katunayake", vehicleType: "Tuk", bookingTime: "2024-03-15 09:00 PM", appPlatform: "Android" },
  { id: "20", bookingId: "TAPP-020", customerName: "Yashodha Kumari", phoneNumber: "+94 73 890 1234", pickupLocation: "Panadura", dropLocation: "Kalutara", vehicleType: "Tuk", bookingTime: "2024-03-15 10:00 PM", appPlatform: "iOS" },
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
          <h1 className="text-2xl font-semibold">Tuk App Pending Bookings</h1>
          <p className="text-muted-foreground">Three-wheeler bookings from mobile application</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Pending</Badge>
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
