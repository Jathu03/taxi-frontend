"use client";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import { ArrowLeft, XCircle } from "lucide-react";
import { useState } from "react";

export default function CancelBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const booking = location.state?.booking;

  // Mock data for cancelled bookings - replace with API call
  const mockCancelledBookings: Record<string, {
    bookingId: string;
    org: string;
    customer: string;
    passengerNo: string;
    name: string;
    numberOfPassengers: string;
    hireType: string;
    bookingTime: string;
    pickupTime: string;
    pickupAddress: string;
    dropAddress: string;
    luggage: string;
    remarks: string;
    advBooking: string;
    vehicleClass: string;
    fareScheme: string;
    cancelledTime: string;
    cancelledType: string;
    cancelledAgent: string;
    driver: string;
    vehicle: string;
  }> = {
    "295747": {
      bookingId: "295747",
      org: "BCD Travels",
      customer: "BCD Travel",
      passengerNo: "0714788999",
      name: "BCD Travel ",
      numberOfPassengers: "0",
      hireType: "On The Meter",
      bookingTime: "12/04/2025 14:53",
      pickupTime: "12/04/2025 17:30",
      pickupAddress: "17.30 BCD Drop",
      dropAddress: "01. Tuan - 070 199 0600 - Nugegoda",
      luggage: "0.00",
      remarks: "17.30 BCD Drop -- 01. Tuan - 070 199 0600 - Nugegoda",
      advBooking: "",
      vehicleClass: "BUDGET",
      fareScheme: "Mileage Calculator",
      cancelledTime: "12/04/2025 15:33",
      cancelledType: "Base cancelled",
      cancelledAgent: "devinda95",
      driver: "",
      vehicle: "",
    },
    "295732": {
      bookingId: "295732",
      org: "Inbay",
      customer: "Hameed ()",
      passengerNo: "0770383078",
      name: "Hameed",
      numberOfPassengers: "0",
      hireType: "On The Meter",
      bookingTime: "12/04/2025 08:22",
      pickupTime: "12/04/2025 08:30",
      pickupAddress: "Inbay Office",
      dropAddress: "Colombo Fort",
      luggage: "0.00",
      remarks: "",
      advBooking: "",
      vehicleClass: "STANDARD",
      fareScheme: "Mileage Calculator",
      cancelledTime: "12/04/2025 14:38",
      cancelledType: "Base cancelled",
      cancelledAgent: "devinda95",
      driver: "",
      vehicle: "",
    },
    "295731": {
      bookingId: "295731",
      org: "Inbay",
      customer: "Hameed ()",
      passengerNo: "0770383078",
      name: "Hameed",
      numberOfPassengers: "0",
      hireType: "On The Meter",
      bookingTime: "12/04/2025 08:20",
      pickupTime: "12/04/2025 08:25",
      pickupAddress: "Inbay Office",
      dropAddress: "Galle Road",
      luggage: "0.00",
      remarks: "",
      advBooking: "",
      vehicleClass: "STANDARD",
      fareScheme: "Mileage Calculator",
      cancelledTime: "12/04/2025 14:36",
      cancelledType: "Base cancelled",
      cancelledAgent: "devinda95",
      driver: "",
      vehicle: "",
    },
    "295725": {
      bookingId: "295725",
      org: "Special",
      customer: "Santhush ()",
      passengerNo: "+491722303724",
      name: "Santhush",
      numberOfPassengers: "0",
      hireType: "KIA Drop",
      bookingTime: "12/04/2025 03:50",
      pickupTime: "12/04/2025 04:00",
      pickupAddress: "Airport",
      dropAddress: "Negombo Hotel",
      luggage: "0.00",
      remarks: "",
      advBooking: "",
      vehicleClass: "BUDGET",
      fareScheme: "Mileage Calculator",
      cancelledTime: "12/04/2025 05:33",
      cancelledType: "Base cancelled",
      cancelledAgent: "devinda95",
      driver: "",
      vehicle: "",
    },
  };

  const cancelledBooking = id && mockCancelledBookings[id] ? mockCancelledBookings[id] : null;

  // Use cancelled booking data if viewing, otherwise use booking data
  const bookingData = cancelledBooking || booking;
  const isViewMode = !!cancelledBooking;

  const [formData, setFormData] = useState({
    customerName: bookingData?.customer || "",
    corporateId: bookingData?.org || bookingData?.organization || "",
    contactNumber: bookingData?.passengerNo || bookingData?.passengerNumber || "",
    name: bookingData?.name || bookingData?.customer || "",
    numberOfPassengers: bookingData?.numberOfPassengers || "0",
    luggage: bookingData?.luggage || "0.00",
    remarks: bookingData?.remarks || bookingData?.clientRemarks || "",
    isAdvanceBooking: bookingData?.advBooking === "Yes" || bookingData?.isAdvance === "Yes",
    vehicleClass: bookingData?.vehicleClass || "",
    fareScheme: bookingData?.fareScheme || "Mileage Calculator",
    pickupTime: bookingData?.pickupTime || "",
    pickupAddress: bookingData?.pickupAddress || "",
    dropAddress: bookingData?.dropAddress || "",
    specialRemarks: "",
    driverVehicle: bookingData?.driver || "",
    cancellationReason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle cancellation logic here
    console.log("Cancelling booking with data:", formData);
    // Navigate to cancelled hires page after successful cancellation
    navigate("/admin/bookings/cancelled");
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
            onClick={() => navigate(isViewMode ? "/admin/bookings/cancelled" : "/admin/bookings/pending")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-red-600">
              {isViewMode ? `Cancel Booking ${id || ""}` : `Cancel Booking ${booking?.bookingNumber || ""}`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isViewMode ? "View cancelled booking details" : "Review and confirm booking cancellation"}
            </p>
          </div>
        </div>
        {!isViewMode && (
          <Button 
            onClick={handleSubmit} 
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
          </Button>
        )}
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
                onChange={(e) =>
                  handleChange("numberOfPassengers", e.target.value)
                }
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="luggage">Luggage (Kg)</Label>
                <Input
                  id="luggage"
                  type="number"
                  step="0.01"
                  value={formData.luggage}
                  onChange={(e) => handleChange("luggage", e.target.value)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  rows={3}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="advBooking"
                checked={formData.isAdvanceBooking}
                disabled
              />
              <Label htmlFor="advBooking" className="cursor-default text-gray-500">
                Adv Booking
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Fare Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Fare Information</CardTitle>
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
                disabled
              >
                <SelectTrigger id="driverVehicle" className="bg-gray-50">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver assigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Information (for view mode) */}
        {isViewMode && cancelledBooking && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Cancellation Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cancelled Time</Label>
                <Input
                  value={cancelledBooking.cancelledTime}
                  readOnly
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Cancelled Type</Label>
                <Input
                  value={cancelledBooking.cancelledType}
                  readOnly
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Cancelled By</Label>
                <Input
                  value={cancelledBooking.cancelledAgent}
                  readOnly
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancellation Reason (for cancel mode) */}
        {!isViewMode && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Cancellation Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="cancellationReason">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="cancellationReason"
                  value={formData.cancellationReason}
                  onChange={(e) =>
                    handleChange("cancellationReason", e.target.value)
                  }
                  placeholder="Please provide a reason for cancelling this booking"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isViewMode ? "/admin/bookings/cancelled" : "/admin/bookings/pending")}
          >
            {isViewMode ? "Back to Cancelled" : "Back to Pending"}
          </Button>
          {!isViewMode && (
            <Button 
              type="submit" 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="mr-2 h-4 w-4" /> Confirm Cancellation
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
