"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Phone, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export type WaitingBooking = {
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

const columns = (navigate: ReturnType<typeof useNavigate>): ColumnDef<WaitingBooking>[] => [
  { accessorKey: "bookingId", header: "Booking ID" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "phoneNumber", header: "Phone" },
  { accessorKey: "driverName", header: "Driver" },
  { accessorKey: "vehicleNumber", header: "Vehicle" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "arrivalTime", header: "Arrival Time" },
  { accessorKey: "waitingTime", header: "Waiting" },
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
            <DropdownMenuItem onClick={() => window.open(`tel:${row.original.phoneNumber}`)}>
              <Phone className="mr-2 h-4 w-4" /> Call Customer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate(`/admin/bookings/view/${row.original.bookingId}`, {
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

const mockWaitingBookings: WaitingBooking[] = [
  { id: "1", bookingId: "WAIT-001", customerName: "Amanda Clark", phoneNumber: "+94 77 111 2222", driverName: "Saman Kumara", vehicleNumber: "CAB-7890", location: "Colombo 05", arrivalTime: "11:00 AM", waitingTime: "5 min" },
  { id: "2", bookingId: "WAIT-002", customerName: "Kevin Rodriguez", phoneNumber: "+94 71 222 3333", driverName: "Chaminda Silva", vehicleNumber: "CAB-1122", location: "Nugegoda", arrivalTime: "11:15 AM", waitingTime: "10 min" },
  { id: "3", bookingId: "WAIT-003", customerName: "Olivia Murphy", phoneNumber: "+94 76 333 4444", driverName: "Nimal Perera", vehicleNumber: "CAB-1234", location: "Fort", arrivalTime: "11:30 AM", waitingTime: "7 min" },
  { id: "4", bookingId: "WAIT-004", customerName: "Brandon Kelly", phoneNumber: "+94 75 444 5555", driverName: "Sunil Silva", vehicleNumber: "CAB-5678", location: "Bambalapitiya", arrivalTime: "11:45 AM", waitingTime: "3 min" },
  { id: "5", bookingId: "WAIT-005", customerName: "Sophia Rivera", phoneNumber: "+94 74 555 6666", driverName: "Kamal Fernando", vehicleNumber: "CAB-2468", location: "Kollupitiya", arrivalTime: "12:00 PM", waitingTime: "12 min" },
  { id: "6", bookingId: "WAIT-006", customerName: "Zachary Cooper", phoneNumber: "+94 73 666 7777", driverName: "Ajith Kumar", vehicleNumber: "CAB-1357", location: "Wellawatta", arrivalTime: "12:15 PM", waitingTime: "8 min" },
  { id: "7", bookingId: "WAIT-007", customerName: "Isabella Cox", phoneNumber: "+94 72 777 8888", driverName: "Chaminda Dias", vehicleNumber: "CAB-3456", location: "Maradana", arrivalTime: "12:30 PM", waitingTime: "15 min" },
  { id: "8", bookingId: "WAIT-008", customerName: "Austin Ward", phoneNumber: "+94 77 888 9999", driverName: "Eranga Bandara", vehicleNumber: "CAB-2345", location: "Slave Island", arrivalTime: "12:45 PM", waitingTime: "6 min" },
  { id: "9", bookingId: "WAIT-009", customerName: "Hannah Bailey", phoneNumber: "+94 71 999 0000", driverName: "Fawaz Mohomed", vehicleNumber: "CAB-6789", location: "Havelock Town", arrivalTime: "01:00 PM", waitingTime: "4 min" },
  { id: "10", bookingId: "WAIT-010", customerName: "Jordan Foster", phoneNumber: "+94 76 000 1111", driverName: "Hasitha Gamage", vehicleNumber: "CAB-4680", location: "Kirulapone", arrivalTime: "01:15 PM", waitingTime: "9 min" },
  { id: "11", bookingId: "WAIT-011", customerName: "Alexis Gray", phoneNumber: "+94 75 111 2222", driverName: "Indika Rathnayake", vehicleNumber: "CAB-8024", location: "Narahenpita", arrivalTime: "01:30 PM", waitingTime: "11 min" },
  { id: "12", bookingId: "WAIT-012", customerName: "Dylan James", phoneNumber: "+94 74 222 3333", driverName: "Janaka Dissanayake", vehicleNumber: "CAB-1596", location: "Nawala", arrivalTime: "01:45 PM", waitingTime: "5 min" },
  { id: "13", bookingId: "WAIT-013", customerName: "Madison Powell", phoneNumber: "+94 73 333 4444", driverName: "Kasun Jayawardena", vehicleNumber: "CAB-7531", location: "Rajagiriya", arrivalTime: "02:00 PM", waitingTime: "13 min" },
  { id: "14", bookingId: "WAIT-014", customerName: "Cameron Long", phoneNumber: "+94 72 444 5555", driverName: "Lakmal Gunasekara", vehicleNumber: "CAB-9876", location: "Borella", arrivalTime: "02:15 PM", waitingTime: "7 min" },
  { id: "15", bookingId: "WAIT-015", customerName: "Allison Hughes", phoneNumber: "+94 77 555 6666", driverName: "Malinga Perera", vehicleNumber: "CAB-3210", location: "Kotahena", arrivalTime: "02:30 PM", waitingTime: "10 min" },
  { id: "16", bookingId: "WAIT-016", customerName: "Trevor Price", phoneNumber: "+94 71 666 7777", driverName: "Oshadha Fernando", vehicleNumber: "CAB-9871", location: "Pettah", arrivalTime: "02:45 PM", waitingTime: "6 min" },
  { id: "17", bookingId: "WAIT-017", customerName: "Courtney Bennett", phoneNumber: "+94 76 777 8888", driverName: "Pradeep Kumara", vehicleNumber: "CAB-2109", location: "Kelaniya", arrivalTime: "03:00 PM", waitingTime: "14 min" },
  { id: "18", bookingId: "WAIT-018", customerName: "Seth Wood", phoneNumber: "+94 75 888 9999", driverName: "Ramesh Thilakarathne", vehicleNumber: "CAB-5432", location: "Wattala", arrivalTime: "03:15 PM", waitingTime: "8 min" },
  { id: "19", bookingId: "WAIT-019", customerName: "Paige Barnes", phoneNumber: "+94 74 999 0000", driverName: "Saman Wijesinghe", vehicleNumber: "CAB-8765", location: "Ja-Ela", arrivalTime: "03:30 PM", waitingTime: "12 min" },
  { id: "20", bookingId: "WAIT-020", customerName: "Cody Ross", phoneNumber: "+94 73 000 1111", driverName: "Nimal Perera", vehicleNumber: "CAB-1234", location: "Negombo", arrivalTime: "03:45 PM", waitingTime: "5 min" },
];

export default function WaitingForCustomer() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
  } = useDataTable<WaitingBooking>({
    initialData: mockWaitingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Waiting for Customer</h1>
          <p className="text-muted-foreground">Drivers waiting at pickup location</p>
        </div>
        <Badge className="text-lg px-4 py-2">{data.length} Waiting</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(navigate)}
        data={data}
        searchKey="customerName"
        searchPlaceholder="Search waiting bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
