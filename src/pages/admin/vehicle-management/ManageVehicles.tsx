"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Vehicle = {
  id: string;
  registrationNo: string;
  code: string;
  vehicleClass: string;
  manufacture: string;
  model: string;
  insuranceExpiryDate: string;
  revenueLicenseExpDate: string;
};

const mockVehicles: Vehicle[] = [
  { id: "1", registrationNo: "LN-8978", code: "Ishan 15ft lorry", vehicleClass: "Lorry", manufacture: "Other", model: "Other", insuranceExpiryDate: "03 Dec 2025", revenueLicenseExpDate: "03 Dec 2025" },
  { id: "2", registrationNo: "PF-1652", code: "Ishan Outside", vehicleClass: "VAN", manufacture: "Toyota", model: "KDH", insuranceExpiryDate: "02 Dec 2025", revenueLicenseExpDate: "02 Dec 2025" },
  { id: "3", registrationNo: "CAX-0036", code: "3221 Fazly", vehicleClass: "BUDGET", manufacture: "Suzuki", model: "Spacia", insuranceExpiryDate: "01 Dec 2025", revenueLicenseExpDate: "01 Dec 2025" },
  { id: "4", registrationNo: "CBQ-3898", code: "3218 Wazeem", vehicleClass: "BUDGET", manufacture: "Suzuki", model: "Wagon R", insuranceExpiryDate: "01 Dec 2025", revenueLicenseExpDate: "01 Dec 2025" },
  { id: "5", registrationNo: "CAQ-8543", code: "Pick me 20", vehicleClass: "ECONOMY", manufacture: "Toyota", model: "Fielder", insuranceExpiryDate: "28 Nov 2025", revenueLicenseExpDate: "28 Nov 2025" },
  { id: "6", registrationNo: "CAP-6283", code: "Counter CAP-6283", vehicleClass: "STANDARD", manufacture: "Toyota", model: "Axio", insuranceExpiryDate: "27 Nov 2025", revenueLicenseExpDate: "27 Nov 2025" },
  { id: "7", registrationNo: "LQ 8224", code: "Wedage Lorry 001", vehicleClass: "Lorry", manufacture: "Other", model: "Other", insuranceExpiryDate: "26 Nov 2025", revenueLicenseExpDate: "26 Nov 2025" },
  { id: "8", registrationNo: "CAB-7662", code: "Ranil Outside", vehicleClass: "STANDARD", manufacture: "Toyota", model: "Axio", insuranceExpiryDate: "26 Nov 2025", revenueLicenseExpDate: "26 Nov 2025" },
  { id: "9", registrationNo: "CAN-4140", code: "3219 Vinoj", vehicleClass: "BUDGET", manufacture: "Suzuki", model: "Stingray", insuranceExpiryDate: "25 Nov 2025", revenueLicenseExpDate: "25 Nov 2025" },
];

export default function ManageVehicles() {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState("code");
  const [searchValue, setSearchValue] = useState("");
  const [vehicles, setVehicles] = useState(mockVehicles);

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchValue) return true;
    const value = vehicle[filterBy as keyof Vehicle]?.toString().toLowerCase() || "";
    return value.includes(searchValue.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Manage Vehicles</h1>
        <p className="text-muted-foreground mt-1">View and manage vehicle fleet inventory</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Section */}
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <Label>Filter By:</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Vehicle Code</SelectItem>
                  <SelectItem value="registrationNo">Registration No</SelectItem>
                  <SelectItem value="vehicleClass">Vehicle Class</SelectItem>
                  <SelectItem value="manufacture">Manufacture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration No</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Manufacture</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Insurance Expiry Date</TableHead>
                  <TableHead>Revenue License Exp Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.registrationNo}</TableCell>
                    <TableCell>{vehicle.code}</TableCell>
                    <TableCell>{vehicle.vehicleClass}</TableCell>
                    <TableCell>{vehicle.manufacture}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.insuranceExpiryDate}</TableCell>
                    <TableCell>{vehicle.revenueLicenseExpDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-blue-600"
                          onClick={() => navigate(`/admin/vehicles/edit/${vehicle.id}`)}
                        >
                          Edit
                        </Button>
                        <span className="text-muted-foreground">|</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-red-600"
                          onClick={() => navigate(`/admin/vehicles/delete/${vehicle.id}`)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
