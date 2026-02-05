"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditDialog } from "@/components/EditDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";

export type Booking = {
  id: string;
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string;
  bookingTime: string;
  status: string;
};

const createDialogFields = [
  {
    name: "customerName" as keyof Booking,
    label: "Customer Name",
    type: "text" as const,
  },
  {
    name: "phoneNumber" as keyof Booking,
    label: "Phone Number",
    type: "text" as const,
  },
  {
    name: "pickupLocation" as keyof Booking,
    label: "Pickup Location",
    type: "text" as const,
  },
  {
    name: "dropLocation" as keyof Booking,
    label: "Drop Location",
    type: "text" as const,
  },
  {
    name: "vehicleType" as keyof Booking,
    label: "Vehicle Type",
    type: "select" as const,
    options: ["LUXURY", "STANDARD", "ECONOMY", "VAN", "MINI VAN", "BUS", "TUK"],
  },
  {
    name: "bookingTime" as keyof Booking,
    label: "Booking Time",
    type: "date" as const,
  },
];

const columns = (
  onDelete: (id: string) => void,
  onEdit: (updated: Booking) => void
): ColumnDef<Booking>[] => [
  { accessorKey: "customerName", header: "Customer Name" },
  { accessorKey: "phoneNumber", header: "Phone Number" },
  { accessorKey: "pickupLocation", header: "Pickup Location" },
  { accessorKey: "dropLocation", header: "Drop Location" },
  { accessorKey: "vehicleType", header: "Vehicle Type" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "Confirmed" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
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
            <EditDialog
              initialValues={booking}
              onSubmit={onEdit}
              title={`Edit Booking - ${booking.customerName}`}
              fields={createDialogFields}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuSeparator />
            <DeleteDialog
              title={`Delete Booking?`}
              description="This action cannot be undone."
              onConfirm={() => onDelete(booking.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const mockBookings: Booking[] = [
  { id: "1", customerName: "John Smith", phoneNumber: "+94 77 123 4567", pickupLocation: "Colombo Fort", dropLocation: "Galle Face", vehicleType: "STANDARD", bookingTime: "2024-03-15 10:30 AM", status: "Confirmed" },
  { id: "2", customerName: "Sarah Johnson", phoneNumber: "+94 71 234 5678", pickupLocation: "Mount Lavinia", dropLocation: "Colombo Airport", vehicleType: "LUXURY", bookingTime: "2024-03-15 02:00 PM", status: "Pending" },
  { id: "3", customerName: "Michael Brown", phoneNumber: "+94 76 345 6789", pickupLocation: "Nugegoda", dropLocation: "Kandy", vehicleType: "VAN", bookingTime: "2024-03-15 03:00 PM", status: "Confirmed" },
  { id: "4", customerName: "Emily Davis", phoneNumber: "+94 75 456 7890", pickupLocation: "Dehiwala", dropLocation: "Galle", vehicleType: "STANDARD", bookingTime: "2024-03-15 04:30 PM", status: "Pending" },
  { id: "5", customerName: "David Wilson", phoneNumber: "+94 74 567 8901", pickupLocation: "Colombo 03", dropLocation: "Negombo", vehicleType: "ECONOMY", bookingTime: "2024-03-15 05:00 PM", status: "Confirmed" },
  { id: "6", customerName: "Jessica Martinez", phoneNumber: "+94 73 678 9012", pickupLocation: "Kollupitiya", dropLocation: "Kurunegala", vehicleType: "MINI VAN", bookingTime: "2024-03-15 06:00 PM", status: "Pending" },
  { id: "7", customerName: "Christopher Lee", phoneNumber: "+94 72 789 0123", pickupLocation: "Bambalapitiya", dropLocation: "Matara", vehicleType: "LUXURY", bookingTime: "2024-03-15 07:00 PM", status: "Confirmed" },
  { id: "8", customerName: "Amanda Garcia", phoneNumber: "+94 77 890 1234", pickupLocation: "Wellawatta", dropLocation: "Anuradhapura", vehicleType: "BUS", bookingTime: "2024-03-15 08:00 PM", status: "Pending" },
  { id: "9", customerName: "Daniel Rodriguez", phoneNumber: "+94 71 901 2345", pickupLocation: "Maradana", dropLocation: "Trincomalee", vehicleType: "STANDARD", bookingTime: "2024-03-15 09:00 AM", status: "Confirmed" },
  { id: "10", customerName: "Lisa Hernandez", phoneNumber: "+94 76 012 3456", pickupLocation: "Fort", dropLocation: "Jaffna", vehicleType: "VAN", bookingTime: "2024-03-15 10:00 AM", status: "Pending" },
  { id: "11", customerName: "Robert Taylor", phoneNumber: "+94 75 123 4567", pickupLocation: "Slave Island", dropLocation: "Batticaloa", vehicleType: "ECONOMY", bookingTime: "2024-03-15 11:00 AM", status: "Confirmed" },
  { id: "12", customerName: "Jennifer Moore", phoneNumber: "+94 74 234 5678", pickupLocation: "Havelock Town", dropLocation: "Hambantota", vehicleType: "STANDARD", bookingTime: "2024-03-15 12:00 PM", status: "Pending" },
  { id: "13", customerName: "James Anderson", phoneNumber: "+94 73 345 6789", pickupLocation: "Kotahena", dropLocation: "Nuwara Eliya", vehicleType: "LUXURY", bookingTime: "2024-03-15 01:00 PM", status: "Confirmed" },
  { id: "14", customerName: "Patricia Thomas", phoneNumber: "+94 72 456 7890", pickupLocation: "Pettah", dropLocation: "Badulla", vehicleType: "MINI VAN", bookingTime: "2024-03-15 02:30 PM", status: "Pending" },
  { id: "15", customerName: "William Jackson", phoneNumber: "+94 77 567 8901", pickupLocation: "Kelaniya", dropLocation: "Ratnapura", vehicleType: "VAN", bookingTime: "2024-03-15 03:30 PM", status: "Confirmed" },
  { id: "16", customerName: "Barbara White", phoneNumber: "+94 71 678 9012", pickupLocation: "Wattala", dropLocation: "Chilaw", vehicleType: "STANDARD", bookingTime: "2024-03-15 04:00 PM", status: "Pending" },
  { id: "17", customerName: "Richard Harris", phoneNumber: "+94 76 789 0123", pickupLocation: "Ja-Ela", dropLocation: "Monaragala", vehicleType: "ECONOMY", bookingTime: "2024-03-15 05:30 PM", status: "Confirmed" },
  { id: "18", customerName: "Susan Martin", phoneNumber: "+94 75 890 1234", pickupLocation: "Negombo", dropLocation: "Ampara", vehicleType: "LUXURY", bookingTime: "2024-03-15 06:30 PM", status: "Pending" },
  { id: "19", customerName: "Joseph Thompson", phoneNumber: "+94 74 901 2345", pickupLocation: "Colombo 05", dropLocation: "Mannar", vehicleType: "BUS", bookingTime: "2024-03-15 07:30 PM", status: "Confirmed" },
  { id: "20", customerName: "Nancy Garcia", phoneNumber: "+94 73 012 3456", pickupLocation: "Colombo 07", dropLocation: "Puttalam", vehicleType: "MINI VAN", bookingTime: "2024-03-15 08:30 PM", status: "Pending" },
];

export default function AddBooking() {
  const {
    data,
    handleCreate,
    handleBulkDelete,
    handleEdit,
    handleDelete,
  } = useDataTable<Booking>({
    initialData: mockBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Add New Booking</h1>
          <p className="text-muted-foreground mt-1">Create and manage customer bookings</p>
        </div>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, handleEdit)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search by customer name..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        onCreate={handleCreate}
        createDialogFields={createDialogFields}
        createDialogTitle="Create New Booking"
        createDialogDescription="Fill in the booking details below."
        filters={[
          {
            key: "vehicleType",
            label: "Vehicle Type",
            options: [
              { value: "LUXURY", label: "Luxury" },
              { value: "STANDARD", label: "Standard" },
              { value: "ECONOMY", label: "Economy" },
              { value: "VAN", label: "Van" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Confirmed", label: "Confirmed" },
              { value: "Pending", label: "Pending" },
            ],
          },
        ]}
      />
    </div>
  );
}
