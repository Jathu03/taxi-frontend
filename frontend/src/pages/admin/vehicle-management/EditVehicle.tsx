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
import { Loader2 } from "lucide-react";

// Services
import vehicleService from "@/services/vehicles/vehicleService";
import makeService from "@/services/vehicle-make/makeService";
import modelService from "@/services/vehicle-model/modelService";
import classService from "@/services/vehicle-class/classService";
import ownerService from "@/services/vehicle-owner/ownerService";
import fareService from "@/services/fare-schemes/fareService";
import companyService from "@/services/vehicle-owner/companyService";
import insurerService from "@/services/insurer/insurerService";

import type { VehicleUpdateRequest } from "@/services/vehicles/types";

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<VehicleUpdateRequest>({
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

  // Dropdown Data States
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [fareSchemes, setFareSchemes] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [insurers, setInsurers] = useState<any[]>([]);

  // Helper: Safely Extract Array
  const getSafeList = (response: any): any[] => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.content && Array.isArray(response.content)) return response.content;
    if (response?.data?.content && Array.isArray(response.data.content)) return response.data.content;
    return [];
  };

  // 1. Fetch ALL Dropdown Data (Independently)
  useEffect(() => {
    const fetchDropdowns = async () => {
      // We run these independently so one failure doesn't stop the others
      
      // --- INSURERS ---
      try {
        const res = await insurerService.getActive();
        setInsurers(getSafeList(res));
      } catch (e) { console.error("Failed to load Insurers", e); }

      // --- MAKES ---
      try {
        const res = await makeService.getAllList();
        setMakes(getSafeList(res));
      } catch (e) { console.error("Failed to load Makes", e); }

      // --- CLASSES ---
      try {
        const res = await classService.getActive();
        setClasses(getSafeList(res));
      } catch (e) { console.error("Failed to load Classes", e); }

      // --- OWNERS ---
      try {
        const res = await ownerService.getAllActive();
        setOwners(getSafeList(res));
      } catch (e) { console.error("Failed to load Owners", e); }

      // --- FARES (With Debug) ---
      try {
        const res = await fareService.getActive();
        console.log("👉 Fare Scheme API Response (Edit):", res); 
        const list = getSafeList(res);
        console.log("👉 Fare Scheme Parsed List (Edit):", list); 
        setFareSchemes(list);
      } catch (e) { console.error("Failed to load Fares", e); }

      // --- COMPANIES ---
      try {
        const res = await companyService.getAllActive();
        setCompanies(getSafeList(res));
      } catch (e) { console.error("Failed to load Companies", e); }
    };

    fetchDropdowns();
  }, []);

  // 2. Fetch Vehicle Data
  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        setIsLoading(true);
        try {
          const res = await vehicleService.getById(Number(id));
          if (res.success && res.data) {
            const v = res.data;
            
            // Pre-load models if make exists
            if (v.makeId) {
               try {
                 const modelsRes = await modelService.getByMakeId(v.makeId);
                 setModels(getSafeList(modelsRes));
               } catch (e) { console.error("Failed to load models for make", v.makeId); }
            }

            setFormData({
              vehicleCode: v.vehicleCode,
              registrationNumber: v.registrationNumber,
              chassisNumber: v.chassisNumber || "",
              registrationDate: v.registrationDate || "",
              revenueLicenseNumber: v.revenueLicenseNumber || "",
              revenueLicenseExpiryDate: v.revenueLicenseExpiryDate || "",
              passengerCapacity: v.passengerCapacity || 0,
              luggageCapacity: v.luggageCapacity || 0,
              comments: v.comments || "",
              manufactureYear: v.manufactureYear || new Date().getFullYear(),
              makeId: v.makeId || undefined,
              modelId: v.modelId || undefined,
              fuelType: typeof v.fuelType === 'string' ? v.fuelType : "",
              insurerId: v.insurerId || undefined,
              insuranceNumber: v.insuranceNumber || "",
              insuranceExpiryDate: v.insuranceExpiryDate || "",
              ownerId: v.ownerId || undefined,
              classId: v.classId || undefined,
              companyId: v.companyId || undefined,
              fareSchemeId: v.fareSchemeId || undefined,
              isActive: v.isActive,
            });
          }
        } catch (error) {
          console.error("Error fetching vehicle", error);
          toast({
            title: "Error",
            description: "Failed to load vehicle details.",
            variant: "destructive",
          });
          navigate("/admin/vehicles/manage");
        } finally {
          setIsLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [id, navigate, toast]);

  // 3. Dynamic Model Fetching
  const handleMakeChange = async (makeIdStr: string) => {
    const makeId = Number(makeIdStr);
    handleInputChange("makeId", makeId);
    handleInputChange("modelId", undefined); // Reset model
    
    if (makeId) {
      try {
        const res = await modelService.getByMakeId(makeId);
        setModels(getSafeList(res));
      } catch (error) {
        console.error("Error fetching models", error);
        setModels([]);
      }
    } else {
      setModels([]);
    }
  };

  const handleInputChange = (field: keyof VehicleUpdateRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.vehicleCode || !formData.registrationNumber) {
      toast({ title: "Error", description: "Vehicle Code and Registration Number are required.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean payload: empty strings -> undefined
      const payload = {
        ...formData,
        chassisNumber: formData.chassisNumber || undefined,
        registrationDate: formData.registrationDate || undefined,
        revenueLicenseNumber: formData.revenueLicenseNumber || undefined,
        revenueLicenseExpiryDate: formData.revenueLicenseExpiryDate || undefined,
        insuranceNumber: formData.insuranceNumber || undefined,
        insuranceExpiryDate: formData.insuranceExpiryDate || undefined,
        comments: formData.comments || undefined,
      };

      const res = await vehicleService.update(Number(id), payload);
      
      if (res.success) {
        toast({
          title: "Vehicle Updated Successfully",
          description: `${formData.vehicleCode} has been updated.`,
        });
        setTimeout(() => navigate("/admin/vehicles/manage"), 500);
      } else {
        toast({
          title: "Update Failed",
          description: res.message || "Could not update vehicle.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error updating vehicle", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update vehicle.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6330B8]">Edit Vehicle</h1>
          <p className="text-muted-foreground">Update information for {formData.registrationNumber}</p>
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
                    placeholder="e.g. CAB-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration # *</Label>
                  <Input
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    placeholder="e.g. WP-AAA-1234"
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

          {/* Manufacture Information */}
          <Card>
            <CardHeader><CardTitle>Manufacture & Capacity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manufacturer *</Label>
                  <Select
                    value={formData.makeId?.toString() ?? ""}
                    onValueChange={handleMakeChange}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.id} value={make.id.toString()}>
                          {make.manufacturer || make.makeName || make.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={formData.modelId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("modelId", Number(val))}
                    disabled={!formData.makeId}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                    <SelectContent>
                      {models.length > 0 ? models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.model || model.modelName || model.name}
                        </SelectItem>
                      )) : <SelectItem value="none" disabled>No models available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Man Year</Label>
                  <Input
                    type="number"
                    value={formData.manufactureYear}
                    onChange={(e) => handleInputChange("manufactureYear", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type *</Label>
                  <Select
                    value={formData.fuelType ?? ""}
                    onValueChange={(val) => handleInputChange("fuelType", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Fuel Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

          {/* Insurance Information */}
          <Card>
            <CardHeader><CardTitle>Insurance & Ownership</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* --- INSURER DROPDOWN --- */}
                <div className="space-y-2">
                  <Label>Insurer</Label>
                  <Select
                    value={formData.insurerId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("insurerId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Insurer" /></SelectTrigger>
                    <SelectContent>
                      {insurers.length === 0 ? (
                        <SelectItem value="none" disabled>No insurers available</SelectItem>
                      ) : (
                        insurers.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.insurerName || item.name || `Insurer #${item.id}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
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

                <div className="space-y-2">
                  <Label>Vehicle Class *</Label>
                  <Select
                    value={formData.classId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("classId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.className || cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Company</Label>
                  <Select
                    value={formData.companyId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("companyId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id.toString()}>
                          {company.companyName || company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* --- FARE SCHEME - FIXED --- */}
                <div className="space-y-2">
                  <Label>Fare Scheme</Label>
                  <Select
                    value={formData.fareSchemeId?.toString() ?? ""}
                    onValueChange={(val) => handleInputChange("fareSchemeId", Number(val))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Scheme" /></SelectTrigger>
                    <SelectContent>
                      {fareSchemes.length === 0 ? (
                        <SelectItem value="none" disabled>No Fare Schemes Available</SelectItem>
                      ) : (
                        fareSchemes.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {/* Matches fareName, fareCode, or description from API */}
                            {item.fareName 
                              ? `${item.fareName} (${item.fareCode})`
                              : (item.fareCode || item.description || "Unknown Scheme")
                            }
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
            <Button type="button" variant="outline" onClick={() => navigate("/admin/vehicles/manage")} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#6330B8] hover:bg-[#5428a0]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Vehicle"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}