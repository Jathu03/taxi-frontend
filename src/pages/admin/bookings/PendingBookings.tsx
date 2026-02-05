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

const mockPendingBookings: PendingBooking[] = [
  { 
    id: "1", 
    bookingNumber: "295104", 
    isAdvance: "", 
    organization: "PGIE", 
    customer: "Ms. Shiromi Herath (Ms. Shiromi Herath )", 
    passengerNumber: "0766117723", 
    hireType: "On The Meter", 
    clientRemarks: "(Hire Postpone) The Open University Sri Lanka, Nawala -- Club Waskaduwa and back", 
    bookingTime: "11/27/2025 15:58", 
    bookedBy: "insaaf", 
    pickupTime: "12/02/2025 08:00", 
    pickupAddress: "83 Liyanage Mawatha, Sri Jayawardenepura Kotte 11222", 
    dropAddress: "", 
    vehicleClass: "Bus" 
  },
  { 
    id: "2", 
    bookingNumber: "295731", 
    isAdvance: "", 
    organization: "Inbay", 
    customer: "Hameed (Hameed )", 
    passengerNumber: "0770383078", 
    hireType: "On The Meter", 
    clientRemarks: "Pick From 77, Yasodara Mawatha, Sri Saranankara Road, Kalubowila, Dehiwala - Drop To Inbay - Also Mr.Sudhesh - 0769795653 - 16B Clifford Pl, Bambalapitiya, Colombo 4", 
    bookingTime: "12/04/2025 08:20", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 20:45", 
    pickupAddress: "59/4 Rahula Rd, Dehiwala-Mount Lavinia", 
    dropAddress: "", 
    vehicleClass: "ECO" 
  },
  { 
    id: "3", 
    bookingNumber: "295661", 
    isAdvance: "", 
    organization: "Casons Taxi Website", 
    customer: "Mr.Chetan (Mr.Chetan )", 
    passengerNumber: "+919899297686", 
    hireType: "On The Meter", 
    clientRemarks: "Axio ---Airport (Flight No: 6E1173) ---Raddission Colombo (Need to collect 30% advance amount LKR: 14460/-)", 
    bookingTime: "12/03/2025 16:47", 
    bookedBy: "erandi", 
    pickupTime: "12/04/2025 21:00", 
    pickupAddress: "5VHP+FJM, Canada Friendship Road, Katunayake 11450", 
    dropAddress: "", 
    vehicleClass: "EX" 
  },
  { 
    id: "4", 
    bookingNumber: "295733", 
    isAdvance: "", 
    organization: "Inbay", 
    customer: "Dilshan (Dilshan )", 
    passengerNumber: "0778658530", 
    hireType: "On The Meter", 
    clientRemarks: "Pick From Inbay - Drop To No. 160, Shrubbery Garden Road, Colombo 04", 
    bookingTime: "12/04/2025 08:24", 
    bookedBy: "shamalka", 
    pickupTime: "12/04/2025 22:30", 
    pickupAddress: "", 
    dropAddress: "", 
    vehicleClass: "ECO" 
  },
  { 
    id: "5", 
    bookingNumber: "295732", 
    isAdvance: "", 
    organization: "Inbay", 
    customer: "Hameed (Hameed )", 
    passengerNumber: "0770383078", 
    hireType: "On The Meter", 
    clientRemarks: "Pick From Inbay - Drop To Dehiwala - Mr.Sudhesh - 0769795653 - Bambalapitiya", 
    bookingTime: "12/04/2025 08:22", 
    bookedBy: "shamalka", 
    pickupTime: "12/05/2025 06:30", 
    pickupAddress: "", 
    dropAddress: "", 
    vehicleClass: "ECO" 
  },
  { 
    id: "6", 
    bookingNumber: "295654", 
    isAdvance: "", 
    organization: "CTC Special", 
    customer: "Yeshitha Jayasinghe (Yeshitha Jayasinghe )", 
    passengerNumber: "0774584724", 
    hireType: "On The Meter", 
    clientRemarks: "8 Seater --- Ja ela --- Uma Garden Kandegedara, Mathugama & Back", 
    bookingTime: "12/03/2025 14:44", 
    bookedBy: "erandi", 
    pickupTime: "12/05/2025 07:00", 
    pickupAddress: "237 Ja-ela - Ganemulla Rd, Ja-Ela", 
    dropAddress: "", 
    vehicleClass: "Van" 
  },
  { 
    id: "7", 
    bookingNumber: "295650", 
    isAdvance: "Yes", 
    organization: "Corporate Services", 
    customer: "John Silva (John Silva)", 
    passengerNumber: "0771234567", 
    hireType: "Fixed Rate", 
    clientRemarks: "Airport pickup for VIP client", 
    bookingTime: "12/03/2025 10:30", 
    bookedBy: "admin", 
    pickupTime: "12/06/2025 05:00", 
    pickupAddress: "Bandaranaike International Airport", 
    dropAddress: "Cinnamon Grand Hotel, Colombo 03", 
    vehicleClass: "Luxury" 
  },
  { 
    id: "8", 
    bookingNumber: "295800", 
    isAdvance: "", 
    organization: "Walk-in Customer", 
    customer: "Priya Fernando (Priya Fernando)", 
    passengerNumber: "0779876543", 
    hireType: "On The Meter", 
    clientRemarks: "Hospital visit - Need clean vehicle", 
    bookingTime: "12/04/2025 12:15", 
    bookedBy: "receptionist", 
    pickupTime: "12/04/2025 14:00", 
    pickupAddress: "No 45, Galle Road, Wellawatta", 
    dropAddress: "National Hospital, Colombo 10", 
    vehicleClass: "Standard" 
  }
];

export default function PendingBookings() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<PendingBooking>({
    initialData: mockPendingBookings,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Pending Bookings</h1>
          <p className="text-muted-foreground mt-1">View and dispatch pending bookings awaiting assignment</p>
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
              { value: "Bus", label: "Bus" },
              { value: "Van", label: "Van" },
              { value: "ECO", label: "ECO" },
              { value: "EX", label: "EX" },
              { value: "Luxury", label: "Luxury" },
              { value: "Standard", label: "Standard" },
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
