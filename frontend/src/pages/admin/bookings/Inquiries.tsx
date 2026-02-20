"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreateDialog } from "@/components/CreateDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  inquiriesService,
  type Inquiry,
  type InquiryFilterParams,
} from "@/services/bookings/inquiriesService";
import { bookingService } from "@/services/bookings/bookingService";

export type InquiryTableRow = Inquiry & {
  resolvedVehicleClass: string;
};

const columns = (): ColumnDef<InquiryTableRow>[] => [
  { accessorKey: "inquiryNumber", header: () => <span className="font-bold text-black">Inquiry</span> },
  { accessorKey: "org", header: () => <span className="font-bold text-black">Org</span> },
  { accessorKey: "customerName", header: () => <span className="font-bold text-black">Customer</span> },
  { accessorKey: "passengerPhone", header: () => <span className="font-bold text-black">Passenger</span> },
  { accessorKey: "hireType", header: () => <span className="font-bold text-black">Hire Type</span> },
  {
    accessorKey: "bookingTime",
    header: () => <span className="font-bold text-black">Booking Time</span>,
    cell: ({ row }) => {
        const time = row.original.bookingTime;
        return time ? new Date(time).toLocaleString() : "N/A";
    }
  },
  { accessorKey: "pickupAddress", header: () => <span className="font-bold text-black">Pickup Address</span> },
  {
    accessorKey: "resolvedVehicleClass",
    header: () => <span className="font-bold text-black">Vehicle Class</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-slate-50 font-semibold border-slate-300 text-slate-700 whitespace-nowrap">
        {row.getValue("resolvedVehicleClass")}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Link to={`/admin/bookings/view/${row.original.id}`}>
          <Button variant="link" className="text-blue-600">View Inquiry</Button>
        </Link>
      </div>
    ),
  },
];

export default function Inquiries() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("passengerPhone");
  const [filterHireType, setFilterHireType] = useState("all");
  const [filterOrg, setFilterOrg] = useState("all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Inquiry[]>([]);
  const [vehicleMap, setVehicleMap] = useState<Record<number, { name: string; code: string }>>({});
  const [vehicleClassesLoading, setVehicleClassesLoading] = useState(false);

  // ─── 1. Fetch Vehicle Classes (Exact same as BookingList) ──────────────
  const fetchVehicleClasses = useCallback(async () => {
    setVehicleClassesLoading(true);
    try {
      const classesData = await bookingService.getVehicleClasses();
      if (Array.isArray(classesData)) {
        const vMap: Record<number, { name: string; code: string }> = {};
        classesData.forEach((vc: any) => {
          const name = vc.className || vc.class_name || vc.name || "Unknown";
          const code = vc.classCode || vc.class_code || vc.code || "";
          vMap[Number(vc.id)] = { name, code };
        });
        setVehicleMap(vMap);
      }
    } catch (err) {
      console.warn("Failed to load vehicle classes");
    } finally {
      setVehicleClassesLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicleClasses(); }, [fetchVehicleClasses]);

  // ─── 2. Fetch Inquiries ─────────────────────────────────────────────────────
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const inquiries = await inquiriesService.getInquiries({
        filterBy: filterText.trim() ? filterBy : undefined,
        searchTerm: filterText.trim() || undefined,
        hireType: filterHireType
      });
      setData(inquiries);
    } catch (error) {
      toast.error("Failed to fetch inquiries.");
    } finally {
      setLoading(false);
    }
  }, [filterText, filterBy, filterHireType]);

  useEffect(() => {
    const timer = setTimeout(fetchInquiries, 400);
    return () => clearTimeout(timer);
  }, [fetchInquiries]);

  // ─── 3. Transform Data (FIXED RESOLUTION) ────────────────────────────────────
  const tableData: InquiryTableRow[] = useMemo(() => {
    const sourceData = filterOrg === "all" ? data : data.filter((item) => item.org === filterOrg);
    
    return sourceData.map((inquiry) => {
      const vId = inquiry.vehicleClassId;
      
      // LOGIC: Check API Name, then check Local Map, then fallback to ID
      const resolvedName = 
        inquiry.vehicleClass || 
        vehicleMap[vId]?.name || 
        (vId > 0 ? `Class ID: ${vId}` : "N/A");

      return {
        ...inquiry,
        resolvedVehicleClass: resolvedName,
      };
    });
  }, [data, filterOrg, vehicleMap]);

  // ─── 4. Create Dialog Logic ─────────────────────────────────────────────────
  const createDialogFields = useMemo(() => {
    const options = Object.values(vehicleMap).map((v) => v.name);
    return [
      { name: "customerName" as keyof Inquiry, label: "Customer Name", type: "text" as const },
      { name: "passengerPhone" as keyof Inquiry, label: "Contact Number", type: "text" as const },
      { name: "org" as keyof Inquiry, label: "Organization", type: "select" as const, options: ["WEB", "Cash Hire", "MOBILE_APP"] },
      { name: "hireType" as keyof Inquiry, label: "Hire Type", type: "select" as const, options: ["On The Meter", "Special Package"] },
      { name: "pickupAddress" as keyof Inquiry, label: "Pickup Address", type: "text" as const },
      { name: "vehicleClass" as keyof Inquiry, label: "Vehicle Class", type: "select" as const, options: options.length > 0 ? options : ["Loading..."] },
    ];
  }, [vehicleMap]);

  const handleCreate = async (values: Partial<Inquiry>) => {
    try {
      const entry = Object.entries(vehicleMap).find(([_, v]) => v.name.toLowerCase() === values.vehicleClass?.toLowerCase());
      const vId = entry ? Number(entry[0]) : 0;
      await inquiriesService.createInquiry(values, vId);
      setOpenCreateDialog(false);
      toast.success("Inquiry created successfully.");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to create inquiry.");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Inquiries</h1>
          <p className="text-muted-foreground mt-1">View and manage customer ride inquiries</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setOpenCreateDialog(true)} disabled={vehicleClassesLoading}>
          {vehicleClassesLoading ? "Loading..." : "Add Inquiry"}
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Search</Label>
            <Input placeholder="Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Search By</Label>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="passengerPhone">Phone</SelectItem>
                <SelectItem value="customerName">Name</SelectItem>
                <SelectItem value="inquiryNumber">Inquiry No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hire Type</Label>
            <Select value={filterHireType} onValueChange={setFilterHireType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="On The Meter">On The Meter</SelectItem>
                <SelectItem value="Special Package">Special Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orgs</SelectItem>
                <SelectItem value="WEB">Website</SelectItem>
                <SelectItem value="MOBILE_APP">Mobile App</SelectItem>
                <SelectItem value="Cash Hire">Cash Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={() => { setFilterText(""); setFilterOrg("all"); }} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      <CreateDialog
        fields={createDialogFields}
        onSubmit={handleCreate}
        title="Add New Inquiry"
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        initialValues={{ customerName: "", passengerPhone: "", org: "Cash Hire", hireType: "On The Meter", pickupAddress: "", vehicleClass: "" }}
      />

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" /></div>
      ) : (
        <EnhancedDataTable columns={columns()} data={tableData} hideSearch enableExport enableColumnVisibility />
      )}
    </div>
  );
}