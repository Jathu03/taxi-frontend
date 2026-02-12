import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { useDataTable } from "@/hooks/useDataTable";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Driver {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  emergencyNumber: string;
  manualDispatch: boolean;
  blocked: boolean;
  lastLocation: string;
  appVersion: string;
}

const mockDrivers: Driver[] = [
  { id: "1", code: "Ishan 15ft lorry", firstName: "Ishan", lastName: "", nic: "", contactNumber: "0466464646", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "2", code: "Ishan Outside", firstName: "Ishan", lastName: "", nic: "5415xz1c56z1x", contactNumber: "0778024462", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "3", code: "3221 Fazly", firstName: "Fazly", lastName: "Farook", nic: "883290046v", contactNumber: "0779901001", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
];

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  toggleBlocked: (id: string) => void
): ColumnDef<Driver>[] => [
    { accessorKey: "code", header: () => <span className="font-bold text-black">Code</span> },
    { accessorKey: "firstName", header: () => <span className="font-bold text-black">First Name</span> },
    { accessorKey: "lastName", header: () => <span className="font-bold text-black">Last Name</span> },
    { accessorKey: "nic", header: () => <span className="font-bold text-black">NIC</span> },
    { accessorKey: "contactNumber", header: () => <span className="font-bold text-black">Contact</span> },
    {
      accessorKey: "manualDispatch",
      header: () => <span className="font-bold text-black text-center block">Manual Dispatch</span>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.manualDispatch ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : "-"}
        </div>
      )
    },
    {
      accessorKey: "blocked",
      header: () => <span className="font-bold text-black text-center block">Blocked</span>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.blocked ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </div>
      )
    },
    { accessorKey: "appVersion", header: () => <span className="font-bold text-black">App Ver.</span> },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleBlocked(driver.id)}
              className={driver.blocked ? "text-green-600 border-green-200" : "text-red-600 border-red-200"}
            >
              {driver.blocked ? "Unblock" : "Block"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/drivers/delete/${driver.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

export default function ManageDrivers() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("firstName");
  const [filterBlocked, setFilterBlocked] = useState("all");
  const [filterManualDispatch, setFilterManualDispatch] = useState("all");

  const {
    data,
    setData,
    handleBulkDelete,
  } = useDataTable<Driver>({
    initialData: mockDrivers,
  });

  const toggleBlocked = (id: string) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, blocked: !d.blocked } : d))
    );
  };

  const filteredData = useMemo(() => {
    return data.filter((driver) => {
      // Text Search
      if (filterText) {
        const value = driver[filterBy as keyof Driver]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Blocked Filter
      if (filterBlocked !== "all") {
        const isBlocked = filterBlocked === "true";
        if (driver.blocked !== isBlocked) return false;
      }

      // Manual Dispatch Filter
      if (filterManualDispatch !== "all") {
        const isManual = filterManualDispatch === "true";
        if (driver.manualDispatch !== isManual) return false;
      }

      return true;
    });
  }, [data, filterText, filterBy, filterBlocked, filterManualDispatch]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("firstName");
    setFilterBlocked("all");
    setFilterManualDispatch("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Drivers</h1>
          <p className="text-muted-foreground mt-1">View and manage all driver accounts</p>
        </div>
        <Button
          onClick={() => navigate("/admin/drivers/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Driver
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="code">Driver Code</SelectItem>
                <SelectItem value="contactNumber">Contact Number</SelectItem>
                <SelectItem value="nic">NIC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterBlocked">Blocked Status</Label>
            <Select value={filterBlocked} onValueChange={setFilterBlocked}>
              <SelectTrigger id="filterBlocked">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Blocked Only</SelectItem>
                <SelectItem value="false">Active Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterManual">Manual Dispatch</Label>
            <Select value={filterManualDispatch} onValueChange={setFilterManualDispatch}>
              <SelectTrigger id="filterManual">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
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

      <EnhancedDataTable
        columns={columns(navigate, toggleBlocked)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
}
