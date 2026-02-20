"use client";

import { useState, useEffect, useMemo } from "react";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  Truck,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  DollarSign,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// Services
import driverService from "@/services/drivers/driverService";
import type { DriverResponse } from "@/services/drivers/types";

// ============================================
// TYPE DEFINITION
// ============================================
export type DriverStatus = {
  id: string;
  phone: string;
  status: "Active" | "On Hire" | "Offline";
  location: string;
};

// ============================================
// TABLE COLUMNS
// ============================================
const columns = (): ColumnDef<DriverStatus>[] => [
  { accessorKey: "id", header: "Driver ID" },
  { accessorKey: "phone", header: "Phone Number" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "location", header: "Location" },
];

// ============================================
// HELPERS
// ============================================
const extractDriversList = (response: any): DriverResponse[] => {
  if (response?.content) return response.content;
  if (response?.data?.content) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

const mapToDriverStatus = (d: DriverResponse): DriverStatus => {
  // Logic to determine status (adjust based on your actual backend fields)
  // For now, mapping blocked -> Offline, else Active.
  // Ideally, you'd check `isOnline` or `currentJobId` if available.
  let status: DriverStatus["status"] = "Offline";
  if (!d.isBlocked) status = "Active";
  
  // If backend has an 'isOnline' or 'jobStatus', use it:
  // if (d.isOnline) status = "Active";
  // if (d.activeJob) status = "On Hire";

  return {
    id: d.code || String(d.id),
    phone: d.contactNumber || "N/A",
    status,
    location: (d as any).currentLocation || (d as any).lastKnownLocation || "Unknown",
  };
};

// ============================================
// MAIN COMPONENT
// ============================================
const DriverDashboard = () => {
  const [drivers, setDrivers] = useState<DriverStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Fetch Drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response: any = await driverService.getAll({ size: 1000 });
        const rawList = extractDriversList(response);
        const mapped = rawList.map(mapToDriverStatus);
        setDrivers(mapped);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        toast.error("Failed to load driver dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Compute Stats Dynamically
  const stats = useMemo(() => {
    const total = drivers.length;
    const active = drivers.filter((d) => d.status === "Active").length;
    const onHire = drivers.filter((d) => d.status === "On Hire").length;
    const offline = drivers.filter((d) => d.status === "Offline").length;
    
    // Placeholder logic for stats not directly in driver list (requires booking data)
    // You can fetch booking stats separately if needed.
    const enroute = 0; 
    const waiting = 0;
    const onboard = 0;
    const manual = drivers.filter((d) => (d as any).manualDispatchOnly).length;

    return [
      { title: "Total Drivers", value: total, icon: Users },
      { title: "Active Drivers", value: active, icon: CalendarDays },
      { title: "Hires Accepted", value: onHire, icon: Truck }, // mapped to On Hire
      { title: "Enroute", value: enroute, icon: MapPin }, // Needs booking data
      { title: "Waiting for Customer", value: waiting, icon: Clock }, // Needs booking data
      { title: "Passengers on Board", value: onboard, icon: Users }, // Needs booking data
      { title: "Offline Drivers", value: offline, icon: AlertCircle },
      { title: "Manual Dispatched", value: manual, icon: DollarSign },
    ];
  }, [drivers]);

  // Unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set(drivers.map((d) => d.location).filter((l) => l !== "Unknown"));
    return Array.from(locs).sort();
  }, [drivers]);

  // Filter Data
  const filteredDrivers = useMemo(() => {
    return selectedLocation === "all"
      ? drivers
      : drivers.filter((d) => d.location === selectedLocation);
  }, [drivers, selectedLocation]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <Loader2 className="h-10 w-10 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#6330B8]">Driver Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage all driver activities and status
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className="text-[#6330B8]" />
                <div className="text-right">
                  <p className="text-xl font-semibold text-primary">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <div className="flex items-center justify-between mt-9 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Driver Status</h1>
          <p className="text-muted-foreground">View Driver status.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by Location:</span>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <EnhancedDataTable
        columns={columns()}
        data={filteredDrivers}
        enableFilters={false}
        isLoading={loading}
        emptyMessage="No drivers found."
        hidePagination={false} 
      />
    </div>
  );
};

export default DriverDashboard;