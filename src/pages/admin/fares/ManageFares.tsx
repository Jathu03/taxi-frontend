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

interface FareScheme {
  id: string;
  code: string;
  metered: boolean;
  minKm: string;
  minRate: string;
  ratePerKm: string;
  ratePerKmHike: string;
}

const mockFares: FareScheme[] = [
  {
    id: "1",
    code: "Mileage Calculator",
    metered: false,
    minKm: "1.00",
    minRate: "0.00",
    ratePerKm: "0.00",
    ratePerKmHike: "0.00",
  },
  {
    id: "2",
    code: "STANDARD",
    metered: false,
    minKm: "1.00",
    minRate: "0.00",
    ratePerKm: "0.00",
    ratePerKmHike: "0.00",
  },
  {
    id: "3",
    code: "Central Bank Standard",
    metered: false,
    minKm: "1.00",
    minRate: "133.62",
    ratePerKm: "133.62",
    ratePerKmHike: "133.62",
  },
];

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
  const [filterText, setFilterText] = useState("");
  const [metered, setMetered] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<FareScheme>({
    initialData: mockFares,
  });

  const filteredData = useMemo(() => {
    return data.filter((fare) => {
      if (filterText && !fare.code.toLowerCase().includes(filterText.toLowerCase())) return false;
      if (metered !== "all") {
        const isMetered = metered === "yes";
        if (fare.metered !== isMetered) return false;
      }
      return true;
    });
  }, [data, filterText, metered]);

  const handleReset = () => {
    setFilterText("");
    setMetered("all");
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

      <EnhancedDataTable
        columns={columns(navigate)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
      />
    </div>
  );
}
