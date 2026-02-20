// src/pages/admin/bookings/PendingBookings.tsx

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

import pendingService from "@/services/bookings/pendingService";
import type {
  PendingBooking,
  VehicleClassOption,
} from "@/services/bookings/pendingService";

// ─── Columns ────────────────────────────────────────────────────────────

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<PendingBooking>[] => [
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
            onClick={() =>
              navigate("/admin/bookings/dispatch-vehicle", {
                state: { booking: booking.originalData },
              })
            }
          >
            <Send className="h-3 w-3" />
            Dispatch
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "isAdvance",
    header: () => <span className="font-bold text-black">Is Adv</span>,
  },
  {
    accessorKey: "organization",
    header: () => <span className="font-bold text-black">Organization</span>,
  },
  {
    accessorKey: "customer",
    header: () => <span className="font-bold text-black">Customer</span>,
  },
  {
    accessorKey: "passengerNumber",
    header: () => <span className="font-bold text-black">Passenger #</span>,
  },
  {
    accessorKey: "hireType",
    header: () => <span className="font-bold text-black">Hire Type</span>,
  },
  {
    accessorKey: "bookingTime",
    header: () => (
      <span className="font-bold text-black whitespace-nowrap">
        Booking Time
      </span>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-xs">
        {row.original.bookingTime}
      </span>
    ),
  },
  {
    accessorKey: "pickupTime",
    header: () => (
      <span className="font-bold text-black whitespace-nowrap">
        Pickup Time
      </span>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-xs font-semibold">
        {row.original.pickupTime}
      </span>
    ),
  },
  {
    accessorKey: "pickupAddress",
    header: () => <span className="font-bold text-black">Pickup Address</span>,
  },
  {
    accessorKey: "vehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="bg-slate-50 font-semibold border-slate-300"
      >
        {row.original.vehicleClass}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="text-right font-bold text-black block">Actions</span>
    ),
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/admin/bookings/${booking.id}`)
            }
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/admin/bookings/cancel/${booking.id}`, {
                state: { booking: booking.originalData },
              })
            }
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      );
    },
  },
];

// ─── Component ──────────────────────────────────────────────────────────

export default function PendingBookings() {
  const navigate = useNavigate();

  const [data, setData] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle classes fetched from backend (for dropdown + name resolution)
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClassOption[]>(
    []
  );
  const [vehicleMap, setVehicleMap] = useState<Record<number, string>>({});

  // Filters
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customer");
  const [vehicleClassFilter, setVehicleClassFilter] = useState("all");
  const [hireTypeFilter, setHireTypeFilter] = useState("all");

  // ─── Load Vehicle Classes Once ──────────────────────────────────────
  useEffect(() => {
    const loadVehicleClasses = async () => {
      const classes = await pendingService.getVehicleClasses();

      // Filter out TUK (id=8) since this page excludes TUK
      const filtered = classes.filter((vc) => vc.id !== 8);

      setVehicleClasses(filtered);

      // Build a lookup map: { 3: "ECONOMY", 7: "BUS", ... }
      const map: Record<number, string> = {};
      classes.forEach((vc) => {
        map[vc.id] = vc.name;
      });
      setVehicleMap(map);
    };

    loadVehicleClasses();
  }, []);

  // ─── Fetch Pending Bookings ─────────────────────────────────────────
  const fetchPendingBookings = useCallback(async () => {
    setLoading(true);
    try {
      const pendingData = await pendingService.getPendingBookings(vehicleMap);
      setData(pendingData);
    } catch (error) {
      toast.error("Failed to load pending bookings.");
    } finally {
      setLoading(false);
    }
  }, [vehicleMap]);

  // Fetch when vehicleMap is ready
  useEffect(() => {
    if (Object.keys(vehicleMap).length > 0) {
      fetchPendingBookings();
    }
  }, [vehicleMap, fetchPendingBookings]);

  // ─── Client-Side Filtering ─────────────────────────────────────────
  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      // Text search
      if (filterText) {
        const term = filterText.toLowerCase();
        let fieldValue = "";

        switch (filterBy) {
          case "customer":
            fieldValue = booking.customer?.toLowerCase() || "";
            break;
          case "passengerNumber":
            fieldValue = booking.passengerNumber?.toLowerCase() || "";
            break;
          case "bookingNumber":
            fieldValue = booking.bookingNumber?.toLowerCase() || "";
            break;
          case "organization":
            fieldValue = booking.organization?.toLowerCase() || "";
            break;
          default:
            fieldValue = booking.customer?.toLowerCase() || "";
        }

        if (!fieldValue.includes(term)) return false;
      }

      // Vehicle class dropdown
      if (
        vehicleClassFilter !== "all" &&
        booking.vehicleClass !== vehicleClassFilter
      ) {
        return false;
      }

      // Hire type dropdown
      if (hireTypeFilter !== "all" && booking.hireType !== hireTypeFilter) {
        return false;
      }

      return true;
    });
  }, [data, filterText, filterBy, vehicleClassFilter, hireTypeFilter]);

  // ─── Reset ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setFilterText("");
    setFilterBy("customer");
    setVehicleClassFilter("all");
    setHireTypeFilter("all");
    fetchPendingBookings();
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Pending Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            Pending bookings (excluding TUK &amp; Mobile App)
          </p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600 hover:bg-yellow-700">
          {filteredData.length} Pending
        </Badge>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Enter search term..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Search By</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
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

          {/* DYNAMIC Vehicle Class Dropdown */}
          <div className="space-y-2">
            <Label>Vehicle Class</Label>
            <Select
              value={vehicleClassFilter}
              onValueChange={setVehicleClassFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {vehicleClasses.map((vc) => (
                  <SelectItem key={vc.id} value={vc.name}>
                    {vc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Hire Type</Label>
            <Select value={hireTypeFilter} onValueChange={setHireTypeFilter}>
              <SelectTrigger>
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

          <div className="space-y-2 flex items-end">
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
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