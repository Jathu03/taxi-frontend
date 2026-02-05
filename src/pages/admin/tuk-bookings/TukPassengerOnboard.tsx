"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type TukPassengerOnboard = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  currentLocation: string;
  estimatedArrival: string;
  distance: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<TukPassengerOnboard>[] => [
  { accessorKey: "bookingId", header: "Booking ID" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "driverName", header: "Driver" },
  { accessorKey: "vehicleNumber", header: "TUK Number" },
  { accessorKey: "pickupLocation", header: "From" },
  { accessorKey: "dropLocation", header: "To" },
  { accessorKey: "currentLocation", header: "Current Location" },
  { accessorKey: "distance", header: "Distance" },
  { accessorKey: "estimatedArrival", header: "ETA" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigate(`/admin/tuk/track/${row.original.bookingId}`, {
                  state: { booking: row.original },
                })
              }
            >
              <MapPin className="mr-2 h-4 w-4" /> Track Live
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
      );
    },
  },
];

const mockTukPassengerOnboard: TukPassengerOnboard[] = [
  { id: "1", bookingId: "TUK-POB-001", customerName: "Rachel Green", driverName: "Mahesh Bandara", vehicleNumber: "TUK-3344", pickupLocation: "Wellawatta", dropLocation: "Galle", currentLocation: "Moratuwa", estimatedArrival: "02:30 PM", distance: "85 km" },
  { id: "2", bookingId: "TUK-POB-002", customerName: "Ross Geller", driverName: "Chandana Perera", vehicleNumber: "TUK-5566", pickupLocation: "Colombo 04", dropLocation: "Negombo", currentLocation: "Ja-Ela", estimatedArrival: "01:15 PM", distance: "12 km" },
  { id: "3", bookingId: "TUK-POB-003", customerName: "Monica Bing", driverName: "Nimal Perera", vehicleNumber: "TUK-1234", pickupLocation: "Fort", dropLocation: "Kandy", currentLocation: "Kaduwela", estimatedArrival: "03:45 PM", distance: "95 km" },
  { id: "4", bookingId: "TUK-POB-004", customerName: "Chandler Bing", driverName: "Sunil Silva", vehicleNumber: "TUK-5678", pickupLocation: "Bambalapitiya", dropLocation: "Kurunegala", currentLocation: "Pasyala", estimatedArrival: "02:15 PM", distance: "68 km" },
  { id: "5", bookingId: "TUK-POB-005", customerName: "Phoebe Buffay", driverName: "Kamal Fernando", vehicleNumber: "TUK-2468", pickupLocation: "Kollupitiya", dropLocation: "Matara", currentLocation: "Kalutara", estimatedArrival: "04:00 PM", distance: "105 km" },
  { id: "6", bookingId: "TUK-POB-006", customerName: "Joey Tribbiani", driverName: "Ajith Kumar", vehicleNumber: "TUK-1357", pickupLocation: "Nugegoda", dropLocation: "Anuradhapura", currentLocation: "Kurunegala", estimatedArrival: "05:30 PM", distance: "145 km" },
  { id: "7", bookingId: "TUK-POB-007", customerName: "Janice Hosenstein", driverName: "Chaminda Dias", vehicleNumber: "TUK-3456", pickupLocation: "Maradana", dropLocation: "Trincomalee", currentLocation: "Dambulla", estimatedArrival: "06:45 PM", distance: "178 km" },
  { id: "8", bookingId: "TUK-POB-008", customerName: "Mike Hannigan", driverName: "Eranga Bandara", vehicleNumber: "TUK-2345", pickupLocation: "Slave Island", dropLocation: "Jaffna", currentLocation: "Vavuniya", estimatedArrival: "08:15 PM", distance: "245 km" },
  { id: "9", bookingId: "TUK-POB-009", customerName: "Gunther Central", driverName: "Fawaz Mohomed", vehicleNumber: "TUK-6789", pickupLocation: "Kotahena", dropLocation: "Batticaloa", currentLocation: "Polonnaruwa", estimatedArrival: "07:30 PM", distance: "198 km" },
  { id: "10", bookingId: "TUK-POB-010", customerName: "Carol Willick", driverName: "Hasitha Gamage", vehicleNumber: "TUK-4680", pickupLocation: "Pettah", dropLocation: "Hambantota", currentLocation: "Tangalle", estimatedArrival: "05:45 PM", distance: "165 km" },
  { id: "11", bookingId: "TUK-POB-011", customerName: "Richard Burke", driverName: "Indika Rathnayake", vehicleNumber: "TUK-8024", pickupLocation: "Kelaniya", dropLocation: "Nuwara Eliya", currentLocation: "Avissawella", estimatedArrival: "04:30 PM", distance: "88 km" },
  { id: "12", bookingId: "TUK-POB-012", customerName: "Emily Waltham", driverName: "Janaka Dissanayake", vehicleNumber: "TUK-1596", pickupLocation: "Wattala", dropLocation: "Badulla", currentLocation: "Mahiyangana", estimatedArrival: "06:15 PM", distance: "152 km" },
  { id: "13", bookingId: "TUK-POB-013", customerName: "Paolo the Waiter", driverName: "Kasun Jayawardena", vehicleNumber: "TUK-7531", pickupLocation: "Ja-Ela", dropLocation: "Ratnapura", currentLocation: "Embilipitiya", estimatedArrival: "03:30 PM", distance: "92 km" },
  { id: "14", bookingId: "TUK-POB-014", customerName: "Tag Jones", driverName: "Lakmal Gunasekara", vehicleNumber: "TUK-9876", pickupLocation: "Colombo 02", dropLocation: "Chilaw", currentLocation: "Wennappuwa", estimatedArrival: "02:00 PM", distance: "48 km" },
  { id: "15", bookingId: "TUK-POB-015", customerName: "Julie Graff", driverName: "Malinga Perera", vehicleNumber: "TUK-3210", pickupLocation: "Colombo 05", dropLocation: "Monaragala", currentLocation: "Wellawaya", estimatedArrival: "07:00 PM", distance: "185 km" },
  { id: "16", bookingId: "TUK-POB-016", customerName: "Kate Miller", driverName: "Oshadha Fernando", vehicleNumber: "TUK-9871", pickupLocation: "Colombo 07", dropLocation: "Ampara", currentLocation: "Kalmunai", estimatedArrival: "06:30 PM", distance: "205 km" },
  { id: "17", bookingId: "TUK-POB-017", customerName: "Kathy Cahill", driverName: "Pradeep Kumara", vehicleNumber: "TUK-2109", pickupLocation: "Dehiwala", dropLocation: "Mannar", currentLocation: "Anuradhapura", estimatedArrival: "07:45 PM", distance: "228 km" },
  { id: "18", bookingId: "TUK-POB-018", customerName: "Charlie Wheeler", driverName: "Ramesh Thilakarathne", vehicleNumber: "TUK-5432", pickupLocation: "Mount Lavinia", dropLocation: "Puttalam", currentLocation: "Chilaw", estimatedArrival: "02:30 PM", distance: "78 km" },
  { id: "19", bookingId: "TUK-POB-019", customerName: "Mona Ross", driverName: "Saman Wijesinghe", vehicleNumber: "TUK-8765", pickupLocation: "Borella", dropLocation: "Kegalle", currentLocation: "Warakapola", estimatedArrival: "01:15 PM", distance: "42 km" },
  { id: "20", bookingId: "TUK-POB-020", customerName: "Jack Geller", driverName: "Nimal Perera", vehicleNumber: "TUK-1234", pickupLocation: "Havelock Town", dropLocation: "Kalutara", currentLocation: "Panadura", estimatedArrival: "12:45 PM", distance: "35 km" },
];

export default function TukPassengerOnboard() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukPassengerOnboard>({
    initialData: mockTukPassengerOnboard,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Passenger Onboard</h1>
          <p className="text-muted-foreground">Active trips in progress</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Active</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search active trips..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
