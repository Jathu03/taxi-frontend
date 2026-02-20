import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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

interface VehicleCategory {
    id: string;
    categoryName: string;
    description: string;
    dateModified: string;
}

const mockCategories: VehicleCategory[] = [
    { id: "1", categoryName: "Economy", description: "Standard business travel", dateModified: "2/26/2024 8:23:59 PM" },
    { id: "2", categoryName: "Premium", description: "Executive travel", dateModified: "2/26/2024 8:23:59 PM" },
];

const columns = (
    navigate: ReturnType<typeof useNavigate>
): ColumnDef<VehicleCategory>[] => [
        { accessorKey: "categoryName", header: () => <span className="font-bold text-black">Category Name</span> },
        { accessorKey: "description", header: () => <span className="font-bold text-black">Description</span> },
        { accessorKey: "dateModified", header: () => <span className="font-bold text-black text-right block">Date Modified</span>, cell: ({ row }) => <div className="text-right">{row.original.dateModified}</div> },
        {
            id: "actions",
            header: () => <span className="text-right font-bold text-black block">Actions</span>,
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporate-vehicle-categories/edit/${category.id}`)}
                            className="text-blue-600 border-blue-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporate-vehicle-categories/delete/${category.id}`)}
                            className="text-red-600 border-red-200"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

export default function ManageCorporateVehicleCategories() {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState("");

    const {
        data,
        handleBulkDelete,
    } = useDataTable<VehicleCategory>({
        initialData: mockCategories,
    });

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (!filterText) return true;
            return item.categoryName.toLowerCase().includes(filterText.toLowerCase());
        });
    }, [data, filterText]);

    const handleReset = () => {
        setFilterText("");
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Vehicle Categories</h1>
                    <p className="text-muted-foreground mt-1">Manage vehicle classification for corporate bookings</p>
                </div>
                <Button
                    onClick={() => navigate("/admin/corporate-vehicle-categories/add")}
                    className="bg-[#6330B8] hover:bg-[#7C3AED]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-2">
                        <Label htmlFor="filter">Search Category</Label>
                        <Input
                            id="filter"
                            placeholder="Filter by category name..."
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
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
