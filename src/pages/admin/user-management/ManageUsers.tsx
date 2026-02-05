import { useState, useEffect} from "react";
import { getUsers, type User as ApiUser } from "@/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("phoneNo");

  // Mock data
  const [users] = useState<User[]>([
    {
      id: "1",
      userName: "Dj",
      email: "judeferdinands585@gmail.com",
      firstName: "cj",
      lastName: "-",
      phoneNumber: "0726208396",
      role: "",
    },
    {
      id: "2",
      userName: "0778508595",
      email: "0778508595@gmail.com",
      firstName: "Mohamed",
      lastName: "rifkhan",
      phoneNumber: "0778508595",
      role: "Driver",
    },
    {
      id: "3",
      userName: "0715892313",
      email: "0715892313@gmail.com",
      firstName: "Ranadinghe",
      lastName: "Arachchige Suresh Nilanka Chandana",
      phoneNumber: "0715892313",
      role: "Driver",
    },
    {
      id: "4",
      userName: "admin",
      email: "admin@casons.com",
      firstName: "System",
      lastName: "Administrator",
      phoneNumber: "0112345678",
      role: "Administrator",
    },
    {
      id: "5",
      userName: "john_driver",
      email: "john.driver@gmail.com",
      firstName: "John",
      lastName: "Silva",
      phoneNumber: "0771234567",
      role: "Driver",
    },
    {
      id: "6",
      userName: "mary_cc",
      email: "mary.center@casons.com",
      firstName: "Mary",
      lastName: "Perera",
      phoneNumber: "0772345678",
      role: "CallCenterAgent",
    },
    {
      id: "7",
      userName: "corp_user1",
      email: "corporate@company.com",
      firstName: "David",
      lastName: "Fernando",
      phoneNumber: "0773456789",
      role: "Corporate",
    },
    {
      id: "8",
      userName: "accountant1",
      email: "accounts@casons.com",
      firstName: "Sarah",
      lastName: "Jayawardena",
      phoneNumber: "0774567890",
      role: "Accountant",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    if (filterBy === "phoneNo") {
      return user.phoneNumber.includes(searchTerm);
    }
    return (
      user.userName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.phoneNumber.includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Users</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their access</p>
        </div>
        <Button
          onClick={() => navigate("/admin/users/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>View and manage all system users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Filter By:</label>
              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phoneNo">Phone No</SelectItem>
                    <SelectItem value="all">All Fields</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={filterBy === "phoneNo" ? "Search by phone number..." : "Search users..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant="outline">{user.role}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => navigate(`/admin/users/reset-password/${user.id}`)}
                          >
                            Reset Password
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => navigate(`/admin/users/delete/${user.id}`)}
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
