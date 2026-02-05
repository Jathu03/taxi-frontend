"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/useDataTable";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export type CancelledHire = {
  id: string;
  bookingId: string;
  org: string;
  customer: string;
  passengerNo: string;
  hireType: string;
  bookingTime: string;
  testBooking: string;
  cancelledTime: string;
  cancelledType: string;
  cancelledAgent: string;
  driver: string;
  vehicle: string;
};

const mockCancelledHires: CancelledHire[] = [
  {
    id: "1",
    bookingId: "295747",
    org: "BCD Travels",
    customer: "BCD Travel ()",
    passengerNo: "0714788999",
    hireType: "On The Meter",
    bookingTime: "12/04/2025 14:53",
    testBooking: "",
    cancelledTime: "12/04/2025 15:33",
    cancelledType: "Base cancelled",
    cancelledAgent: "devinda95",
    driver: "",
    vehicle: "",
  },
  {
    id: "2",
    bookingId: "295732",
    org: "Inbay",
    customer: "Hameed ()",
    passengerNo: "0770383078",
    hireType: "On The Meter",
    bookingTime: "12/04/2025 08:22",
    testBooking: "",
    cancelledTime: "12/04/2025 14:38",
    cancelledType: "Base cancelled",
    cancelledAgent: "devinda95",
    driver: "",
    vehicle: "",
  },
  {
    id: "3",
    bookingId: "295731",
    org: "Inbay",
    customer: "Hameed ()",
    passengerNo: "0770383078",
    hireType: "On The Meter",
    bookingTime: "12/04/2025 08:20",
    testBooking: "",
    cancelledTime: "12/04/2025 14:36",
    cancelledType: "Base cancelled",
    cancelledAgent: "devinda95",
    driver: "",
    vehicle: "",
  },
  {
    id: "4",
    bookingId: "295725",
    org: "Special",
    customer: "Santhush ()",
    passengerNo: "+491722303724",
    hireType: "KIA Drop",
    bookingTime: "12/04/2025 03:50",
    testBooking: "",
    cancelledTime: "12/04/2025 05:33",
    cancelledType: "Base cancelled",
    cancelledAgent: "devinda95",
    driver: "",
    vehicle: "",
  },
  {
    id: "5",
    bookingId: "295691",
    org: "CTC Special",
    customer: "Mr. Samith ()",
    passengerNo: "0779312248",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 22:02",
    testBooking: "",
    cancelledTime: "12/03/2025 22:12",
    cancelledType: "Base cancelled",
    cancelledAgent: "devinda95",
    driver: "",
    vehicle: "",
  },
  {
    id: "6",
    bookingId: "295655",
    org: "BCD Travels",
    customer: "BCD Travel ()",
    passengerNo: "0714788999",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 14:45",
    testBooking: "",
    cancelledTime: "12/03/2025 18:57",
    cancelledType: "Base cancelled",
    cancelledAgent: "insaaf",
    driver: "",
    vehicle: "",
  },
  {
    id: "7",
    bookingId: "295650",
    org: "CTC Special",
    customer: "Vindika Srimal ()",
    passengerNo: "783335321",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 14:35",
    testBooking: "",
    cancelledTime: "12/03/2025 17:41",
    cancelledType: "Base cancelled",
    cancelledAgent: "erandi",
    driver: "",
    vehicle: "",
  },
  {
    id: "8",
    bookingId: "294743",
    org: "Casons Taxi Website",
    customer: "Ms.Abhimani ()",
    passengerNo: "0762200255",
    hireType: "On The Meter",
    bookingTime: "11/24/2025 13:04",
    testBooking: "",
    cancelledTime: "12/03/2025 14:56",
    cancelledType: "Base cancelled",
    cancelledAgent: "erandi",
    driver: "",
    vehicle: "",
  },
  {
    id: "9",
    bookingId: "295632",
    org: "BCD Travels",
    customer: "Base ()",
    passengerNo: "0714788999",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 10:42",
    testBooking: "",
    cancelledTime: "12/03/2025 14:42",
    cancelledType: "Base cancelled",
    cancelledAgent: "insaaf",
    driver: "",
    vehicle: "",
  },
  {
    id: "10",
    bookingId: "295642",
    org: "Central Bank",
    customer: "MS.NILANI ()",
    passengerNo: "0779828724",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 13:49",
    testBooking: "",
    cancelledTime: "12/03/2025 14:41",
    cancelledType: "Base cancelled",
    cancelledAgent: "erandi",
    driver: "3216 Naveen",
    vehicle: "CAZ-8699",
  },
  {
    id: "11",
    bookingId: "295631",
    org: "BCD Travels",
    customer: "BCD Travel ()",
    passengerNo: "0714788999",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 10:38",
    testBooking: "",
    cancelledTime: "12/03/2025 14:40",
    cancelledType: "Base cancelled",
    cancelledAgent: "insaaf",
    driver: "",
    vehicle: "",
  },
  {
    id: "12",
    bookingId: "295634",
    org: "BCD Travels",
    customer: "BCD Travel ()",
    passengerNo: "0714788999",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 11:10",
    testBooking: "",
    cancelledTime: "12/03/2025 14:40",
    cancelledType: "Base cancelled",
    cancelledAgent: "insaaf",
    driver: "",
    vehicle: "",
  },
  {
    id: "13",
    bookingId: "295629",
    org: "Central Bank",
    customer: "Mr.Pinto ()",
    passengerNo: "0727548609",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 08:10",
    testBooking: "",
    cancelledTime: "12/03/2025 09:45",
    cancelledType: "Base cancelled",
    cancelledAgent: "erandi",
    driver: "",
    vehicle: "",
  },
  {
    id: "14",
    bookingId: "295627",
    org: "Central Bank",
    customer: "Mr.Pinto ()",
    passengerNo: "0727548609",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 08:08",
    testBooking: "",
    cancelledTime: "12/03/2025 09:45",
    cancelledType: "Base cancelled",
    cancelledAgent: "erandi",
    driver: "",
    vehicle: "",
  },
];

