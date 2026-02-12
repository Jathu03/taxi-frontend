"use client";
import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react"; 
import { DeleteDialog } from "@/components/DeleteDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
  navigate: ReturnType<typeof useNavigate>
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
            <Edit className="mr-2 h-4 w-4" /> Edit Booking
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
  { id: "3", customerName: "Michael Brown", phoneNumber: "+94 76 555 1234", pickupLocation: "Nugegoda", dropLocation: "Kandy", vehicleType: "VAN", bookingTime: "2024-03-16 08:00 AM", status: "Confirmed" },
];

export default function AddBooking() {
  const navigate = useNavigate();
  
  // Filter States
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVehicle, setFilterVehicle] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<Booking>({
    initialData: mockBookings,
  });

  const handleSearch = () => {
    console.log("Searching with filters:", { filterText, filterBy, filterStatus, filterVehicle, startDate, endDate });
  };

  const handleReset = () => {
    setFilterText("");
    setFilterBy("name");
    setFilterStatus("all");
    setFilterVehicle("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Bookings</h1>
          <p className="text-muted-foreground mt-1">Create and manage customer bookings</p>
        </div>
        <Button 
          className="bg-[#6330B8] hover:bg-[#5028a0]"
          onClick={() => navigate('/admin/bookings/add-new-booking')}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Filter Input */}
          <div className="space-y-2">
            <Label htmlFor="filter">Search</Label>
            <Input
              id="filter"
              placeholder="Enter search term..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          {/* By Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="filterBy">Search By:</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger id="filterBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Customer Name</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* By Status */}
          <div className="space-y-2">
            <Label htmlFor="filterStatus">Status:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filterStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* By Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="filterVehicle">Vehicle Type:</Label>
            <Select value={filterVehicle} onValueChange={setFilterVehicle}>
              <SelectTrigger id="filterVehicle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
                <SelectItem value="VAN">Van</SelectItem>
                <SelectItem value="ECONOMY">Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 flex items-end gap-2 col-span-2 lg:col-span-1">
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 w-full">
              Filter
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)}
        data={data}
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableColumnVisibility
        // Removed internal filters since we have the custom header now
      />
    </div>
  );
}