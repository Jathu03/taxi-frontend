import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, RotateCcw } from "lucide-react";
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

interface FareScheme {
  id: string;
  schemeName: string;
  vehicleClass: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  waitingCharges: number;
  nightCharges: number;
  status: string;
}

const mockFares: FareScheme[] = [
  { id: "1", schemeName: "Standard Day Rate", vehicleClass: "STANDARD", baseFare: 300, perKmRate: 100, perMinuteRate: 5, waitingCharges: 50, nightCharges: 50, status: "Active" },
  { id: "2", schemeName: "Luxury Rate", vehicleClass: "LUXURY", baseFare: 500, perKmRate: 150, perMinuteRate: 8, waitingCharges: 80, nightCharges: 80, status: "Active" },
  { id: "3", schemeName: "Economy Rate", vehicleClass: "ECONOMY", baseFare: 200, perKmRate: 70, perMinuteRate: 3, waitingCharges: 30, nightCharges: 30, status: "Active" },
  { id: "4", schemeName: "TUK Day Rate", vehicleClass: "TUK", baseFare: 100, perKmRate: 50, perMinuteRate: 2, waitingCharges: 20, nightCharges: 25, status: "Active" },
];

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<FareScheme>[] => [
    { accessorKey: "schemeName", header: () => <span className="font-bold text-black">Scheme Name</span> },
    { accessorKey: "vehicleClass", header: () => <span className="font-bold text-black">Vehicle Class</span> },
    { accessorKey: "baseFare", header: () => <span className="font-bold text-black text-right block">Base Fare</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.baseFare}</div> },
    { accessorKey: "perKmRate", header: () => <span className="font-bold text-black text-right block">Per KM</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.perKmRate}</div> },
    { accessorKey: "perMinuteRate", header: () => <span className="font-bold text-black text-right block">Per Min</span>, cell: ({ row }) => <div className="text-right">Rs. {row.original.perMinuteRate}</div> },
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
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("schemeName");
  const [vehicleClass, setVehicleClass] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<FareScheme>({
    initialData: mockFares,
  });

  const filteredData = useMemo(() => {
    return data.filter((fare) => {
      if (filterText) {
        const value = fare[filterBy as keyof FareScheme]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      if (vehicleClass !== "all" && fare.vehicleClass !== vehicleClass) return false;
      return true;
    });
  }, [data, filterText, filterBy, vehicleClass]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("schemeName");
    setVehicleClass("all");
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
            <Label htmlFor="vehicleClass">Vehicle Class</Label>
            <Select value={vehicleClass} onValueChange={setVehicleClass}>
              <SelectTrigger id="vehicleClass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
                <SelectItem value="ECONOMY">Economy</SelectItem>
                <SelectItem value="TUK">TUK</SelectItem>
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
