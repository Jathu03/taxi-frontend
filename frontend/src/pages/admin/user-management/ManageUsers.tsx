import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Key, RotateCcw, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Make sure these imports match your file structure created in the previous step
import { userService } from "@/services/user/userService";
import type { UserResponse} from "@/services/user/types";
import type { RoleResponse } from "@/services/role/types";

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */
const buildColumns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<UserResponse>[] => [
  {
    accessorKey: "username", // Must match the JSON key from Java (case-sensitive)
    header: () => <span className="font-bold text-black">User Name</span>,
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
  },
  {
    accessorKey: "firstName",
    header: () => <span className="font-bold text-black">First Name</span>,
  },
  {
    accessorKey: "lastName",
    header: () => <span className="font-bold text-black">Last Name</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span className="font-bold text-black">Phone Number</span>,
  },
  {
    accessorKey: "isActive",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge className="bg-green-50 text-green-700 border-green-200">
          Active
        </Badge>
      ) : (
        <Badge className="bg-red-50 text-red-700 border-red-200">
          Inactive
        </Badge>
      ),
  },
  {
    id: "roles",
    header: () => <span className="font-bold text-black">Roles</span>,
    cell: ({ row }) => {
      // Safely access roles array, default to empty if null
      const roles: RoleResponse[] = row.original.roles ?? [];
      return roles.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {roles.map((r) => (
            <Badge
              key={r.id}
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {r.roleName}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-right font-bold text-black block">Actions</span>
    ),
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
            onClick={() =>
              navigate(`/admin/users/reset-password/${user.id}`)
            }
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

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function ManageUsers() {
  const navigate = useNavigate();

  /* ---- API state ---- */
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* ---- Filter state ---- */
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("phoneNumber");
  const [filterRole, setFilterRole] = useState("all");

  /* ---- Fetch users from API ---- */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching users from API..."); // Debug log
      const data = await userService.getAll();
      console.log("Users fetched successfully:", data); // Debug log (Check this in browser console)

      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err); // Debug log for errors
      
      // Construct a readable error message
      const errorMessage = 
        err?.response?.data?.message || 
        err?.message || 
        "Failed to fetch users. Please check your connection.";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---- Derived: unique role names for the filter dropdown ---- */
  const uniqueRoles = useMemo(() => {
    // Safety check: ensure users is an array before mapping
    if (!Array.isArray(users)) return [];
    
    const names = users.flatMap((u) => (u.roles ?? []).map((r) => r.roleName));
    return [...new Set(names)];
  }, [users]);

  /* ---- Client-side filtering ---- */
  const filteredData = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((user) => {
      // Text search
      if (filterText) {
        const term = filterText.toLowerCase();

        if (filterBy === "roles") {
          const roleNames = (user.roles ?? [])
            .map((r) => r.roleName.toLowerCase())
            .join(" ");
          if (!roleNames.includes(term)) return false;
        } else {
          // Dynamic key access with null check
          const value = (user as any)[filterBy]?.toString().toLowerCase() ?? "";
          if (!value.includes(term)) return false;
        }
      }

      // Role dropdown filter
      if (filterRole !== "all") {
        const userRoles = user.roles ?? [];
        if (!userRoles.some((r) => r.roleName === filterRole))
          return false;
      }

      return true;
    });
  }, [users, filterText, filterBy, filterRole]);

  /* ---- Reset filters ---- */
  const handleReset = () => {
    setFilterText("");
    setFilterBy("phoneNumber");
    setFilterRole("all");
  };

  /* ---- Render ---- */
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their access
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/users/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New User
        </Button>
      </div>

      {/* Filters */}
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
                <SelectItem value="username">User Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="roles">Role</SelectItem>
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
                {uniqueRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
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

      {/* Table Area with Loading/Error/Empty states */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <span className="ml-3 text-lg text-muted-foreground">
            Loading users...
          </span>
        </div>
      ) : error ? (
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600 font-medium mb-4">Error: {error}</p>
          <Button onClick={fetchUsers} variant="outline" className="bg-white">
            <RotateCcw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </Card>
      ) : (
        <EnhancedDataTable
          columns={buildColumns(navigate)}
          data={filteredData}
          hideSearch
        />
      )}
    </div>
  );
}