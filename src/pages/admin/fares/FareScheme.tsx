import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FareScheme {
  id: string;
  schemeName: string;
  vehicleClass: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  waitingCharges: number;
  nightCharges: number;
  status: string;
}

export default function FareScheme() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [fares] = useState<FareScheme[]>([
    { id: "1", schemeName: "Standard Day Rate", vehicleClass: "STANDARD", baseFare: 300, perKmRate: 100, perMinuteRate: 5, waitingCharges: 50, nightCharges: 50, status: "Active" },
    { id: "2", schemeName: "Luxury Rate", vehicleClass: "LUXURY", baseFare: 500, perKmRate: 150, perMinuteRate: 8, waitingCharges: 80, nightCharges: 80, status: "Active" },
    { id: "3", schemeName: "Economy Rate", vehicleClass: "ECONOMY", baseFare: 200, perKmRate: 70, perMinuteRate: 3, waitingCharges: 30, nightCharges: 30, status: "Active" },
    { id: "4", schemeName: "TUK Day Rate", vehicleClass: "TUK", baseFare: 100, perKmRate: 50, perMinuteRate: 2, waitingCharges: 20, nightCharges: 25, status: "Active" },
    { id: "5", schemeName: "Standard Night Rate", vehicleClass: "STANDARD", baseFare: 350, perKmRate: 120, perMinuteRate: 6, waitingCharges: 60, nightCharges: 100, status: "Active" },
    { id: "6", schemeName: "Luxury Night Rate", vehicleClass: "LUXURY", baseFare: 600, perKmRate: 180, perMinuteRate: 10, waitingCharges: 100, nightCharges: 150, status: "Active" },
    { id: "7", schemeName: "Economy Night Rate", vehicleClass: "ECONOMY", baseFare: 250, perKmRate: 90, perMinuteRate: 4, waitingCharges: 40, nightCharges: 50, status: "Active" },
    { id: "8", schemeName: "TUK Night Rate", vehicleClass: "TUK", baseFare: 120, perKmRate: 60, perMinuteRate: 3, waitingCharges: 25, nightCharges: 40, status: "Active" },
    { id: "9", schemeName: "Weekend Special Standard", vehicleClass: "STANDARD", baseFare: 280, perKmRate: 95, perMinuteRate: 5, waitingCharges: 45, nightCharges: 45, status: "Active" },
    { id: "10", schemeName: "Weekend Special Luxury", vehicleClass: "LUXURY", baseFare: 480, perKmRate: 140, perMinuteRate: 7, waitingCharges: 75, nightCharges: 75, status: "Active" },
  ]);

  const filteredFares = fares.filter(
    (fare) =>
      fare.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fare.vehicleClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Fare Schemes</h1>
          <p className="text-muted-foreground mt-1">Configure pricing structures and fare calculations for different vehicle classes</p>
        </div>
        <Button
          onClick={() => navigate("/admin/fares/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Fare Scheme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fare Scheme List</CardTitle>
          <CardDescription>View and manage all fare schemes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by scheme name or vehicle class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scheme Name</TableHead>
                  <TableHead>Vehicle Class</TableHead>
                  <TableHead>Base Fare</TableHead>
                  <TableHead>Per KM</TableHead>
                  <TableHead>Per Min</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFares.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No fare schemes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFares.map((fare) => (
                    <TableRow key={fare.id}>
                      <TableCell className="font-medium">{fare.schemeName}</TableCell>
                      <TableCell>{fare.vehicleClass}</TableCell>
                      <TableCell>Rs. {fare.baseFare}</TableCell>
                      <TableCell>Rs. {fare.perKmRate}</TableCell>
                      <TableCell>Rs. {fare.perMinuteRate}</TableCell>
                      <TableCell>
                        <Badge variant={fare.status === "Active" ? "default" : "secondary"}>
                          {fare.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/fares/edit/${fare.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/fares/delete/${fare.id}`)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
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
