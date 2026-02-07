"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Driver = {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  contactNumber: string;
  emergencyNumber: string;
  manualDispatch: boolean;
  blocked: boolean;
  lastLocation: string;
  appVersion: string;
};

const mockDrivers: Driver[] = [
  { id: "1", code: "Ishan 15ft lorry", firstName: "Ishan", lastName: "", nic: "", contactNumber: "0466464646", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "2", code: "Ishan Outside", firstName: "Ishan", lastName: "", nic: "5415xz1c56z1x", contactNumber: "0778024462", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "3", code: "3221 Fazly", firstName: "Fazly", lastName: "Farook", nic: "883290046v", contactNumber: "0779901001", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "4", code: "3218 Wazeem", firstName: "Wazeem", lastName: "", nic: "564545f64", contactNumber: "0779765110", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "5", code: "Pick me 20", firstName: "Fayaz", lastName: "-", nic: "sadfasdfasd", contactNumber: "0714786306", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "6", code: "Counter CAP-6283", firstName: "Kasun", lastName: "", nic: "5645641564165v", contactNumber: "0779945115", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "7", code: "Wedage Lorry 001", firstName: "Ruwan", lastName: "Sameera", nic: "7547857643773v", contactNumber: "0778251215", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "8", code: "Ranil Outside", firstName: "Ranil", lastName: "", nic: "0755322121", contactNumber: "0755322121", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "9", code: "3219 Vinoj", firstName: "Vinoj", lastName: "", nic: "770671515v", contactNumber: "778484774", emergencyNumber: "", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "10", code: "509 Hewage", firstName: "Hewage", lastName: "-", nic: "8574575654v", contactNumber: "0779116995", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "11", code: "Santhush Bus", firstName: "Santhush", lastName: "", nic: "75675755575v", contactNumber: "0758898277", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "12", code: "3220 Jayantha", firstName: "Jayantha", lastName: "", nic: "5415353415314", contactNumber: "0711652553", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "13", code: "Chandima Van Outside", firstName: "Chandima", lastName: "54654654", nic: "264548554", contactNumber: "0767168014", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "14", code: "508 Nuwan", firstName: "Nuwan", lastName: "-", nic: "354335445354v", contactNumber: "0755555797", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "15", code: "Prasad Outside", firstName: "Chanuka", lastName: "", nic: "54665456456", contactNumber: "0716583657", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "16", code: "4149 Chinthaka", firstName: "Chinthaka", lastName: "5556", nic: "xzvzxvzxv", contactNumber: "0703298960", emergencyNumber: "0112861111", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "17", code: "3217 Ali", firstName: "Ahmed", lastName: ".", nic: "rtewtertyer", contactNumber: "0760517755", emergencyNumber: "", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "18", code: "507 Sandew", firstName: "Sandew", lastName: "Fernando", nic: "200008901695", contactNumber: "0766427544", emergencyNumber: "", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
  { id: "19", code: "4148 Company Vehicle", firstName: "Neel", lastName: "", nic: "725816565v", contactNumber: "0710832643", emergencyNumber: "", manualDispatch: false, blocked: false, lastLocation: ",", appVersion: "" },
];

export default function ManageDrivers() {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const [drivers, setDrivers] = useState(mockDrivers);

  const filteredDrivers = drivers.filter((driver) => {
    if (!searchValue) return true;
    const value = driver[filterBy as keyof Driver]?.toString().toLowerCase() || "";
    return value.includes(searchValue.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Manage Drivers</h1>
        <p className="text-muted-foreground mt-1">View and manage all driver accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Section */}
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <Label>Filter By:</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="code">Driver Code</SelectItem>
                  <SelectItem value="contactNumber">Contact Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Code</TableHead>
                  <TableHead className="font-bold text-black">First Name</TableHead>
                  <TableHead className="font-bold text-black">Last Name</TableHead>
                  <TableHead className="font-bold text-black">NIC</TableHead>
                  <TableHead className="font-bold text-black">Contact Number</TableHead>
                  <TableHead className="font-bold text-black">Emergency Contact Number</TableHead>
                  <TableHead className="font-bold text-black">Manual Dispatch</TableHead>
                  <TableHead className="font-bold text-black">Blocked</TableHead>
                  <TableHead className="font-bold text-black">Last Location</TableHead>
                  <TableHead className="font-bold text-black">App Ver.</TableHead>
                  <TableHead className="font-bold text-black">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.code}</TableCell>
                    <TableCell>{driver.firstName}</TableCell>
                    <TableCell>{driver.lastName}</TableCell>
                    <TableCell>{driver.nic}</TableCell>
                    <TableCell>{driver.contactNumber}</TableCell>
                    <TableCell>{driver.emergencyNumber}</TableCell>
                    <TableCell>{driver.manualDispatch ? "Yes" : ""}</TableCell>
                    <TableCell>{driver.blocked ? "Yes" : ""}</TableCell>
                    <TableCell>{driver.lastLocation}</TableCell>
                    <TableCell>{driver.appVersion}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-blue-600"
                          onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
                        >
                          Edit
                        </Button>
                        <span className="text-muted-foreground">|</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-red-600"
                          onClick={() => navigate(`/admin/drivers/delete/${driver.id}`)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
