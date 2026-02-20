"use client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Navigation, Clock, User, Car, Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function TrackLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();
  const booking = location.state?.booking;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!booking) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Track Live</h1>
            <p className="text-muted-foreground">Real-time vehicle tracking</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No booking data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Track Live - {booking.bookingId}</h1>
          <p className="text-muted-foreground">Real-time vehicle tracking</p>
        </div>
        <Badge className="text-lg px-4 py-2 bg-green-600">Live Tracking</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "500px" }}>
              {/* Placeholder for map - integrate with Google Maps or similar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">Map View</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Current Location: {booking.currentLocation || "Tracking..."}
                  </p>
                </div>
              </div>
              
              {/* Animated vehicle marker */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" style={{ width: "40px", height: "40px" }}></div>
                  <div className="relative bg-blue-600 rounded-full p-2 shadow-lg">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-500 rounded-full p-2">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-medium text-sm truncate">{booking.pickupLocation || booking.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <div className="bg-red-500 rounded-full p-2">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Drop Location</p>
                  <p className="font-medium text-sm truncate">{booking.dropLocation || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Trip Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge className="bg-green-600">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Time</span>
                <span className="font-medium text-sm">{currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">ETA</span>
                <span className="font-medium text-sm">{booking.estimatedArrival || "N/A"}</span>
              </div>
              {booking.distance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Distance</span>
                  <span className="font-medium text-sm">{booking.distance}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="font-medium">{booking.customerName}</p>
              </div>
              {booking.phoneNumber && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{booking.phoneNumber}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${booking.phoneNumber}`)}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Driver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="h-4 w-4" />
                Driver Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Driver Name</p>
                <p className="font-medium">{booking.driverName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Vehicle Number</p>
                <p className="font-medium">{booking.vehicleNumber}</p>
              </div>
              {booking.arrivalTime && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Arrival Time</p>
                  <p className="font-medium">{booking.arrivalTime}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  navigate(`/admin/bookings/view/${booking.bookingId}`, {
                    state: { booking },
                  })
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                View Full Details
              </Button>
              {booking.phoneNumber && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open(`tel:${booking.phoneNumber}`)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Customer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
