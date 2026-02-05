import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

interface Corporate {
  id: string;
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  date: string;
  cashDiscountRate: string;
  creditDiscountRate: string;
  enableQuickBooking: string;
}

const mockCorporates: Corporate[] = [
  {
    id: "1",
    name: "Codezync PVT Ltd",
    code: "CODE",
    primaryContact: "Aneef Fashir",
    phone: "0773260907",
    email: "aneef@codezync.com",
    address: "123 Tech Street, Colombo 03",
    date: "2024-01-15",
    cashDiscountRate: "5%",
    creditDiscountRate: "3%",
    enableQuickBooking: "Yes",
  },
  {
    id: "2",
    name: "MILLENNIUM IT",
    code: "MIT",
    primaryContact: "John Doe",
    phone: "0771067711",
    email: "contact@millennium.lk",
    address: "456 Business Road, Colombo 02",
    date: "2024-02-20",
    cashDiscountRate: "7%",
    creditDiscountRate: "4%",
    enableQuickBooking: "Yes",
  },
  {
    id: "3",
    name: "Tech Solutions Lanka",
    code: "TSL",
    primaryContact: "Sarah Fernando",
    phone: "0112416000",
    email: "info@techsolutions.lk",
    address: "789 IT Park, Colombo 05",
    date: "2024-03-10",
    cashDiscountRate: "6%",
    creditDiscountRate: "2%",
    enableQuickBooking: "No",
  },
];

export default function ManageCorporates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCorporates = mockCorporates.filter(
    (corporate) =>
      corporate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corporate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corporate.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corporate.phone.includes(searchTerm) ||
      corporate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Corporate Client Management</h1>
        <p className="text-muted-foreground mt-1">Manage corporate clients and their configurations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Corporate Clients</CardTitle>
              <CardDescription>View and manage all corporate clients</CardDescription>
            </div>
            <Button
              onClick={() => navigate("/admin/corporate/add")}
              className="bg-[#6330B8] hover:bg-[#7C3AED]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Corporate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, code, contact, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[80px]">Code</TableHead>
                  <TableHead className="min-w-[130px]">Primary Contact</TableHead>
                  <TableHead className="min-w-[110px]">Phone</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[200px]">Address</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Cash Discount</TableHead>
                  <TableHead className="min-w-[110px]">Credit Discount</TableHead>
                  <TableHead className="min-w-[120px]">Quick Booking</TableHead>
                  <TableHead className="min-w-[550px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCorporates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground">
                      No corporate clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCorporates.map((corporate) => (
                    <TableRow key={corporate.id}>
                      <TableCell className="font-medium">{corporate.name}</TableCell>
                      <TableCell>{corporate.code}</TableCell>
                      <TableCell>{corporate.primaryContact}</TableCell>
                      <TableCell>{corporate.phone}</TableCell>
                      <TableCell>{corporate.email}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={corporate.address}>{corporate.address}</TableCell>
                      <TableCell>{corporate.date}</TableCell>
                      <TableCell>{corporate.cashDiscountRate}</TableCell>
                      <TableCell>{corporate.creditDiscountRate}</TableCell>
                      <TableCell>{corporate.enableQuickBooking}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/corporate/${corporate.id}/users`)}
                            className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
                          >
                            Manage Users
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/corporate/${corporate.id}/vehicle-categories`)}
                            className="bg-purple-500 hover:bg-purple-600 text-white whitespace-nowrap"
                          >
                            Manage Categories
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/corporate/${corporate.id}/vehicle-classes`)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap"
                          >
                            Manage Classes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/corporate/edit/${corporate.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/corporate/delete/${corporate.id}`)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
