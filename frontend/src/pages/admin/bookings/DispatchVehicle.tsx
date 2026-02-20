// src/pages/admin/bookings/DispatchVehicle.tsx

"use client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Send, Loader2, User, Car } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { BookingResponse } from "@/services/bookings/types";
import dispatchService from "@/services/bookings/dispatchService";
import type { DriverOption, VehicleOption } from "@/services/bookings/dispatchService";

export default function DispatchVehicle() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking as BookingResponse;

  // -- State --
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -- Selected Details (For display after selection) --
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(null);

  // -- Form Data --
  const [formData, setFormData] = useState({
    // Selection IDs
    driverId: "",
    vehicleId: "",
    
    // Editable Fields (Mapped to DTO)
    numberOfPassengers: booking?.numberOfPassengers?.toString() || "1",
    luggage: booking?.luggage?.toString() || "0",
    remarks: booking?.remarks || booking?.clientRemarks || "",
    specialRemarks: booking?.specialRemarks || "",
    percentage: booking?.percentage?.toString() || "0",
    
    // Editable passenger name
    name: booking?.passengerName || booking?.customerName || "",

    // Read-only / Display fields
    customerName: booking?.customerName || "",
    corporateId: booking?.corporateName || booking?.corporateCode || "",
    contactNumber: booking?.contactNumber || "",
    isAdvanceBooking: booking?.isAdvanceBooking || false,
    vehicleClass: booking?.vehicleClassName || "",
    fareScheme: booking?.fareSchemeName || "",
    pickupTime: booking?.pickupTime || "",
    pickupAddress: booking?.pickupAddress || "",
    dropAddress: booking?.dropAddress || "",
    destination: booking?.destination || "",
  });

  // -- Load Resources --
  useEffect(() => {
    if (!booking) {
      toast.error("No booking selected. Redirecting...");
      navigate("/admin/bookings/pending");
      return;
    }

    const loadData = async () => {
      setIsLoadingResources(true);
      try {
        const [driverList, vehicleList] = await Promise.all([
          dispatchService.getActiveDrivers(),
          dispatchService.getActiveVehicles()
        ]);
        setDrivers(driverList);
        setVehicles(vehicleList);
      } catch (error) {
        console.error("Failed to load resources:", error);
        toast.error("Failed to load drivers/vehicles.");
      } finally {
        setIsLoadingResources(false);
      }
    };
    loadData();
  }, [booking, navigate]);

  // -- Handle Driver Selection --
  const handleDriverChange = (driverId: string) => {
    setFormData(prev => ({ ...prev, driverId }));
    const driver = drivers.find(d => String(d.id) === driverId);
    setSelectedDriver(driver || null);

    // Auto-select vehicle if driver has one assigned
    if (driver?.vehicleId) {
      const matchingVehicle = vehicles.find(v => v.id === driver.vehicleId);
      if (matchingVehicle) {
        setFormData(prev => ({ ...prev, driverId, vehicleId: String(matchingVehicle.id) }));
        setSelectedVehicle(matchingVehicle);
      }
    }
  };

  // -- Handle Vehicle Selection --
  const handleVehicleChange = (vehicleId: string) => {
    setFormData(prev => ({ ...prev, vehicleId }));
    const vehicle = vehicles.find(v => String(v.id) === vehicleId);
    setSelectedVehicle(vehicle || null);
  };

  // -- Generic Change Handler --
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // -- Submit Handler --
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.driverId || !formData.vehicleId) {
      toast.error("Please select both a Driver and a Vehicle.");
      return;
    }

    const driverIdNum = parseInt(formData.driverId);
    const vehicleIdNum = parseInt(formData.vehicleId);

    if (isNaN(driverIdNum) || isNaN(vehicleIdNum)) {
      toast.error("Invalid Driver or Vehicle selection.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatchService.dispatchBooking(booking.id, {
        driverId: driverIdNum,
        vehicleId: vehicleIdNum,
        dispatchedBy: 1, // TODO: Replace with logged-in User ID
        
        // Optional updates
        passengerName: formData.name || undefined,
        numberOfPassengers: parseInt(formData.numberOfPassengers) || 1,
        luggage: parseFloat(formData.luggage) || 0,
        remarks: formData.remarks || undefined,
        specialRemarks: formData.specialRemarks || undefined,
        percentage: parseFloat(formData.percentage) || 0
      });

      toast.success("Vehicle dispatched successfully!");
      navigate("/admin/bookings/dispatched");
    } catch (error: any) {
      console.error("Dispatch Error:", error);
      toast.error(error.response?.data?.message || "Failed to dispatch vehicle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="p-2 space-y-3 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/bookings/pending")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#6330B8]">Dispatch Vehicle</h1>
            <p className="text-muted-foreground mt-1">
              Assign driver and vehicle to booking{" "}
              <Badge variant="outline" className="ml-1 text-[#6330B8] border-[#6330B8]">
                #{booking.bookingId}
              </Badge>
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-[#6330B8] hover:bg-[#5028a0]" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Dispatch Vehicle
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* ========== Assign Resources ========== */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="text-[#6330B8]">Assign Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Driver Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#6330B8]" />
                  Driver <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.driverId}
                  onValueChange={handleDriverChange}
                  disabled={isLoadingResources}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingResources ? "Loading drivers..." : "Select Driver"} />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.length === 0 && (
                      <SelectItem value="none" disabled>
                        {isLoadingResources ? "Loading..." : "No active drivers found"}
                      </SelectItem>
                    )}
                    {drivers.map(d => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        [{d.code}] {d.fullName || `${d.firstName} ${d.lastName}`} - {d.contactNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Show selected driver info */}
                {selectedDriver && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ {selectedDriver.fullName} | Phone: {selectedDriver.contactNumber}
                    {selectedDriver.vehicleId && ` | Vehicle ID: ${selectedDriver.vehicleId}`}
                  </p>
                )}
              </div>

              {/* Vehicle Select */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#6330B8]" />
                  Vehicle <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={handleVehicleChange}
                  disabled={isLoadingResources}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingResources ? "Loading vehicles..." : "Select Vehicle"} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length === 0 && (
                      <SelectItem value="none" disabled>
                        {isLoadingResources ? "Loading..." : "No active vehicles found"}
                      </SelectItem>
                    )}
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        [{v.vehicleCode}] {v.registrationNumber} - {v.modelName || "N/A"} ({v.className || "N/A"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Show selected vehicle info */}
                {selectedVehicle && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ {selectedVehicle.registrationNumber} | {selectedVehicle.modelName} | Class: {selectedVehicle.className}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========== Personal Details ========== */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Input value={formData.customerName} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Corporate</Label>
              <Input value={formData.corporateId} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Contact #</Label>
              <Input value={formData.contactNumber} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Passenger Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Passenger name"
              />
            </div>
            <div className="space-y-2">
              <Label>No. of Passengers</Label>
              <Input
                type="number"
                min="1"
                value={formData.numberOfPassengers}
                onChange={(e) => handleChange("numberOfPassengers", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ========== Other Information ========== */}
        <Card>
          <CardHeader><CardTitle>Other Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Luggage (Kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.luggage}
                  onChange={(e) => handleChange("luggage", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Remarks</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  placeholder="Any remarks for this dispatch..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="advBooking" checked={formData.isAdvanceBooking} disabled />
              <Label htmlFor="advBooking" className="cursor-pointer text-gray-500">
                Advance Booking
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* ========== Fare Information ========== */}
        <Card>
          <CardHeader><CardTitle>Fare Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Vehicle Class</Label>
              <Input value={formData.vehicleClass} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Fare Scheme</Label>
              <Input value={formData.fareScheme || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Percentage (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.percentage}
                onChange={(e) => handleChange("percentage", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ========== Pickup Information ========== */}
        <Card>
          <CardHeader><CardTitle>Pickup Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pickup Time</Label>
              <Input
                value={formData.pickupTime ? new Date(formData.pickupTime).toLocaleString() : "N/A"}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Pickup Address</Label>
              <Input value={formData.pickupAddress} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Drop Address</Label>
              <Input value={formData.dropAddress || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Special Remarks</Label>
              <Textarea
                value={formData.specialRemarks}
                onChange={(e) => handleChange("specialRemarks", e.target.value)}
                rows={2}
                placeholder="Driver instructions..."
              />
            </div>
          </CardContent>
        </Card>

        {/* ========== Destination ========== */}
        <Card>
          <CardHeader><CardTitle>Destination</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Destination / Dropoff</Label>
              <Input value={formData.destination || formData.dropAddress || "N/A"} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* ========== Action Buttons ========== */}
        <div className="flex justify-end gap-4 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/bookings/pending")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6330B8] hover:bg-[#5028a0]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Dispatch Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}