import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, UserPlus } from "lucide-react"; // Added Plus and UserPlus icons

interface CorporateUser {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const mockUsers: CorporateUser[] = [
  {
    id: "1",
    userName: "democorp",
    email: "admin@aneef.com",
    firstName: "Demo",
    lastName: "Corp",
    phoneNumber: "",
  },
  {
    id: "2",
    userName: "thufailrm",
    email: "thufail@gmail.com",
    firstName: "thufail",
    lastName: "Rafi",
    phoneNumber: "",
  },
  {
    id: "3",
    userName: "WaleedhN",
    email: "waleedh1@codezync.com",
    firstName: "Waleedh",
    lastName: "Naim",
    phoneNumber: "",
  },
  {
    id: "4",
    userName: "shukrycorp",
    email: "shukry@yahoo.com",
    firstName: "Mohammed",
    lastName: "Shukry",
    phoneNumber: "",
  },
  {
    id: "5",
    userName: "johnsmith",
    email: "john@example.com",
    firstName: "John",
    lastName: "Smith",
    phoneNumber: "0771234567",
  },
  {
    id: "6",
    userName: "sarahj",
    email: "sarah@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    phoneNumber: "0779876543",
  },
  {
    id: "7",
    userName: "mikeb",
    email: "mike@example.com",
    firstName: "Mike",
    lastName: "Brown",
    phoneNumber: "0772345678",
  },
];

export default function ManageCorporateUsers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock corporate name - in real app, fetch based on id
  const corporateName = id === "1" ? "Codezync PVT Ltd" : id === "2" ? "MILLENNIUM IT" : "Tech Solutions Lanka";

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/corporate/manage")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Users - {corporateName}</h1>
          <p className="text-muted-foreground mt-1">Manage users for this corporate client</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Corporate Users</CardTitle>
              <CardDescription>Showing all {filteredUsers.length} users</CardDescription>
            </div>
            {/* NEW ADD USER BUTTON */}
            <Button 
              className="bg-[#6330B8] hover:bg-[#4f2694] text-white gap-2 shadow-md transition-all hover:scale-105"
              onClick={() => navigate(`/admin/corporate/${id}/users/add`)}
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Filter by username, email, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UserPlus className="h-8 w-8 mb-2 opacity-20" />
                        <p>No users found matching your search.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.phoneNumber || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporate/${id}/users/edit/${user.id}`)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/corporate/${id}/users/delete/${user.id}`)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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