"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnhancedDataTable } from "@/components/DataTableLayout";
import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, UserX, AlertTriangle, SwitchCamera } from "lucide-react";
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
import type { CorporateVehicleClassResponse } from "@/services/corporate/types";

// 1. Row type
export type CorporateClassRow = {
  id: string | null;      // mapping ID (or null if not mapped yet)
  vehicleClassId: string; // MASTER ID (used for toggle)
  className: string;
  classCode: string;
  customRate?: number;
  status: "Enabled" | "Disabled";
};

// 2. Columns
const columns = (
  handleToggle: (masterId: number) => void
): ColumnDef<CorporateClassRow>[] => [
  {
    accessorKey: "className",
    header: () => <span className="font-bold text-black">Class Name</span>,
  },
  {
    accessorKey: "classCode",
    header: () => <span className="font-bold text-black">Code</span>,
  },
  {
    accessorKey: "customRate",
    header: () => <span className="font-bold text-black">Custom Rate</span>,
    cell: ({ row }) => (
      <span>{row.original.customRate != null ? row.original.customRate : "-"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-bold text-black">Status</span>,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.status === "Enabled"
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
    header: () => (
      <span className="text-right font-bold text-black block pr-4">Actions</span>
    ),
    cell: ({ row }) => {
      const cls = row.original;
      const masterId = Number(cls.vehicleClassId);
      
      return (
        <div className="flex justify-end gap-2 pr-2">
          <Button
            size="sm"
            variant="ghost"
            title={cls.status === "Enabled" ? "Disable" : "Enable"}
            onClick={() => handleToggle(masterId)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <SwitchCamera className="h-4 w-4 mr-1" />
            {cls.status === "Enabled" ? "Disable" : "Enable"}
          </Button>
        </div>
      );
    },
  },
];

export default function ManageCorporateVehicleClasses() {
  const navigate = useNavigate();
  const { id: corporateIdParam } = useParams<{ id: string }>();

  const [data, setData] = useState<CorporateClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState<keyof CorporateClassRow>("className");
  const [statusFilter, setStatusFilter] = useState<"all" | "Enabled" | "Disabled">("all");

  // Fetch logic
  const fetchClasses = useCallback(async () => {
    const corpId = Number(corporateIdParam);
    if (!corporateIdParam || isNaN(corpId)) {
      console.error("Invalid Corporate ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const classes = await corporateService.getCorporateVehicleClasses(corpId);

      const rows: CorporateClassRow[] = (classes || []).map((c: CorporateVehicleClassResponse) => ({
        id: c.id ? String(c.id) : null,
        vehicleClassId: String(c.vehicleClassId),
        className: c.className || "Unknown",
        classCode: c.classCode || "N/A",
        customRate: c.customRate ?? undefined,
        status: c.isEnabled ? "Enabled" : "Disabled",
      }));

      setData(rows);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load vehicle classes");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [corporateIdParam]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Toggle Action
  const handleToggle = async (masterId: number) => {
    const corpId = Number(corporateIdParam);
    if (!corporateIdParam || isNaN(corpId)) return;

    try {
      // Call backend with MASTER ID
      const updated = await corporateService.toggleCorporateVehicleClass(corpId, masterId);

      // Update state in place
      setData(prev => prev.map(row => {
        // Find row by Master ID (vehicleClassId) because ID might change from null -> number
        if (row.vehicleClassId === String(updated.vehicleClassId)) {
          return {
            ...row,
            id: String(updated.id), // Update mapping ID if it was null
            status: updated.isEnabled ? "Enabled" : "Disabled",
            customRate: updated.customRate ?? row.customRate
          };
        }
        return row;
      }));
      toast.success("Status updated");
    } catch (error: any) {
      console.error("Toggle failed", error);
      toast.error("Failed to update status");
    }
  };

  // Filters
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
    setFilterBy("className");
    setStatusFilter("all");
  };

  if (!corporateIdParam) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-screen bg-slate-50 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Corporate ID Missing</h2>
        <Button onClick={() => navigate("/admin/corporate/manage")}>Go to List</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Vehicle Classes</h1>
          <p className="text-muted-foreground mt-1">
            Managing classes for Corporate ID: <span className="font-bold text-black">{corporateIdParam}</span>
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <Card className="p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label>Search</Label>
          <Input placeholder="Search..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Filter By</Label>
          <Select value={filterBy} onValueChange={(val) => setFilterBy(val as keyof CorporateClassRow)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="className">Class Name</SelectItem>
              <SelectItem value="classCode">Code</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Enabled">Enabled</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="ghost" onClick={handleReset} className="w-full text-slate-500">
             <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#6330B8]" />
          <p>Loading...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="p-20 text-center border-dashed">
          <UserX className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p>No classes found.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <EnhancedDataTable columns={columns(handleToggle)} data={filteredData} hideSearch />
        </div>
      )}
    </div>
  );
}