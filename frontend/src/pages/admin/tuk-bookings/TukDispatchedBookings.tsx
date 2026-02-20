// src/pages/admin/tuk-bookings/TukDispatchedBookings.tsx
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

export type DispatchedBookingRow = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  dispatchTime: string;
  pickupLocation: string;
  status: string;
  originalData: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  refresh: () => void
): ColumnDef<DispatchedBookingRow>[] => [
    { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
    { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
    { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">Vehicle</span> },
    {
      accessorKey: "dispatchTime",
      header: () => <span className="font-bold text-black whitespace-nowrap">Dispatch Time</span>,
      cell: ({ row }) => <span className="whitespace-nowrap text-xs">{row.original.dispatchTime}</span>,
    },
    { accessorKey: "pickupLocation", header: () => <span className="font-bold text-black">Pickup</span> },
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
                await bookingService.updateStatus(booking.id, BookingStatus.ENROUTE);
                toast.success("TUK driver is now en route to pickup!");
                refresh();
              } catch (error) {
                toast.error("Failed to update status");
              }
            }}
          >
            Driver En Route
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

function mapResponseToRow(b: BookingResponse): DispatchedBookingRow {
  return {
    id: String(b.id),
    bookingId: b.bookingId,
    customerName: b.customerName || "N/A",
    driverName: b.driverName || b.driverCode || "Unassigned",
    vehicleNumber: b.vehicleRegistrationNumber || b.vehicleCode || "—",
    dispatchTime: b.dispatchedTime ? new Date(b.dispatchedTime).toLocaleString() : "—",
    pickupLocation: b.pickupAddress || "—",
    status: b.status,
    originalData: b,
  };
}

export default function TukDispatchedBookings() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<DispatchedBookingRow[]>([]);

  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<
    "customerName" | "bookingId" | "driverName" | "vehicleNumber"
  >("customerName");

  const loadDispatched = async () => {
    try {
      setIsLoading(true);

      const data = await bookingService.searchAll({
        status: BookingStatus.DISPATCHED,
      });

      // ✅ Only DISPATCHED + ✅ Only TUK
      const tukDispatched = (data || []).filter(
        (b) => b.status === BookingStatus.DISPATCHED && Number(b.vehicleClassId) === TUK_CLASS_ID
      );

      setRows(tukDispatched.map(mapResponseToRow));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load TUK dispatched bookings");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDispatched();
  }, []);

  const filteredData = useMemo(() => {
    if (!filterText) return rows;
    const term = filterText.toLowerCase();
    return rows.filter((r) => (r[filterBy] || "").toLowerCase().includes(term));
  }, [rows, filterText, filterBy]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customerName");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-700">TUK Dispatched Bookings</h1>
          <p className="text-muted-foreground mt-1">Dispatched bookings for TUK only</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-orange-600">{filteredData.length} TUK Dispatched</Badge>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-1">
          <div className="space-y-2">
            <Label htmlFor="filter">Search</Label>
            <Input id="filter" placeholder="Enter search term..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterBy">Search By</Label>
            <Select value={filterBy} onValueChange={(v) => setFilterBy(v as any)}>
              <SelectTrigger id="filterBy"><SelectValue /></SelectTrigger>
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
          columns={columns(navigate, loadDispatched)}
          data={filteredData}
          hideSearch
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}