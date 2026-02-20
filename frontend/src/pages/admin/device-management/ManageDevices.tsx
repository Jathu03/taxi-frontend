"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDataTable } from "@/hooks/useDataTable";
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
import { useToast } from "@/hooks/use-toast";

// --- Services & Types ---
import deviceService from "@/services/devices/deviceService";
import type { DeviceResponse } from "@/services/devices/types";

// ========================
// Columns Definition
// ========================
const columns = (
  navigate: ReturnType<typeof useNavigate>,
  onDelete: (id: number) => void
): ColumnDef<DeviceResponse>[] => [
  { 
    accessorKey: "deviceId", 
    header: () => <span className="font-bold text-black">Device ID</span> 
  },
  { 
    accessorKey: "deviceModel", 
    header: () => <span className="font-bold text-black">Model</span> 
  },
  { 
    accessorKey: "serialNumber", 
    header: () => <span className="font-bold text-black">S/N</span> 
  },
  { 
    accessorKey: "deviceType", 
    header: () => <span className="font-bold text-black">Type</span> 
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, string> = {
        Active: "bg-green-100 text-green-700 border-green-200",
        Inactive: "bg-gray-100 text-gray-700 border-gray-200",
        Maintenance: "bg-orange-100 text-orange-700 border-orange-200",
      };
      
      return (
        <Badge className={variants[status] || "bg-gray-100 text-gray-700"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: () => <span className="font-bold text-black">Last Active</span>,
    cell: ({ row }) => {
      const date = row.original.lastActive;
      return date ? new Date(date).toLocaleString() : "-";
    },
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const device = row.original;
      return (
        <div className="flex justify-end gap-2">
          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/devices/edit/${device.id}`)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(device.id)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      );
    },
  },
];

// ========================
// Main Component
// ========================
export default function ManageDevices() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Local Filtering State
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("deviceId");
  const [deviceType, setDeviceType] = useState("all");
  const [status, setStatus] = useState("all");

  // Initialize DataTable Hook
  const { data, setData } = useDataTable<DeviceResponse>({
    initialData: [],
  });

  // --- 1. Load Data from Backend ---
  const loadDevices = async () => {
    setIsLoading(true);
    try {
      console.log("Loading devices...");
      // Fetch all devices (large size for client-side filtering)
      const response: any = await deviceService.getAll({ size: 1000 });
      
      let devicesList: DeviceResponse[] = [];

      // Handle different response structures (Paged vs Flat)
      if (response?.content) {
        devicesList = response.content;
      } else if (response?.data?.content) {
        devicesList = response.data.content;
      } else if (Array.isArray(response)) {
        devicesList = response;
      } else if (Array.isArray(response?.data)) {
        devicesList = response.data;
      }

      console.log(`Loaded ${devicesList.length} devices`);
      setData(devicesList);

    } catch (error) {
      console.error("Failed to load devices:", error);
      toast({
        title: "Error",
        description: "Failed to load devices list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // --- 2. Action Handlers ---

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;

    try {
      await deviceService.delete(id);
      setData((prev) => prev.filter((d) => d.id !== id));
      toast({ title: "Deleted", description: "Device removed successfully." });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete device.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} devices?`)) return;

    try {
      await Promise.all(selectedIds.map(id => deviceService.delete(Number(id))));
      setData((prev) => prev.filter(d => !selectedIds.includes(d.id.toString())));
      toast({ title: "Bulk Delete", description: "Selected devices have been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Some devices could not be deleted.", variant: "destructive" });
      loadDevices(); // Refresh list to sync state
    }
  };

  // --- 3. Client-Side Filtering Logic ---
  const filteredData = useMemo(() => {
    return data.filter((device) => {
      // Search filter
      if (filterText) {
        const rawValue = device[filterBy as keyof DeviceResponse];
        const value = rawValue ? rawValue.toString().toLowerCase() : "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Select filters
      if (deviceType !== "all" && device.deviceType !== deviceType) return false;
      if (status !== "all" && device.status !== status) return false;

      return true;
    });
  }, [data, filterText, filterBy, deviceType, status]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("deviceId");
    setDeviceType("all");
    setStatus("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Device Management</h1>
          <p className="text-muted-foreground mt-1">Manage MDVRs and GPS trackers</p>
        </div>
        <Button onClick={() => navigate("/admin/devices/add")} className="bg-[#6330B8] hover:bg-[#7C3AED]">
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
                <SelectItem value="deviceId">Device ID</SelectItem>
                <SelectItem value="deviceModel">Model</SelectItem>
                <SelectItem value="serialNumber">Serial Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceType">Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger id="deviceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GPS Tracker">GPS Tracker</SelectItem>
                <SelectItem value="Meter">Meter</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Dashcam">Dashcam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
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

      <EnhancedDataTable
        columns={columns(navigate, handleDelete)}
        data={filteredData}
        isLoading={isLoading}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
      />
    </div>
  );
}