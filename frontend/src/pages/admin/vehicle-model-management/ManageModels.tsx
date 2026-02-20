import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw, Loader2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Services
import modelService from "@/services/vehicle-model/modelService";
import type { VehicleModelResponse } from "@/services/vehicle-model/types";

// UI Interface
interface Model {
  id: string;
  name: string;
  manufacturer: string;
  dateModified: string;
}

// Mapper
const mapToModel = (item: VehicleModelResponse): Model => ({
  id: String(item.id),
  name: item.model,
  manufacturer: item.makeName,
  dateModified: new Date(item.updatedAt).toLocaleString(),
});

// Columns
const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<Model>[] => [
  { accessorKey: "name", header: () => <span className="font-bold text-black">Model Name</span> },
  { accessorKey: "manufacturer", header: () => <span className="font-bold text-black">Manufacturer</span> },
  { 
    accessorKey: "dateModified", 
    header: () => <span className="font-bold text-black text-right block">Date Modified</span>, 
    cell: ({ row }) => <div className="text-right">{row.original.dateModified}</div> 
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const model = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-models/edit/${model.id}`)}
            className="text-blue-600 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-models/delete/${model.id}`)}
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

export default function ManageModels() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [models, setModels] = useState<Model[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ========================
  // Fetch Data
  // ========================
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await modelService.getAll({ 
        size: 1000, // Fetch large page for client-side filtering
        sortBy: "updatedAt", 
        sortDir: "desc" 
      });

      if (response.success) {
        setModels(response.data.map(mapToModel));
      } else {
        toast({
          title: "Error",
          description: "Failed to load vehicle models.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching models:", error);
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
    fetchModels();
  }, [fetchModels]);

  // ========================
  // Filter Logic
  // ========================
  const filteredData = useMemo(() => {
    return models.filter((item) => {
      if (!filterText) return true;
      const lowerFilter = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(lowerFilter) ||
        item.manufacturer.toLowerCase().includes(lowerFilter)
      );
    });
  }, [models, filterText]);

  const handleReset = () => {
    setFilterText("");
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

    if (!window.confirm(`Are you sure you want to delete ${ids.length} model(s)?`)) {
      return;
    }

    try {
      await Promise.all(ids.map(id => modelService.delete(id)));
      
      toast({
        title: "Success",
        description: `${ids.length} model(s) deleted successfully.`,
      });
      
      fetchModels();
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Models</h1>
          <p className="text-muted-foreground mt-1">Manage specific models for each manufacturer</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-models/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="filter">Search Model</Label>
            <Input
              id="filter"
              placeholder="Filter by model or manufacturer..."
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
            <p className="text-muted-foreground">Loading vehicle models...</p>
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