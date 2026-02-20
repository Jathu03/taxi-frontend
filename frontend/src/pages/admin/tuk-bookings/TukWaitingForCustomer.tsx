"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Phone, RotateCcw, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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

type WaitingBookingRow = {
  id: string;
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  driverName: string;
  vehicleNumber: string;
  location: string;
  arrivalTime: string;
  waitingTime: string;
  originalData: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  refresh: () => void
): ColumnDef<WaitingBookingRow>[] => [
    { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
    { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "phoneNumber", header: () => <span className="font-bold text-black">Phone</span> },
    { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
    { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">Vehicle</span> },
    { accessorKey: "location", header: () => <span className="font-bold text-black">Location</span> },
    {
      accessorKey: "arrivalTime",
      header: () => <span className="font-bold text-black whitespace-nowrap">Arrival Time</span>,
    },
    { accessorKey: "waitingTime", header: () => <span className="font-bold text-black">Waiting</span> },
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
                await bookingService.updateStatus(booking.id, BookingStatus.PASSENGER_ONBOARD);
                toast.success("TUK trip started! Passenger is onboard.");
                refresh();
              } catch (error) {
                toast.error("Failed to update status");
              }
            }}
          >
            Start Trip
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`tel:${row.original.phoneNumber}`)}>
                <Phone className="mr-2 h-4 w-4" /> Call Customer
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(`/admin/bookings/${row.original.originalData.id}`)}>
                <Eye className="mr-2 h-4 w-4" /> View Hire
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

function toLocal(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function toWaitingDuration(driverArrivedTime?: string) {
  if (!driverArrivedTime) return "—";
  const arrived = new Date(driverArrivedTime);
  if (isNaN(arrived.getTime())) return "—";

  const diffMs = Date.now() - arrived.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m`;
}

function mapBookingToRow(b: BookingResponse): WaitingBookingRow {
  return {
    id: String(b.id),
    bookingId: b.bookingId || "N/A",
    customerName: b.customerName || "N/A",
    phoneNumber: b.contactNumber || "N/A",
    driverName: b.driverName || b.driverCode || "N/A",
    vehicleNumber: b.vehicleRegistrationNumber || b.vehicleCode || "N/A",
    location: b.currentLocation || b.pickupAddress || "N/A",
    arrivalTime: toLocal(b.driverArrivedTime),
    waitingTime: toWaitingDuration(b.driverArrivedTime),
    originalData: b,
  };
}

export default function TukWaitingForCustomer() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<WaitingBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<
    "customerName" | "bookingId" | "driverName" | "vehicleNumber"
  >("customerName");

  const loadWaitingBookings = async () => {
    try {
      setIsLoading(true);

      const data = await bookingService.searchAll({
        status: BookingStatus.WAITING_FOR_CUSTOMER,
      });

      // ✅ WAITING_FOR_CUSTOMER + ✅ ONLY TUK
      const waitingTuk = (data || []).filter(
        (b) =>
          b.status === BookingStatus.WAITING_FOR_CUSTOMER &&
          Number(b.vehicleClassId) === TUK_CLASS_ID
      );

      setRows(waitingTuk.map(mapBookingToRow));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load TUK waiting bookings");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWaitingBookings();
  }, []);

  const filteredData = useMemo(() => {
    return rows.filter((booking) => {
      if (!filterText) return true;
      const value = booking[filterBy]?.toString().toLowerCase() || "";
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
          <h1 className="text-3xl font-bold text-orange-700">TUK Waiting for Customer</h1>
          <p className="text-muted-foreground mt-1">TUK drivers waiting at pickup location</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-orange-600">
          {filteredData.length} Waiting (TUK)
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
          columns={columns(navigate, loadWaitingBookings)}
          data={filteredData}
          hideSearch
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}