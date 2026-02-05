import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";

interface VehicleOwner {
  id: string;
  personalCompanyName: string;
  nicBusinessReg: string;
  primaryContact: string;
  secondaryContact: string;
  postalAddress: string;
  email: string;
  company: string;
  dateModified: string;
}

export default function ManageOwners() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [owners] = useState<VehicleOwner[]>([
    {
      id: "1",
      personalCompanyName: "Jegath Fernanado",
      nicBusinessReg: "601390698v",
      primaryContact: "0778406882",
      secondaryContact: "0112840625",
      postalAddress: "No 91 Piliyndala Road, maharagma",
      email: "jagathnf123@gmail.com",
      company: "",
      dateModified: "1/17/2018 12:25:25 PM",
    },
    {
      id: "2",
      personalCompanyName: "Sajith Rupasinghe",
      nicBusinessReg: "910111264v",
      primaryContact: "0710780409",
      secondaryContact: "0755809206",
      postalAddress: "20/2B/ Sanwardana",
      email: "566sajith@gmail.com",
      company: "",
      dateModified: "2/10/2018 9:15:30 AM",
    },
  ]);

  const filteredOwners = owners.filter(
    (owner) =>
      owner.personalCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.nicBusinessReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.primaryContact.includes(searchTerm) ||
      owner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Vehicle Owner Management</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle owners and their information</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-owners/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Owner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Owner List</CardTitle>
          <CardDescription>View and manage all vehicle owners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, NIC, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personal/Company Name</TableHead>
                  <TableHead>NIC/Business Registration</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Secondary Contact</TableHead>
                  <TableHead>Postal Address</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No vehicle owners found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.personalCompanyName}</TableCell>
                      <TableCell>{owner.nicBusinessReg}</TableCell>
                      <TableCell>{owner.primaryContact}</TableCell>
                      <TableCell>{owner.secondaryContact}</TableCell>
                      <TableCell>{owner.postalAddress}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.company || "-"}</TableCell>
                      <TableCell>{owner.dateModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/vehicle-owners/edit/${owner.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/vehicle-owners/delete/${owner.id}`)}
                          >
                            <Trash className="h-4 w-4" />
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
