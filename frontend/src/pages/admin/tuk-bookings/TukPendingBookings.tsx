// src/pages/admin/bookings/TukPendingBooking.tsx

"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash, Edit, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import Service and Types
import tukPendingService from "@/services/bookings/tukService";
import type { TukPendingBooking } from "@/services/bookings/tukService";

// =============================================================================
// COLUMNS DEFINITION
// =============================================================================

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
            // Navigate to Dispatch Page (specifically for Tuk if needed, otherwise generic)
            onClick={() => navigate('/admin/tuk/dispatched', { state: { booking: booking.originalData } })}
          >
            <Send className="h-3 w-3" />
            Dispatch
          </Button>
        </div>
      );
    }
  },
  { accessorKey: "isAdvance", header: () => <span className="font-bold text-black">Is Adv</span> },
  { accessorKey: "organization", header: () => <span className="font-bold text-black">Organization</span> },
  { accessorKey: "customer", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "passengerNumber", header: () => <span className="font-bold text-black">Passenger #</span> },
  { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
  { 
    accessorKey: "bookingTime", 
    header: () => <span className="font-bold text-black whitespace-nowrap">Booking Time</span>,
    cell: ({ row }) => <span className="whitespace-nowrap text-xs">{row.original.bookingTime}</span>
  },
  { 
    accessorKey: "pickupTime", 
    header: () => <span className="font-bold text-black whitespace-nowrap">Pickup Time</span>,
    cell: ({ row }) => <span className="whitespace-nowrap text-xs font-semibold">{row.original.pickupTime}</span>
  },
  { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
  // Since this page is ONLY Tuks, we can optionally hide this or keep it for verification
  { 
    accessorKey: "vehicleClass", 
    header: () => <span className="font-bold text-black">Vehicle</span>,
    cell: ({ row }) => <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">{row.original.vehicleClass}</Badge>
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex justify-end gap-2">
          {/* EDIT BUTTON */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/bookings/edit/${booking.id}`, { state: { booking: booking.originalData } })}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          
          {/* CANCEL BUTTON */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/bookings/cancel/${booking.id}`, { state: { booking: booking.originalData } })}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      );
    },
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function TukPendingBooking() {
  const navigate = useNavigate();
  
  // -- State --
  const [data, setData] = useState<TukPendingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (Removed Vehicle Class as this is specific to Tuks)
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customer");
  const [hireType, setHireType] = useState("all");

  // -- Fetch Data from Backend --
  const fetchTukBookings = useCallback(async () => {
    setLoading(true);
    try {
      const backendParams: any = {};
      
      // Backend search for heavy lifting
      if (filterText && (filterBy === "customer" || filterBy === "passengerNumber")) {
        backendParams.searchTerm = filterText;
      }

      const tukData = await tukPendingService.getTukPendingBookings(backendParams);
      setData(tukData);
    } catch (error) {
      toast.error("Failed to load Tuk pending bookings.");
    } finally {
      setLoading(false);
    }
  }, [filterText, filterBy]); 

  // Initial Fetch & Debounce
  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTukBookings();
    }, 500);
    return () => clearTimeout(debounce);
  }, [fetchTukBookings]);

  // -- Client-Side Filter Fallback --
  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      
      // 1. Client-side Search Logic for non-backend fields
      if (filterText) {
        if (filterBy === "bookingNumber" || filterBy === "organization") {
           const value = booking[filterBy as keyof TukPendingBooking]?.toString().toLowerCase() || "";
           if (!value.includes(filterText.toLowerCase())) return false;
        }
      }

      // 2. Dropdown Filters
      if (hireType !== "all" && booking.hireType !== hireType) return false;

      // Ensure it is a Tuk (Double check)
      // if (!booking.vehicleClass.toLowerCase().includes("tuk")) return false;

      return true;
    });
  }, [data, filterText, filterBy, hireType]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customer");
    setHireType("all");
    fetchTukBookings(); 
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-700">Tuk Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage manual/web bookings specifically for Tuk-Tuks</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-orange-600 hover:bg-orange-700">
          {filteredData.length} Tuk Pending
        </Badge>
      </div>

      <Card className="p-4">
        {/* Adjusted Grid Columns since we removed one filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="filter">Search</Label>
            <Input
              id="filter"
              placeholder="Enter search term..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border-orange-200 focus-visible:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterBy">Search By</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger id="filterBy" className="border-orange-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="passengerNumber">Passenger #</SelectItem>
                <SelectItem value="bookingNumber">Booking #</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireType">Hire Type</Label>
            <Select value={hireType} onValueChange={setHireType}>
              <SelectTrigger id="hireType" className="border-orange-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="On The Meter">On The Meter</SelectItem>
                <SelectItem value="Fixed Rate">Fixed Rate</SelectItem>
                <SelectItem value="Package">Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleReset} variant="outline" className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate)}
          data={filteredData}
          hideSearch
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}