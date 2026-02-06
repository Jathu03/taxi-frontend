"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react"; 
import { DeleteDialog } from "@/components/DeleteDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom"; // Add this

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

const columns = (
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate> // Add navigate here
): ColumnDef<Booking>[] => [
  { 
    accessorKey: "customerName", 
    header: () => <span className="font-bold text-black">Customer Name</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex flex-col gap-2">
          <span>{row.getValue("customerName")}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 w-full"
            onClick={() => navigate('/admin/bookings/add-new-booking', { 
                state: { 
                    booking: {
                        bookingNumber: booking.id,
                        customer: booking.customerName,
                        passengerNumber: booking.phoneNumber,
                        pickupTime: booking.bookingTime,
                        pickupAddress: booking.pickupLocation,
                        dropAddress: booking.dropLocation,
                        vehicleClass: booking.vehicleType,
                        isAdvance: "No"
                    } 
                } 
            })}
          >
            <Edit className="mr-2 h-4 w-4" /> Booking
          </Button>
        </div>
      );
    }
  },
  { 
    accessorKey: "phoneNumber", 
    header: () => <span className="font-bold text-black">Phone Number</span> 
  },
  { 
    accessorKey: "pickupLocation", 
    header: () => <span className="font-bold text-black">Pickup Location</span> 
  },
  { 
    accessorKey: "dropLocation", 
    header: () => <span className="font-bold text-black">Drop Location</span> 
  },
  { 
    accessorKey: "vehicleType", 
    header: () => <span className="font-bold text-black">Vehicle Type</span> 
  },
  { 
    accessorKey: "bookingTime", 
    header: () => <span className="font-bold text-black">Booking Time</span> 
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
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
    header: () => <span className="font-bold text-black text-right block">Actions</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex justify-end items-center gap-2">
          <DeleteDialog
            title={`Delete Booking?`}
            description="This action cannot be undone."
            onConfirm={() => onDelete(booking.id)}
            trigger={
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            }
          />
        </div>
      );
    },
  },
];

const mockBookings: Booking[] = [
  { id: "1", customerName: "John Smith", phoneNumber: "+94 77 123 4567", pickupLocation: "Colombo Fort", dropLocation: "Galle Face", vehicleType: "STANDARD", bookingTime: "2024-03-15 10:30 AM", status: "Confirmed" },
  { id: "2", customerName: "Sarah Johnson", phoneNumber: "+94 71 234 5678", pickupLocation: "Mount Lavinia", dropLocation: "Colombo Airport", vehicleType: "LUXURY", bookingTime: "2024-03-15 02:00 PM", status: "Pending" },
];

export default function AddBooking() {
  const navigate = useNavigate(); // Initialize navigate
  const {
    data,
    handleBulkDelete,
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
        {/* ADDED: Manual "Add Booking" button for redirection */}
        <Button 
          className="bg-[#6330B8] hover:bg-[#5028a0]"
          onClick={() => navigate('/admin/bookings/add-new-booking')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)} // Pass navigate to columns
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search by customer name..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        // REMOVED: createDialogFields and onCreate so the popup doesn't appear
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
        ]}
      />
    </div>
  );
}