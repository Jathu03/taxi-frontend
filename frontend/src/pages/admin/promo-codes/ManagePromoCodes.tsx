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
import promoService from "@/services/promo-codes/promoService";
import type { PromoCodeResponse } from "@/services/promo-codes/types";

// UI Interface (Kept exactly as requested)
export type PromoCode = {
  id: string;
  code: string;
  description: string;
  vehicleClasses: string; // Will store count or string representation
  discountIn: string;
  discountValue: number;
  isFirstTimeOnly: boolean;
  maxAmount: number;
  maxCountPerUser: number;
  maxUsage: number;
  maxHireCount: number;
  minimumHireCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

// Mapper: Backend -> UI
const mapToPromoCode = (item: PromoCodeResponse): PromoCode => ({
  id: String(item.id),
  code: item.code,
  description: item.description || "-",
  // Showing count of vehicle classes or "-" if empty, since API returns array of IDs
  vehicleClasses: item.vehicleClassIds?.length > 0 ? `${item.vehicleClassIds.length} Classes` : "All",
  discountIn: item.discountType === "PERCENTAGE" ? "Percentage" : "Amount",
  discountValue: item.discountValue,
  isFirstTimeOnly: item.isFirstTimeOnly,
  maxAmount: item.maxDiscountAmount || 0,
  maxCountPerUser: item.maxUsagePerCustomer || 0,
  maxUsage: item.maxUsage || 0,
  maxHireCount: item.maxHireCount || 0,
  minimumHireCount: item.minimumHireCount || 0,
  startDate: item.startDate ? new Date(item.startDate).toLocaleString() : "-",
  endDate: item.endDate ? new Date(item.endDate).toLocaleString() : "-",
  isActive: item.isActive,
});

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<PromoCode>[] => [
    { accessorKey: "code", header: () => <span className="font-bold text-black">Code</span> },
    { accessorKey: "description", header: () => <span className="font-bold text-black">Description</span> },
    { accessorKey: "vehicleClasses", header: () => <span className="font-bold text-black">Vehicle Classes</span> },
    { accessorKey: "discountIn", header: () => <span className="font-bold text-black">Discount In</span> },
    { accessorKey: "discountValue", header: () => <span className="font-bold text-black">Value</span> },
    { accessorKey: "maxAmount", header: () => <span className="font-bold text-black">Max Amt</span>, cell: ({ row }) => row.original.maxAmount.toFixed(2) },
    { accessorKey: "maxUsage", header: () => <span className="font-bold text-black">Max Usage</span> },
    { accessorKey: "startDate", header: () => <span className="font-bold text-black whitespace-nowrap">Start Date</span> },
    { accessorKey: "endDate", header: () => <span className="font-bold text-black whitespace-nowrap">End Date</span> },
    {
      accessorKey: "isActive",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const promo = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/promo-codes/edit/${promo.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/promo-codes/delete/${promo.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

export default function ManagePromoCodes() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("code");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // ========================
  // Fetch Data
  // ========================
  const fetchPromoCodes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetching large page size for client-side filtering support
      const response = await promoService.getAll({ 
        size: 1000, 
        sortBy: "createdAt", 
        sortDir: "desc" 
      });

      if (response.success) {
        setPromoCodes(response.data.map(mapToPromoCode));
      } else {
        toast({
          title: "Error",
          description: "Failed to load promo codes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
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
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  // ========================
  // Filter Logic
  // ========================
  const filteredData = useMemo(() => {
    return promoCodes.filter((promo) => {
      if (filterText) {
        const value = promo[filterBy as keyof PromoCode]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      if (status !== "all") {
        const isActive = status === "active";
        if (promo.isActive !== isActive) return false;
      }
      return true;
    });
  }, [promoCodes, filterText, filterBy, status]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("code");
    setStatus("all");
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

    if (!window.confirm(`Are you sure you want to delete ${ids.length} promo code(s)?`)) {
      return;
    }

    try {
      await promoService.bulkDelete(ids);
      
      toast({
        title: "Success",
        description: `${ids.length} promo code(s) deleted successfully.`,
      });
      
      fetchPromoCodes(); // Refresh
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Promo Codes</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional discount codes</p>
        </div>
        <Button
          onClick={() => navigate("/admin/promo-codes/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Promo
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
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="description">Description</SelectItem>
                <SelectItem value="vehicleClasses">Vehicle Classes</SelectItem>
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
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
            <p className="text-muted-foreground">Loading promo codes...</p>
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