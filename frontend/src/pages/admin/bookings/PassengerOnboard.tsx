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

export type OnboardBookingRow = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  pickupTime: string;
  currentLocation: string;
  destination: string;
  status: string;
  originalData: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  refresh: () => void
): ColumnDef<OnboardBookingRow>[] => [
    { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
    { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
    { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">Vehicle</span> },
    { accessorKey: "destination", header: () => <span className="font-bold text-black">Destination</span> },
    {
      accessorKey: "pickupTime",
      header: () => <span className="font-bold text-black whitespace-nowrap">Pickup Time</span>,
      cell: ({ row }) => <span className="whitespace-nowrap text-xs">{row.original.pickupTime}</span>,
    },
    {
      accessorKey: "status",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge className="bg-green-100 text-green-700 border-green-200">
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
            className="bg-green-600 hover:bg-green-700 text-xs gap-1.5 px-2"
            onClick={() => navigate("/admin/bookings/complete-booking", {
              state: { booking: row.original.originalData }
            })}
          >
            Complete Trip
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

function toLocal(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function mapBookingToRow(b: BookingResponse): OnboardBookingRow {
  return {
    id: String(b.id),
    bookingId: b.bookingId || "N/A",
    customerName: b.customerName || "N/A",
    driverName: b.driverName || b.driverCode || "N/A",
    vehicleNumber: b.vehicleRegistrationNumber || b.vehicleCode || "N/A",
    pickupTime: toLocal(b.startTime || b.pickupTime),
    currentLocation: b.currentLocation || "—",
    destination: b.destination || b.dropAddress || "—",
    status: b.status,
    originalData: b,
  };
}

export default function PassengerOnboard() {
  const navigate = useNavigate();

  const [rows, setRows] = useState<OnboardBookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<
    "customerName" | "bookingId" | "driverName" | "vehicleNumber"
  >("customerName");

  const loadOnboard = async () => {
    try {
      setIsLoading(true);

      const data = await bookingService.searchAll({
        status: BookingStatus.PASSENGER_ONBOARD,
      });

      // ✅ PASSENGER_ONBOARD + ✅ EXCLUDE TUK
      const onboardNonTuk = (data || []).filter(
        (b) =>
          b.status === BookingStatus.PASSENGER_ONBOARD &&
          Number(b.vehicleClassId) !== TUK_CLASS_ID
      );

      setRows(onboardNonTuk.map(mapBookingToRow));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load onboard bookings");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOnboard();
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Passenger Onboard (Excluding TUK)
          </h1>
          <p className="text-muted-foreground mt-1">
            Hires currently in progress with passengers
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-green-600">
          {filteredData.length} On Board
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate, loadOnboard)}
          data={filteredData}
          hideSearch
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}