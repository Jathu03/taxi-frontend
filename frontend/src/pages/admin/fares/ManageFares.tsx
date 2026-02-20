import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw, Loader2 } from "lucide-react";
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
  code: string;
  metered: boolean;
  minKm: string;
  minRate: string;
  ratePerKm: string;
  ratePerKmHike: string;
}

// Mapper: Backend -> UI
const mapToFareScheme = (item: FareSchemeResponse): FareScheme => ({
  id: String(item.id),
  code: item.fareCode,
  metered: item.isMetered,
  minKm: item.minimumDistance ? item.minimumDistance.toFixed(2) : "0.00",
  minRate: item.minimumRate ? item.minimumRate.toFixed(2) : "0.00",
  ratePerKm: item.ratePerKm ? item.ratePerKm.toFixed(2) : "0.00",
  ratePerKmHike: item.ratePerKmHike ? item.ratePerKmHike.toFixed(2) : "0.00",
});

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<FareScheme>[] => [
    { accessorKey: "code", header: () => <span className="font-bold text-black">Code</span> },
    {
      accessorKey: "metered",
      header: () => <span className="font-bold text-black">Metered</span>,
      cell: ({ row }) => (
        row.original.metered ? (
          <Badge>Yes</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        )
      ),
    },
    { accessorKey: "minKm", header: () => <span className="font-bold text-black text-right block">Min Km</span>, cell: ({ row }) => <div className="text-right">{row.original.minKm}</div> },
    { accessorKey: "minRate", header: () => <span className="font-bold text-black text-right block">Min Rate</span>, cell: ({ row }) => <div className="text-right">{row.original.minRate}</div> },
    { accessorKey: "ratePerKm", header: () => <span className="font-bold text-black text-right block">Rate Per Km</span>, cell: ({ row }) => <div className="text-right">{row.original.ratePerKm}</div> },
    { accessorKey: "ratePerKmHike", header: () => <span className="font-bold text-black text-right block">Rate Per Km ^</span>, cell: ({ row }) => <div className="text-right">{row.original.ratePerKmHike}</div> },
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

export default function ManageFares() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fares, setFares] = useState<FareScheme[]>([]);
  const [filterText, setFilterText] = useState("");
  const [metered, setMetered] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // ========================
  // Fetch Data
  // ========================
  const fetchFares = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetching large page size to support client-side filtering
      const response = await fareService.getAll({ 
        size: 1000, 
        sortBy: "fareCode", 
        sortDir: "asc" 
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
      if (filterText && !fare.code.toLowerCase().includes(filterText.toLowerCase())) return false;
      if (metered !== "all") {
        const isMetered = metered === "yes";
        if (fare.metered !== isMetered) return false;
      }
      return true;
    });
  }, [fares, filterText, metered]);

  const handleReset = () => {
    setFilterText("");
    setMetered("all");
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Fare Scheme</h1>
          <p className="text-muted-foreground mt-1">Configure fare schemes and pricing</p>
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
            <Label htmlFor="filter">Search Scheme</Label>
            <Input
              id="filter"
              placeholder="Filter by code..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metered">Metered</Label>
            <Select value={metered} onValueChange={setMetered}>
              <SelectTrigger id="metered">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
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
        />
      )}
    </div>
  );
}