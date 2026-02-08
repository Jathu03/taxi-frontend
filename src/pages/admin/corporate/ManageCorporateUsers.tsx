import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, RotateCcw } from "lucide-react";
import { useDataTable } from "@/hooks/useDataTable";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
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

export type CorporateUser = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  division: string;
  costCenter: string;
  status: "Active" | "Inactive";
};

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<CorporateUser>[] => [
    { accessorKey: "name", header: () => <span className="font-bold text-black">Name</span> },
    { accessorKey: "mobile", header: () => <span className="font-bold text-black">Mobile</span> },
    { accessorKey: "email", header: () => <span className="font-bold text-black">Email</span> },
    { accessorKey: "address", header: () => <span className="font-bold text-black">Address</span> },
    { accessorKey: "division", header: () => <span className="font-bold text-black">Division</span> },
    { accessorKey: "costCenter", header: () => <span className="font-bold text-black">Cost Center</span> },
    {
      accessorKey: "status",
      header: () => <span className="font-bold text-black">Status</span>,
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-right font-bold text-black block">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/corporate/users/edit/${user.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/corporate/users/delete/${user.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

const mockCorporateUsers: CorporateUser[] = [
  { id: "1", name: "Jegath Fernando", mobile: "0771234567", email: "jegath@codezync.com", address: "123 Main St, Colombo", division: "IT", costCenter: "CC-001", status: "Active" },
  { id: "2", name: "Sajith Rupasinghe", mobile: "0777654321", email: "sajith@codezync.com", address: "456 Side St, Nugegoda", division: "Operations", costCenter: "CC-002", status: "Active" },
  { id: "3", name: "Mohammed Shukri", mobile: "0771112222", email: "shukri@codezync.com", address: "789 Lane, Dehiwala", division: "Finance", costCenter: "CC-003", status: "Inactive" },
];

export default function ManageCorporateUsers() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [status, setStatus] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<CorporateUser>({
    initialData: mockCorporateUsers,
  });

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      if (filterText) {
        const value = user[filterBy as keyof CorporateUser]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }
      if (status !== "all" && user.status !== status) return false;
      return true;
    });
  }, [data, filterText, filterBy, status]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("name");
    setStatus("all");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Users</h1>
          <p className="text-muted-foreground mt-1">Manage users authorized to book on corporate accounts</p>
        </div>
        <Button onClick={() => navigate("/admin/corporate/users/add")} className="bg-[#6330B8]">
          <Plus className="mr-2 h-4 w-4" /> Add User
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
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="division">Division</SelectItem>
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
        columns={columns(navigate)}
        data={filteredData}
        hideSearch
        enableBulkDelete
        onBulkDelete={handleBulkDelete}
        enableExport
        enableColumnVisibility
      />
    </div>
  );
}