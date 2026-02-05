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
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export default function DispatchVehicle() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({
    customerName: booking?.customer || "",
    corporateId: booking?.organization || "",
    contactNumber: booking?.passengerNumber || "",
    name: booking?.customer || "",
    numberOfPassengers: "0",
    luggage: "0.00",
    remarks: booking?.clientRemarks || "",
    isAdvanceBooking: booking?.isAdvance === "Yes",
    vehicleClass: booking?.vehicleClass || "",
    fareScheme: "Commission",
    percentage: "0.00",
    pickupTime: booking?.pickupTime || "",
    pickupAddress: booking?.pickupAddress || "",
    dropAddress: booking?.dropAddress || "",
    specialRemarks: "",
    destination: "",
    driverVehicle: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle dispatch logic here
    console.log("Dispatching vehicle with data:", formData);
    // Navigate to dispatched bookings page after successful dispatch
    navigate("/admin/bookings/dispatched");
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-2 space-y-3 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/bookings/pending")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#6330B8]">
              Dispatch Vehicle
            </h1>
            <p className="text-muted-foreground mt-1">
              Assign driver and vehicle to booking #{booking?.bookingNumber || "N/A"}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="bg-[#6330B8] hover:bg-[#5028a0]">
          <Send className="mr-2 h-4 w-4" /> Dispatch Vehicle
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corporateId">Corporate Id</Label>
              <Input
                id="corporateId"
                value={formData.corporateId}
                onChange={(e) => handleChange("corporateId", e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact #</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPassengers">No. of Pass</Label>
              <Input
                id="numberOfPassengers"
                type="number"
                value={formData.numberOfPassengers}
                onChange={(e) =>
                  handleChange("numberOfPassengers", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="luggage">Luggage (Kg)</Label>
                <Input
                  id="luggage"
                  type="number"
                  step="0.01"
                  value={formData.luggage}
                  onChange={(e) => handleChange("luggage", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="advBooking"
                checked={formData.isAdvanceBooking}
                onCheckedChange={(checked) =>
                  handleChange("isAdvanceBooking", checked as boolean)
                }
              />
              <Label htmlFor="advBooking" className="cursor-pointer">
                Adv Booking
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Fare Information */}
        <Card>
          <CardHeader>
            <CardTitle>Fare Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleClass">Vehicle Class</Label>
              <Select
                value={formData.vehicleClass}
                onValueChange={(value) => handleChange("vehicleClass", value)}
              >
                <SelectTrigger id="vehicleClass">
                  <SelectValue placeholder="Select vehicle class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="ECO">ECO</SelectItem>
                  <SelectItem value="EX">EX</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fareScheme">Fare Scheme</Label>
              <Select
                value={formData.fareScheme}
                onValueChange={(value) => handleChange("fareScheme", value)}
              >
                <SelectTrigger id="fareScheme">
                  <SelectValue placeholder="Select fare scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Commission">Commission</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                  <SelectItem value="Metered">Metered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                id="percentage"
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) => handleChange("percentage", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                value={formData.pickupTime?.replace(" ", "T").slice(0, 16) || ""}
                onChange={(e) => handleChange("pickupTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleChange("pickupAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropAddress">Drop Address</Label>
              <Input
                id="dropAddress"
                value={formData.dropAddress}
                onChange={(e) => handleChange("dropAddress", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRemarks">Special Remarks</Label>
              <Textarea
                id="specialRemarks"
                value={formData.specialRemarks}
                onChange={(e) =>
                  handleChange("specialRemarks", e.target.value)
                }
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination/Dropoff</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleChange("destination", e.target.value)}
                placeholder="Enter destination"
              />
            </div>
          </CardContent>
        </Card>

        {/* Driver & Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Driver & Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="driverVehicle">Choose Driver/Vehicle</Label>
              <Select
                value={formData.driverVehicle}
                onValueChange={(value) => handleChange("driverVehicle", value)}
              >
                <SelectTrigger id="driverVehicle">
                  <SelectValue placeholder="Select driver and vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver1-CAB-1234">
                    Nimal Perera - CAB-1234 (Available)
                  </SelectItem>
                  <SelectItem value="driver2-CAB-5678">
                    Sunil Silva - CAB-5678 (Available)
                  </SelectItem>
                  <SelectItem value="driver3-CAB-9012">
                    Kamal Fernando - CAB-9012 (Available)
                  </SelectItem>
                  <SelectItem value="driver4-VAN-1111">
                    Ajith Kumar - VAN-1111 (Available)
                  </SelectItem>
                  <SelectItem value="driver5-BUS-2222">
                    Chaminda Perera - BUS-2222 (Available)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/bookings/pending")}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#6330B8] hover:bg-[#5028a0]">
            <Send className="mr-2 h-4 w-4" /> Dispatch Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}
