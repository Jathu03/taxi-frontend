"use client";
import { useState, useMemo } from "react";
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
import { RotateCcw, Search } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";

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
  { accessorKey: "inquiryNumber", header: () => <span className="font-bold text-black">Inquiry</span> },
  { accessorKey: "org", header: () => <span className="font-bold text-black">Org</span> },
  { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "passengerPhone", header: () => <span className="font-bold text-black">Passenger</span> },
  { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
  { accessorKey: "bookingTime", header: () => <span className="font-bold text-black whitespace-nowrap">Booking Time</span> },
  { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
  { accessorKey: "vehicleClass", header: () => <span className="font-bold text-black">Vehicle Class</span> },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => {
      const inquiry = row.original;
      return (
        <div className="flex justify-end">
          <Link to={`/admin/bookings/view/${inquiry.id}`}>
            <Button variant="link" className="text-blue-600">
              View Inquiry
            </Button>
          </Link>
        </div>
      );
    },
  },
];

const mockInquiries: Inquiry[] = [
  { id: "294980", inquiryNumber: "294980", org: "Casons Taxi Website", customerName: "Janaka Walgama", passengerPhone: "0777319186", hireType: "On The Meter", bookingTime: "11/26/2025 11:42", pickupAddress: "237 Ja-ela Road", vehicleClass: "VAN", customerId: "39653" },
  { id: "294702", inquiryNumber: "294702", org: "Cash Hire", customerName: "Mr. Saman", passengerPhone: "0760434520", hireType: "On The Meter", bookingTime: "11/23/2025 19:47", pickupAddress: "Colombo Fort", vehicleClass: "STANDARD", customerId: "39650" },
];

export default function Inquiries() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("passengerPhone");
  const [filterHireType, setFilterHireType] = useState("all");
  const [filterOrg, setFilterOrg] = useState("all");

  const {
    data,
    setData,
    handleBulkDelete,
  } = useDataTable<Inquiry>({
    initialData: mockInquiries,
  });

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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search text filter
      if (filterText) {
        const value = item[filterBy as keyof Inquiry]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      // Hire Type filter
      if (filterHireType !== "all" && item.hireType !== filterHireType) return false;
      // Org filter
      if (filterOrg !== "all" && item.org !== filterOrg) return false;

      return true;
    });
  }, [data, filterText, filterBy, filterHireType, filterOrg]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("passengerPhone");
    setFilterHireType("all");
    setFilterOrg("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Inquiries</h1>
          <p className="text-muted-foreground mt-1">View and manage customer ride inquiries</p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpenCreateDialog(true)}
        >
          Add Inquiry
        </Button>
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
                <SelectItem value="passengerPhone">Phone</SelectItem>
                <SelectItem value="customerName">Name</SelectItem>
                <SelectItem value="inquiryNumber">Inquiry Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterHireType">Hire Type</Label>
            <Select value={filterHireType} onValueChange={setFilterHireType}>
              <SelectTrigger id="filterHireType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="On The Meter">On The Meter</SelectItem>
                <SelectItem value="Special Package">Special Package</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterOrg">Organization</Label>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger id="filterOrg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orgs</SelectItem>
                <SelectItem value="Casons Taxi Website">Casons Taxi Website</SelectItem>
                <SelectItem value="Cash Hire">Cash Hire</SelectItem>
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
        data={filteredData}
        hideSearch
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}