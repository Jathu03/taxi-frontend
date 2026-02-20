"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, RotateCcw, Loader2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout"; 
import { useDataTable } from "@/hooks/useDataTable";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import vehicleService from "@/services/vehicles/vehicleService";
import type { VehicleResponse } from "@/services/vehicles/types";

// Interface for the UI Row
interface VehicleRow {
  id: string;
  vehicleName: string;
  vehiclePlate: string;
  owner: string;
  class: string;
  manufacturer: string;
  model: string;
  isActive: boolean;
  dateModified: string;
}

export default function ManageVehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("vehicleName");
  const [filterActive, setFilterActive] = useState("all");
  const [filterClass, setFilterClass] = useState("all");

  const {
    data,
    setData,
  } = useDataTable<VehicleRow>({
    initialData: [],
  });

  // ==========================================
  // 1. DATA FETCHING (GET)
  // ==========================================
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching vehicles from API...");
      
      // We request 1000, but Backend might limit this to 20!
      const response = await vehicleService.getAll({
        page: 0,
        size: 1000, 
        sortBy: "id",
        sortDir: "desc"
      });

      console.log("📥 Raw API Response:", response);

      if (response.success) {
        let rawList: VehicleResponse[] = [];
        
        // Handle Spring Boot Page<T> vs List<T>
        if (Array.isArray(response.data)) {
          rawList = response.data;
        } 
        // @ts-ignore - Handle 'content' wrapper from Spring Data
        else if (response.data && Array.isArray(response.data.content)) {
          // @ts-ignore
          rawList = response.data.content;
        }

        console.log(`✅ Extracted ${rawList.length} vehicles. (If this is 20, your backend is limiting the result)`);

        const mappedData: VehicleRow[] = rawList.map((v) => ({
          id: v.id.toString(),
          vehicleName: `${v.makeName || ''} ${v.modelName || ''}`.trim() || "Unknown Vehicle",
          vehiclePlate: v.registrationNumber,
          owner: v.ownerName || "N/A",
          class: v.className || "N/A",
          manufacturer: v.makeName || "N/A",
          model: v.modelName || "N/A",
          isActive: v.isActive,
          dateModified: v.updatedAt 
            ? new Date(v.updatedAt).toLocaleDateString() 
            : "N/A",
        }));
        
        setData(mappedData);
      }
    } catch (error) {
      console.error("❌ Failed to fetch vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to load vehicles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setData, toast]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles, location.key]);

  // ==========================================
  // 2. ACTIONS (PUT / DELETE)
  // ==========================================
  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await vehicleService.update(Number(id), { isActive: !currentStatus });
      if (response.success) {
        setData((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isActive: !currentStatus } : v))
        );
        toast({ title: "Updated", description: "Vehicle status updated." });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  // Note: We use the separate Delete Page now, but kept this for bulk delete
  const handleApiBulkDelete = async (ids: string[]) => {
    if (!window.confirm(`Delete ${ids.length} vehicles?`)) return;
    let count = 0;
    for (const id of ids) {
      try {
        await vehicleService.delete(Number(id));
        count++;
      } catch (e) { console.error(e); }
    }
    toast({ title: "Bulk Delete", description: `Deleted ${count} vehicles.` });
    fetchVehicles();
  };

  // ==========================================
  // 3. TABLE COLUMNS
  // ==========================================
  const columns = useMemo<ColumnDef<VehicleRow>[]>(() => [
    { 
      accessorKey: "vehicleName", 
      header: "Vehicle Name",
      cell: ({ row }) => <span className="font-medium">{row.original.vehicleName}</span>
    },
    { 
      accessorKey: "vehiclePlate", 
      header: "Plate Number",
      cell: ({ row }) => <Badge variant="outline">{row.original.vehiclePlate}</Badge>
    },
    { accessorKey: "class", header: "Class" },
    { accessorKey: "owner", header: "Owner" },
    { 
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={row.original.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { accessorKey: "dateModified", header: "Modified" },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" onClick={() => toggleActiveStatus(v.id, v.isActive)}>
              <RotateCcw className={`h-4 w-4 ${v.isActive ? "text-orange-500" : "text-green-500"}`} />
            </Button>
            
            <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/vehicles/edit/${v.id}`)}>
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            
            {/* LINKED TO DELETE PAGE */}
            <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/vehicles/delete/${v.id}`)}>
              <Trash className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ], [navigate]);

  // ==========================================
  // 4. CLIENT-SIDE FILTERING
  // ==========================================
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Text Search
      if (filterText) {
        const val = item[filterBy as keyof VehicleRow]?.toString().toLowerCase() || "";
        if (!val.includes(filterText.toLowerCase())) return false;
      }
      // 2. Status
      if (filterActive !== "all") {
        const isActive = filterActive === "true";
        if (item.isActive !== isActive) return false;
      }
      // 3. Class
      if (filterClass !== "all" && item.class !== filterClass) return false;
      return true;
    });
  }, [data, filterText, filterBy, filterActive, filterClass]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("vehicleName");
    setFilterActive("all");
    setFilterClass("all");
  };

  const uniqueClasses = useMemo(() => 
    [...new Set(data.map(v => v.class))].filter(Boolean).sort(), 
  [data]);

  // ==========================================
  // 5. RENDER
  // ==========================================
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Management</h1>
          <p className="text-muted-foreground mt-1">Manage vehicles</p>
        </div>
        <Button onClick={() => navigate("/admin/vehicles/add")} className="bg-[#6330B8] hover:bg-[#7C3AED]">
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex gap-2 col-span-1 md:col-span-2">
            <div className="w-1/3 min-w-[120px]">
              <Label className="text-xs mb-1">Search By</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicleName">Name</SelectItem>
                  <SelectItem value="vehiclePlate">Plate</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label className="text-xs mb-1">Term</Label>
              <Input placeholder="Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1">Class</Label>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs mb-1">Status</Label>
              <Select value={filterActive} onValueChange={setFilterActive}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleReset} variant="outline" size="icon"><RotateCcw className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64 border rounded-lg bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns}
          data={filteredData}
          hideSearch={true}
          enableBulkDelete={true}
          onBulkDelete={handleApiBulkDelete}
          pageSize={50} 
        />
      )}
    </div>
  );
}