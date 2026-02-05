"use client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function CompleteBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({
    bookingId: booking?.bookingId || "",
    customerName: booking?.customerName || "",
    corporateId: booking?.organization || "",
    contactNumber: booking?.passengerNumber || "",
    name: booking?.customerName || "",
    numberOfPassengers: "0",
    vehicleClass: booking?.vehicleClass || "",
    fareScheme: booking?.fareScheme || "",
    driverCode: booking?.driverName || "",
    pickupTime: booking?.pickupTime || "",
    pickupAddress: booking?.pickupAddress || "",
    dropAddress: booking?.dropAddress || "",
    specialRemarks: "",
    completedTime: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+),/, "$3/$1/$2"),
    totalDistance: "",
    totalWaitTime: "",
    totalWaitingFee: "",
    totalFare: "",
    sendClientSMS: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle completion logic here
    console.log("Completing booking with data:", formData);
    // Navigate to completed hires page after successful completion
    navigate("/admin/bookings/completed");
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/bookings/dispatched")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-green-600">
              Complete Booking {formData.bookingId}
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and complete booking details
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Complete Booking
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corporateId">Corporate Id</Label>
              <Input
                id="corporateId"
                value={formData.corporateId}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact #</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPassengers">No. of Pass</Label>
              <Input
                id="numberOfPassengers"
                type="number"
                value={formData.numberOfPassengers}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleClass">Vehicle Class</Label>
              <Input
                id="vehicleClass"
                value={formData.vehicleClass}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fareScheme">Fare Scheme</Label>
              <Input
                id="fareScheme"
                value={formData.fareScheme}
                readOnly
                className="bg-gray-50"
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
              <Label htmlFor="driverCode">Driver Code</Label>
              <Input
                id="driverCode"
                value={formData.driverCode}
                readOnly
                className="bg-gray-50"
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
              <Label htmlFor="pickupTime">PickupTime</Label>
              <Input
                id="pickupTime"
                value={formData.pickupTime}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input
                id="pickupAddress"
                value={formData.pickupAddress}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropAddress">Drop Address</Label>
              <Input
                id="dropAddress"
                value={formData.dropAddress}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRemarks">Special Remarks</Label>
              <Textarea
                id="specialRemarks"
                value={formData.specialRemarks}
                rows={2}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hire Completion */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600">Hire Completion</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completedTime">CompletedTime</Label>
              <Input
                id="completedTime"
                value={formData.completedTime}
                onChange={(e) => handleChange("completedTime", e.target.value)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalDistance">Total Distance</Label>
              <Input
                id="totalDistance"
                type="number"
                step="0.01"
                value={formData.totalDistance}
                onChange={(e) => handleChange("totalDistance", e.target.value)}
                placeholder="Enter distance in km"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalWaitTime">Total Wait Time</Label>
              <Input
                id="totalWaitTime"
                value={formData.totalWaitTime}
                onChange={(e) => handleChange("totalWaitTime", e.target.value)}
                placeholder="Enter wait time (e.g., 30 mins)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalWaitingFee">Total Waiting Fee</Label>
              <Input
                id="totalWaitingFee"
                type="number"
                step="0.01"
                value={formData.totalWaitingFee}
                onChange={(e) => handleChange("totalWaitingFee", e.target.value)}
                placeholder="Enter waiting fee"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalFare">
                Total Fare <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalFare"
                type="number"
                step="0.01"
                value={formData.totalFare}
                onChange={(e) => handleChange("totalFare", e.target.value)}
                placeholder="Enter total fare"
                required
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="sendClientSMS"
                checked={formData.sendClientSMS}
                onCheckedChange={(checked) =>
                  handleChange("sendClientSMS", checked as boolean)
                }
              />
              <Label htmlFor="sendClientSMS" className="cursor-pointer">
                Send Client SMS
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/bookings/dispatched")}
          >
            Back to Dispatched
          </Button>
          <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Complete Booking
          </Button>
        </div>
      </form>
    </div>
  );
}
