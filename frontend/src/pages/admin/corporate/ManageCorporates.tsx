"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, RotateCcw } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { corporateService } from "@/services/corporate/corporateService";
import type { CorporateResponse } from "@/services/corporate/types";

const columns = (
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<CorporateResponse>[] => [
  {
    accessorKey: "name",
    header: () => <span className="font-bold text-black">Name</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "code",
    header: () => <span className="font-bold text-black">Code</span>,
  },
  {
    accessorKey: "primaryContact",
    header: () => (
      <span className="font-bold text-black">Primary Contact</span>
    ),
    cell: ({ row }) => <span>{row.original.primaryContact || "-"}</span>,
  },
  {
    accessorKey: "phone",
    header: () => <span className="font-bold text-black">Phone</span>,
  },
  {
    accessorKey: "email",
    header: () => <span className="font-bold text-black">Email</span>,
  },
  {
    accessorKey: "address",
    header: () => <span className="font-bold text-black">Address</span>,
    cell: ({ row }) => (
      <span
        className="max-w-[200px] truncate block"
        title={row.original.address}
      >
        {row.original.address || "-"}
      </span>
    ),
  },
  {
    accessorKey: "registrationDate",
    header: () => <span className="font-bold text-black">Date</span>,
    cell: ({ row }) => {
      const date = row.original.registrationDate;
      if (!date) return "-";
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return date;
      }
    },
  },
  {
    accessorKey: "billingType",
    header: () => (
      <span className="font-bold text-black">Billing Type</span>
    ),
    cell: ({ row }) => <span>{row.original.billingType || "-"}</span>,
  },
  {
    accessorKey: "cashDiscountRate",
    header: () => (
      <span className="font-bold text-black">Cash Discount</span>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.cashDiscountRate
          ? `${row.original.cashDiscountRate}%`
          : "0%"}
      </span>
    ),
  },
  {
    accessorKey: "creditDiscountRate",
    header: () => (
      <span className="font-bold text-black">Credit Discount</span>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.creditDiscountRate
          ? `${row.original.creditDiscountRate}%`
          : "0%"}
      </span>
    ),
  },
  {
    accessorKey: "enableQuickBooking",
    header: () => (
      <span className="font-bold text-black text-center block">
        Quick Booking
      </span>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.enableQuickBooking ? "Yes" : "No"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <span className="text-right font-bold text-black block">Actions</span>
    ),
    cell: ({ row }) => {
      const corporate = row.original;
      return (
        <div className="flex justify-end gap-1.5 flex-wrap min-w-[260px]">
          <Button
            size="sm"
            onClick={() =>
              navigate(`/admin/corporate/${corporate.id}/users`)
            }
            className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap h-8"
          >
            Users
          </Button>
          <Button
            size="sm"
            onClick={() =>
              navigate(`/admin/corporate/${corporate.id}/vehicle-classes`)
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white whitespace-nowrap h-8"
          >
            Classes
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/corporate/edit/${corporate.id}`)
            }
            className="text-blue-600 border-blue-200 h-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(`/admin/corporate/delete/${corporate.id}`)
            }
            className="text-red-600 border-red-200 h-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function ManageCorporates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterText, setFilterText] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [corporates, setCorporates] = useState<CorporateResponse[]>([]);

  useEffect(() => {
    const fetchCorporates = async () => {
      setLoading(true);
      try {
        const data = await corporateService.getAllCorporates();
        setCorporates(data);
      } catch (error) {
        console.error("Failed to fetch corporates:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCorporates();
  }, [toast]);

  const { handleBulkDelete } = useDataTable<CorporateResponse>({
    initialData: corporates,
  });

  const filteredData = useMemo(() => {
    return corporates.filter((item) => {
      if (!filterText) return true;
      const value =
        item[filterBy as keyof CorporateResponse]
          ?.toString()
          .toLowerCase() || "";
      return value.includes(filterText.toLowerCase());
    });
  }, [corporates, filterText, filterBy]);

  const handleReset = () => {
    setFilterText("");
    setFilterBy("name");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">
            Corporate Client Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage corporate clients and their configurations
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/corporate/add")}
          className="bg-[#6330B8] hover:bg-[#7C3AED]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Corporate
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
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="primaryContact">
                  Primary Contact
                </SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="billingType">Billing Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-lg text-muted-foreground">
            Loading corporate clients...
          </span>
        </div>
      ) : (
        <EnhancedDataTable
          columns={columns(navigate)}
          data={filteredData}
          hideSearch
          enableBulkDelete
          onBulkDelete={handleBulkDelete}
        />
      )}
    </div>
  );
}