"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SendSMS() {
  const { toast } = useToast();
  
  // Bulk SMS state
  const [bulkSMS, setBulkSMS] = useState({
    phoneNumbers: "",
    message: "",
  });

  // Vehicle Class SMS state
  const [vehicleClassSMS, setVehicleClassSMS] = useState({
    vehicleClass: "",
    message: "",
  });

  // Driver SMS state
  const [driverSMS, setDriverSMS] = useState({
    driver: "",
    message: "",
  });

  const handleBulkSMSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bulk SMS Sent Successfully",
      description: "Your message has been sent to the specified phone numbers.",
    });
    setBulkSMS({ phoneNumbers: "", message: "" });
  };

  const handleVehicleClassSMSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Vehicle Class SMS Sent Successfully",
      description: `Your message has been sent to all drivers in ${vehicleClassSMS.vehicleClass} class.`,
    });
    setVehicleClassSMS({ vehicleClass: "", message: "" });
  };

  const handleDriverSMSSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Driver SMS Sent Successfully",
      description: "Your message has been sent to the driver.",
    });
    setDriverSMS({ driver: "", message: "" });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">SMS Portal</h1>
        <p className="text-muted-foreground mt-1">Send SMS notifications to drivers and customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bulk SMS */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk SMS</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkSMSSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulkPhoneNumbers">Add Phone Numbers</Label>
                <Textarea
                  id="bulkPhoneNumbers"
                  value={bulkSMS.phoneNumbers}
                  onChange={(e) => setBulkSMS({ ...bulkSMS, phoneNumbers: e.target.value })}
                  rows={3}
                  placeholder="e.g: 07XXXXXXXX,07XXXXXXXX,07XXXXXXXX"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulkMessage">Message</Label>
                <Textarea
                  id="bulkMessage"
                  value={bulkSMS.message}
                  onChange={(e) => {
                    if (e.target.value.length <= 400) {
                      setBulkSMS({ ...bulkSMS, message: e.target.value });
                    }
                  }}
                  rows={5}
                  placeholder="Type your message here..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Message cannot exceed 400 characters ({bulkSMS.message.length}/400)
                </p>
              </div>

              <Button type="submit" className="w-full">
                Send Bulk SMS
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Vehicle Class SMS */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Class SMS</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVehicleClassSMSSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleClass">Select Vehicle Class</Label>
                <Select 
                  value={vehicleClassSMS.vehicleClass} 
                  onValueChange={(value) => setVehicleClassSMS({ ...vehicleClassSMS, vehicleClass: value })}
                  required
                >
                  <SelectTrigger id="vehicleClass">
                    <SelectValue placeholder="Select a Vehicle Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUXURY">LUXURY</SelectItem>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="ECONOMY">ECONOMY</SelectItem>
                    <SelectItem value="BUDGET">BUDGET</SelectItem>
                    <SelectItem value="VAN">VAN</SelectItem>
                    <SelectItem value="MINI VAN">MINI VAN</SelectItem>
                    <SelectItem value="BUS">BUS</SelectItem>
                    <SelectItem value="TUK">TUK</SelectItem>
                    <SelectItem value="Lorry">Lorry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleClassMessage">Message</Label>
                <Textarea
                  id="vehicleClassMessage"
                  value={vehicleClassSMS.message}
                  onChange={(e) => {
                    if (e.target.value.length <= 400) {
                      setVehicleClassSMS({ ...vehicleClassSMS, message: e.target.value });
                    }
                  }}
                  rows={5}
                  placeholder="Type your message here..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Message cannot exceed 400 characters ({vehicleClassSMS.message.length}/400)
                </p>
              </div>

              <Button type="submit" className="w-full">
                Send Class SMS
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Driver SMS */}
        <Card>
          <CardHeader>
            <CardTitle>Driver SMS</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDriverSMSSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <Input
                  id="driver"
                  value={driverSMS.driver}
                  onChange={(e) => setDriverSMS({ ...driverSMS, driver: e.target.value })}
                  placeholder="Enter Driver Code or Phone Number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverMessage">Message</Label>
                <Textarea
                  id="driverMessage"
                  value={driverSMS.message}
                  onChange={(e) => {
                    if (e.target.value.length <= 400) {
                      setDriverSMS({ ...driverSMS, message: e.target.value });
                    }
                  }}
                  rows={5}
                  placeholder="Type your message here..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Message cannot exceed 400 characters ({driverSMS.message.length}/400)
                </p>
              </div>

              <Button type="submit" className="w-full">
                Send Driver SMS
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
