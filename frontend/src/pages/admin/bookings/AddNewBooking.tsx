// src/pages/admin/bookings/AddNewBooking.tsx

"use client";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Plus, X, Building2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { bookingService } from "@/services/bookings/bookingService";
import type {
  CreateBookingRequest,
  VehicleClass,
  PaymentType,
  BookingResponse,
} from "@/services/bookings/types";

export default function AddNewBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get ID from URL

  // Determine if editing
  const isEditMode = Boolean(id);
  // Get booking object passed from previous page (if available)
  const passedBooking = location.state?.booking as BookingResponse | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [vehicleClasses, setVehicleClasses] = useState<VehicleClass[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    contactNumber: "",
    isCorporate: false,
    corporateId: "",
    numberOfPassengers: "1",
    hireType: "On The Meter",
    pickupTime: "",
    pickupAddress: "",
    dropAddress: "",
    stops: [""] as string[],
    destination: "",
    vehicleClassId: "",
    paymentType: "CASH",
    isAdvanceBooking: false,

    // ✅ NEW FIELD
    // IMPORTANT: value must match backend enum (usually WEB / MOBILE_APP / CASH_HIRE)
    bookingSource: "WEB",

    specialRemarks: "",
    remarks: "",
  });

  // Helper to map API Response to Form State
  const populateForm = (booking: BookingResponse) => {
    let loadedStops = [""];
    let loadedRemarks = booking.remarks || "";

    // Attempt to parse stops from remarks string
    if (loadedRemarks.includes("| Intermediate Stops:")) {
      const parts = loadedRemarks.split("| Intermediate Stops:");
      loadedRemarks = parts[0].trim();
      const stopsString = parts[1].trim();
      if (stopsString) {
        loadedStops = stopsString.split(" -> ");
      }
    }

    setFormData({
      customerName: booking.customerName || "",
      customerEmail: booking.customerEmail || "",
      contactNumber: booking.contactNumber || "",

      isCorporate: !!booking.corporateId,
      corporateId: booking.corporateId?.toString() || "",

      numberOfPassengers: booking.numberOfPassengers?.toString() || "1",
      hireType: booking.hireType || "On The Meter",

      pickupTime: booking.pickupTime
        ? new Date(booking.pickupTime).toISOString().slice(0, 16)
        : "",

      pickupAddress: booking.pickupAddress || "",
      dropAddress: booking.dropAddress || "",
      destination: booking.destination || "",
      stops: loadedStops,

      vehicleClassId: booking.vehicleClassId?.toString() || "",

      paymentType: booking.paymentType || "CASH",
      isAdvanceBooking: booking.isAdvanceBooking || false,

      // ✅ NEW FIELD (fallback to WEB if null)
      bookingSource: booking.bookingSource || "WEB",

      specialRemarks: booking.specialRemarks || "",
      remarks: loadedRemarks,
    });
  };

  // 1. Fetch Data on Mount
  useEffect(() => {
    const init = async () => {
      setIsFetchingData(true);
      try {
        // A. Load Classes (Always needed)
        const classes = await bookingService.getVehicleClasses();
        setVehicleClasses(classes);

        // B. Load Booking Data
        if (isEditMode) {
          if (passedBooking) {
            // Optimization: Use data passed from navigation state (no API call needed)
            populateForm(passedBooking);
          } else if (id) {
            // Fallback: Fetch by ID if user refreshed the page
            const booking = await bookingService.getBookingById(Number(id));
            populateForm(booking);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load booking data");
        navigate("/admin/bookings/pending");
      } finally {
        setIsFetchingData(false);
      }
    };

    init();
  }, [id, isEditMode, navigate, passedBooking]);

  // Handlers
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.vehicleClassId) {
        toast.error("Please select a vehicle class");
        setIsLoading(false);
        return;
      }

      // Re-assemble stops into remarks string
      const validStops = formData.stops.filter((s) => s.trim() !== "");
      let finalRemarks = formData.remarks;
      if (validStops.length > 0) {
        finalRemarks += ` | Intermediate Stops: ${validStops.join(" -> ")}`;
      }

      const payload: CreateBookingRequest = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        contactNumber: formData.contactNumber,
        numberOfPassengers: parseInt(formData.numberOfPassengers) || 1,
        corporateId:
          formData.isCorporate && formData.corporateId
            ? parseInt(formData.corporateId)
            : undefined,
        hireType: formData.hireType,
        vehicleClassId: parseInt(formData.vehicleClassId),
        paymentType: formData.paymentType as PaymentType,
        pickupAddress: formData.pickupAddress,
        dropAddress: formData.dropAddress,
        destination: formData.destination || formData.dropAddress,
        pickupTime: formData.pickupTime
          ? new Date(formData.pickupTime).toISOString()
          : undefined,
        isAdvanceBooking: formData.isAdvanceBooking,
        remarks: finalRemarks,
        specialRemarks: formData.specialRemarks,

        // ✅ NEW FIELD
        // Must match backend enum value (WEB / MOBILE_APP / CASH_HIRE)
        bookingSource: formData.bookingSource,

        // Backend flags
        isTestBooking: false,
        isInquiryOnly: false,
        sendClientSms: true,
      };

      if (isEditMode && id) {
        await bookingService.updateBooking(Number(id), payload);
        toast.success("Booking updated successfully");
      } else {
        await bookingService.createBooking(payload);
        toast.success("Booking created successfully");
      }

      navigate(-1); // Return to previous screen
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.response?.data?.message || "Failed to save booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#6330B8]">
              {isEditMode ? "Edit Booking" : "Add New Booking"}
            </h1>
            {isEditMode && (
              <p className="text-sm text-gray-500">
                Booking ID: {passedBooking?.bookingId || id}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-[#6330B8] hover:bg-[#5028a0]"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditMode ? "Update Booking" : "Save Booking"}
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
                onCheckedChange={(checked) =>
                  handleChange("isCorporate", checked as boolean)
                }
              />
              <Label
                htmlFor="isCorporate"
                className="text-xs font-semibold text-[#6330B8] cursor-pointer"
              >
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Customer Email</Label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange("customerEmail", e.target.value)}
              />
            </div>
            {formData.isCorporate && (
              <div className="space-y-2 animate-in fade-in">
                <Label className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Corporate ID
                </Label>
                <Input
                  type="number"
                  value={formData.corporateId}
                  onChange={(e) => handleChange("corporateId", e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>No. of Passengers</Label>
              <Input
                type="number"
                min="1"
                value={formData.numberOfPassengers}
                onChange={(e) =>
                  handleChange("numberOfPassengers", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Route Information */}
        <Card>
          <CardHeader>
            <CardTitle>Route Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.pickupTime}
                  onChange={(e) => handleChange("pickupTime", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Pickup Address</Label>
                <Input
                  value={formData.pickupAddress}
                  onChange={(e) =>
                    handleChange("pickupAddress", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* STOPS SECTION */}
            <div className="space-y-3 pt-2 border-t border-dashed">
              <div className="flex items-center justify-between">
                <Label className="text-[#6330B8] font-semibold">
                  Intermediate Stops
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStop}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Stop
                </Button>
              </div>

              {formData.stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="w-16 h-10 justify-center"
                  >
                    Stop {index + 1}
                  </Badge>
                  <Input
                    value={stop}
                    onChange={(e) => handleStopChange(index, e.target.value)}
                    placeholder="Enter waypoint address"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStop(index)}
                    className="text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              <Label>Final Destination Address</Label>
              <Input
                value={formData.dropAddress}
                onChange={(e) => handleChange("dropAddress", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle & Options */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Options</CardTitle>
          </CardHeader>

          {/* changed md:grid-cols-3 -> md:grid-cols-4 to fit booking source */}
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Vehicle Class</Label>
              <Select
                value={formData.vehicleClassId}
                onValueChange={(v) => handleChange("vehicleClassId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleClasses.map((vc) => (
                    <SelectItem key={vc.id} value={vc.id.toString()}>
                      {vc.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hire Type</Label>
              <Select
                value={formData.hireType}
                onValueChange={(v) => handleChange("hireType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On The Meter">On The Meter</SelectItem>
                  <SelectItem value="Fixed Rate">Fixed Rate</SelectItem>
                  <SelectItem value="Package">Package</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select
                value={formData.paymentType}
                onValueChange={(v) => handleChange("paymentType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  {formData.isCorporate && (
                    <SelectItem value="CORPORATE_BILLING">
                      Corporate Billing
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ✅ NEW: Booking Source Dropdown */}
            <div className="space-y-2">
              <Label>Booking Source</Label>
              <Select
                value={formData.bookingSource}
                onValueChange={(v) => handleChange("bookingSource", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEB">Website</SelectItem>
                  <SelectItem value="MOBILE_APP">Mobile App</SelectItem>

                  {/* backend enum usually is CASH_HIRE; label is "Cash Hire" */}
                  <SelectItem value="CASH_HIRE">Cash Hire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="adv"
                checked={formData.isAdvanceBooking}
                onCheckedChange={(c) =>
                  handleChange("isAdvanceBooking", c as boolean)
                }
              />
              <Label htmlFor="adv">Advance Booking</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label>Special Remarks</Label>
              <Input
                value={formData.specialRemarks}
                onChange={(e) => handleChange("specialRemarks", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}