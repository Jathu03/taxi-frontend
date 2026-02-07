import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface VehicleCategory {
  id: string;
  categoryName: string;
  enabled: boolean;
}

const mockVehicleCategories: VehicleCategory[] = [
  { id: "1", categoryName: "Bus", enabled: true },
  { id: "2", categoryName: "TUK", enabled: true },
  { id: "3", categoryName: "Mini Van", enabled: true },
  { id: "4", categoryName: "Lorry", enabled: true },
  { id: "5", categoryName: "Person", enabled: true },
  { id: "6", categoryName: "Budget", enabled: true },
  { id: "7", categoryName: "BTG VAN", enabled: true },
  { id: "8", categoryName: "Double Cab", enabled: true },
];

export default function ManageCorporateVehicleCategories() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleCategories, setVehicleCategories] = useState<VehicleCategory[]>(mockVehicleCategories);

  // Mock corporate name - in real app, fetch based on id
  const corporateName = id === "1" ? "Codezync PVT Ltd" : id === "2" ? "MILLENNIUM IT" : "Tech Solutions Lanka";

  const filteredCategories = vehicleCategories.filter((vc) =>
    vc.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEnabled = (categoryId: string) => {
    setVehicleCategories((prev) =>
      prev.map((vc) =>
        vc.id === categoryId ? { ...vc, enabled: !vc.enabled } : vc
      )
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/corporate/manage")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Vehicle Categories - {corporateName}</h1>
          <p className="text-muted-foreground mt-1">Configure vehicle categories for this corporate client</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vehicle Categories</CardTitle>
              <CardDescription>Showing all {filteredCategories.length} vehicle categories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Filter by category name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Category Name</TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                  <TableHead className="text-right font-bold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No vehicle categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.categoryName}</TableCell>
                      <TableCell>
                        <Badge variant={category.enabled ? "default" : "secondary"}>
                          {category.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => toggleEnabled(category.id)}
                          className={
                            category.enabled
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }
                        >
                          {category.enabled ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
