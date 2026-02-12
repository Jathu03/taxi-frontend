import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Services
import fareService from "@/services/fare-schemes/fareService";
import type { FareSchemeResponse } from "@/services/fare-schemes/types";

// UI Interface
interface FareScheme {
  id: string;
  schemeName: string; // fareCode
  vehicleClass: string; // Currently ID, can be mapped if you fetch vehicle classes
  baseFare: number; // minimumRate
  perKmRate: number; // ratePerKm
  perMinuteRate: number; // waitingChargePerMin
  waitingCharges: number; // freeWaitTime or calc? Mapping to waitingChargePerMin for display
  nightCharges: number; // nightRateHike
  status: string;
}

// Mapper: Backend -> UI
const mapToFareScheme = (item: FareSchemeResponse): FareScheme => ({
  id: String(item.id),
  schemeName: item.fareCode,
  vehicleClass: String(item.vehicleClassId || "-"), // Ideally, fetch vehicle class name
  baseFare: item.minimumRate || 0,
  perKmRate: item.ratePerKm || 0,
  perMinuteRate: item.waitingChargePerMin || 0,
  waitingCharges: item.waitingChargePerMin || 0, // Using same field for now based on your UI columns
  nightCharges: item.nightRateHike || 0,
  status: item.status,
});

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<FareScheme>[] => [
    { accessorKey: "schemeName", header: () => <span className="font-bold text-black">Scheme Name</span> },
    { accessorKey: "vehicleClass", header: () => <span className="font-bold text-black">Vehicle Class ID</span> },
    { accessorKey: "baseFare", header: () => <span className="font-bold text-black text-right block">Base Fare</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.baseFare.toFixed(2)}</div> },
    { accessorKey: "perKmRate", header: () => <span className="font-bold text-black text-right block">Per KM</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.perKmRate.toFixed(2)}</div> },
    { accessorKey: "perMinuteRate", header: () => <span className="font-bold text-black text-right block">Per Min</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.perMinuteRate.toFixed(2)}</div> },
    {
      accessorKey: "status",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const fare = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/fares/edit/${fare.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/fares/delete/${fare.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        );
      },
    },
  ];

export default function FareScheme() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fares, setFares] = useState<FareScheme[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("schemeName");
  const [vehicleClass, setVehicleClass] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // ========================
  // Fetch Data
  // ========================
  const fetchFares = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fareService.getAll({ 
        size: 1000, 
        sortBy: "createdAt", 
        sortDir: "desc" 
      });

      if (response.success) {
        setFares(response.data.map(mapToFareScheme));
      } else {
        toast({
          title: "Error",
          description: "Failed to load fare schemes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching fares:", error);
      toast({
        title: "Error",
        description: "Network error while fetching data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFares();
  }, [fetchFares]);

  // ========================
  // Filter Logic
  // ========================
  const filteredData = useMemo(() => {
    return fares.filter((fare) => {
      if (filterText) {
        const value = fare[filterBy as keyof FareScheme]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      // Note: vehicleClass filter checks ID string for now
      if (vehicleClass !== "all" && fare.vehicleClass !== vehicleClass) return false;
      return true;
    });
  }, [fares, filterText, filterBy, vehicleClass]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("schemeName");
    setVehicleClass("all");
  };

  // ========================
  // Bulk Delete
  // ========================
  const handleBulkDelete = async (selectedRows: any[]) => {
    const ids = selectedRows.map((row) => {
      const item = row.original || row; 
      return Number(item.id);
    });

    if (ids.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${ids.length} fare scheme(s)?`)) {
      return;
    }

    try {
      await fareService.bulkDelete(ids);
      
      toast({
        title: "Success",
        description: `${ids.length} fare scheme(s) deleted successfully.`,
      });
      
      fetchFares(); // Refresh
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete some items.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Fare Schemes</h1>
          <p className="text-muted-foreground mt-1">Configure pricing structures and fare calculations</p>
        </div>
        <Button
          onClick={() => navigate("/admin/fares/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Fare Scheme
        </Button>
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
                <SelectItem value="schemeName">Scheme Name</SelectItem>
                <SelectItem value="vehicleClass">Vehicle Class</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleClass">Vehicle Class ID</Label>
            <Select value={vehicleClass} onValueChange={setVehicleClass}>
              <SelectTrigger id="vehicleClass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* 
                  To populate this dynamically, you'd fetch active vehicle classes 
                  from VehicleService and map them here. 
                  For now, keeping "All" as default.
                */}
                <SelectItem value="all">All Classes</SelectItem>
                {/* Example IDs */}
                <SelectItem value="1">ID: 1</SelectItem>
                <SelectItem value="2">ID: 2</SelectItem>
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
        <Card className="p-12 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
            <p className="text-muted-foreground">Loading fare schemes...</p>
          </div>
        </Card>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate)}
          data={filteredData}
          hideSearch
          enableBulkDelete
          onBulkDelete={handleBulkDelete}
          enableExport
          enableColumnVisibility
        />
      )}
    </div>
  );
}