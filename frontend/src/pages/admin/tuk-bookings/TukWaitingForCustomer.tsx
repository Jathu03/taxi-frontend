import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Phone, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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

export type TukWaitingBooking = {
  id: string;
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  driverName: string;
  vehicleNumber: string;
  location: string;
  arrivalTime: string;
  waitingTime: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<TukWaitingBooking>[] => [
  { accessorKey: "bookingId", header: () => <span className="font-bold text-black">Booking ID</span> },
  { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "phoneNumber", header: () => <span className="font-bold text-black">Phone</span> },
  { accessorKey: "driverName", header: () => <span className="font-bold text-black">Driver</span> },
  { accessorKey: "vehicleNumber", header: () => <span className="font-bold text-black">TUK Number</span> },
  { accessorKey: "location", header: () => <span className="font-bold text-black">Location</span> },
  { accessorKey: "arrivalTime", header: () => <span className="font-bold text-black whitespace-nowrap">Arrival Time</span> },
  { accessorKey: "waitingTime", header: () => <span className="font-bold text-black">Waiting</span> },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`tel:${row.original.phoneNumber}`)}>
                <Phone className="mr-2 h-4 w-4" /> Call Customer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/admin/tuk/view/${row.original.bookingId}`, {
                    state: { booking: row.original },
                  })
                }
              >
                <Eye className="mr-2 h-4 w-4" /> View Hire
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const mockTukWaitingBookings: TukWaitingBooking[] = [
  { id: "1", bookingId: "TUK-WAIT-001", customerName: "Amanda Clark", phoneNumber: "+94 77 111 2222", driverName: "Saman Kumara", vehicleNumber: "TUK-7890", location: "Colombo 05", arrivalTime: "11:00 AM", waitingTime: "5 min" },
  { id: "2", bookingId: "TUK-WAIT-002", customerName: "Kevin Rodriguez", phoneNumber: "+94 71 222 3333", driverName: "Chaminda Silva", vehicleNumber: "TUK-1122", location: "Nugegoda", arrivalTime: "11:15 AM", waitingTime: "10 min" },
  { id: "3", bookingId: "TUK-WAIT-003", customerName: "Olivia Murphy", phoneNumber: "+94 76 333 4444", driverName: "Nimal Perera", vehicleNumber: "TUK-1234", location: "Fort", arrivalTime: "11:30 AM", waitingTime: "7 min" },
];

export default function TukWaitingForCustomer() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customerName");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukWaitingBooking>({
    initialData: mockTukWaitingBookings,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      if (!filterText) return true;
      const value = booking[filterBy as keyof TukWaitingBooking]?.toString().toLowerCase() || "";
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Waiting for Customer</h1>
          <p className="text-muted-foreground mt-1">Drivers waiting at pickup location</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-blue-600">{data.length} Waiting</Badge>
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
                <SelectItem value="vehicleNumber">TUK Number</SelectItem>
                <SelectItem value="phoneNumber">Phone</SelectItem>
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
