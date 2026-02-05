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

export type TukCompletedHire = {
  id: string;
  bookingId: string;
  voucherNo: string;
  org: string;
  customer: string;
  passengerNo: string;
  hireType: string;
  bookingTime: string;
  bookedBy: string;
  pickupTime: string;
  pickupAddress: string;
  dispatchedTime: string;
  dispatchedBy: string;
  startTime: string;
  completedTime: string;
  totalDistance: string;
  totalFare: string;
  waitingTime: string;
  billedWaitTime: string;
  waitingFee: string;
  testBooking: string;
  driver: string;
  vehicle: string;
  fareScheme: string;
  isManualDispatch?: boolean;
  isManualComplete?: boolean;
};

const mockTukCompletedHires: TukCompletedHire[] = [
  {
    id: "1",
    bookingId: "270423",
    voucherNo: "",
    org: "Hilton Hotel",
    customer: "Minura Hilton Coordinetor (Minura Hilton Coordinetor )",
    passengerNo: "0773052522",
    hireType: "On The Meter",
    bookingTime: "12/29/2024 18:02",
    bookedBy: "Haroon",
    pickupTime: "12/29/2024 22:00",
    pickupAddress: "Hilton Hotel, Colombo,,Night Transport (Highlevel Road),Additional (14S),-- Highlevel road",
    dispatchedTime: "12/29/2024 21:10",
    dispatchedBy: "Pasindu Dinuranga",
    startTime: "",
    completedTime: "12/29/2025 23:28",
    totalDistance: "118.00",
    totalFare: "22770.00",
    waitingTime: "",
    billedWaitTime: "",
    waitingFee: "",
    testBooking: "",
    driver: "431 Parakrama",
    vehicle: "TUK-8771",
    fareScheme: "STANDARD",
  },
  {
    id: "2",
    bookingId: "270370",
    voucherNo: "",
    org: "CTC Special",
    customer: "Kasun Yasarathna (Kasun Yasarathna )",
    passengerNo: "0750341859",
    hireType: "On The Meter",
    bookingTime: "12/28/2024 12:48",
    bookedBy: "erandi",
    pickupTime: "12/28/2024 18:30",
    pickupAddress: "Pick From CTC Head Office (Kandy Route),--Drop to Kirillawala + Kandy,--1. Nishantha - 0714341732. 2.Kasun - 0750341859,--02pax",
    dispatchedTime: "12/28/2024 17:52",
    dispatchedBy: "Ashankhan Mohamed Haroon",
    startTime: "",
    completedTime: "12/28/2025 23:58",
    totalDistance: "270.00",
    totalFare: "42770.00",
    waitingTime: "",
    billedWaitTime: "",
    waitingFee: "",
    testBooking: "",
    driver: "4074 Rikaz",
    vehicle: "TUK-6381",
    fareScheme: "STANDARD",
  },
  {
    id: "3",
    bookingId: "270347",
    voucherNo: "",
    org: "Hilton Hotel",
    customer: "Minura Hilton Coordinetor (Minura Hilton Coordinetor )",
    passengerNo: "0773052522",
    hireType: "On The Meter",
    bookingTime: "12/27/2024 19:21",
    bookedBy: "shamalka",
    pickupTime: "12/27/2024 22:00",
    pickupAddress: "Hilton Hotel, Colombo,,Night Transport (Highlevel Road),Additional,-- Highlevel road",
    dispatchedTime: "12/27/2024 21:10",
    dispatchedBy: "Ashankhan Mohamed Haroon",
    startTime: "",
    completedTime: "12/27/2025 23:17",
    totalDistance: "118.00",
    totalFare: "22770.00",
    waitingTime: "",
    billedWaitTime: "",
    waitingFee: "",
    testBooking: "",
    driver: "Uresh 14s KDH",
    vehicle: "TUK-3188",
    fareScheme: "STANDARD",
  },
  {
    id: "4",
    bookingId: "295692",
    voucherNo: "",
    org: "",
    customer: "mohamed munafiq(ROADTRIP)",
    passengerNo: "0721908658",
    hireType: "On The Meter",
    bookingTime: "12/03/2025 22:03",
    bookedBy: "3196",
    pickupTime: "12/03/2025 22:03",
    pickupAddress: ",780 Maradana Rd, Colombo 01000,,",
    dispatchedTime: "12/03/2025 22:03",
    dispatchedBy: "",
    startTime: "12/03/2025 22:03",
    completedTime: "12/03/2025 23:27",
    totalDistance: "32.39",
    totalFare: "0.00",
    waitingTime: "12.51",
    billedWaitTime: "12.51",
    waitingFee: "0.00",
    testBooking: "",
    driver: "3196 Munafdeen",
    vehicle: "TUK-1281",
    fareScheme: "STANDARD",
  },
  {
    id: "5",
    bookingId: "295123",
    voucherNo: "",
    org: "Waters Edge",
    customer: "Mr. Perera-Watersedge (Mr. Perera-Watersedge )",
    passengerNo: "0773541193",
    hireType: "On The Meter",
    bookingTime: "11/27/2025 17:53",
    bookedBy: "Nirash",
    pickupTime: "11/27/2025 23:15",
    pickupAddress: ",316 Ethul Kotte Road, Battaramulla 10100,,",
    dispatchedTime: "11/27/2025 22:49",
    dispatchedBy: "Devinda Sudaraka",
    startTime: "",
    completedTime: "12/03/2025 10:01",
    totalDistance: "19.00",
    totalFare: "2509.52",
    waitingTime: "",
    billedWaitTime: "",
    waitingFee: "",
    testBooking: "",
    driver: "4133 Isran",
    vehicle: "TUK-8844",
    fareScheme: "Mileage Calculator",
  },
];

