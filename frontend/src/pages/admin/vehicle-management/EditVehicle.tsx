"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Registration Information
    vehicleCode: "",
    registrationNo: "",
    chasisNo: "",
    regDate: "",
    
    // License Information
    revLicenceNo: "",
    revLicenceExpDate: "",
    
    // Passenger Information
    passengerCapacity: "",
    luggageCapacity: "",
    comments: "",
    
    // Manufacture Information
    manYear: "",
    manufacture: "",
    model: "",
    fuelType: "",
    
    // Insurance Information
    insurer: "",
    insuranceNo: "",
    insuranceExpDate: "",
    
    // Other Information
    owner: "",
    vehicleClass: "",
    fareScheme: "",
    company: "",
  });

  useEffect(() => {
    // Mock data based on vehicle ID - replace with actual API call
    const mockVehicles: Record<string, typeof formData> = {
      "1": {
        vehicleCode: "Ishan 15ft lorry",
        registrationNo: "LN-8978",
        chasisNo: "04664646440464644",
        regDate: "2025-12-03",
        revLicenceNo: "0464646464646",
        revLicenceExpDate: "2025-12-04",
        passengerCapacity: "0",
        luggageCapacity: "0",
        comments: "",
        manYear: "2015",
        manufacture: "Other",
        model: "Other",
        fuelType: "Patrol",
        insurer: "Arpico Insurance",
        insuranceNo: "42949904996098",
        insuranceExpDate: "2025-12-04",
        owner: "a.k.m ziyad",
        vehicleClass: "Lorry",
        fareScheme: "STANDARD",
        company: "OTHER",
      },
      "3": {
        vehicleCode: "3221 Fazly",
        registrationNo: "CAX-0036",
        chasisNo: "06646046466606049",
        regDate: "2025-11-30",
        revLicenceNo: "452345453434",
        revLicenceExpDate: "2025-12-04",
        passengerCapacity: "0",
        luggageCapacity: "0",
        comments: "",
        manYear: "2016",
        manufacture: "Suzuki",
        model: "Spacia",
        fuelType: "Hybrid",
        insurer: "Amana Takaful",
        insuranceNo: "41040646046046046460",
        insuranceExpDate: "2025-12-04",
        owner: "A M G Amarakoon",
        vehicleClass: "BUDGET",
        fareScheme: "Mileage Calculator",
        company: "OTHER",
      },
    };

    const vehicleData = mockVehicles[id || "1"] || mockVehicles["1"];
    setFormData(vehicleData);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Vehicle Updated Successfully",
      description: `${formData.vehicleCode} (${formData.registrationNo}) has been updated.`,
    });
    navigate("/admin/vehicles/manage");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Vehicle</h1>
          <p className="text-muted-foreground">Update vehicle information for {formData.registrationNo}</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/vehicles/manage")}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Registration Information */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleCode">Vehicle Code</Label>
                  <Input
                    id="vehicleCode"
                    value={formData.vehicleCode}
                    onChange={(e) => setFormData({ ...formData, vehicleCode: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNo">Registration #</Label>
                  <Input
                    id="registrationNo"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chasisNo">Chasis #</Label>
                  <Input
                    id="chasisNo"
                    value={formData.chasisNo}
                    onChange={(e) => setFormData({ ...formData, chasisNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regDate">Reg Date</Label>
                  <Input
                    id="regDate"
                    type="date"
                    value={formData.regDate}
                    onChange={(e) => setFormData({ ...formData, regDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revLicenceNo">Rev Licence #</Label>
                  <Input
                    id="revLicenceNo"
                    value={formData.revLicenceNo}
                    onChange={(e) => setFormData({ ...formData, revLicenceNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revLicenceExpDate">Rev Licence Exp Date</Label>
                  <Input
                    id="revLicenceExpDate"
                    type="date"
                    value={formData.revLicenceExpDate}
                    onChange={(e) => setFormData({ ...formData, revLicenceExpDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengerCapacity">Passenger Capacity</Label>
                  <Input
                    id="passengerCapacity"
                    type="number"
                    value={formData.passengerCapacity}
                    onChange={(e) => setFormData({ ...formData, passengerCapacity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="luggageCapacity">Luggage Capacity</Label>
                  <Input
                    id="luggageCapacity"
                    type="number"
                    value={formData.luggageCapacity}
                    onChange={(e) => setFormData({ ...formData, luggageCapacity: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Manufacture Information */}
          <Card>
            <CardHeader>
              <CardTitle>Manufacture Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manYear">Man Year</Label>
                  <Input
                    id="manYear"
                    type="number"
                    value={formData.manYear}
                    onChange={(e) => setFormData({ ...formData, manYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacture">Manufacture</Label>
                  <Select value={formData.manufacture} onValueChange={(value) => setFormData({ ...formData, manufacture: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Suzuki">Suzuki</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Mazda">Mazda</SelectItem>
                      <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Patrol">Patrol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurer">Insurer</Label>
                  <Input
                    id="insurer"
                    value={formData.insurer}
                    onChange={(e) => setFormData({ ...formData, insurer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNo">Insurance #</Label>
                  <Input
                    id="insuranceNo"
                    value={formData.insuranceNo}
                    onChange={(e) => setFormData({ ...formData, insuranceNo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceExpDate">Insurance Exp Date</Label>
                  <Input
                    id="insuranceExpDate"
                    type="date"
                    value={formData.insuranceExpDate}
                    onChange={(e) => setFormData({ ...formData, insuranceExpDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Information */}
          <Card>
            <CardHeader>
              <CardTitle>Other Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleClass">Class</Label>
                  <Select value={formData.vehicleClass} onValueChange={(value) => setFormData({ ...formData, vehicleClass: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LUXURY">LUXURY</SelectItem>
                      <SelectItem value="STANDARD">STANDARD</SelectItem>
                      <SelectItem value="ECONOMY">ECONOMY</SelectItem>
                      <SelectItem value="BUDGET">BUDGET</SelectItem>
                      <SelectItem value="VAN">VAN</SelectItem>
                      <SelectItem value="MINI VAN">MINI VAN</SelectItem>
                      <SelectItem value="BUS">BUS</SelectItem>
                      <SelectItem value="TUK">TUK</SelectItem>
                      <SelectItem value="Lorry">Lorry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fareScheme">Fare Scheme</Label>
                  <Select value={formData.fareScheme} onValueChange={(value) => setFormData({ ...formData, fareScheme: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fare scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">STANDARD</SelectItem>
                      <SelectItem value="Mileage Calculator">Mileage Calculator</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select value={formData.company} onValueChange={(value) => setFormData({ ...formData, company: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                      <SelectItem value="CASONS">CASONS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/vehicles/manage")}>
              Cancel
            </Button>
            <Button type="submit">Update Vehicle</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