export default function CancelledHires() {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState("Phone");
  const [filterValue, setFilterValue] = useState("");
  const [adminFilter, setAdminFilter] = useState("All");
  const [hireTypeFilter, setHireTypeFilter] = useState("All");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
  const [cancelledTypeFilter, setCancelledTypeFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const columns = (): ColumnDef<CancelledHire>[] => [
    { accessorKey: "bookingId", header: "Booking #" },
    { accessorKey: "org", header: "Org" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "passengerNo", header: "Passenger #" },
    { accessorKey: "hireType", header: "Hire Type" },
    { accessorKey: "bookingTime", header: "Booking Time" },
    { accessorKey: "testBooking", header: "Test Booking" },
    { accessorKey: "cancelledTime", header: "Cancelled Time" },
    { accessorKey: "cancelledType", header: "Cancelled Type" },
    { accessorKey: "cancelledAgent", header: "Cancelled Agent" },
    { accessorKey: "driver", header: "Driver" },
    { accessorKey: "vehicle", header: "Vehicle" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <Button
            variant="default"
            size="sm"
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            onClick={() => navigate(`/admin/bookings/view/${row.original.bookingId}`)}
          >
            View Hire
          </Button>
        );
      },
    },
  ];

  const {
    data,
    handleBulkDelete,
  } = useDataTable<CancelledHire>({
    initialData: mockCancelledHires,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cancelled Bookings</h1>
          <p className="text-muted-foreground">View all cancelled bookings</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Filter By:</Label>
              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="DriverCode">Driver Code</SelectItem>
                    <SelectItem value="PlateNumber">Plate Number</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>By Admin:</Label>
              <Select value={adminFilter} onValueChange={setAdminFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="devinda95">devinda95</SelectItem>
                  <SelectItem value="insaaf">insaaf</SelectItem>
                  <SelectItem value="erandi">erandi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Hire Type:</Label>
              <Select value={hireTypeFilter} onValueChange={setHireTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="On The Meter">On The Meter</SelectItem>
                  <SelectItem value="KIA Drop">KIA Drop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Payment Type:</Label>
              <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Cancelled Type:</Label>
              <Select value={cancelledTypeFilter} onValueChange={setCancelledTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Base cancelled">Base cancelled</SelectItem>
                  <SelectItem value="Driver cancelled">Driver cancelled</SelectItem>
                  <SelectItem value="Customer cancelled">Customer cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By ORG:</Label>
              <Select value={orgFilter} onValueChange={setOrgFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="BCD Travels">BCD Travels</SelectItem>
                  <SelectItem value="Central Bank">Central Bank</SelectItem>
                  <SelectItem value="CTC Special">CTC Special</SelectItem>
                  <SelectItem value="Inbay">Inbay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <EnhancedDataTable
        columns={columns()}
        data={data}
        searchKey="customer"
        searchPlaceholder="Search cancelled bookings..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
