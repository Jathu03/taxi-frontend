import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DeleteUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data - in real app, fetch based on id
  const [userData] = useState({
    userName: "Dj",
    email: "judeferdinands585@gmail.com",
    firstName: "cj",
    lastName: "-",
    phoneNumber: "0726208396",
    roles: {
      accountant: false,
      administrator: false,
      callCenterAgent: false,
      corporate: false,
      driver: false,
    },
  });

  const handleDelete = () => {
    console.log("Deleting user with ID:", id);

    toast({
      title: "Success",
      description: "User has been deleted successfully.",
    });

    navigate("/admin/users/manage");
  };

  const selectedRoles = Object.entries(userData.roles)
    .filter(([, selected]) => selected)
    .map(([role]) => role);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Delete User {userData.firstName}</h1>
          <p className="text-muted-foreground mt-1">Review user details before deletion</p>
        </div>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">User Name</p>
              <p className="text-sm font-semibold">{userData.userName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-semibold">{userData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Name</p>
              <p className="text-sm font-semibold">{userData.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Name</p>
              <p className="text-sm font-semibold">{userData.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="text-sm font-semibold">{userData.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRoles.length > 0 ? (
                  selectedRoles.map((role) => (
                    <Badge key={role} variant="outline" className="capitalize">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate("/admin/users/manage")}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