export default function TukCompletedHires() {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState("Phone");
  const [filterValue, setFilterValue] = useState("");
  const [agentFilter, setAgentFilter] = useState("All");
  const [hireTypeFilter, setHireTypeFilter] = useState("All");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("All");
  const [vehicleClassFilter, setVehicleClassFilter] = useState("All");
  const [fareSchemeFilter, setFareSchemeFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const columns = (): ColumnDef<TukCompletedHire>[] => [
    {
      accessorKey: "bookingId",
      header: "Booking",
      cell: ({ row }) => {
        const isManualDispatch = row.original.isManualDispatch;
        const isManualComplete = row.original.isManualComplete;
        return (
          <span
            className={
              isManualDispatch ? "bg-yellow-200 px-1" : isManualComplete ? "text-red-600" : ""
            }
          >
            {row.original.bookingId}
          </span>
        );
      },
    },
    { accessorKey: "voucherNo", header: "Voucher" },
    { accessorKey: "org", header: "Org" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "passengerNo", header: "Passenger" },
    { accessorKey: "hireType", header: "Hire Type" },
    { accessorKey: "bookingTime", header: "Booking Time" },
    { accessorKey: "bookedBy", header: "Booked By" },
    { accessorKey: "pickupTime", header: "Pickup Time" },
    { accessorKey: "pickupAddress", header: "Pickup Address" },
    { accessorKey: "dispatchedTime", header: "Dispatched Time" },
    { accessorKey: "dispatchedBy", header: "Dispatched By" },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "completedTime", header: "Completed Time" },
    { accessorKey: "totalDistance", header: "Total Distance" },
    {
      accessorKey: "totalFare",
      header: "Total Fare",
      cell: ({ row }) => `Rs.${parseFloat(row.original.totalFare).toLocaleString()}`,
    },
    { accessorKey: "waitingTime", header: "Waiting Time" },
    { accessorKey: "billedWaitTime", header: "Billed Wait Time" },
    { accessorKey: "waitingFee", header: "Waiting Fee" },
    { accessorKey: "testBooking", header: "Test Booking" },
    { accessorKey: "driver", header: "Driver" },
    { accessorKey: "vehicle", header: "Vehicle" },
    { accessorKey: "fareScheme", header: "Fare Scheme" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <Button
            variant="default"
            size="sm"
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            onClick={() => navigate(`/admin/tuk/review/${row.original.bookingId}`)}
          >
            Review Hire
          </Button>
        );
      },
    },
  ];

  const {
    data,
    handleBulkDelete,
  } = useDataTable<TukCompletedHire>({
    initialData: mockTukCompletedHires,
  });

  // Calculate finance summary
  const totalHireAmount = data.reduce((sum, hire) => sum + parseFloat(hire.totalFare || "0"), 0);
  const corporateDiscount = 11772019.21;
  const commissions = 25398090.77;
  const totalNetAmount = 555661501.52;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Completed Hires</h1>
          <p className="text-muted-foreground">View and review all completed bookings</p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Filter</Label>
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
              <Label>By Agent:</Label>
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Haroon">Haroon</SelectItem>
                  <SelectItem value="erandi">erandi</SelectItem>
                  <SelectItem value="shamalka">shamalka</SelectItem>
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
                  <SelectItem value="KIA Pickup">KIA Pickup</SelectItem>
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
              <Label>By ORG:</Label>
              <Select value={orgFilter} onValueChange={setOrgFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Hilton Hotel">Hilton Hotel</SelectItem>
                  <SelectItem value="Waters Edge">Waters Edge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Booking Type:</Label>
              <Select value={bookingTypeFilter} onValueChange={setBookingTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Vehicle Class:</Label>
              <Select value={vehicleClassFilter} onValueChange={setVehicleClassFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="VAN">VAN</SelectItem>
                  <SelectItem value="LUXURY">LUXURY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>By Fare Scheme:</Label>
              <Select value={fareSchemeFilter} onValueChange={setFareSchemeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="Mileage Calculator">Mileage Calculator</SelectItem>
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

      {/* Finance Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">Finance Summary (Excluding Test Booking)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Hire Amount:</span>
              <span className="ml-2">Rs.{totalHireAmount.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Corporate Discount Amount:</span>
              <span className="ml-2">Rs.{corporateDiscount.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Commissions:</span>
              <span className="ml-2">Rs.{commissions.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Total Net Amount:</span>
              <span className="ml-2">Rs.{totalNetAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <span className="bg-yellow-200 px-2 py-1 rounded">Items highlighted are Manually Dispatched</span>
        <span className="text-red-600 font-semibold">Items with red text are Manually Completed</span>
      </div>

      {/* Data Table */}
      <EnhancedDataTable
        columns={columns()}
        data={data}
        searchKey="customer"
        searchPlaceholder="Search completed hires..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}
