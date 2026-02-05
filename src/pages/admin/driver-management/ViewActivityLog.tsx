"use client";
import { useState } from "react";
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

export type ActivityLog = {
  id: string;
  code: string;
  firstName: string;
  contactNumber: string;
  vehicleCode: string;
  vehicleModel: string;
  lastLocation: string;
  totalOnlineDuration: string;
};

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    code: "508 Nuwan",
    firstName: "Nuwan",
    contactNumber: "0755555797",
    vehicleCode: "PF 1008",
    vehicleModel: "Toyota Prius",
    lastLocation: "Colombo Fort, Western Province",
    totalOnlineDuration: "8h 30m",
  },
  {
    id: "2",
    code: "Pick me 20",
    firstName: "Fayaz",
    contactNumber: "0714786306",
    vehicleCode: "CAQ-8543",
    vehicleModel: "Honda Vezel",
    lastLocation: "Kandy City, Central Province",
    totalOnlineDuration: "7h 15m",
  },
  {
    id: "3",
    code: "3221 Fazly",
    firstName: "Fazly",
    contactNumber: "0779901001",
    vehicleCode: "CAB-1234",
    vehicleModel: "Suzuki Alto",
    lastLocation: "Galle Face, Colombo",
    totalOnlineDuration: "9h 45m",
  },
  {
    id: "4",
    code: "3218 Wazeem",
    firstName: "Wazeem",
    contactNumber: "0779765110",
    vehicleCode: "CAB-5678",
    vehicleModel: "Toyota Aqua",
    lastLocation: "Mount Lavinia, Colombo",
    totalOnlineDuration: "6h 20m",
  },
  {
    id: "5",
    code: "Ishan 15ft lorry",
    firstName: "Ishan",
    contactNumber: "0466464646",
    vehicleCode: "LOR-1001",
    vehicleModel: "Isuzu Lorry",
    lastLocation: "Kelaniya, Gampaha",
    totalOnlineDuration: "10h 00m",
  },
  {
    id: "6",
    code: "Counter CAP-6283",
    firstName: "Kasun",
    contactNumber: "0779945115",
    vehicleCode: "CAP-6283",
    vehicleModel: "Nissan Caravan",
    lastLocation: "Negombo, Western Province",
    totalOnlineDuration: "5h 40m",
  },
  {
    id: "7",
    code: "Wedage Lorry 001",
    firstName: "Ruwan",
    contactNumber: "0778251215",
    vehicleCode: "WED-001",
    vehicleModel: "Mitsubishi Canter",
    lastLocation: "Kadawatha, Gampaha",
    totalOnlineDuration: "8h 10m",
  },
  {
    id: "8",
    code: "3219 Vinoj",
    firstName: "Vinoj",
    contactNumber: "778484774",
    vehicleCode: "CAB-9876",
    vehicleModel: "Suzuki Wagon R",
    lastLocation: "Dehiwala, Colombo",
    totalOnlineDuration: "7h 55m",
  },
  {
    id: "9",
    code: "509 Hewage",
    firstName: "Hewage",
    contactNumber: "0779116995",
    vehicleCode: "CAB-2468",
    vehicleModel: "Toyota Vitz",
    lastLocation: "Moratuwa, Western Province",
    totalOnlineDuration: "6h 30m",
  },
  {
    id: "10",
    code: "3220 Jayantha",
    firstName: "Jayantha",
    contactNumber: "0711652553",
    vehicleCode: "CAB-1357",
    vehicleModel: "Honda Fit",
    lastLocation: "Panadura, Kalutara",
    totalOnlineDuration: "9h 00m",
  },
];

export default function ViewActivityLog() {
  const [filterBy, setFilterBy] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("2025-12-04");
  const [endDate, setEndDate] = useState("2025-12-05");
  const [logs] = useState(mockActivityLogs);

  const filteredLogs = logs.filter((log) => {
    if (!searchValue) return true;
    const value = log[filterBy as keyof ActivityLog]?.toString().toLowerCase() || "";
    return value.includes(searchValue.toLowerCase());
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentPage = 0;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Driver Activity Logs</h1>
        <p className="text-muted-foreground mt-1">View driver activity history and online duration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Section */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
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
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button>Search</Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Vehicle Code</TableHead>
                  <TableHead>Vehicle Model</TableHead>
                  <TableHead>Last Location</TableHead>
                  <TableHead>Total Online Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.code}</TableCell>
                      <TableCell>{log.firstName}</TableCell>
                      <TableCell>{log.contactNumber}</TableCell>
                      <TableCell>{log.vehicleCode}</TableCell>
                      <TableCell>{log.vehicleModel}</TableCell>
                      <TableCell>{log.lastLocation}</TableCell>
                      <TableCell>{log.totalOnlineDuration}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Page {currentPage} of {totalPages} (Total: {filteredLogs.length})
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
