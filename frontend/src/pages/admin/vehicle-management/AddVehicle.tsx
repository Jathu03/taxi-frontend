"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Services
import vehicleService from "@/services/vehicles/vehicleService";
import makeService from "@/services/vehicle-make/makeService";
import modelService from "@/services/vehicle-model/modelService";
import classService from "@/services/vehicle-class/classService";
import ownerService from "@/services/vehicle-owner/ownerService";
import fareService from "@/services/fare-schemes/fareService";
import companyService from "@/services/vehicle-owner/companyService";
import insurerService from "@/services/insurer/insurerService";

import type { VehicleCreateRequest } from "@/services/vehicles/types";

export default function AddVehicle() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ================================
  // Form State
  // ================================
  const [formData, setFormData] = useState<VehicleCreateRequest>({
    vehicleCode: "",
    registrationNumber: "",
    chassisNumber: "",
    registrationDate: "",
    revenueLicenseNumber: "",
    revenueLicenseExpiryDate: "",
    passengerCapacity: 0,
    luggageCapacity: 0,
    comments: "",
    manufactureYear: new Date().getFullYear(),
    makeId: undefined,
    modelId: undefined,
    fuelType: "",
    insurerId: undefined,
    insuranceNumber: "",
    insuranceExpiryDate: "",
    ownerId: undefined,
    classId: undefined,
    companyId: undefined,
    fareSchemeId: undefined,
    isActive: true,
  });

  // ================================
  // Dropdown Data States
  // ================================
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [fareSchemes, setFareSchemes] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [insurers, setInsurers] = useState<any[]>([]);

  // ================================
  // Helper: Safely Extract Array
  // ================================
  const getSafeList = (response: any): any[] => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.content && Array.isArray(response.content))
      return response.content;
    if (response?.data?.content && Array.isArray(response.data.content))
      return response.data.content;
    return [];
  };

  // ================================
  // Fetch All Dropdown Data on Mount
  // ================================
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      
      // Fetch Makes
      try {
        const res = await makeService.getAllList();
        setMakes(getSafeList(res));
      } catch (err) { console.error("Failed to fetch makes", err); }

      // Fetch Classes
      try {
        const res = await classService.getActive();
        setClasses(getSafeList(res));
      } catch (err) { console.error("Failed to fetch classes", err); }

      // Fetch Owners
      try {
        const res = await ownerService.getAllActive();
        setOwners(getSafeList(res));
      } catch (err) { console.error("Failed to fetch owners", err); }

      // Fetch Fares
      try {
        const res = await fareService.getActive();
        // console.log("Fares fetched:", res); // Debug if needed
        setFareSchemes(getSafeList(res));
      } catch (err) { console.error("Failed to fetch fares", err); }

      // Fetch Companies
      try {
        const res = await companyService.getAllActive();
        setCompanies(getSafeList(res));
      } catch (err) { console.error("Failed to fetch companies", err); }

      // Fetch Insurers
      try {
        const res = await insurerService.getActive();
        setInsurers(getSafeList(res));
      } catch (err) { console.error("Failed to fetch insurers", err); }

      setIsLoading(false);
    };

    fetchDropdownData();
  }, []);

  // ================================
  // Fetch Models When Make Changes
  // ================================
  useEffect(() => {
    if (formData.makeId) {
      const fetchModels = async () => {
        try {
          const res = await modelService.getByMakeId(formData.makeId!);
          setModels(getSafeList(res));
        } catch (err) {
          console.error("Failed to fetch models", err);
          setModels([]);
        }
      };
      fetchModels();
    } else {
      setModels([]);
      setFormData((prev) => ({ ...prev, modelId: undefined }));
    }
  }, [formData.makeId]);

  // ================================
  // Generic Input Change Handler
  // ================================
  const handleInputChange = (field: keyof VehicleCreateRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ================================
  // Form Submission
  // ================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔵 Submit Button Clicked - Starting Validation...");

    // --- VALIDATION START ---
    if (!formData.vehicleCode || !formData.vehicleCode.trim()) {
      toast({ title: "Validation Error", description: "Vehicle Code is required", variant: "destructive" });
      return;
    }

    if (!formData.registrationNumber || !formData.registrationNumber.trim()) {
      toast({ title: "Validation Error", description: "Registration # is required", variant: "destructive" });
      return;
    }

    if (!formData.makeId) {
      toast({ title: "Validation Error", description: "Select a Manufacturer", variant: "destructive" });
      return;
    }

    if (!formData.classId) {
      toast({ title: "Validation Error", description: "Select a Vehicle Class", variant: "destructive" });
      return;
    }

    if (!formData.fuelType) {
      toast({ title: "Validation Error", description: "Select a Fuel Type", variant: "destructive" });
      return;
    }
    // --- VALIDATION PASSED ---

    setIsSubmitting(true);

    const payload: VehicleCreateRequest = {
      vehicleCode: formData.vehicleCode,
      registrationNumber: formData.registrationNumber,
      chassisNumber: formData.chassisNumber || undefined,
      registrationDate: formData.registrationDate || undefined,
      revenueLicenseNumber: formData.revenueLicenseNumber || undefined,
      revenueLicenseExpiryDate: formData.revenueLicenseExpiryDate || undefined,
      passengerCapacity: formData.passengerCapacity || 0,
      luggageCapacity: formData.luggageCapacity || 0,
      comments: formData.comments || undefined,
      manufactureYear: formData.manufactureYear || undefined,
      makeId: formData.makeId,
      modelId: formData.modelId || undefined,
      fuelType: formData.fuelType,
      insurerId: formData.insurerId || undefined,
      insuranceNumber: formData.insuranceNumber || undefined,
      insuranceExpiryDate: formData.insuranceExpiryDate || undefined,
      ownerId: formData.ownerId || undefined,
      classId: formData.classId,
      companyId: formData.companyId || undefined,
      fareSchemeId: formData.fareSchemeId || undefined,
      isActive: true,
    };

    try {
      const res = await vehicleService.create(payload);
      
      if (res.success) {
        toast({
          title: "Vehicle Added Successfully",
          description: `${formData.vehicleCode} has been created.`,
        });
        setTimeout(() => navigate("/admin/vehicles/manage"), 1000);
      } else {
        toast({
          title: "Failed",
          description: res.message || "Operation failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to connect to server";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6330B8]"></div>
        <span className="ml-3 text-lg font-medium text-gray-600">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6330B8]">Create a New Vehicle</h1>
          <p className="text-muted-foreground">Register a new vehicle in the system</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/vehicles/manage")} disabled={isSubmitting}>
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Registration Information */}
          <Card>
            <CardHeader><CardTitle>Registration Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Code *</Label>
                  <Input
                    value={formData.vehicleCode}
                    onChange={(e) => handleInputChange("vehicleCode", e.target.value)}
                    placeholder="eg: CAB-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration # *</Label>
                  <Input
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    placeholder="eg: WP-AAA-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chassis #</Label>
                  <Input
                    value={formData.chassisNumber}
                    onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reg Date</Label>
                  <Input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => handleInputChange("registrationDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader><CardTitle>License Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rev Licence #</Label>
                  <Input
                    value={formData.revenueLicenseNumber}
                    onChange={(e) => handleInputChange("revenueLicenseNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rev Licence Exp Date</Label>
                  <Input
                    type="date"
                    value={formData.revenueLicenseExpiryDate}
                    onChange={(e) => handleInputChange("revenueLicenseExpiryDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manufacture & Capacity */}
          <Card>
            <CardHeader><CardTitle>Manufacture & Capacity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Make */}
                <div className="space-y-2">
                  <Label>Manufacturer *</Label>
                  <Select
                    value={formData.makeId?.toString() ?? ""}
                    onValueChange={(val) => {
                      handleInputChange("makeId", Number(val));
                      handleInputChange("modelId", undefined);
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger>
                    <SelectContent>
                      {makes.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.manufacturer || item.makeName || item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={formData.modelId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("modelId", Number(val))}
                    disabled={!formData.makeId}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                    <SelectContent>
                      {models.length === 0 ? (
                        <SelectItem value="none" disabled>No models available</SelectItem>
                      ) : (
                        models.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.model || item.modelName || item.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Man Year */}
                <div className="space-y-2">
                  <Label>Man Year</Label>
                  <Input
                    type="number"
                    value={formData.manufactureYear}
                    onChange={(e) => handleInputChange("manufactureYear", Number(e.target.value))}
                  />
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label>Fuel Type *</Label>
                  <Select
                    value={formData.fuelType ?? ""}
                    onValueChange={(val) => handleInputChange("fuelType", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Fuel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Capacities */}
                <div className="space-y-2">
                  <Label>Passenger Capacity</Label>
                  <Input
                    type="number"
                    value={formData.passengerCapacity}
                    onChange={(e) => handleInputChange("passengerCapacity", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Luggage Capacity</Label>
                  <Input
                    type="number"
                    value={formData.luggageCapacity}
                    onChange={(e) => handleInputChange("luggageCapacity", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance & Ownership */}
          <Card>
            <CardHeader><CardTitle>Insurance & Ownership</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insurer */}
                <div className="space-y-2">
                  <Label>Insurer</Label>
                  <Select
                    value={formData.insurerId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("insurerId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Insurer" /></SelectTrigger>
                    <SelectContent>
                      {insurers.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.insurerName || item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Insurance Details */}
                <div className="space-y-2">
                  <Label>Insurance #</Label>
                  <Input
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Insurance Exp Date</Label>
                  <Input
                    type="date"
                    value={formData.insuranceExpiryDate}
                    onChange={(e) => handleInputChange("insuranceExpiryDate", e.target.value)}
                  />
                </div>

                {/* Owner */}
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Select
                    value={formData.ownerId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("ownerId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Owner" /></SelectTrigger>
                    <SelectContent>
                      {owners.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.ownerName || item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select
                    value={formData.classId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("classId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.className || item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Select
                    value={formData.companyId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("companyId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                    <SelectContent>
                      {companies.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.companyName || item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fare Scheme - FIXED HERE */}
                <div className="space-y-2">
                  <Label>Fare Scheme</Label>
                  <Select
                    value={formData.fareSchemeId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("fareSchemeId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Scheme" /></SelectTrigger>
                    <SelectContent>
                      {fareSchemes.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {/* Updated to use actual API property names */}
                          {item.fareName || item.fareCode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) => handleInputChange("comments", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/vehicles/manage")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6330B8] hover:bg-[#5428a0]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}