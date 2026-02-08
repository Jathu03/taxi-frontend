import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Vehicle {
  id: string;
  vehicleName: string;
  vehiclePlate: string;
  owner: string;
  class: string;
  category: string;
  manufacturer: string;
  model: string;
  isInspected: boolean;
  isActive: boolean;
  dateModified: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleName: "Honda Grace - ABC-1234",
    vehiclePlate: "ABC-1234",
    owner: "Jegath Fernando",
    class: "BUDGET",
    category: "Car",
    manufacturer: "Honda",
    model: "Grace",
    isInspected: true,
    isActive: true,
    dateModified: "2/26/2024 8:23:59 PM",
  },
  {
    id: "2",
    vehicleName: "Toyota Axio - WP CA-5678",
    vehiclePlate: "WP CA-5678",
    owner: "Sajith Rupasinghe",
    class: "BUDGET",
    category: "Car",
    manufacturer: "Toyota",
    model: "Axio",
    isInspected: true,
    isActive: true,
    dateModified: "2/26/2024 9:15:30 AM",
  },
  {
    id: "3",
    vehicleName: "Suzuki Alto - CAD-9012",
    vehiclePlate: "CAD-9012",
    owner: "Mohammed Shukri",
    class: "BUDGET",
    category: "Mini",
    manufacturer: "Suzuki",
    model: "Alto",
    isInspected: false,
    isActive: true,
    dateModified: "2/27/2024 10:20:15 AM",
  },
];

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  toggleActive: (id: string) => void
): ColumnDef<Vehicle>[] => [
    { accessorKey: "vehicleName", header: () => <span className="font-bold text-black">Vehicle Name</span> },
    { accessorKey: "owner", header: () => <span className="font-bold text-black">Owner</span> },
    { accessorKey: "class", header: () => <span className="font-bold text-black">Class</span> },
    { accessorKey: "category", header: () => <span className="font-bold text-black">Category</span> },
    { accessorKey: "manufacturer", header: () => <span className="font-bold text-black">Manufacturer</span> },
    { accessorKey: "model", header: () => <span className="font-bold text-black">Model</span> },
    {
      accessorKey: "isInspected",
      header: () => <span className="font-bold text-black text-center block">Inspected</span>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.isInspected ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { accessorKey: "dateModified", header: () => <span className="font-bold text-black">Modified</span> },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleActive(vehicle.id)}
              className={vehicle.isActive ? "text-orange-600 border-orange-200" : "text-green-600 border-green-200"}
            >
              {vehicle.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/vehicles/edit/${vehicle.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/vehicles/delete/${vehicle.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

export default function ManageVehicles() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("vehicleName");
  const [filterActive, setFilterActive] = useState("all");
  const [filterInspected, setFilterInspected] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const {
    data,
    setData,
    handleBulkDelete,
  } = useDataTable<Vehicle>({
    initialData: mockVehicles,
  });

  const toggleActive = (id: string) => {
    setData((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Text Search
      if (filterText) {
        const value = item[filterBy as keyof Vehicle]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Active Status
      if (filterActive !== "all") {
        const isActive = filterActive === "true";
        if (item.isActive !== isActive) return false;
      }

      // Inspected Status
      if (filterInspected !== "all") {
        const isInspected = filterInspected === "true";
        if (item.isInspected !== isInspected) return false;
      }

      // Class Filter
      if (filterClass !== "all" && item.class !== filterClass) return false;

      // Category Filter
      if (filterCategory !== "all" && item.category !== filterCategory) return false;

      return true;
    });
  }, [data, filterText, filterBy, filterActive, filterInspected, filterClass, filterCategory]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("vehicleName");
    setFilterActive("all");
    setFilterInspected("all");
    setFilterClass("all");
    setFilterCategory("all");
  };

  // Unique values for dropdowns
  const uniqueClasses = useMemo(() => [...new Set(data.map(v => v.class))], [data]);
  const uniqueCategories = useMemo(() => [...new Set(data.map(v => v.category))], [data]);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Management</h1>
          <p className="text-muted-foreground mt-1">Manage all registered vehicles in the system</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicles/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
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
                <SelectItem value="vehicleName">Vehicle Name</SelectItem>
                <SelectItem value="vehiclePlate">Plate Number</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="model">Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterClass">Class</Label>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger id="filterClass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterCategory">Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger id="filterCategory">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterActive">Status</Label>
            <Select value={filterActive} onValueChange={setFilterActive}>
              <SelectTrigger id="filterActive">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active Only</SelectItem>
                <SelectItem value="false">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterInspected">Inspected</Label>
            <Select value={filterInspected} onValueChange={setFilterInspected}>
              <SelectTrigger id="filterInspected">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Inspected</SelectItem>
                <SelectItem value="false">Not Inspected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-end gap-2 xl:col-span-6 justify-end">
            <Button onClick={handleReset} variant="outline" className="w-full md:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      <EnhancedDataTable
        columns={columns(navigate, toggleActive)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}
