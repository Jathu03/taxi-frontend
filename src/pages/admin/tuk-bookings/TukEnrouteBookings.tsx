"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type TukEnrouteBooking = {
  id: string;
  bookingId: string;
  customerName: string;
  driverName: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  currentLocation: string;
  estimatedArrival: string;
};

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<TukEnrouteBooking>[] => [
  { accessorKey: "bookingId", header: "Booking ID" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "driverName", header: "Driver" },
  { accessorKey: "vehicleNumber", header: "TUK Number" },
  { accessorKey: "pickupLocation", header: "Pickup" },
  { accessorKey: "currentLocation", header: "Current Location" },
  { accessorKey: "estimatedArrival", header: "ETA" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            navigate(`/admin/tuk/view/${row.original.bookingId}`, {
              state: { booking: row.original },
            })
          }
        >
          <Eye className="mr-2 h-4 w-4" /> View Hire
        </Button>
      );
    },
  },
];

const mockTukEnrouteBookings: TukEnrouteBooking[] = [
  { id: "1", bookingId: "TUK-ENR-001", customerName: "Daniel White", driverName: "Ravi Jayasinghe", vehicleNumber: "TUK-9876", pickupLocation: "Colombo 07", dropLocation: "Colombo Airport", currentLocation: "Peliyagoda", estimatedArrival: "12:45 PM" },
  { id: "2", bookingId: "TUK-ENR-002", customerName: "Jessica Thompson", driverName: "Prasad Wijesinghe", vehicleNumber: "TUK-5432", pickupLocation: "Bambalapitiya", dropLocation: "Kandy", currentLocation: "Kaduwela", estimatedArrival: "03:30 PM" },
  { id: "3", bookingId: "TUK-ENR-003", customerName: "Matthew Allen", driverName: "Nimal Perera", vehicleNumber: "TUK-1234", pickupLocation: "Fort", dropLocation: "Galle", currentLocation: "Panadura", estimatedArrival: "02:15 PM" },
  { id: "4", bookingId: "TUK-ENR-004", customerName: "Ashley Baker", driverName: "Sunil Silva", vehicleNumber: "TUK-5678", pickupLocation: "Wellawatta", dropLocation: "Negombo", currentLocation: "Ja-Ela", estimatedArrival: "11:30 AM" },
  { id: "5", bookingId: "TUK-ENR-005", customerName: "Justin Wright", driverName: "Kamal Fernando", vehicleNumber: "TUK-2468", pickupLocation: "Colombo 03", dropLocation: "Kurunegala", currentLocation: "Pasyala", estimatedArrival: "01:45 PM" },
  { id: "6", bookingId: "TUK-ENR-006", customerName: "Rebecca Hill", driverName: "Ajith Kumar", vehicleNumber: "TUK-1357", pickupLocation: "Colombo 05", dropLocation: "Matara", currentLocation: "Kalutara", estimatedArrival: "03:00 PM" },
  { id: "7", bookingId: "TUK-ENR-007", customerName: "Jeremy Scott", driverName: "Chaminda Dias", vehicleNumber: "TUK-3456", pickupLocation: "Nugegoda", dropLocation: "Anuradhapura", currentLocation: "Kurunegala", estimatedArrival: "05:30 PM" },
  { id: "8", bookingId: "TUK-ENR-008", customerName: "Brittany Green", driverName: "Eranga Bandara", vehicleNumber: "TUK-2345", pickupLocation: "Rajagiriya", dropLocation: "Trincomalee", currentLocation: "Dambulla", estimatedArrival: "06:45 PM" },
  { id: "9", bookingId: "TUK-ENR-009", customerName: "Aaron Adams", driverName: "Fawaz Mohomed", vehicleNumber: "TUK-6789", pickupLocation: "Colombo 02", dropLocation: "Jaffna", currentLocation: "Vavuniya", estimatedArrival: "08:15 PM" },
  { id: "10", bookingId: "TUK-ENR-010", customerName: "Megan Nelson", driverName: "Hasitha Gamage", vehicleNumber: "TUK-4680", pickupLocation: "Mount Lavinia", dropLocation: "Batticaloa", currentLocation: "Polonnaruwa", estimatedArrival: "07:30 PM" },
  { id: "11", bookingId: "TUK-ENR-011", customerName: "Ryan Carter", driverName: "Indika Rathnayake", vehicleNumber: "TUK-8024", pickupLocation: "Colombo 04", dropLocation: "Hambantota", currentLocation: "Tangalle", estimatedArrival: "04:45 PM" },
  { id: "12", bookingId: "TUK-ENR-012", customerName: "Heather Mitchell", driverName: "Janaka Dissanayake", vehicleNumber: "TUK-1596", pickupLocation: "Dehiwala", dropLocation: "Nuwara Eliya", currentLocation: "Avissawella", estimatedArrival: "05:00 PM" },
  { id: "13", bookingId: "TUK-ENR-013", customerName: "Jacob Roberts", driverName: "Kasun Jayawardena", vehicleNumber: "TUK-7531", pickupLocation: "Borella", dropLocation: "Badulla", currentLocation: "Mahiyangana", estimatedArrival: "06:15 PM" },
  { id: "14", bookingId: "TUK-ENR-014", customerName: "Amber Phillips", driverName: "Lakmal Gunasekara", vehicleNumber: "TUK-9876", pickupLocation: "Kotahena", dropLocation: "Ratnapura", currentLocation: "Embilipitiya", estimatedArrival: "03:30 PM" },
  { id: "15", bookingId: "TUK-ENR-015", customerName: "Kyle Campbell", driverName: "Malinga Perera", vehicleNumber: "TUK-3210", pickupLocation: "Pettah", dropLocation: "Chilaw", currentLocation: "Wennappuwa", estimatedArrival: "02:00 PM" },
  { id: "16", bookingId: "TUK-ENR-016", customerName: "Danielle Parker", driverName: "Oshadha Fernando", vehicleNumber: "TUK-9871", pickupLocation: "Maradana", dropLocation: "Monaragala", currentLocation: "Wellawaya", estimatedArrival: "07:00 PM" },
  { id: "17", bookingId: "TUK-ENR-017", customerName: "Eric Evans", driverName: "Pradeep Kumara", vehicleNumber: "TUK-2109", pickupLocation: "Kollupitiya", dropLocation: "Ampara", currentLocation: "Kalmunai", estimatedArrival: "06:30 PM" },
  { id: "18", bookingId: "TUK-ENR-018", customerName: "Tiffany Edwards", driverName: "Ramesh Thilakarathne", vehicleNumber: "TUK-5432", pickupLocation: "Bambalapitiya", dropLocation: "Mannar", currentLocation: "Anuradhapura", estimatedArrival: "07:45 PM" },
  { id: "19", bookingId: "TUK-ENR-019", customerName: "Tyler Collins", driverName: "Saman Wijesinghe", vehicleNumber: "TUK-8765", pickupLocation: "Slave Island", dropLocation: "Puttalam", currentLocation: "Chilaw", estimatedArrival: "02:30 PM" },
  { id: "20", bookingId: "TUK-ENR-020", customerName: "Crystal Stewart", driverName: "Nimal Perera", vehicleNumber: "TUK-1234", pickupLocation: "Havelock Town", dropLocation: "Kegalle", currentLocation: "Warakapola", estimatedArrival: "01:15 PM" },
];

export default function TukEnrouteBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukEnrouteBooking>({
    initialData: mockTukEnrouteBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Enroute Bookings</h1>
          <p className="text-muted-foreground">Drivers on the way to pickup location</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Enroute</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search enroute bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
