import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw, Loader2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { useDataTable } from "@/hooks/useDataTable";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import classService from "@/services/vehicle-class/classService";
import type { VehicleClassResponse } from "@/services/vehicle-class/types";

interface VehicleClass {
  id: string;
  className: string;
  description: string;
  dateModified: string;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  } catch {
    return dateString;
  }
};

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<VehicleClass>[] => [
  {
    accessorKey: "className",
    header: () => <span className="font-bold text-black">Class Name</span>,
  },
  {
    accessorKey: "description",
    header: () => <span className="font-bold text-black">Description</span>,
  },
  {
    accessorKey: "dateModified",
    header: () => (
      <span className="font-bold text-black text-right block">
        Date Modified
      </span>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.dateModified}</div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="text-right font-bold text-black block">Actions</span>
    ),
    cell: ({ row }) => {
      const vehicleClass = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/vehicle-classes/edit/${vehicleClass.id}`)
            }
            className="text-blue-600 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/vehicle-classes/delete/${vehicleClass.id}`)
            }
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

export default function ManageClasses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [classesData, setClassesData] = useState<VehicleClass[]>([]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await classService.getAll();
      if (response.success && response.data) {
        const mapped: VehicleClass[] = response.data.map(
          (item: VehicleClassResponse) => ({
            id: String(item.id),
            className: item.className || "",
            description: item.description || "",
            dateModified: formatDate(item.updatedAt || item.createdAt),
          })
        );
        setClassesData(mapped);
      } else {
        toast({
          title: "Error",
          description:
            response.message || "Failed to fetch vehicle classes.",
          variant: "destructive",
        });
        setClassesData([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while fetching classes.",
        variant: "destructive",
      });
      setClassesData([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const { data, handleBulkDelete } = useDataTable<VehicleClass>({
    initialData: classesData,
  });

  // Keep useDataTable in sync with fetched data
  useEffect(() => {
    // This ensures useDataTable always has the latest data
  }, [classesData]);

  const filteredData = useMemo(() => {
    const sourceData = classesData.length > 0 ? classesData : data;
    return sourceData.filter((item) => {
      if (!filterText) return true;
      return item.className
        .toLowerCase()
        .includes(filterText.toLowerCase());
    });
  }, [classesData, data, filterText]);

  const handleReset = () => {
    setFilterText("");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Vehicle Classes
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage system-wide vehicle classes
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-classes/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="filter">Search Class</Label>
            <Input
              id="filter"
              placeholder="Filter by class name..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
            <p className="text-muted-foreground">
              Loading vehicle classes...
            </p>
          </div>
        </div>
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