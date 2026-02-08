import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Send, Trash, RotateCcw } from "lucide-react";
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

export type TukAppPendingBooking = {
  id: string;
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  bookingTime: string;
  appPlatform: string;
};

const columns = (
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<TukAppPendingBooking>[] => [
    {
      accessorKey: "bookingId",
      header: () => <span className="font-bold text-black">Booking ID</span>,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex flex-col gap-2">
            <span className="font-mono font-bold text-primary">
              {booking.bookingId}
            </span>
            <Button
              size="sm"
              className="h-7 bg-green-600 hover:bg-green-700 text-xs gap-1.5 px-2 w-fit"
              onClick={() => navigate('/admin/bookings/dispatch-vehicle', {
                state: {
                  booking: { ...booking, vehicleClass: "TUK" }
                }
              })}
            >
              <Send className="h-3 w-3" />
              Dispatch
            </Button>
          </div>
        );
      }
    },
    { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
    { accessorKey: "phoneNumber", header: () => <span className="font-bold text-black">Phone</span> },
    { accessorKey: "pickupLocation", header: () => <span className="font-bold text-black">Pickup</span> },
    { accessorKey: "dropLocation", header: () => <span className="font-bold text-black">Drop</span> },
    { accessorKey: "bookingTime", header: () => <span className="font-bold text-black">Time</span> },
    {
      accessorKey: "appPlatform",
      header: () => <span className="font-bold text-black">Platform</span>,
      cell: ({ row }) => <Badge variant="outline">{row.original.appPlatform}</Badge>,
    },
    {
      id: "actions",
      header: () => <span className="font-bold text-black text-right block">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original.id)}
            className="text-red-600 border-red-200"
          >
            <Trash className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </div>
      ),
    },
  ];

const mockTukAppBookings: TukAppPendingBooking[] = [
  { id: "1", bookingId: "TUK-APP-001", customerName: "David Lee", phoneNumber: "+94 77 123 4567", pickupLocation: "Galle Face Green", dropLocation: "Mount Lavinia", bookingTime: "12:30 PM", appPlatform: "Android" },
];

export default function TukAppPendingBookings() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("customerName");
  const [platform, setPlatform] = useState("all");

  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<TukAppPendingBooking>({
    initialData: mockTukAppBookings,
  });

  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      if (filterText) {
        const value = booking[filterBy as keyof TukAppPendingBooking]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      if (platform !== "all" && booking.appPlatform !== platform) return false;
      return true;
    });
  }, [data, filterText, filterBy, platform]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("customerName");
    setPlatform("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">TUK App Pending</h1>
          <p className="text-muted-foreground mt-1">Pending TUK bookings from mobile application</p>
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
                <SelectItem value="customerName">Customer</SelectItem>
                <SelectItem value="bookingId">Booking ID</SelectItem>
                <SelectItem value="phoneNumber">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Android">Android</SelectItem>
                <SelectItem value="iOS">iOS</SelectItem>
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
      />
    </div>
  );
}