"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, RotateCcw, Loader2, UserX, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { corporateService } from "@/services/corporate/corporateService";

// 1. Table Row Definition
export type CorporateUserRow = {
  id: string;            // userId
  assignmentId: string;  // mapping record ID
  name: string;
  username: string;
  mobile: string;
  email: string;
  division: string;
  designation: string;
  status: "Active" | "Inactive";
  canBook: boolean;
  canViewReports: boolean;
};

// 2. Column Definitions
const columns = (
  navigate: ReturnType<typeof useNavigate>,
  handleDelete: (userId: number) => void,
  currentCorporateId: string | undefined
): ColumnDef<CorporateUserRow>[] => [
  { accessorKey: "name", header: () => <span className="font-bold text-black">Name</span> },
  { accessorKey: "username", header: () => <span className="font-bold text-black">Username</span> },
  { accessorKey: "email", header: () => <span className="font-bold text-black">Email</span> },
  { accessorKey: "division", header: () => <span className="font-bold text-black">Department</span> },
  { accessorKey: "designation", header: () => <span className="font-bold text-black">Designation</span> },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.status === "Active"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <span className="text-right font-bold text-black block pr-4">Actions</span>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-end gap-2 pr-2">
          <Button
            size="sm"
            variant="ghost"
            title="Edit Assignment"
            onClick={() =>
              navigate(`/admin/corporate/${currentCorporateId}/users/${user.id}/edit`, {
                state: {
                  assignment: {
                    userId: Number(user.id),
                    name: user.name,
                    username: user.username,
                    corporateId: currentCorporateId,
                    designation: user.designation,
                    department: user.division, // Maps 'division' back to 'department' for API
                    canBook: user.canBook,
                    canViewReports: user.canViewReports,
                    isActive: user.status === "Active",
                  },
                },
              })
            }
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Remove User"
            onClick={() => handleDelete(Number(user.id))}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function ManageCorporateUsers() {
  const navigate = useNavigate();
  
  // Match :corporateId in Routes.tsx
  const { corporateId } = useParams<{ corporateId: string }>();

  const [data, setData] = useState<CorporateUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<keyof CorporateUserRow>("name");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // 4. Fetch Logic
  const fetchCorporateUsers = useCallback(async () => {
    const id = Number(corporateId);

    if (!corporateId || isNaN(id)) {
      console.error("Invalid Corporate ID in URL:", corporateId);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const assignments = await corporateService.getCorporateUsers(id);

      if (!Array.isArray(assignments)) {
        console.error("Unexpected API response:", assignments);
        setData([]);
        return;
      }

      const rows: CorporateUserRow[] = assignments.map((a) => ({
        id: String(a.userId),
        assignmentId: String(a.id),
        name: `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.username || "Unknown",
        username: a.username || "N/A",
        mobile: a.phoneNumber || "N/A",
        email: a.email || "N/A",
        division: a.department || "N/A",
        designation: a.designation || "N/A",
        status: a.isActive ? "Active" : "Inactive",
        canBook: !!a.canBook,
        canViewReports: !!a.canViewReports,
      }));

      setData(rows);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load corporate users.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [corporateId]);

  useEffect(() => {
    fetchCorporateUsers();
  }, [fetchCorporateUsers]);

  // 6. Delete Action
  const handleDelete = async (userId: number) => {
    if (!window.confirm("Are you sure you want to remove this user from the corporate account?")) return;
    
    try {
      const id = Number(corporateId);
      await corporateService.removeUserFromCorporate(id, userId);
      toast.success("User removed successfully");
      fetchCorporateUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  // 7. Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!filterText.trim()) return true;
      const value = (item[filterBy] || "").toString().toLowerCase();
      return value.includes(filterText.toLowerCase());
    });
  }, [data, filterText, filterBy, statusFilter]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("name");
    setStatusFilter("all");
  };

  // 8. Guard: Missing ID
  if (!corporateId) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-screen bg-slate-50 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Corporate ID Missing</h2>
        <p className="text-slate-600 mb-4">
          Please select a corporate account from the list first.
        </p>
        <Button onClick={() => navigate("/admin/corporate/manage")}>
          Go to Corporate List
        </Button>
      </div>
    );
  }

  // 9. Main Render
  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Users</h1>
          <p className="text-muted-foreground mt-1">
            Managing users for Corporate ID:{" "}
            <span className="font-bold text-black">{corporateId}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            onClick={() => navigate(`/admin/corporate/${corporateId}/users/add`)}
            className="bg-[#6330B8] hover:bg-[#4c248f]"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      <Card className="p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label>Search</Label>
            <Input
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Filter By</Label>
            <Select
              value={filterBy}
              onValueChange={(val) => setFilterBy(val as keyof CorporateUserRow)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="division">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as "all" | "Active" | "Inactive")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" onClick={handleReset} className="w-full text-slate-500">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#6330B8]" />
          <p className="text-slate-500 animate-pulse">Loading users...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="p-20 text-center flex flex-col items-center border-dashed">
          <UserX className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Users Found</h3>
          <p className="text-slate-500">
            No users assigned to this corporate yet.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate(`/admin/corporate/${corporateId}/users/add`)}
          >
            Assign your first user
          </Button>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <EnhancedDataTable
            columns={columns(navigate, handleDelete, corporateId)}
            data={filteredData}
            hideSearch
          />
        </div>
      )}
    </div>
  );
}