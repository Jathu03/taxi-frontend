// src/pages/admin/bookings/CancelBooking.tsx

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
import { ArrowLeft, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import cancelService from "@/services/bookings/cancelService";
import type { BookingCancellationResponse } from "@/services/bookings/cancelService"
import type { BookingResponse } from "@/services/bookings/types";

export default function CancelBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // This is the Booking ID (e.g., 1 or BK123)
  
  // -- State Management --
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // The main booking object (General Info)
  const [booking, setBooking] = useState<BookingResponse | null>(location.state?.booking || null);
  
  // The specific cancellation info (Reason, Agent Name) - only for View Mode
  const [cancellationInfo, setCancellationInfo] = useState<BookingCancellationResponse | null>(null);

  // Form Input
  const [cancellationReason, setCancellationReason] = useState("");

  // Determine Mode
  const isViewMode = booking?.status === "CANCELLED";

  // -- Fetch Data --
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        let currentBooking = booking;
        
        // 1. If we don't have booking data from navigation state, fetch it
        if (!currentBooking) {
          currentBooking = await cancelService.getBookingDetails(id);
          setBooking(currentBooking);
        }

        // 2. If it's already cancelled, we need the "Cancellation Details" (Reason, Who cancelled it)
        // These details live in the CancelledHireController / BookingCancellation entity
        if (currentBooking.status === "CANCELLED") {
          const details = await cancelService.getCancellationDetails(currentBooking.bookingId);
          if (details) setCancellationInfo(details);
        }

      } catch (error) {
        console.error("Error loading booking:", error);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, booking]);

  // -- Submit Handler --
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    if (!cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    setSubmitting(true);
    try {
      await cancelService.cancelBooking(id, {
        cancellationReason: cancellationReason,
        cancelledType: "ADMIN_CANCELLED",
        cancelledByType: "USER",
        cancelledByUserId: 1, // TODO: Get this from your Auth Context (current user ID)
      });
      
      toast.success("Booking cancelled successfully.");
      // Navigate to the Cancelled Hires LIST page
      navigate("/admin/bookings/cancelled"); 
    } catch (error: any) {
      console.error("Cancellation failed", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!booking) {
    return <div className="p-6">Booking not found.</div>;
  }

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
              {isViewMode ? `Cancelled Booking ${booking.bookingId}` : `Cancel Booking ${booking.bookingId}`}
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
            disabled={submitting}
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
            Confirm Cancellation
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
              <Input value={booking.customerName || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corporateId">Corporate / Org</Label>
              <Input value={booking.corporateName || booking.bookingSource || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact #</Label>
              <Input value={booking.contactNumber || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Passenger Name</Label>
              <Input value={booking.passengerName || booking.customerName || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPassengers">No. of Pass</Label>
              <Input value={String(booking.numberOfPassengers || 0)} readOnly className="bg-gray-50" />
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
                <Input value={String(booking.luggage || "0.00")} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea value={booking.remarks || booking.clientRemarks || ""} rows={3} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="advBooking" checked={booking.isAdvanceBooking || false} disabled />
              <Label htmlFor="advBooking" className="cursor-default text-gray-500">Adv Booking</Label>
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
              <Input value={booking.vehicleClassName || "Standard"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fareScheme">Fare Scheme</Label>
              <Input value={booking.fareSchemeName || "Standard Tariff"} readOnly className="bg-gray-50" />
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
                value={booking.pickupTime ? new Date(booking.pickupTime).toLocaleString() : ""} 
                readOnly 
                className="bg-gray-50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input value={booking.pickupAddress || ""} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropAddress">Drop Address</Label>
              <Input value={booking.dropAddress || "N/A"} readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRemarks">Special Remarks</Label>
              <Textarea value={booking.specialRemarks || ""} rows={2} readOnly className="bg-gray-50" />
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
              <Label htmlFor="driverVehicle">Assigned Driver</Label>
              <Select value={booking.driverId ? String(booking.driverId) : "none"} disabled>
                <SelectTrigger id="driverVehicle" className="bg-gray-50">
                  <SelectValue placeholder="No driver assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver assigned</SelectItem>
                  {booking.driverId && (
                    <SelectItem value={String(booking.driverId)}>
                      {booking.driverName} ({booking.vehicleRegistrationNumber})
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Information (VIEW MODE ONLY) */}
        {isViewMode && cancellationInfo && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Cancellation Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cancelled Time</Label>
                <Input value={new Date(cancellationInfo.cancelledTime).toLocaleString()} readOnly className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Cancelled Type</Label>
                <Input value={cancellationInfo.cancelledType} readOnly className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Cancelled By</Label>
                <Input 
                  value={cancellationInfo.cancelledByUserName || cancellationInfo.cancelledByType} 
                  readOnly 
                  className="bg-white" 
                />
              </div>
              <div className="col-span-1 md:col-span-3 space-y-2">
                <Label>Reason</Label>
                <Textarea value={cancellationInfo.cancellationReason} readOnly className="bg-white" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cancellation Reason Input (ACTION MODE ONLY) */}
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
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this booking"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
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
              disabled={submitting}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Confirm Cancellation
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}