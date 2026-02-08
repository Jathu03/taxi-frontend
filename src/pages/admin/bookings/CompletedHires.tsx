import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CompletedHire = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  fare: string;
  completionTime: string;
  status: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<CompletedHire>[] => [
  { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
  { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
  { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">Vehicle</span> },
  { accessorKey: "fare", header: () => <span className="font-bold text-black text-right block">Fare</span>, cell: ({ row }) => <div className="text-right font-semibold">{row.original.fare}</div> },
  { accessorKey: "completionTime", header: () => <span className="font-bold text-black whitespace-nowrap">Completed At</span> },
  { accessorKey: "status", header: () => <span className="font-bold text-black">Status</span>, cell: ({ row }) => <Badge className="bg-gray-100 text-gray-700 border-gray-200">{row.original.status}</Badge> },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/bookings/view/${row.original.id}`)}
            className="text-blue-600 border-blue-200"
          >
            <Eye className="mr-2 h-4 w-4" /> View
          </Button>
        </div>
      );
    },
  },
];

const mockCompletedHires: CompletedHire[] = [
  { id: "1", bookingId: "CMP-001", customerName: "Sarah Johnson", driverName: "Sunil Perera", vehicleNumber: "WP-CAB-1234", pickupLocation: "Colombo 03", dropLocation: "Fort", fare: "LKR 1,200", completionTime: "2024-03-20 11:30", status: "Completed" },
  { id: "2", bookingId: "CMP-002", customerName: "Michael Silva", driverName: "Kamal Fernando", vehicleNumber: "WP-CAB-5678", pickupLocation: "Dehiwala", dropLocation: "Mount Lavinia", fare: "LKR 850", completionTime: "2024-03-20 11:45", status: "Completed" },
];

export default function CompletedHires() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customerName");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<CompletedHire>({
    initialData: mockCompletedHires,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      if (!filterText) return true;
      const value = booking[filterBy as keyof CompletedHire]?.toString().toLowerCase() || "";
      return value.includes(filterText.toLowerCase());
    });
  }, [data, filterText, filterBy]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customerName");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Completed Hires</h1>
          <p className="text-muted-foreground mt-1">History of all successfully completed bookings</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-gray-600">{data.length} Completed</Badge>
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
                <SelectItem value="customerName">Customer</SelectItem>
                <SelectItem value="bookingId">Booking ID</SelectItem>
                <SelectItem value="driverName">Driver</SelectItem>
                <SelectItem value="vehicleNumber">Vehicle Number</SelectItem>
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
