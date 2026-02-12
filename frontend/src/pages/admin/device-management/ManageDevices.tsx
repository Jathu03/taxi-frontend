import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, MoreHorizontal, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDataTable } from "@/hooks/useDataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Device {
  id: string;
  deviceName: string;
  imei: string;
  serialNumber: string;
  deviceType: string;
  status: "Active" | "Inactive" | "Maintenance";
  lastPing: string;
}

const mockDevices: Device[] = [
  { id: "1", deviceName: "MDVR-01", imei: "867530901234567", serialNumber: "SN1001", deviceType: "MDVR", status: "Active", lastPing: "2024-03-20 10:30:00" },
  { id: "2", deviceName: "Tracker-05", imei: "867530901234568", serialNumber: "SN1002", deviceType: "GPS Tracker", status: "Inactive", lastPing: "2024-03-19 15:45:00" },
  { id: "3", deviceName: "MDVR-02", imei: "867530901234569", serialNumber: "SN1003", deviceType: "MDVR", status: "Maintenance", lastPing: "2024-03-20 09:15:00" },
];

const columns = (
  navigate: ReturnType<typeof useNavigate>,
  onDelete: (id: string) => void
): ColumnDef<Device>[] => [
    { accessorKey: "deviceName", header: () => <span className="font-bold text-black">Device Name</span> },
    { accessorKey: "imei", header: () => <span className="font-bold text-black">IMEI</span> },
    { accessorKey: "serialNumber", header: () => <span className="font-bold text-black">Serial Number</span> },
    { accessorKey: "deviceType", header: () => <span className="font-bold text-black">Type</span> },
    {
      accessorKey: "status",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => {
        const status = row.original.status;
        const variants = {
          Active: "bg-green-100 text-green-700 border-green-200",
          Inactive: "bg-gray-100 text-gray-700 border-gray-200",
          Maintenance: "bg-orange-100 text-orange-700 border-orange-200",
        };
        return <Badge className={variants[status]}>{status}</Badge>;
      },
    },
    { accessorKey: "lastPing", header: () => <span className="font-bold text-black">Last Ping</span> },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const device = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate(`/admin/devices/edit/${device.id}`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(device.id)}
                  className="text-red-600 focus:text-red-700"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

export default function ManageDevices() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("deviceName");
  const [deviceType, setDeviceType] = useState("all");
  const [status, setStatus] = useState("all");

  const {
    data,
    handleBulkDelete,
    handleDelete,
  } = useDataTable<Device>({
    initialData: mockDevices,
  });

  const filteredData = useMemo(() => {
    return data.filter((device) => {
      // Search filter
      if (filterText) {
        const value = device[filterBy as keyof Device]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Select filters
      if (deviceType !== "all" && device.deviceType !== deviceType) return false;
      if (status !== "all" && device.status !== status) return false;

      return true;
    });
  }, [data, filterText, filterBy, deviceType, status]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("deviceName");
    setDeviceType("all");
    setStatus("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Device Management</h1>
          <p className="text-muted-foreground mt-1">Manage MDVRs and GPS trackers</p>
        </div>
        <Button onClick={() => navigate("/admin/devices/add")} className="bg-[#6330B8]">
          <Plus className="mr-2 h-4 w-4" /> Add Device
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
                <SelectItem value="deviceName">Device Name</SelectItem>
                <SelectItem value="imei">IMEI</SelectItem>
                <SelectItem value="serialNumber">Serial Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceType">Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger id="deviceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MDVR">MDVR</SelectItem>
                <SelectItem value="GPS Tracker">GPS Tracker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
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
        columns={columns(navigate, handleDelete)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
      />
    </div>
  );
}
