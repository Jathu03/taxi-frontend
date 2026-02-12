import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/user/userService"; 
import type { UserResponse } from "@/services/user/types"; 
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // 1. Fetch User Details to display the Name
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
          description: "Could not load user details.",
          variant: "destructive",
        });
        navigate("/admin/users/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Client-side validation check
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;

    // 3. Call API
    try {
      setSubmitting(true);
      
      await userService.resetPassword(Number(id), {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      toast({
        title: "Success",
        description: "Password has been reset successfully.",
      });

      navigate("/admin/users/manage");
    } catch (error: any) {
      console.error("Reset password failed:", error);
      
      // --- UPDATED ERROR HANDLING ---
      let errorMessage = "Failed to reset password. Please try again.";

      // Check if the backend sent a specific validation error
      if (error.response && error.response.data) {
        const data = error.response.data;
        
        // Check for specific field errors (from backend @Valid annotations)
        if (data.password) {
          errorMessage = data.password;
        } else if (data.confirmPassword) {
          errorMessage = data.confirmPassword;
        } else if (data.error) {
          // Check for generic runtime errors
          errorMessage = data.error;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state for initial data fetch
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

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Reset Password</h1>
          <p className="text-muted-foreground mt-1">Reset password for {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter new password for the user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Display User Name (Read Only) */}
            <div className="space-y-2">
              <Label>User Name</Label>
              <div className="px-3 py-2 border rounded-md bg-muted text-muted-foreground">
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/users/manage")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#6330B8] hover:bg-[#6330B8]/90"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}