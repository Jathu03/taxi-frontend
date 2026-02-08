import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

export type PromoCode = {
  id: string;
  code: string;
  description: string;
  vehicleClasses: string;
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

const mockPromoCodes: PromoCode[] = [
  { id: "1", code: "Ride1", description: "Offer", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Percentage", discountValue: 30, isFirstTimeOnly: false, maxAmount: 150.00, maxCountPerUser: 20, maxUsage: 500, maxHireCount: 0, minimumHireCount: 0, startDate: "6/5/2018 5:34:00 AM", endDate: "7/31/2018 5:34:00 AM", isActive: false },
  { id: "2", code: "MON101", description: "Weekend promotoin", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Percentage", discountValue: 10, isFirstTimeOnly: false, maxAmount: 500.00, maxCountPerUser: 15, maxUsage: 100, maxHireCount: 0, minimumHireCount: 0, startDate: "6/4/2018 12:02:00 PM", endDate: "6/7/2018 12:02:00 PM", isActive: false },
  { id: "3", code: "MON100", description: "Days", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Amount", discountValue: 100, isFirstTimeOnly: false, maxAmount: 0.00, maxCountPerUser: 5, maxUsage: 10, maxHireCount: 0, minimumHireCount: 0, startDate: "5/28/2018 1:13:00 AM", endDate: "6/1/2018 1:13:00 AM", isActive: false },
];

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
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("code");
  const [status, setStatus] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<PromoCode>({
    initialData: mockPromoCodes,
  });

  const filteredData = useMemo(() => {
    return data.filter((promo) => {
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
  }, [data, filterText, filterBy, status]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("code");
    setStatus("all");
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

      <EnhancedDataTable
        columns={columns(navigate)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
