"use client";

import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  RotateCcw,
  Loader2,
} from "lucide-react";
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

const TUK_CLASS_ID = 8;

export type ManualDispatchedBooking = {
  id: string;
  bookingId: string;
  organization: string;
  customerName: string;
  passengerNumber: string;
  hireType: string;
  pickupTime: string;
  pickupAddress: string;
  bookedBy: string;
  dispatchedBy: string;
  dispatchedTime: string;
  testBooking: string;
  driverName: string;
  vehicleNumber: string;
  fareScheme: string;
  originalData: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<ManualDispatchedBooking>[] => [
  {
    accessorKey: "bookingId",
    header: () => (
      <span className="font-bold text-black text-center block">Booking</span>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 items-center">
        <span className="font-mono font-bold">{row.original.bookingId}</span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs px-2"
          onClick={() =>
            navigate("/admin/bookings/dispatch-vehicle", {
              state: { booking: row.original.originalData },
            })
          }
        >
          <RefreshCw className="mr-1.5 h-3 w-3" /> Redispatch
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "organization",
    header: () => <span className="font-bold text-black">Org</span>,
  },
  {
    accessorKey: "customerName",
    header: () => <span className="font-bold text-black">Customer</span>,
    cell: ({ row }) => {
      const customer = row.original.customerName;
      const org = row.original.organization;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer}</span>
          <span className="text-xs text-muted-foreground">{org}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "passengerNumber",
    header: () => <span className="font-bold text-black">Passenger</span>,
  },
  {
    accessorKey: "hireType",
    header: () => <span className="font-bold text-black">Hire Type</span>,
  },
  {
    accessorKey: "pickupTime",
    header: () => (
      <span className="font-bold text-black whitespace-nowrap">Pickup Time</span>
    ),
  },
  {
    accessorKey: "pickupAddress",
    header: () => (
      <span className="font-bold text-black max-w-[200px] truncate block">
        Pickup Address
      </span>
    ),
  },
  {
    accessorKey: "driverName",
    header: () => <span className="font-bold text-black">Driver</span>,
  },
  {
    accessorKey: "vehicleNumber",
    header: () => <span className="font-bold text-black">Vehicle</span>,
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="default"
          className="bg-green-600 hover:bg-green-700 h-8"
          onClick={() =>
            navigate("/admin/bookings/complete-booking", {
              state: { booking: row.original.originalData },
            })
          }
        >
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Complete
        </Button>

        <Button
          size="sm"
          variant="destructive"
          className="h-8"
          onClick={() =>
            navigate("/admin/bookings/cancel-booking", {
              state: { booking: row.original.originalData },
            })
          }
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-8 text-blue-600 border-blue-200"
          onClick={() => navigate(`/admin/bookings/${row.original.originalData.id}`)}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" /> View
        </Button>
      </div>
    ),
  },
];

function toLocal(dt?: string) {
  if (!dt) return "";
  const d = new Date(dt);
  return isNaN(d.getTime()) ? dt : d.toLocaleString();
}

function mapBookingToManualRow(b: BookingResponse): ManualDispatchedBooking {
  return {
    id: String(b.id),
    bookingId: b.bookingId,
    organization: b.corporateName || b.bookingSource || "N/A",
    customerName: b.customerName || "N/A",
    passengerNumber: b.contactNumber || "N/A",
    hireType: b.hireType || "N/A",
    pickupTime: toLocal(b.pickupTime),
    pickupAddress: b.pickupAddress || "N/A",
    bookedBy: b.bookedByName || "System",
    dispatchedBy: b.dispatchedByName || "System",
    dispatchedTime: toLocal(b.dispatchedTime),
    testBooking: b.isTestBooking ? "YES" : "",
    driverName: b.driverName || b.driverCode || "N/A",
    vehicleNumber: b.vehicleRegistrationNumber || b.vehicleCode || "N/A",
    fareScheme: b.fareSchemeName || b.fareSchemeCode || "N/A",
    originalData: b,
  };
}

export default function ManualDispatchedBookings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ManualDispatchedBooking[]>([]);

  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customerName");
  const [filterOrg, setFilterOrg] = useState("all");

  const loadManualDispatched = async () => {
    setLoading(true);
    try {
      const bookings = await bookingService.getManualDispatchedBookings();

      // ✅ EXCLUDE TUK HERE
      const nonTuk = (bookings || []).filter(
        (b) => Number(b.vehicleClassId) !== TUK_CLASS_ID
      );

      setData(nonTuk.map(mapBookingToManualRow));
    } catch (e) {
      console.error(e);
      toast.error("Failed to load manually dispatched bookings");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManualDispatched();
  }, []);

  const orgOptions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => set.add(d.organization));
    return Array.from(set).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filterText) {
        const value =
          item[filterBy as keyof ManualDispatchedBooking]?.toString().toLowerCase() ||
          "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      if (filterOrg !== "all" && item.organization !== filterOrg) return false;
      return true;
    });
  }, [data, filterText, filterBy, filterOrg]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customerName");
    setFilterOrg("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Manually Dispatched (Excluding TUK)
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage bookings that were manually assigned to drivers
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-[#6330B8]">
          {filteredData.length} Active
        </Badge>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger id="filterBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customerName">Customer</SelectItem>
                <SelectItem value="bookingId">Booking ID</SelectItem>
                <SelectItem value="passengerNumber">Passenger No</SelectItem>
                <SelectItem value="driverName">Driver Name</SelectItem>
                <SelectItem value="vehicleNumber">Vehicle Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterOrg">Organization</Label>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger id="filterOrg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {orgOptions.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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