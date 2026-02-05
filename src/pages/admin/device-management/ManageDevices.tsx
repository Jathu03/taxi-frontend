"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/DeleteDialog";
import { EditDialog } from "@/components/EditDialog";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";

export type Device = {
  id: string;
  deviceId: string;
  deviceType: string;
  driverAssigned: string;
  vehicleAssigned: string;
  status: string;
  lastActive: string;
  installDate: string;
};

const createDialogFields = [
  {
    name: "deviceId" as keyof Device,
    label: "Device ID",
    type: "text" as const,
  },
  {
    name: "deviceType" as keyof Device,
    label: "Device Type",
    type: "select" as const,
    options: ["GPS Tracker", "Meter", "Tablet", "Phone"],
  },
  {
    name: "driverAssigned" as keyof Device,
    label: "Driver Assigned",
    type: "text" as const,
  },
  {
    name: "vehicleAssigned" as keyof Device,
    label: "Vehicle Assigned",
    type: "text" as const,
  },
  {
    name: "status" as keyof Device,
    label: "Status",
    type: "select" as const,
    options: ["Active", "Inactive", "Maintenance"],
  },
];

const columns = (
  onDelete: (id: string) => void,
  onEdit: (updated: Device) => void
): ColumnDef<Device>[] => [
  { accessorKey: "deviceId", header: "Device ID" },
  {
    accessorKey: "deviceType",
    header: "Device Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.deviceType}</Badge>,
  },
  { accessorKey: "driverAssigned", header: "Driver" },
  { accessorKey: "vehicleAssigned", header: "Vehicle" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "Active" ? "default" : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "lastActive", header: "Last Active" },
  { accessorKey: "installDate", header: "Install Date" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const device = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditDialog
              initialValues={device}
              onSubmit={onEdit}
              title={`Edit Device - ${device.deviceId}`}
              fields={createDialogFields}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuSeparator />
            <DeleteDialog
              title={`Delete Device ${device.deviceId}?`}
              description="This action cannot be undone."
              onConfirm={() => onDelete(device.id)}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const mockDevices: Device[] = [
  { id: "1", deviceId: "GPS-001", deviceType: "GPS Tracker", driverAssigned: "Nimal Perera", vehicleAssigned: "CAB-1234", status: "Active", lastActive: "2024-03-15 11:30 AM", installDate: "2024-01-10" },
  { id: "2", deviceId: "TAB-002", deviceType: "Tablet", driverAssigned: "Sunil Silva", vehicleAssigned: "CAB-5678", status: "Active", lastActive: "2024-03-15 11:25 AM", installDate: "2024-02-05" },
  { id: "3", deviceId: "GPS-003", deviceType: "GPS Tracker", driverAssigned: "Kamal Fernando", vehicleAssigned: "CAB-2468", status: "Active", lastActive: "2024-03-15 11:28 AM", installDate: "2024-01-15" },
  { id: "4", deviceId: "METER-004", deviceType: "Meter", driverAssigned: "Ajith Kumar", vehicleAssigned: "CAB-1357", status: "Active", lastActive: "2024-03-15 11:20 AM", installDate: "2024-02-01" },
  { id: "5", deviceId: "TAB-005", deviceType: "Tablet", driverAssigned: "Chaminda Dias", vehicleAssigned: "VAN-3456", status: "Active", lastActive: "2024-03-15 11:32 AM", installDate: "2024-01-20" },
  { id: "6", deviceId: "PHONE-006", deviceType: "Phone", driverAssigned: "Darshana Wickrama", vehicleAssigned: "CAB-7890", status: "Inactive", lastActive: "2024-03-10 05:15 PM", installDate: "2024-02-10" },
  { id: "7", deviceId: "GPS-007", deviceType: "GPS Tracker", driverAssigned: "Eranga Bandara", vehicleAssigned: "CAB-2345", status: "Active", lastActive: "2024-03-15 11:29 AM", installDate: "2024-01-25" },
  { id: "8", deviceId: "METER-008", deviceType: "Meter", driverAssigned: "Fawaz Mohomed", vehicleAssigned: "BUS-6789", status: "Active", lastActive: "2024-03-15 11:15 AM", installDate: "2024-02-15" },
  { id: "9", deviceId: "TAB-009", deviceType: "Tablet", driverAssigned: "Gayan Prasad", vehicleAssigned: "CAB-1357", status: "Maintenance", lastActive: "2024-03-12 02:30 PM", installDate: "2024-01-30" },
  { id: "10", deviceId: "GPS-010", deviceType: "GPS Tracker", driverAssigned: "Hasitha Gamage", vehicleAssigned: "CAB-4680", status: "Active", lastActive: "2024-03-15 11:31 AM", installDate: "2024-02-20" },
  { id: "11", deviceId: "PHONE-011", deviceType: "Phone", driverAssigned: "Indika Rathnayake", vehicleAssigned: "CAB-8024", status: "Active", lastActive: "2024-03-15 11:27 AM", installDate: "2024-01-05" },
  { id: "12", deviceId: "GPS-012", deviceType: "GPS Tracker", driverAssigned: "Janaka Dissanayake", vehicleAssigned: "MINIVAN-1596", status: "Active", lastActive: "2024-03-15 11:26 AM", installDate: "2024-02-25" },
  { id: "13", deviceId: "TAB-013", deviceType: "Tablet", driverAssigned: "Kasun Jayawardena", vehicleAssigned: "CAB-7531", status: "Active", lastActive: "2024-03-15 11:33 AM", installDate: "2024-01-18" },
  { id: "14", deviceId: "METER-014", deviceType: "Meter", driverAssigned: "Lakmal Gunasekara", vehicleAssigned: "CAB-9876", status: "Active", lastActive: "2024-03-15 11:22 AM", installDate: "2024-02-08" },
  { id: "15", deviceId: "GPS-015", deviceType: "GPS Tracker", driverAssigned: "Malinga Perera", vehicleAssigned: "CAB-3210", status: "Active", lastActive: "2024-03-15 11:34 AM", installDate: "2024-02-28" },
  { id: "16", deviceId: "PHONE-016", deviceType: "Phone", driverAssigned: "Nuwan Silva", vehicleAssigned: "TUK-6543", status: "Active", lastActive: "2024-03-15 11:18 AM", installDate: "2024-01-12" },
  { id: "17", deviceId: "TAB-017", deviceType: "Tablet", driverAssigned: "Oshadha Fernando", vehicleAssigned: "CAB-9871", status: "Active", lastActive: "2024-03-15 11:35 AM", installDate: "2024-02-18" },
  { id: "18", deviceId: "GPS-018", deviceType: "GPS Tracker", driverAssigned: "Pradeep Kumara", vehicleAssigned: "VAN-2109", status: "Active", lastActive: "2024-03-15 11:24 AM", installDate: "2024-01-28" },
  { id: "19", deviceId: "METER-019", deviceType: "Meter", driverAssigned: "Ramesh Thilakarathne", vehicleAssigned: "CAB-5432", status: "Active", lastActive: "2024-03-15 11:21 AM", installDate: "2024-02-12" },
  { id: "20", deviceId: "TAB-020", deviceType: "Tablet", driverAssigned: "Saman Wijesinghe", vehicleAssigned: "CAB-8765", status: "Active", lastActive: "2024-03-15 11:36 AM", installDate: "2024-03-01" },
];

export default function ManageDevices() {
  const navigate = useNavigate();
  const {
    data,
    handleBulkDelete,
    handleEdit,
    handleDelete,
  } = useDataTable<Device>({
    initialData: mockDevices,
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Devices</h1>
          <p className="text-muted-foreground mt-1">Track and manage GPS, meters, and tablets</p>
        </div>
        <Button
          onClick={() => navigate("/admin/devices/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          Create New Device
        </Button>
      </div>

      <EnhancedDataTable
        columns={columns(handleDelete, handleEdit)}
        data={data}
        searchKey="deviceId"
        searchPlaceholder="Search devices..."
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
        filters={[
          {
            key: "deviceType",
            label: "Device Type",
            options: [
              { value: "GPS Tracker", label: "GPS Tracker" },
              { value: "Meter", label: "Meter" },
              { value: "Tablet", label: "Tablet" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
              { value: "Maintenance", label: "Maintenance" },
            ],
          },
        ]}
      />
    </div>
  );
}
