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

interface Corporate {
    id: string;
    name: string;
    code: string;
    address: string;
    phone: string;
    dateModified: string;
}

const mockCorporates: Corporate[] = [
    { id: "1", name: "PGIE", code: "PGIE", address: "Kotte", phone: "0112818111", dateModified: "2/26/2024 8:23:59 PM" },
    { id: "2", name: "Inbay", code: "INBAY", address: "Dehiwala", phone: "0112717111", dateModified: "2/26/2024 8:23:59 PM" },
];

const columns = (
    navigate: ReturnType<typeof useNavigate>
): ColumnDef<Corporate>[] => [
        { accessorKey: "name", header: () => <span className="font-bold text-black">Name</span> },
        { accessorKey: "code", header: () => <span className="font-bold text-black">Code</span> },
        { accessorKey: "address", header: () => <span className="font-bold text-black">Address</span> },
        { accessorKey: "phone", header: () => <span className="font-bold text-black">Phone</span> },
        { accessorKey: "dateModified", header: () => <span className="font-bold text-black text-right block">Date Modified</span>, cell: ({ row }) => <div className="text-right">{row.original.dateModified}</div> },
        {
            id: "actions",
            header: () => <span className="text-right font-bold text-black block">Actions</span>,
            cell: ({ row }) => {
                const corporate = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporates/edit/${corporate.id}`)}
                            className="text-blue-600 border-blue-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporates/delete/${corporate.id}`)}
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

export default function ManageCorporates() {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState("");
    const [filterBy, setFilterBy] = useState("name");

    const {
        data,
        handleBulkDelete,
    } = useDataTable<Corporate>({
        initialData: mockCorporates,
    });

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (!filterText) return true;
            const value = item[filterBy as keyof Corporate]?.toString().toLowerCase() || "";
            return value.includes(filterText.toLowerCase());
        });
    }, [data, filterText, filterBy]);

    const handleReset = () => {
        setFilterText("");
        setFilterBy("name");
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Management</h1>
                    <p className="text-muted-foreground mt-1">Manage corporate clients and organizations</p>
                </div>
                <Button
                    onClick={() => navigate("/admin/corporates/add")}
                    className="bg-[#6330B8] hover:bg-[#7C3AED]"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Corporate
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
                                <SelectItem value="code">Code</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
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
