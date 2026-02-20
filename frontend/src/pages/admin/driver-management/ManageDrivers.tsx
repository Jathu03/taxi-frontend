"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout"; 
import { useDataTable } from "@/hooks/useDataTable"; 
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
import driverService from "@/services/drivers/driverService";
import type { DriverResponse } from "@/services/drivers/types";

// ========================
// Columns Definition
// ========================
const columns = (
  navigate: ReturnType<typeof useNavigate>,
  toggleBlocked: (driver: DriverResponse) => void,
  handleDelete: (id: number) => void
): ColumnDef<DriverResponse>[] => [
  { 
    accessorKey: "code", 
    header: () => <span className="font-bold text-black">Code</span> 
  },
  { 
    accessorKey: "firstName", 
    header: () => <span className="font-bold text-black">First Name</span> 
  },
  { 
    accessorKey: "lastName", 
    header: () => <span className="font-bold text-black">Last Name</span>,
    cell: ({ row }) => row.original.lastName || "-"
  },
  { 
    accessorKey: "contactNumber", 
    header: () => <span className="font-bold text-black">Contact</span> 
  },
  {
    accessorKey: "manualDispatchOnly",
    header: () => <span className="font-bold text-black text-center block">Manual Dispatch</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.manualDispatchOnly ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isBlocked",
    header: () => <span className="font-bold text-black text-center block">Status</span>,
    cell: ({ row }) => (
      <div className="flex justify-center" title={row.original.blockedDescription || ""}>
        {row.original.isBlocked ? (
          <XCircle className="h-4 w-4 text-red-500" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleBlocked(driver)}
            className={
              driver.isBlocked
                ? "text-green-600 border-green-200 hover:bg-green-50"
                : "text-red-600 border-red-200 hover:bg-red-50"
            }
          >
            {driver.isBlocked ? "Unblock" : "Block"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(driver.id)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// ========================
// Main Component
// ========================
export default function ManageDrivers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Local Filtering State
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("firstName");
  const [filterBlocked, setFilterBlocked] = useState("all");
  const [filterManualDispatch, setFilterManualDispatch] = useState("all");

  // Initialize DataTable Hook
  const { data, setData } = useDataTable<DriverResponse>({
    initialData: [],
  });

  // --- 1. Load Data from Backend ---
  const loadDrivers = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching drivers...");
      // Fetch all drivers (using a large size to allow client-side searching)
      const response: any = await driverService.getAll({ size: 1000 });
      console.log("Raw API Response:", response);

      let driversList: DriverResponse[] = [];

      // STRATEGY 1: Check if it's your custom ApiResponse wrapper
      if (response.success === true && response.data) {
        if (Array.isArray(response.data)) {
          driversList = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          // It is a Page object inside data
          driversList = response.data.content;
        }
      } 
      // STRATEGY 2: Check if it's a direct Spring Page Response (no success field)
      else if (response.content && Array.isArray(response.content)) {
        console.log("Detected direct Page response");
        driversList = response.content;
      }
      // STRATEGY 3: Check if it's a direct Array
      else if (Array.isArray(response)) {
        console.log("Detected direct Array response");
        driversList = response;
      }

      console.log(`Extracted ${driversList.length} drivers for table.`);
      setData(driversList);

    } catch (error) {
      console.error("Failed to load drivers:", error);
      toast({
        title: "Error",
        description: "Failed to load drivers list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // --- 2. Action Handlers ---

  const handleToggleBlocked = async (driver: DriverResponse) => {
    const newStatus = !driver.isBlocked;
    const action = newStatus ? "blocked" : "unblocked";

    try {
      await driverService.toggleBlock(driver.id, {
        isBlocked: newStatus,
        blockedDescription: newStatus ? "Blocked via Admin Panel" : undefined
      });

      setData((prev) =>
        prev.map((d) => (d.id === driver.id ? { ...d, isBlocked: newStatus } : d))
      );

      toast({
        title: "Status Updated",
        description: `Driver has been ${action}.`,
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to ${action} driver.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await driverService.delete(id);
      setData((prev) => prev.filter((d) => d.id !== id));
      toast({ title: "Deleted", description: "Driver removed successfully." });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete driver. Check active bookings.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} drivers?`)) return;
    try {
      await Promise.all(selectedIds.map(id => driverService.delete(Number(id))));
      setData((prev) => prev.filter(d => !selectedIds.includes(d.id.toString())));
      toast({ title: "Bulk Delete", description: "Selected drivers have been deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Some drivers could not be deleted.", variant: "destructive" });
      loadDrivers();
    }
  };

  // --- 3. Client-Side Filtering Logic ---
  const filteredData = useMemo(() => {
    return data.filter((driver) => {
      // Text Search
      if (filterText) {
        const rawValue = driver[filterBy as keyof DriverResponse];
        const value = rawValue ? rawValue.toString().toLowerCase() : "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Blocked Filter
      if (filterBlocked !== "all") {
        const isBlocked = filterBlocked === "true";
        if (driver.isBlocked !== isBlocked) return false;
      }

      // Manual Dispatch Filter
      if (filterManualDispatch !== "all") {
        const isManual = filterManualDispatch === "true";
        if (driver.manualDispatchOnly !== isManual) return false;
      }

      return true;
    });
  }, [data, filterText, filterBy, filterBlocked, filterManualDispatch]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("firstName");
    setFilterBlocked("all");
    setFilterManualDispatch("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Drivers</h1>
          <p className="text-muted-foreground mt-1">View and manage all driver accounts</p>
        </div>
        <Button
          onClick={() => navigate("/admin/drivers/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Driver
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
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="code">Driver Code</SelectItem>
                <SelectItem value="contactNumber">Contact Number</SelectItem>
                <SelectItem value="nic">NIC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterBlocked">Blocked Status</Label>
            <Select value={filterBlocked} onValueChange={setFilterBlocked}>
              <SelectTrigger id="filterBlocked">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Blocked Only</SelectItem>
                <SelectItem value="false">Active Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterManual">Manual Dispatch</Label>
            <Select value={filterManualDispatch} onValueChange={setFilterManualDispatch}>
              <SelectTrigger id="filterManual">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
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
        columns={columns(navigate, handleToggleBlocked, handleDelete)}
        data={filteredData}
        isLoading={isLoading}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}