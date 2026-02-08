import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Key, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

const mockUsers: User[] = [
  { id: "1", userName: "Dj", email: "judeferdinands585@gmail.com", firstName: "cj", lastName: "-", phoneNumber: "0726208396", role: "User" },
  { id: "2", userName: "0778508595", email: "0778508595@gmail.com", firstName: "Mohamed", lastName: "rifkhan", phoneNumber: "0778508595", role: "Driver" },
  { id: "3", userName: "0715892313", email: "0715892313@gmail.com", firstName: "Ranadinghe", lastName: "Arachchige Suresh Nilanka Chandana", phoneNumber: "0715892313", role: "Driver" },
];

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<User>[] => [
    { accessorKey: "userName", header: () => <span className="font-bold text-black">User Name</span> },
    { accessorKey: "email", header: () => <span className="font-bold text-black">Email</span> },
    { accessorKey: "firstName", header: () => <span className="font-bold text-black">First Name</span> },
    { accessorKey: "lastName", header: () => <span className="font-bold text-black">Last Name</span> },
    { accessorKey: "phoneNumber", header: () => <span className="font-bold text-black">Phone Number</span> },
    {
      accessorKey: "role",
      header: () => <span className="font-bold text-black">Role</span>,
      cell: ({ row }) => (
        row.original.role ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {row.original.role}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
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
              onClick={() => navigate(`/admin/users/edit/${user.id}`)}
              className="text-blue-600 border-blue-200"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/users/reset-password/${user.id}`)}
              className="text-orange-600 border-orange-200"
            >
              <Key className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/users/delete/${user.id}`)}
              className="text-red-600 border-red-200"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

export default function ManageUsers() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("phoneNumber");
  const [filterRole, setFilterRole] = useState("all");

  const {
    data,
    handleBulkDelete,
  } = useDataTable<User>({
    initialData: mockUsers,
  });

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      // Text Search
      if (filterText) {
        const value = user[filterBy as keyof User]?.toString().toLowerCase() || "";
        if (!value.includes(filterText.toLowerCase())) return false;
      }

      // Role Filter
      if (filterRole !== "all" && user.role !== filterRole) return false;

      return true;
    });
  }, [data, filterText, filterBy, filterRole]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("phoneNumber");
    setFilterRole("all");
  };

  const uniqueRoles = useMemo(() => [...new Set(data.filter(u => u.role).map(u => u.role))], [data]);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Users</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their access</p>
        </div>
        <Button
          onClick={() => navigate("/admin/users/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New User
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
                <SelectItem value="phoneNumber">Phone Number</SelectItem>
                <SelectItem value="userName">User Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterRole">Role</Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger id="filterRole">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
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
      />
    </div>
  );
}
