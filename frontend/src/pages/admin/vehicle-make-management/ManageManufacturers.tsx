import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw, Loader2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast"; // Adjust path if using sonner vs use-toast

// Import Service and Types
import makeService from "@/services/vehicle-make/makeService";
import type { VehicleMakeResponse } from "@/services/vehicle-make/types";

// UI Interface (Matches your table structure)
interface Manufacturer {
  id: string;
  name: string;
  code: string;
  dateModified: string;
}

// Mapper: Backend Response -> UI Interface
const mapToManufacturer = (item: VehicleMakeResponse): Manufacturer => ({
  id: String(item.id),
  name: item.manufacturer,
  code: item.manufacturerCode || "-",
  dateModified: new Date(item.updatedAt).toLocaleString(),
});

// Column Definitions
const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<Manufacturer>[] => [
  { accessorKey: "name", header: () => <span className="font-bold text-black">Name</span> },
  { accessorKey: "code", header: () => <span className="font-bold text-black">Code</span> },
  { 
    accessorKey: "dateModified", 
    header: () => <span className="font-bold text-black text-right block">Date Modified</span>, 
    cell: ({ row }) => <div className="text-right">{row.original.dateModified}</div> 
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const manufacturer = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-makes/edit/${manufacturer.id}`)}
            className="text-blue-600 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-makes/delete/${manufacturer.id}`)}
            className="text-red-600 border-red-200"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      );
    },
  },
];

export default function ManageManufacturers() {
  const navigate = useNavigate();
  
  // State
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ========================
  // Fetch Data from Backend
  // ========================
  const fetchManufacturers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetching a large page size to handle client-side filtering for now
      const response = await makeService.getAll({ 
        size: 1000, 
        sortBy: "updatedAt", 
        sortDir: "desc" 
      });

      if (response.success) {
        const mappedData = response.data.map(mapToManufacturer);
        setManufacturers(mappedData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load manufacturers.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      toast({
        title: "Error",
        description: "Network error while fetching data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchManufacturers();
  }, [fetchManufacturers]);

  // ========================
  // Client-Side Filtering
  // ========================
  const filteredData = useMemo(() => {
    return manufacturers.filter((item) => {
      if (!filterText) return true;
      const lowerFilter = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(lowerFilter) ||
        item.code.toLowerCase().includes(lowerFilter)
      );
    });
  }, [manufacturers, filterText]);

  const handleReset = () => {
    setFilterText("");
  };

  // ========================
  // Bulk Delete Handler
  // ========================
  const handleBulkDelete = async (selectedRows: any[]) => {
    // Extract IDs from selected rows
    const ids = selectedRows.map((row) => {
      const item = row.original || row; 
      return Number(item.id);
    });

    if (ids.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${ids.length} manufacturer(s)?`)) {
      return;
    }

    try {
      // Execute deletions in parallel since service is per-ID (or implement bulk endpoint in backend)
      await Promise.all(ids.map(id => makeService.delete(id)));
      
      toast({
        title: "Success",
        description: `${ids.length} manufacturer(s) deleted successfully.`,
      });
      
      // Refresh list
      fetchManufacturers();
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete some items. They may be in use.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Manufacturers</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle make/manufacturer data</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-makes/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Manufacturer
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="filter">Search Make</Label>
            <Input
              id="filter"
              placeholder="Filter by manufacturer name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
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
            <p className="text-muted-foreground">Loading manufacturers...</p>
          </div>
        </Card>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate)}
          data={filteredData}
          hideSearch
          enableBulkDelete
          onBulkDelete={handleBulkDelete}
        />
      )}
    </div>
  );
}