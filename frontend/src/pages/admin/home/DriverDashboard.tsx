import { useState } from "react";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  Truck,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnDef } from "node_modules/@tanstack/table-core/build/lib/types";

export type DriverStatus = {
  id: string;
  phone: string;
  status: "Active" | "On Hire" | "Offline";
  location: string;
};

const stats = [
  { title: "Total Drivers", value: 2977, icon: Users },
  { title: "Active Drivers", value: 1500, icon: CalendarDays },
  { title: "Hires Accepted", value: 120, icon: Truck },
  { title: "Enroute", value: 453, icon: MapPin },
  { title: "Waiting for Customer", value: 80, icon: Clock },
  { title: "Passengers on Board", value: 1024, icon: Users },
  { title: "Offline Drivers", value: 1477, icon: AlertCircle },
  { title: "No Driver Update", value: 200, icon: Phone },
  { title: "Manual Dispatched", value: 35, icon: DollarSign },
];

const driverStatusData: DriverStatus[] = [
  {
    id: "1",
    phone: "+94123456789",
    status: "Active",
    location: "Colombo",
  },

  {
    id: "2",
    phone: "+941278789",
    status: "Offline",
    location: "Mannar",
  },
];

const locations = [
  "Colombo",
  "Mannar",
  "Jaffna",
  "Kandy",
  "Galle",
  "Negombo",
  "Trincomalee",
  "Anuradhapura",
  "Batticaloa",
  "Matara",
];

const columns = (): ColumnDef<DriverStatus>[] => [
  { accessorKey: "id", header: "Driver ID" },
  { accessorKey: "phone", header: "Phone Number" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "location", header: "Location" },
];

const DriverDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  
  const filteredDrivers = selectedLocation === "all" 
    ? driverStatusData 
    : driverStatusData.filter(driver => driver.location === selectedLocation);

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
      <div className="flex items-center justify-between mt-9 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Driver Status</h1>
          <p className="text-muted-foreground">View Driver status .</p>
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
        isLoading={false}
        emptyMessage="No Configuration found. Add one to get started."
        hidePagination={true}
      />
    </div>
  );
};

export default DriverDashboard;
