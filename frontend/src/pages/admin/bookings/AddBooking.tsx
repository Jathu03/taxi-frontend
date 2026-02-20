"use client";
import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Loader2 } from "lucide-react"; 
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
import { toast } from "sonner"; 

// Import Service and Types
import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

// Define the shape of data for the table
export type BookingTableRow = {
  id: number;
  bookingNumber: string; 
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string; 
  bookingTime: string;
  status: string;
  originalData: BookingResponse; 
};

// Define Columns
const columns = (
  onDelete: (id: number) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<BookingTableRow>[] => [
  { 
    accessorKey: "bookingNumber", 
    header: () => <span className="font-bold text-black">Booking ID</span> 
  },
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
            // UPDATED: Navigate using URL parameter instead of state
            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
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
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => {
        return (
            <Badge variant="outline" className="bg-slate-50 font-semibold border-slate-300 text-slate-700">
                {row.getValue("vehicleType")}
            </Badge>
        )
    }
  },
  { 
    accessorKey: "bookingTime", 
    header: () => <span className="font-bold text-black">Pickup Time</span> 
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status as BookingStatus;
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      if (status === BookingStatus.PENDING) variant = "secondary";
      if (status === BookingStatus.CANCELLED) variant = "destructive";
      if (status === BookingStatus.COMPLETED) variant = "outline";

      return (
        <Badge variant={variant}>
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
      const isCancelled = booking.status === BookingStatus.CANCELLED;

      return (
        <div className="flex justify-end items-center gap-2">
          {!isCancelled && (
            <DeleteDialog
                title={`Cancel Booking ${booking.bookingNumber}?`}
                description="This will change status to CANCELLED. This action cannot be undone."
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
          )}
        </div>
      );
    },
  },
];

export default function BookingList() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingTableRow[]>([]);

  // Filter States
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customername");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Store vehicle classes map (ID -> { name, code })
  const [vehicleMap, setVehicleMap] = useState<Record<number, { name: string, code: string }>>({});

  /**
   * Transforms raw API booking data into Table Rows.
   */
  const mapResponseToRow = (data: BookingResponse[], vMap: Record<number, { name: string, code: string }>): BookingTableRow[] => {
    if (!data || !Array.isArray(data)) {
        console.warn("mapResponseToRow received invalid data:", data);
        return [];
    }

    return data.map((b) => {
        // Resolve Name (Use Backend enriched name OR Frontend Map OR ID Fallback)
        const resolvedName = 
            b.vehicleClassName || 
            vMap[b.vehicleClassId]?.name || 
            `Class ID: ${b.vehicleClassId}`;

        return {
            id: b.id,
            bookingNumber: b.bookingId,
            customerName: b.customerName,
            phoneNumber: b.contactNumber,
            pickupLocation: b.pickupAddress,
            dropLocation: b.dropAddress || "N/A",
            vehicleType: resolvedName, 
            bookingTime: b.pickupTime ? new Date(b.pickupTime).toLocaleString() : "N/A",
            status: b.status,
            originalData: b
        };
    });
  };

  // Fetch Data 
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch Vehicle Classes (Non-blocking)
      let vMap: Record<number, { name: string, code: string }> = {};
      try {
          const classesData = await bookingService.getVehicleClasses();
          
          if(Array.isArray(classesData)) {
            classesData.forEach((vc: any) => {
              // Handle potential casing issues (className vs class_name)
              const name = vc.className || vc.class_name || vc.name || "Unknown";
              const code = vc.classCode || vc.class_code || vc.code || "";
              vMap[vc.id] = { name, code };
            });
            setVehicleMap(vMap);
          }
      } catch (err) {
          console.warn("Could not load vehicle classes, displaying IDs instead.");
      }

      // 2. Fetch Bookings
      const bookingsData = await bookingService.getAllBookings();
      
      setBookings(mapResponseToRow(bookingsData, vMap));

    } catch (error) {
      console.error("Failed to load bookings", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Search / Filter - FIXED
const handleSearch = async () => {
  try {
    setIsLoading(true);

    // Use the new combined search method
    // Sends ALL filters as query params to GET /api/bookings
    const data = await bookingService.searchAll({
      searchTerm: filterText || undefined,
      filterBy: filterText ? filterBy : undefined,
      status: filterStatus === "all" ? undefined : filterStatus,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    setBookings(mapResponseToRow(data, vehicleMap));

    if (data.length === 0) {
      toast.info("No bookings found matching your filters");
    }
  } catch (error) {
    console.error("Search failed", error);
    toast.error("Search failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customername");
    setFilterStatus("all");
    setStartDate("");
    setEndDate("");
    loadData(); 
  };

  const handleCancelBooking = async (id: number) => {
    try {
        await bookingService.cancelBooking(id, "Cancelled by Admin via Dashboard");
        toast.success("Booking cancelled successfully");
        loadData(); 
    } catch (error) {
        console.error("Cancellation failed", error);
        toast.error("Failed to cancel booking");
    }
  };

  const {
    handleBulkDelete,
  } = useDataTable<BookingTableRow>({
    initialData: bookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Bookings</h1>
          <p className="text-muted-foreground mt-1">Create and manage all customer bookings</p>
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
                <SelectItem value="customername">Customer Name</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="bookingid">Booking ID</SelectItem>
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Filter"}
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <EnhancedDataTable
        columns={columns(handleCancelBooking, navigate)}
        data={bookings}
        enableBulkDelete={false} 
        onBulkDelete={handleBulkDelete}
        enableColumnVisibility
        isLoading={isLoading}
      />
    </div>
  );
}