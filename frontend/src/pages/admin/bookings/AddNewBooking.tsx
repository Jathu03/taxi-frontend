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
import { ArrowLeft, Save, Plus, X, Building2 } from "lucide-react"; 
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AddNewBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({
    customerName: booking?.customer || "",
    isCorporate: !!booking?.organization, // Auto-check if organization exists
    corporateId: booking?.organization || "",
    contactNumber: booking?.passengerNumber || "",
    name: booking?.customer || "",
    numberOfPassengers: "1",
    hireType: booking?.hireType || "On The Meter",
    pickupTime: booking?.pickupTime || "",
    pickupAddress: booking?.pickupAddress || "",
    stops: [""], 
    dropAddress: booking?.dropAddress || "",
    specialRemarks: "",
    luggage: "0.00",
    remarks: booking?.clientRemarks || "",
    isAdvanceBooking: booking?.isAdvance === "Yes",
    isTestBooking: false,
    isInquiryOnly: false,
    destination: "",
    vehicleClass: booking?.vehicleClass || "",
    fareScheme: "Mileage Calculator",
    paymentType: "Credit Payments",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving booking:", formData);
    navigate("/admin/bookings/pending");
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = value;
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ""] }));
  };

  const removeStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/bookings/pending")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#6330B8]">
              {booking ? "Edit Booking" : "Add New Booking"}
            </h1>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-[#6330B8] hover:bg-[#5028a0]">
          <Save className="mr-2 h-4 w-4" /> Save Booking
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Corporate Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal & Corporate Details</CardTitle>
            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
              <Checkbox 
                id="isCorporate" 
                checked={formData.isCorporate} 
                onCheckedChange={(checked) => handleChange("isCorporate", checked as boolean)}
              />
              <Label htmlFor="isCorporate" className="text-xs font-semibold text-[#6330B8] cursor-pointer">
                Corporate Booking
              </Label>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input 
                value={formData.customerName} 
                onChange={(e) => handleChange("customerName", e.target.value)} 
                placeholder="Enter customer name"
              />
            </div>

            {/* CORPORATE ID SECTION - Shows only if isCorporate is true */}
            {formData.isCorporate && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <Label className="flex items-center gap-2 text-blue-600">
                  <Building2 className="h-4 w-4" /> Corporate ID / Organization
                </Label>
                <Input 
                  value={formData.corporateId} 
                  onChange={(e) => handleChange("corporateId", e.target.value)} 
                  placeholder="e.g. PGIE, Inbay, Codezync"
                  className="border-blue-200 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input 
                value={formData.contactNumber} 
                onChange={(e) => handleChange("contactNumber", e.target.value)} 
                placeholder="Enter phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pickup & Stops Information */}
        <Card>
          <CardHeader><CardTitle>Route Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Time</Label>
                <Input type="datetime-local" value={formData.pickupTime?.replace(" ", "T").slice(0, 16) || ""} onChange={(e) => handleChange("pickupTime", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Pickup Address</Label>
                <Input value={formData.pickupAddress} onChange={(e) => handleChange("pickupAddress", e.target.value)} placeholder="Start location" />
              </div>
            </div>

            {/* STOPS SECTION */}
            <div className="space-y-3 pt-2 border-t border-dashed">
              <div className="flex items-center justify-between">
                <Label className="text-[#6330B8] font-semibold">Intermediate Stops</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStop} className="h-7 text-xs gap-1 hover:bg-purple-50">
                  <Plus className="h-3 w-3" /> Add Stop
                </Button>
              </div>
              
              {formData.stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="w-16 h-10 justify-center">Stop {index + 1}</Badge>
                  <Input 
                    value={stop} 
                    onChange={(e) => handleStopChange(index, e.target.value)} 
                    placeholder="Enter waypoint address" 
                    className="flex-grow"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStop(index)} className="text-red-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label className="font-bold text-green-700">Final Destination Address</Label>
              <Input value={formData.dropAddress} onChange={(e) => handleChange("dropAddress", e.target.value)} placeholder="Final destination" className="border-green-200" />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader><CardTitle>Vehicle & Booking Options</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
              <Label>Vehicle Class</Label>
              <Select value={formData.vehicleClass} onValueChange={(v) => handleChange("vehicleClass", v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="ECO">ECO</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Tuk">Tuk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hire Type</Label>
              <Select value={formData.hireType} onValueChange={(v) => handleChange("hireType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="On The Meter">On The Meter</SelectItem>
                  <SelectItem value="Fixed Rate">Fixed Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="adv" checked={formData.isAdvanceBooking} onCheckedChange={(c) => handleChange("isAdvanceBooking", c as boolean)} />
                <Label htmlFor="adv" className="cursor-pointer">Advance Booking</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/bookings/pending")}>Cancel</Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#5028a0] h-11 px-8">
            <Save className="mr-2 h-5 w-5" /> Save Booking Details
          </Button>
        </div>
      </form>
    </div>
  );
}