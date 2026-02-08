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

export type CancelledHire = {
  id: string;
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  cancelTime: string;
  reason: string;
  cancelledBy: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<CancelledHire>[] => [
  { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
  { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "cancelTime", header: () => <span className="font-bold text-black whitespace-nowrap">Cancelled At</span> },
  { accessorKey: "reason", header: () => <span className="font-bold text-black">Reason</span> },
  { accessorKey: "cancelledBy", header: () => <span className="font-bold text-black">By</span>, cell: ({ row }) => <Badge variant="outline" className="text-red-600 border-red-200">{row.original.cancelledBy}</Badge> },
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

const mockCancelledHires: CancelledHire[] = [
  { id: "1", bookingId: "CAN-001", customerName: "David Lee", phoneNumber: "+94 77 123 4567", pickupLocation: "Colombo 05", cancelTime: "2024-03-20 09:30", reason: "Vehicle delayed", cancelledBy: "Customer" },
  { id: "2", bookingId: "CAN-002", customerName: "Sophia Wang", phoneNumber: "+94 71 987 6543", pickupLocation: "Dehiwala", cancelTime: "2024-03-20 09:45", reason: "Order mistake", cancelledBy: "Admin" },
];

export default function CancelledHires() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customerName");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<CancelledHire>({
    initialData: mockCancelledHires,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      if (!filterText) return true;
      const value = booking[filterBy as keyof CancelledHire]?.toString().toLowerCase() || "";
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Cancelled Hires</h1>
          <p className="text-muted-foreground mt-1">History of cancelled bookings and reasons</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-red-600">{data.length} Cancelled</Badge>
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
                <SelectItem value="reason">Reason</SelectItem>
                <SelectItem value="cancelledBy">Cancelled By</SelectItem>
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
