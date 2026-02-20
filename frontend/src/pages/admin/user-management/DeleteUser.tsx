import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/user/userService"; // Adjust path as needed
import type{ UserResponse } from "@/services/user/types"; // Adjust path as needed

export default function DeleteUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 1. Fetch User Details on Load
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await userService.getById(Number(id));
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast({
          title: "Error",
          description: "Could not fetch user details.",
          variant: "destructive",
        });
        // Optional: Redirect back if user not found
        navigate("/admin/users/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast, navigate]);

  // 2. Handle Delete Action
  const handleDelete = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await userService.delete(Number(id));
      
      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      });

      navigate("/admin/users/manage");
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or return a "User Not Found" component
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Delete User: {user.firstName}</h1>
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
              <p className="text-sm font-semibold">{user.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Name</p>
              <p className="text-sm font-semibold">{user.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Name</p>
              <p className="text-sm font-semibold">{user.lastName || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="text-sm font-semibold">{user.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Roles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role.id || role.roleName} variant="outline" className="capitalize">
                      {role.roleName}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/users/manage")}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}