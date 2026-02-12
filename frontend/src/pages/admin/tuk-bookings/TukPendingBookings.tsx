import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash, Edit, RotateCcw } from "lucide-react";
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

export type TukPendingBooking = {
  id: string;
  bookingNumber: string;
  isAdvance: string;
  organization: string;
  customer: string;
  passengerNumber: string;
  hireType: string;
  clientRemarks: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dropAddress: string;
  vehicleClass: string;
};

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<TukPendingBooking>[] => [
    {
      accessorKey: "bookingNumber",
      header: () => <span className="font-bold text-black">Booking #</span>,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex flex-col gap-2">
            <span className="font-mono font-bold text-primary">
              {booking.bookingNumber}
            </span>
            <Button
              size="sm"
              className="h-7 bg-green-600 hover:bg-green-700 text-xs gap-1.5 px-2 w-fit"
              onClick={() => navigate('/admin/bookings/dispatch-vehicle', { state: { booking } })}
            >
              <Send className="h-3 w-3" />
              Dispatch
            </Button>
          </div>
        );
      }
    },
    { accessorKey: "organization", header: () => <span className="font-bold text-black">Organization</span> },
    { accessorKey: "customer", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "passengerNumber", header: () => <span className="font-bold text-black">Passenger #</span> },
    { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
    { accessorKey: "bookingTime", header: () => <span className="font-bold text-black whitespace-nowrap">Booking Time</span> },
    { accessorKey: "pickupTime", header: () => <span className="font-bold text-black whitespace-nowrap">Pickup Time</span> },
    { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/bookings/add-new-booking', { state: { booking } })}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/bookings/cancel-booking', { state: { booking } })}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        );
      },
    },
  ];

const mockTukPendingBookings: TukPendingBooking[] = [
  { id: "1", bookingNumber: "TUK-295104", isAdvance: "", organization: "Tuk Services", customer: "Ms. Nadeeka Silva", passengerNumber: "0776234567", hireType: "On The Meter", clientRemarks: "Short trip to nearby market", bookingTime: "11/27/2025 15:58", bookedBy: "insaaf", pickupTime: "12/02/2025 08:00", pickupAddress: "45 Temple Road, Kotte", dropAddress: "Kotte Market", vehicleClass: "Tuk" },
  { id: "2", bookingNumber: "TUK-295731", isAdvance: "", organization: "Quick Rides", customer: "Ravi Fernando", passengerNumber: "0779876543", hireType: "On The Meter", clientRemarks: "Pick from home to railway station", bookingTime: "12/04/2025 08:20", bookedBy: "shamalka", pickupTime: "12/04/2025 20:45", pickupAddress: "78 Galle Road, Dehiwala", dropAddress: "Fort Railway Station", vehicleClass: "Tuk" },
];

export default function TukPendingBookings() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customer");
  const [hireType, setHireType] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukPendingBooking>({
    initialData: mockTukPendingBookings,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      // Search filter
      if (filterText) {
        const value = booking[filterBy as keyof TukPendingBooking]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Select filters
      if (hireType !== "all" && booking.hireType !== hireType) return false;

      return true;
    });
  }, [data, filterText, filterBy, hireType]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customer");
    setHireType("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Tuk Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending tuk bookings awaiting assignment</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
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
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="bookingNumber">Booking #</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="passengerNumber">Passenger #</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireType">Hire Type</Label>
            <Select value={hireType} onValueChange={setHireType}>
              <SelectTrigger id="hireType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="On The Meter">On The Meter</SelectItem>
                <SelectItem value="Fixed Rate">Fixed Rate</SelectItem>
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