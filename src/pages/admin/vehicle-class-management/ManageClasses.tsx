import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";

type VehicleClass = {
  id: string;
  className: string;
  classCode: string;
  showInApp: boolean;
  fareScheme: string;
  corporateFareScheme: string;
  roadTripFareScheme: string;
  appFareScheme: string;
  commission: string;
};

const mockClasses: VehicleClass[] = [
  { id: "1", className: "BTG VAN", classCode: "BTG VAN", showInApp: false, fareScheme: "BTG Demo", corporateFareScheme: "BTG Demo", roadTripFareScheme: "BTG APP", appFareScheme: "BTG APP", commission: "0" },
  { id: "2", className: "Double Cab", classCode: "Double Cab", showInApp: false, fareScheme: "STANDARD", corporateFareScheme: "STANDARD", roadTripFareScheme: "STANDARD", appFareScheme: "STANDARD", commission: "0" },
  { id: "3", className: "Mini Van", classCode: "Buddy", showInApp: false, fareScheme: "STANDARD", corporateFareScheme: "STANDARD", roadTripFareScheme: "STANDARD", appFareScheme: "STANDARD", commission: "0" },
  { id: "4", className: "ECONOMY", classCode: "ECON", showInApp: false, fareScheme: "BTG APP", corporateFareScheme: "BTG APP", roadTripFareScheme: "BTG APP", appFareScheme: "BTG APP", commission: "0" },
];

export default function ManageClasses() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<VehicleClass[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = classes.filter((vehicleClass) => {
    const search = searchTerm.toLowerCase();
    return (
      vehicleClass.className.toLowerCase().includes(search) ||
      vehicleClass.classCode.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Vehicle Classes</h1>
          <p className="text-muted-foreground mt-1">Configure vehicle classes and pricing tiers</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-classes/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          Create New Class
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Input
              placeholder="Search by class name or class code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Class Code</TableHead>
                  <TableHead>Show in App</TableHead>
                  <TableHead>Fare Scheme</TableHead>
                  <TableHead>Corporate Fare Scheme</TableHead>
                  <TableHead>RoadTrip Fare Scheme</TableHead>
                  <TableHead>App Fare Scheme</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No classes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((vehicleClass) => (
                    <TableRow key={vehicleClass.id}>
                      <TableCell className="font-medium">{vehicleClass.className}</TableCell>
                      <TableCell>{vehicleClass.classCode || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={vehicleClass.showInApp ? "default" : "secondary"}>
                          {vehicleClass.showInApp ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicleClass.fareScheme || "-"}</TableCell>
                      <TableCell>{vehicleClass.corporateFareScheme || "-"}</TableCell>
                      <TableCell>{vehicleClass.roadTripFareScheme || "-"}</TableCell>
                      <TableCell>{vehicleClass.appFareScheme || "-"}</TableCell>
                      <TableCell>{vehicleClass.commission}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/admin/vehicle-classes/edit/${vehicleClass.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => navigate(`/admin/vehicle-classes/delete/${vehicleClass.id}`)}
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
