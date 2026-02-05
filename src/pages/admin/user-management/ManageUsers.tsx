import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "@/api/index"; // Import API functions
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: number;
  username: string; 
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: { id: number; roleName: string; description?: string }[]; // Backend returns array of roles
}

export default function ManageUsers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // Changed default to 'all'
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Map frontend filter value to backend expected value
      const backendFilterType = filterBy === "phoneNo" ? "phone" : "all";
      
      const data = await getUsers(backendFilterType, searchTerm);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    // Add a small debounce to prevent too many API calls while typing
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterBy]);

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        // Refresh list after delete
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      {/* Updated property names to match backend response */}
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.lastName}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {role.roleName}
                            </Badge>
                          ))
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
                            onClick={() => handleDelete(user.id)}
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