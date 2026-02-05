"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Send, Trash, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/DeleteDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

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
  onDelete: (id: string) => void,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<TukPendingBooking>[] => [
  { accessorKey: "bookingNumber", header: "Booking #" },
  { accessorKey: "isAdvance", header: "Is Adv" },
  { accessorKey: "organization", header: "Organization" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "passengerNumber", header: "Passenger #" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "clientRemarks", header: "Client Remarks" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  { accessorKey: "bookedBy", header: "Booked By" },
  { accessorKey: "pickupTime", header: "Pickup Time" },
  { accessorKey: "pickupAddress", header: "Pickup Address" },
  { accessorKey: "dropAddress", header: "Drop Address" },
  { accessorKey: "vehicleClass", header: "Vehicle Class" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/admin/bookings/dispatch-vehicle', { state: { booking } })}>
              <Send className="mr-2 h-4 w-4" /> Dispatch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/bookings/add-new-booking', { state: { booking } })}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate('/admin/bookings/cancel-booking', { state: { booking } })}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const mockTukPendingBookings: TukPendingBooking[] = [
  { 
    id: "1", 
    bookingNumber: "TUK-295104", 
    isAdvance: "", 
    organization: "Tuk Services", 
    customer: "Ms. Nadeeka Silva (Ms. Nadeeka Silva )", 
    passengerNumber: "0776234567", 
    hireType: "On The Meter", 
    clientRemarks: "Short trip to nearby market", 
    bookingTime: "11/27/2025 15:58", 
    bookedBy: "insaaf", 
    pickupTime: "12/02/2025 08:00", 
    pickupAddress: "45 Temple Road, Kotte", 
    dropAddress: "Kotte Market", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "2", 
    bookingNumber: "TUK-295731", 
    isAdvance: "", 
    organization: "Quick Rides", 
    customer: "Ravi Fernando (Ravi Fernando )", 
    passengerNumber: "0779876543", 
    hireType: "On The Meter", 
    clientRemarks: "Pick from home to railway station", 
    bookingTime: "12/04/2025 08:20", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 20:45", 
    pickupAddress: "78 Galle Road, Dehiwala", 
    dropAddress: "Fort Railway Station", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "3", 
    bookingNumber: "TUK-295661", 
    isAdvance: "Yes", 
    organization: "City Tuk", 
    customer: "Mr. Perera (Mr. Perera )", 
    passengerNumber: "0771234589", 
    hireType: "Fixed Rate", 
    clientRemarks: "Hospital visit - Colombo General", 
    bookingTime: "12/03/2025 16:47", 
    bookedBy: "erandi", 
    pickupTime: "12/04/2025 21:00", 
    pickupAddress: "23 Ward Place, Colombo 7", 
    dropAddress: "Colombo General Hospital", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "4", 
    bookingNumber: "TUK-295733", 
    isAdvance: "", 
    organization: "Express Tuk", 
    customer: "Saman Kumar (Saman Kumar )", 
    passengerNumber: "0778658530", 
    hireType: "On The Meter", 
    clientRemarks: "Office to home", 
    bookingTime: "12/04/2025 08:24", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 22:30", 
    pickupAddress: "Union Place, Colombo 2", 
    dropAddress: "Rajagiriya", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "5", 
    bookingNumber: "TUK-295732", 
    isAdvance: "", 
    organization: "Tuk Express", 
    customer: "Kamala Dias (Kamala Dias )", 
    passengerNumber: "0773456789", 
    hireType: "On The Meter", 
    clientRemarks: "Quick trip to bank", 
    bookingTime: "12/04/2025 08:22", 
    bookedBy: "shamalka", 
    pickupTime: "12/05/2025 06:30", 
    pickupAddress: "Nugegoda Junction", 
    dropAddress: "Peoples Bank, High Level Road", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "6", 
    bookingNumber: "TUK-295654", 
    isAdvance: "", 
    organization: "Tuk Rides", 
    customer: "Priyantha Mendis (Priyantha Mendis )", 
    passengerNumber: "0774584724", 
    hireType: "On The Meter", 
    clientRemarks: "Bus stand to home", 
    bookingTime: "12/03/2025 14:44", 
    bookedBy: "erandi", 
    pickupTime: "12/05/2025 07:00", 
    pickupAddress: "Maharagama Bus Stand", 
    dropAddress: "Pannipitiya", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "7", 
    bookingNumber: "TUK-295650", 
    isAdvance: "Yes", 
    organization: "City Tuk Service", 
    customer: "Anjali Wickrama (Anjali Wickrama)", 
    passengerNumber: "0771234567", 
    hireType: "Fixed Rate", 
    clientRemarks: "Shopping mall trip", 
    bookingTime: "12/03/2025 10:30", 
    bookedBy: "admin", 
    pickupTime: "12/06/2025 05:00", 
    pickupAddress: "Borella Junction", 
    dropAddress: "Majestic City", 
    vehicleClass: "Tuk" 
  },
  { 
    id: "8", 
    bookingNumber: "TUK-295800", 
    isAdvance: "", 
    organization: "Walk-in Tuk", 
    customer: "Sunil Gunasekara (Sunil Gunasekara)", 
    passengerNumber: "0779876543", 
    hireType: "On The Meter", 
    clientRemarks: "Temple visit", 
    bookingTime: "12/04/2025 12:15", 
    bookedBy: "receptionist", 
    pickupTime: "12/04/2025 14:00", 
    pickupAddress: "Pelawatte", 
    dropAddress: "Kelaniya Temple", 
    vehicleClass: "Tuk" 
  }
];

export default function TukPendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<TukPendingBooking>({
    initialData: mockTukPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Tuk Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending tuk bookings awaiting assignment</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-yellow-600">{data.length} Pending</Badge>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, navigate)}
        data={data}
        searchKey="customer"
        searchPlaceholder="Search by customer name..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
          {
            key: "vehicleClass",
            label: "Vehicle Class",
            options: [
              { value: "Tuk", label: "Tuk" },
            ],
          },
          {
            key: "hireType",
            label: "Hire Type",
            options: [
              { value: "On The Meter", label: "On The Meter" },
              { value: "Fixed Rate", label: "Fixed Rate" },
            ],
          },
        ]}
      />
    </div>
  );
}
