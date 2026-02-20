"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, Loader2 } from "lucide-react";
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

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";
import { BookingStatus } from "@/services/bookings/types";

const TUK_CLASS_ID = 8;

type EnrouteBookingRow = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  estimatedArrival: string;
  status: string;
  originalData: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  refresh: () => void
): ColumnDef<EnrouteBookingRow>[] => [
    { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
    { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
    { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">Vehicle</span> },
    { accessorKey: "pickupLocation", header: () => <span className="font-bold text-black">Pickup Location</span> },
    { accessorKey: "estimatedArrival", header: () => <span className="font-bold text-black whitespace-nowrap">Est. Arrival</span> },
    {
      accessorKey: "status",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-xs gap-1.5 px-2"
            onClick={async () => {
              try {
                const booking = row.original.originalData;
                await bookingService.updateStatus(booking.id, BookingStatus.WAITING_FOR_CUSTOMER);
                toast.success("TUK driver has arrived at pickup location!");
                refresh();
              } catch (error) {
                toast.error("Failed to update status");
              }
            }}
          >
            Check-in/Arrived
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/bookings/${row.original.originalData.id}`)}
            className="text-blue-600 border-blue-200"
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
      ),
    },
  ];

function mapBookingToRow(b: BookingResponse): EnrouteBookingRow {
  return {
    id: String(b.id),
    bookingId: b.bookingId || "N/A",
    customerName: b.customerName || "N/A",
    driverName: b.driverName || b.driverCode || "N/A",
    vehicleNumber: b.vehicleRegistrationNumber || b.vehicleCode || "N/A",
    pickupLocation: b.pickupAddress || "N/A",
    estimatedArrival: b.eta || "—",
    status: b.status,
    originalData: b,
  };
}

export default function TukEnrouteBookings() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<EnrouteBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<
    "customerName" | "bookingId" | "driverName" | "vehicleNumber"
  >("customerName");

  const loadEnroute = async () => {
    try {
      setIsLoading(true);

      const data = await bookingService.searchAll({
        status: BookingStatus.ENROUTE,
      });

      // ✅ ENROUTE + ✅ ONLY TUK
      const tukEnroute = (data || []).filter(
        (b) =>
          b.status === BookingStatus.ENROUTE &&
          Number(b.vehicleClassId) === TUK_CLASS_ID
      );

      setRows(tukEnroute.map(mapBookingToRow));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load TUK en route bookings");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnroute();
  }, []);

  const filteredData = useMemo(() => {
    return rows.filter((booking) => {
      if (!filterText) return true;
      const value = (booking[filterBy] || "").toLowerCase();
      return value.includes(filterText.toLowerCase());
    });
  }, [rows, filterText, filterBy]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customerName");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-700">
            TUK En Route Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            TUK drivers currently on their way to pickup
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-orange-600">
          {filteredData.length} TUK En Route
        </Badge>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-1">
          <div className="space-y-2">
            <Label htmlFor="filter">Search</Label>
            <Input
              id="filter"
              placeholder="Enter search term..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterBy">Search By</Label>
            <Select value={filterBy} onValueChange={(v) => setFilterBy(v as any)}>
              <SelectTrigger id="filterBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customerName">Customer</SelectItem>
                <SelectItem value="bookingId">Booking ID</SelectItem>
                <SelectItem value="driverName">Driver</SelectItem>
                <SelectItem value="vehicleNumber">Vehicle Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate, loadEnroute)}
          data={filteredData}
          hideSearch
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}