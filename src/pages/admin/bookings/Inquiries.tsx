"use client";
import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreateDialog } from "@/components/CreateDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export type Inquiry = {
  id: string;
  inquiryNumber: string;
  org: string;
  customerName: string;
  passengerPhone: string;
  hireType: string;
  bookingTime: string;
  pickupAddress: string;
  vehicleClass: string;
  customerId: string;
};

const createDialogFields = [
  {
    name: "customerName" as keyof Inquiry,
    label: "Customer Name",
    type: "text" as const,
  },
  {
    name: "passengerPhone" as keyof Inquiry,
    label: "Contact Number",
    type: "text" as const,
  },
  {
    name: "org" as keyof Inquiry,
    label: "Organization",
    type: "select" as const,
    options: ["Casons Taxi Website", "Cash Hire"],
  },
  {
    name: "hireType" as keyof Inquiry,
    label: "Hire Type",
    type: "select" as const,
    options: ["On The Meter", "Special Package"],
  },
  {
    name: "pickupAddress" as keyof Inquiry,
    label: "Pickup Address",
    type: "text" as const,
  },
  {
    name: "vehicleClass" as keyof Inquiry,
    label: "Vehicle Class",
    type: "select" as const,
    options: ["VAN", "STANDARD", "LUXURY", "ECONOMY", "Bus"],
  },
];

const columns = (): ColumnDef<Inquiry>[] => [
  { accessorKey: "inquiryNumber", header: "Inquiry" },
  { accessorKey: "org", header: "Org" },
  { accessorKey: "customerName", header: "Customer" },
  { accessorKey: "passengerPhone", header: "Passenger" },
  { accessorKey: "hireType", header: "Hire Type" },
  { accessorKey: "bookingTime", header: "Booking Time" },
  { accessorKey: "pickupAddress", header: "Pickup Address" },
  { accessorKey: "vehicleClass", header: "Vehicle Class" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const inquiry = row.original;
      return (
        <Link to={`/admin/bookings/view/${inquiry.id}`}>
          <Button variant="link" className="text-blue-600">
            View Inquiry
          </Button>
        </Link>
      );
    },
  },
];

