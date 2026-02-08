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

export type PendingBooking = {
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
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<PendingBooking>[] => [
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
    { accessorKey: "isAdvance", header: () => <span className="font-bold text-black">Is Adv</span> },
    { accessorKey: "organization", header: () => <span className="font-bold text-black">Organization</span> },
    { accessorKey: "customer", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "passengerNumber", header: () => <span className="font-bold text-black">Passenger #</span> },
    { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
    { accessorKey: "bookingTime", header: () => <span className="font-bold text-black">Booking Time</span> },
    { accessorKey: "pickupTime", header: () => <span className="font-bold text-black">Pickup Time</span> },
    { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
    { accessorKey: "vehicleClass", header: () => <span className="font-bold text-black">Vehicle Class</span> },
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

const mockPendingBookings: PendingBooking[] = [
  { id: "1", bookingNumber: "295104", isAdvance: "", organization: "PGIE", customer: "Ms. Shiromi Herath", passengerNumber: "0766117723", hireType: "On The Meter", clientRemarks: "(Hire Postpone) Nawala to Waskaduwa", bookingTime: "11/27/2025 15:58", bookedBy: "insaaf", pickupTime: "12/02/2025 08:00", pickupAddress: "83 Liyanage Mawatha, Kotte", dropAddress: "", vehicleClass: "Bus" },
  { id: "2", bookingNumber: "295731", isAdvance: "", organization: "Inbay", customer: "Hameed", passengerNumber: "0770383078", hireType: "On The Meter", clientRemarks: "Pick From Dehiwala", bookingTime: "12/04/2025 08:20", bookedBy: "shamalka", pickupTime: "12/04/2025 20:45", pickupAddress: "59/4 Rahula Rd, Dehiwala", dropAddress: "", vehicleClass: "ECO" },
];

export default function PendingBookings() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customer");
  const [vehicleClass, setVehicleClass] = useState("all");
  const [hireType, setHireType] = useState("all");

  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<PendingBooking>({
    initialData: mockPendingBookings,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      // Search filter
      if (filterText) {
        const value = booking[filterBy as keyof PendingBooking]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Select filters
      if (vehicleClass !== "all" && booking.vehicleClass !== vehicleClass) return false;
      if (hireType !== "all" && booking.hireType !== hireType) return false;

      return true;
    });
  }, [data, filterText, filterBy, vehicleClass, hireType]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customer");
    setVehicleClass("all");
    setHireType("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending bookings awaiting assignment</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
            <Label htmlFor="vehicleClass">Vehicle Class</Label>
            <Select value={vehicleClass} onValueChange={setVehicleClass}>
              <SelectTrigger id="vehicleClass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="ECO">ECO</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
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
        columns={columns(handleDelete, navigate)}
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