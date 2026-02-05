import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

type VehicleModel = {
  id: string;
  manufacturer: string;
  model: string;
  modelCode: string;
  frame: string;
  transmissionType: string;
  trimLevel: string;
  fuelInjectionType: string;
  turbo: string;
  comments: string;
  dateModified: string;
};

const mockModels: VehicleModel[] = [
  { id: "1", manufacturer: "Honda", model: "Grace", modelCode: "Grace", frame: "Sedan", transmissionType: "Automatic", trimLevel: "L", fuelInjectionType: "L", turbo: "", comments: "-", dateModified: "2/26/2018 8:23:59 PM" },
  { id: "2", manufacturer: "Toyota", model: "Axio", modelCode: "Axio", frame: "Sedan", transmissionType: "Automatic", trimLevel: "l", fuelInjectionType: "l", turbo: "", comments: "", dateModified: "8/9/2016 11:24:15 AM" },
  { id: "3", manufacturer: "Audi", model: "Q7", modelCode: "Q7", frame: "", transmissionType: "", trimLevel: "", fuelInjectionType: "", turbo: "", comments: "", dateModified: "8/10/2016 1:21:46 AM" },
  { id: "4", manufacturer: "Suzuki", model: "Celerio", modelCode: "Celerio", frame: "Mini", transmissionType: "Manuel", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "", dateModified: "7/13/2016 8:53:08 AM" },
  { id: "5", manufacturer: "Suzuki", model: "Wagon R", modelCode: "Wagon R", frame: "ECON", transmissionType: "Automatic", trimLevel: "L", fuelInjectionType: "patrol", turbo: "", comments: "", dateModified: "10/22/2018 12:17:50 PM" },
  { id: "6", manufacturer: "Suzuki", model: "Alto", modelCode: "ALTO", frame: "Budget", transmissionType: "Manual", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "10/22/2018 12:19:36 PM" },
  { id: "7", manufacturer: "Nissan", model: "Clipper", modelCode: "CLIPPER", frame: "", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "7/18/2016 8:26:54 AM" },
  { id: "8", manufacturer: "Suzuki", model: "Every", modelCode: "EVERY", frame: "Mini", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "8/3/2016 3:00:53 PM" },
  { id: "9", manufacturer: "Honda", model: "Fit", modelCode: "FIT", frame: "", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "12/30/2017 11:12:14 AM" },
  { id: "10", manufacturer: "Toyota", model: "Corolla", modelCode: "COROLLA", frame: "", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "7/18/2016 8:30:39 AM" },
  { id: "11", manufacturer: "Toyota", model: "Prius", modelCode: "PRIUS", frame: "Sedan", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "8/9/2016 8:06:03 PM" },
  { id: "12", manufacturer: "Toyota", model: "Aqua", modelCode: "AQUA", frame: "", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "7/18/2016 8:32:11 AM" },
  { id: "13", manufacturer: "Nissan", model: "Caravan", modelCode: "CARAVAN", frame: "", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "-", dateModified: "8/9/2016 8:04:36 PM" },
  { id: "14", manufacturer: "Honda", model: "Fit shuttle", modelCode: "shuttle", frame: "Sedan", transmissionType: "Automatic", trimLevel: "", fuelInjectionType: "Petrol", turbo: "", comments: "", dateModified: "8/23/2017 10:48:40 AM" },
  { id: "15", manufacturer: "Toyota", model: "Fielder", modelCode: "Fielder", frame: "Sedan", transmissionType: "Automatic", trimLevel: "-", fuelInjectionType: "Patrol", turbo: "", comments: "", dateModified: "8/9/2016 9:14:58 PM" },
];

export default function ManageModels() {
  const navigate = useNavigate();
  const [models, setModels] = useState<VehicleModel[]>(mockModels);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = models.filter((model) => {
    const search = searchTerm.toLowerCase();
    return (
      model.manufacturer.toLowerCase().includes(search) ||
      model.model.toLowerCase().includes(search) ||
      model.modelCode.toLowerCase().includes(search) ||
      model.frame.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Vehicle Models</h1>
          <p className="text-muted-foreground mt-1">Configure vehicle models and specifications</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-models/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          Create New Model
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Input
              placeholder="Search by manufacturer, model, model code, or frame..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Model Code</TableHead>
                  <TableHead>Frame</TableHead>
                  <TableHead>Transmission Type</TableHead>
                  <TableHead>Trim Level</TableHead>
                  <TableHead>Fuel Injection Type</TableHead>
                  <TableHead>Turbo</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Date Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground">
                      No models found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.manufacturer}</TableCell>
                      <TableCell>{model.model}</TableCell>
                      <TableCell>{model.modelCode || "-"}</TableCell>
                      <TableCell>{model.frame || "-"}</TableCell>
                      <TableCell>{model.transmissionType || "-"}</TableCell>
                      <TableCell>{model.trimLevel || "-"}</TableCell>
                      <TableCell>{model.fuelInjectionType || "-"}</TableCell>
                      <TableCell>{model.turbo || "-"}</TableCell>
                      <TableCell>{model.comments || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{model.dateModified}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/admin/vehicle-models/edit/${model.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => navigate(`/admin/vehicle-models/delete/${model.id}`)}
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