const mockInquiries: Inquiry[] = [
  { 
    id: "294980", 
    inquiryNumber: "294980",
    org: "Casons Taxi Website",
    customerName: "Janaka Walgama (Janaka Walgama)",
    passengerPhone: "0777319186",
    hireType: "On The Meter",
    bookingTime: "11/26/2025 11:42",
    pickupAddress: "237 Ja-ela - Ganemulla Rd, Ja-Ela",
    vehicleClass: "VAN",
    customerId: "39653"
  },
  { 
    id: "294702", 
    inquiryNumber: "294702",
    org: "Cash Hire",
    customerName: "Mr. Saman (Mr. Saman)",
    passengerPhone: "0760434520",
    hireType: "On The Meter",
    bookingTime: "11/23/2025 19:47",
    pickupAddress: "Colombo Fort, Colombo 01",
    vehicleClass: "STANDARD",
    customerId: "39650"
  },
  { 
    id: "291931", 
    inquiryNumber: "291931",
    org: "Cash Hire",
    customerName: "Ms.Nadeeka (Ms.Nadeeka)",
    passengerPhone: "0773945252",
    hireType: "On The Meter",
    bookingTime: "10/22/2025 15:41",
    pickupAddress: "WWF9+65Q, Mandavila Rd, Homagama",
    vehicleClass: "Bus",
    customerId: "39640"
  },
  { 
    id: "291699", 
    inquiryNumber: "291699",
    org: "",
    customerName: "Kumara (Kumara)",
    passengerPhone: "0704058783",
    hireType: "On The Meter",
    bookingTime: "10/19/2025 16:38",
    pickupAddress: "Unnamed Road, Balangoda",
    vehicleClass: "VAN",
    customerId: "39638"
  },
  { 
    id: "294851", 
    inquiryNumber: "294851",
    org: "Casons Taxi Website",
    customerName: "Priya Fernando (Priya Fernando)",
    passengerPhone: "0712345678",
    hireType: "Special Package",
    bookingTime: "11/28/2025 09:15",
    pickupAddress: "Galle Face Hotel, Colombo 03",
    vehicleClass: "LUXURY",
    customerId: "39700"
  },
  { 
    id: "294823", 
    inquiryNumber: "294823",
    org: "Cash Hire",
    customerName: "Roshan Silva (Roshan Silva)",
    passengerPhone: "0769876543",
    hireType: "On The Meter",
    bookingTime: "11/27/2025 14:30",
    pickupAddress: "Bandaranaike International Airport",
    vehicleClass: "STANDARD",
    customerId: "39695"
  },
  { 
    id: "294756", 
    inquiryNumber: "294756",
    org: "Casons Taxi Website",
    customerName: "Chaminda Perera (Chaminda Perera)",
    passengerPhone: "0754321098",
    hireType: "On The Meter",
    bookingTime: "11/25/2025 16:20",
    pickupAddress: "Mount Lavinia Beach Hotel",
    vehicleClass: "VAN",
    customerId: "39680"
  },
  { 
    id: "294689", 
    inquiryNumber: "294689",
    org: "Cash Hire",
    customerName: "Dilani Jayawardena (Dilani Jayawardena)",
    passengerPhone: "0778765432",
    hireType: "Special Package",
    bookingTime: "11/24/2025 10:00",
    pickupAddress: "Cinnamon Grand Hotel, Colombo",
    vehicleClass: "LUXURY",
    customerId: "39670"
  },
  { 
    id: "294612", 
    inquiryNumber: "294612",
    org: "Casons Taxi Website",
    customerName: "Anil Gunasekara (Anil Gunasekara)",
    passengerPhone: "0723456789",
    hireType: "On The Meter",
    bookingTime: "11/22/2025 08:45",
    pickupAddress: "Negombo Beach, Negombo",
    vehicleClass: "STANDARD",
    customerId: "39655"
  },
  { 
    id: "294543", 
    inquiryNumber: "294543",
    org: "Cash Hire",
    customerName: "Thilini Rajapaksa (Thilini Rajapaksa)",
    passengerPhone: "0765432109",
    hireType: "On The Meter",
    bookingTime: "11/21/2025 13:30",
    pickupAddress: "Kandy City Center",
    vehicleClass: "VAN",
    customerId: "39645"
  },
  { 
    id: "294478", 
    inquiryNumber: "294478",
    org: "Casons Taxi Website",
    customerName: "Sunil Wickramasinghe (Sunil Wickramasinghe)",
    passengerPhone: "0719876543",
    hireType: "Special Package",
    bookingTime: "11/20/2025 11:00",
    pickupAddress: "Galle Fort, Galle",
    vehicleClass: "Bus",
    customerId: "39635"
  },
  { 
    id: "294401", 
    inquiryNumber: "294401",
    org: "Cash Hire",
    customerName: "Malini Samaraweera (Malini Samaraweera)",
    passengerPhone: "0787654321",
    hireType: "On The Meter",
    bookingTime: "11/19/2025 15:45",
    pickupAddress: "Anuradhapura Ancient City",
    vehicleClass: "STANDARD",
    customerId: "39625"
  },
  { 
    id: "294334", 
    inquiryNumber: "294334",
    org: "Casons Taxi Website",
    customerName: "Kasun Bandara (Kasun Bandara)",
    passengerPhone: "0734567890",
    hireType: "On The Meter",
    bookingTime: "11/18/2025 12:20",
    pickupAddress: "Ella Railway Station",
    vehicleClass: "VAN",
    customerId: "39615"
  },
  { 
    id: "294267", 
    inquiryNumber: "294267",
    org: "Cash Hire",
    customerName: "Nimali De Silva (Nimali De Silva)",
    passengerPhone: "0776543210",
    hireType: "Special Package",
    bookingTime: "11/17/2025 09:30",
    pickupAddress: "Nuwara Eliya Grand Hotel",
    vehicleClass: "LUXURY",
    customerId: "39605"
  },
  { 
    id: "294195", 
    inquiryNumber: "294195",
    org: "Casons Taxi Website",
    customerName: "Tharaka Mendis (Tharaka Mendis)",
    passengerPhone: "0745678901",
    hireType: "On The Meter",
    bookingTime: "11/16/2025 14:15",
    pickupAddress: "Trincomalee Beach Resort",
    vehicleClass: "STANDARD",
    customerId: "39595"
  },
  { 
    id: "294128", 
    inquiryNumber: "294128",
    org: "Cash Hire",
    customerName: "Sanduni Wijesinghe (Sanduni Wijesinghe)",
    passengerPhone: "0785432109",
    hireType: "On The Meter",
    bookingTime: "11/15/2025 10:50",
    pickupAddress: "Sigiriya Rock Fortress",
    vehicleClass: "VAN",
    customerId: "39585"
  },
];

