// src/pages/admin/bookings/CancelledHires.tsx
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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

import { cancelService } from "@/services/bookings/cancelService";
import type {
  BookingCancellationResponse,
  CancelledHireFilterParams,
} from "@/services/bookings/cancelService";

import { bookingService } from "@/services/bookings/bookingService";
import type { BookingResponse } from "@/services/bookings/types";

const TUK_CLASS_ID = 8;

type CancelledHireRow = BookingCancellationResponse & {
  vehicleClassId?: number;
  vehicleClassName?: string;
  bookingSource?: string;
  originalBooking?: BookingResponse;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<CancelledHireRow>[] => [
  {
    accessorKey: "bookingNumber",
    header: () => <span className="font-bold text-black">Booking ID</span>,
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.bookingNumber || row.original.bookingId}
      </span>
    ),
  },
  {
    accessorKey: "cancelledByUserName",
    header: () => <span className="font-bold text-black">Customer/User</span>,
    cell: ({ row }) => {
      const name =
        row.original.cancelledByUserName ||
        row.original.cancelledByDriverName ||
        "Unknown";
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "cancelledTime",
    header: () => (
      <span className="font-bold text-black whitespace-nowrap">Cancelled At</span>
    ),
    cell: ({ row }) => {
      const date = row.original.cancelledTime
        ? new Date(row.original.cancelledTime).toLocaleString()
        : "N/A";
      return <span className="whitespace-nowrap">{date}</span>;
    },
  },
  {
    accessorKey: "cancellationReason",
    header: () => <span className="font-bold text-black">Reason</span>,
    cell: ({ row }) => (
      <span
        className="italic text-gray-600 truncate max-w-[200px] block"
        title={row.original.cancellationReason}
      >
        {row.original.cancellationReason}
      </span>
    ),
  },
  {
    accessorKey: "cancelledByType",
    header: () => <span className="font-bold text-black">By</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
        {row.original.cancelledByType}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/admin/bookings/cancel/${row.original.bookingId}`)}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
      </div>
    ),
  },
];

export default function CancelledHires() {
  const navigate = useNavigate();

  const [data, setData] = useState<CancelledHireRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("bookingNumber");
  const [cancelledType, setCancelledType] = useState<string>("all");

  // Cache bookings to avoid refetching same bookingId again and again
  const bookingCacheRef = useRef<Record<number, BookingResponse>>({});

  const fetchCancelledHires = useCallback(async () => {
    setLoading(true);
    try {
      const params: CancelledHireFilterParams = {};

      if (filterText) {
        params.searchTerm = filterText;

        // Keep your existing mapping (adjust if your backend supports more filterBy values)
        params.filterBy = filterBy === "bookingNumber" ? "phone" : (filterBy as any);
      }

      if (cancelledType !== "all") {
        params.cancelledType = cancelledType;
      }

      // 1) Fetch cancellations
      const cancellations = await cancelService.getAllCancelledHires(params);

      // 2) Enrich with booking vehicleClassId by fetching /api/bookings/{id}
      const uniqueBookingIds = Array.from(
        new Set((cancellations || []).map((c) => Number(c.bookingId)).filter(Boolean))
      );

      const idsToFetch = uniqueBookingIds.filter(
        (id) => !bookingCacheRef.current[id]
      );

      // Fetch missing bookings
      await Promise.allSettled(
        idsToFetch.map(async (id) => {
          const b = await bookingService.getBookingById(id);
          bookingCacheRef.current[id] = b;
        })
      );

      // 3) Merge
      const enriched: CancelledHireRow[] = (cancellations || []).map((c) => {
        const bookingId = Number(c.bookingId);
        const b = bookingCacheRef.current[bookingId];

        return {
          ...c,
          vehicleClassId: b?.vehicleClassId,
          vehicleClassName: b?.vehicleClassName,
          bookingSource: b?.bookingSource,
          originalBooking: b,
        };
      });

      setData(enriched);
    } catch (error) {
      console.error("Failed to fetch cancelled hires:", error);
      toast.error("Failed to load cancelled bookings.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filterText, filterBy, cancelledType]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCancelledHires();
    }, 500);
    return () => clearTimeout(debounce);
  }, [fetchCancelledHires]);

  // Filter locally + EXCLUDE TUK
  const filteredData = useMemo(() => {
    const base = data.filter((item) => Number(item.vehicleClassId) !== TUK_CLASS_ID);

    if (!filterText) return base;

    return base.filter((item) => {
      const val = item[filterBy as keyof CancelledHireRow];
      return val ? String(val).toLowerCase().includes(filterText.toLowerCase()) : false;
    });
  }, [data, filterText, filterBy]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("bookingNumber");
    setCancelledType("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Cancelled Hires (Excluding TUK)
          </h1>
          <p className="text-muted-foreground mt-1">
            History of cancelled bookings and reasons
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-red-600 hover:bg-red-700">
          {filteredData.length} Cancelled
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
                <SelectItem value="bookingNumber">Booking ID</SelectItem>
                <SelectItem value="cancelledByUserName">User Name</SelectItem>
                <SelectItem value="cancellationReason">Reason</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancelledType">Cancelled Type</Label>
            <Select value={cancelledType} onValueChange={setCancelledType}>
              <SelectTrigger id="cancelledType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ADMIN_CANCELLED">Admin Cancelled</SelectItem>
                <SelectItem value="USER_CANCELLED">User Cancelled</SelectItem>
                <SelectItem value="DRIVER_CANCELLED">Driver Cancelled</SelectItem>
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
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
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