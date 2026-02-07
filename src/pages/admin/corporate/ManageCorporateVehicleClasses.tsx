import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface VehicleClass {
  id: string;
  className: string;
  enabled: boolean;
}

const mockVehicleClasses: VehicleClass[] = [
  { id: "1", className: "BUDGET", enabled: true },
  { id: "2", className: "ECONOMY", enabled: true },
  { id: "3", className: "STANDARD", enabled: true },
  { id: "4", className: "VAN", enabled: true },
  { id: "5", className: "LUXURY", enabled: true },
];

export default function ManageCorporateVehicleClasses() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>(mockVehicleClasses);

  // Mock corporate name - in real app, fetch based on id
  const corporateName = id === "1" ? "Codezync PVT Ltd" : id === "2" ? "MILLENNIUM IT" : "Tech Solutions Lanka";

  const filteredClasses = vehicleClasses.filter((vc) =>
    vc.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEnabled = (classId: string) => {
    setVehicleClasses((prev) =>
      prev.map((vc) =>
        vc.id === classId ? { ...vc, enabled: !vc.enabled } : vc
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
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Vehicle Classes - {corporateName}</h1>
          <p className="text-muted-foreground mt-1">Configure vehicle classes for this corporate client</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vehicle Classes</CardTitle>
              <CardDescription>Showing all {filteredClasses.length} vehicle classes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Filter by class name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Class Name</TableHead>
                  <TableHead className="font-bold text-black">Status</TableHead>
                  <TableHead className="text-right font-bold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No vehicle classes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((vehicleClass) => (
                    <TableRow key={vehicleClass.id}>
                      <TableCell className="font-medium">{vehicleClass.className}</TableCell>
                      <TableCell>
                        <Badge variant={vehicleClass.enabled ? "default" : "secondary"}>
                          {vehicleClass.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => toggleEnabled(vehicleClass.id)}
                          className={
                            vehicleClass.enabled
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }
                        >
                          {vehicleClass.enabled ? "Disable" : "Enable"}
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
