import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Label } from "@/components/ui/label";
import ownerService from "@/services/vehicle-owner/ownerService";
import type { VehicleOwnerResponse } from "@/services/vehicle-owner/types";
import { toast } from "sonner"; // Assuming you use sonner or similar for toasts

// Local interface for UI
interface Owner {
  id: string;
  name: string;
  nic: string;
  phone: string;
  dateModified: string;
}

// Mapper: Backend Response -> UI Interface
const mapToOwner = (item: VehicleOwnerResponse): Owner => ({
  id: String(item.id),
  name: item.name,
  nic: item.nicOrBusinessReg || "-",
  phone: item.primaryContact,
  dateModified: new Date(item.updatedAt).toLocaleString(),
});

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<Owner>[] => [
  { accessorKey: "name", header: () => <span className="font-bold text-black">Name</span> },
  { accessorKey: "nic", header: () => <span className="font-bold text-black">NIC</span> },
  { accessorKey: "phone", header: () => <span className="font-bold text-black">Phone</span> },
  {
    accessorKey: "dateModified",
    header: () => <span className="font-bold text-black text-right block">Date Modified</span>,
    cell: ({ row }) => <div className="text-right">{row.original.dateModified}</div>
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const owner = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-owners/edit/${owner.id}`)}
            className="text-blue-600 border-blue-200"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/vehicle-owners/delete/${owner.id}`)}
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

export default function ManageOwners() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const response = await ownerService.getAll({
        size: 1000, // Fetch large amount to support client-side filter for now
        sortBy: "updatedAt",
        sortDir: "desc",
      });

      if (response.success && response.data) {
        setOwners(response.data.map(mapToOwner));
      } else {
        setOwners([]);
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
      toast.error("Failed to load vehicle owners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Filter Data
  const filteredData = useMemo(() => {
    return owners.filter((item) => {
      if (!filterText) return true;
      return item.name.toLowerCase().includes(filterText.toLowerCase());
    });
  }, [owners, filterText]);

  const handleReset = () => {
    setFilterText("");
  };

  // Bulk Delete Handler
  const handleBulkDelete = (selectedRows: any[]) => {
    const ids = selectedRows.map((row) => {
      // Handle both cases: if 'row' is the data object or a TanStack Row object
      const item = row.original || row; 
      return Number(item.id);
    });

    if (ids.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${ids.length} owner(s)?`)) return;

    ownerService.bulkDelete(ids)
      .then(() => {
        toast.success(`${ids.length} owners deleted successfully`);
        fetchOwners();
      })
      .catch((error) => {
        console.error("Delete failed", error);
        toast.error("Failed to delete owners");
      });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Owners</h1>
          <p className="text-muted-foreground mt-1">Manage individuals and entities owning vehicles</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-owners/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Owner
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="filter">Search Owner</Label>
            <Input
              id="filter"
              placeholder="Filter by owner name..."
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
        <Card className="p-12 text-center text-muted-foreground">
          Loading vehicle owners...
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