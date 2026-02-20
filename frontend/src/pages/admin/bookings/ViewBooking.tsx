import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function ViewBooking() {
  const { id } = useParams();
  
  // Mock booking data - replace with actual API call
  const bookingData = {
    bookingId: id || "294980",
    customerId: "39653",
    customerName: "Janaka Walgama",
    corporateId: "Casons Taxi Website",
    contactNumber: "0777319186",
    name: "Janaka Walgama",
    numberOfPassengers: "0",
    hireType: "On The Meter",
    pickupTime: "12/27/2025 11:40",
    pickupAddress: "Jaela",
    dropAddress: "Bandaraweka and back (3days 2 Nights)",
    specialRemarks: "Billing - 90,000/- 14-seater van 3 days 600km",
    luggage: "0.00",
    remarks: "Jaela - Bandaraweka and back (3days 2 Nights)",
    advBooking: "Test Booking",
    inquiry: "Inquiry Only",
    destination: "",
    vehicleClass: "VAN",
    fareScheme: "STANDARD",
    paymentType: "Cash Payments",
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#6330B8]">Add New Booking</h1>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-[#6330B8] hover:bg-[#6330B8]/90">Save</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" value={bookingData.customerName} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="corporateId">Corporate Id</Label>
              <Input id="corporateId" value={bookingData.corporateId} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact #</Label>
              <Input id="contact" value={bookingData.contactNumber} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={bookingData.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="passengers">No. of Pass</Label>
              <Input id="passengers" type="number" value={bookingData.numberOfPassengers} />
            </div>
          </CardContent>
        </Card>

        {/* Pickup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="hireType">Hire Type</Label>
              <Select value={bookingData.hireType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On The Meter">On The Meter</SelectItem>
                  <SelectItem value="Special Package">Special Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <Input id="pickupTime" type="datetime-local" value={bookingData.pickupTime} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input id="pickupAddress" value={bookingData.pickupAddress} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dropAddress">Drop Address</Label>
              <Input id="dropAddress" value={bookingData.dropAddress} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialRemarks">Special Remarks</Label>
              <Textarea id="specialRemarks" value={bookingData.specialRemarks} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Other Information */}
        <Card>
          <CardHeader>
            <CardTitle>Other Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="luggage">Luggage (Kg)</Label>
              <Input id="luggage" type="number" value={bookingData.luggage} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" value={bookingData.remarks} rows={3} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="advBooking">Adv Booking</Label>
              <Input id="advBooking" value={bookingData.advBooking} />
            </div>
          </CardContent>
        </Card>

        {/* Inquiry */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="inquiryOnly" checked={bookingData.inquiry === "Inquiry Only"} />
              <Label htmlFor="inquiryOnly">Inquiry Only</Label>
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card>
          <CardHeader>
            <CardTitle>Destination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination/Dropoff</Label>
              <Input id="destination" value={bookingData.destination} placeholder="Enter destination" />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicleClass">Vehicle Class</Label>
              <Select value={bookingData.vehicleClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAN">VAN</SelectItem>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="LUXURY">LUXURY</SelectItem>
                  <SelectItem value="ECONOMY">ECONOMY</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fareScheme">Fare Scheme</Label>
              <Select value={bookingData.fareScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select value={bookingData.paymentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash Payments">Cash Payments</SelectItem>
                  <SelectItem value="Card Payments">Card Payments</SelectItem>
                  <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