export default function Inquiries() {
  const [data, setData] = useState<Inquiry[]>(mockInquiries);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("phone");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [filterHireType, setFilterHireType] = useState("all");
  const [filterOrg, setFilterOrg] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = (values: Partial<Inquiry>) => {
    const newInquiry: Inquiry = {
      id: (Date.now()).toString(),
      inquiryNumber: (Date.now()).toString(),
      org: values.org ?? "",
      customerName: values.customerName ?? "",
      passengerPhone: values.passengerPhone ?? "",
      hireType: values.hireType ?? "",
      bookingTime: new Date().toLocaleString(),
      pickupAddress: values.pickupAddress ?? "",
      vehicleClass: values.vehicleClass ?? "",
      customerId: (Date.now() + 1000).toString(),
    };
    setData([...data, newInquiry]);
    setOpenCreateDialog(false);
  };

  const handleSearch = () => {
    // Filter logic can be implemented here
    console.log("Searching with filters:", { filterText, filterBy, filterAdmin, filterHireType, filterOrg, startDate, endDate });
  };

  const handleReset = () => {
    setFilterText("");
    setFilterBy("phone");
    setFilterAdmin("all");
    setFilterHireType("all");
    setFilterOrg("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Inquiries</h1>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Inquiry
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Filter Input */}
          <div className="space-y-2">
            <Label htmlFor="filter">Filter</Label>
            <Input
              id="filter"
              placeholder="Enter search term..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          {/* By Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="filterBy">By:</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger id="filterBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="inquiry">Inquiry Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* By Admin */}
          <div className="space-y-2">
            <Label htmlFor="filterAdmin">By Admin:</Label>
            <Select value={filterAdmin} onValueChange={setFilterAdmin}>
              <SelectTrigger id="filterAdmin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin1">Admin 1</SelectItem>
                <SelectItem value="admin2">Admin 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* By Hire Type */}
          <div className="space-y-2">
            <Label htmlFor="filterHireType">By Hire Type:</Label>
            <Select value={filterHireType} onValueChange={setFilterHireType}>
              <SelectTrigger id="filterHireType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="On The Meter">On The Meter</SelectItem>
                <SelectItem value="Special Package">Special Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* By ORG */}
          <div className="space-y-2">
            <Label htmlFor="filterOrg">By ORG:</Label>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger id="filterOrg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Casons Taxi Website">Casons Taxi Website</SelectItem>
                <SelectItem value="Cash Hire">Cash Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Go!
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </Card>

      <CreateDialog
        fields={createDialogFields}
        onSubmit={handleCreate}
        title="Add New Inquiry"
        description="Fill in the inquiry details below."
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        initialValues={{
          customerName: "",
          passengerPhone: "",
          org: "",
          hireType: "",
          pickupAddress: "",
          vehicleClass: "",
        }}
      />

      <EnhancedDataTable
        columns={columns()}
        data={data}
        searchPlaceholder="Filter..."
        enableExport
        enableColumnVisibility={false}
        hidePagination={false}
        filters={[
          {
            key: "hireType",
            label: "By Hire Type",
            options: [
              { value: "On The Meter", label: "On The Meter" },
              { value: "Special Package", label: "Special Package" },
            ],
          },
          {
            key: "org",
            label: "By ORG",
            options: [
              { value: "Casons Taxi Website", label: "Casons Taxi Website" },
              { value: "Cash Hire", label: "Cash Hire" },
            ],
          },
        ]}
      />
    </div>
  );
}
