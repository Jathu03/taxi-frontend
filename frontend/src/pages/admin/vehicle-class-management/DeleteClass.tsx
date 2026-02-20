import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import classService from "@/services/vehicle-class/classService";
import type { VehicleClassResponse } from "@/services/vehicle-class/types";

export default function DeleteClass() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<VehicleClassResponse | null>(null);

  // 1. Fetch the data so the user knows what they are deleting
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await classService.getById(Number(id));
        if (response.success && response.data) {
          setData(response.data);
        } else {
          toast({
            title: "Error",
            description: "Could not load vehicle class details.",
            variant: "destructive",
          });
          navigate("/admin/vehicle-classes/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/vehicle-classes/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  // 2. Handle the Delete Action
  const handleDelete = async () => {
    if (!id) return;

    try {
      setSubmitting(true);
      const response = await classService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Vehicle Class Deleted",
          description: "The vehicle class has been removed from the system.",
        });
        navigate("/admin/vehicle-classes/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Delete Vehicle Class</h1>
        <p className="text-muted-foreground mt-1">Review and confirm deletion (ID: {id})</p>
      </div>

      <Card className="border-red-200 shadow-md">
        <CardHeader className="bg-red-50/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Confirm Deletion</CardTitle>
          </div>
          <CardDescription className="text-red-600/80">
            Are you sure you want to delete this vehicle class? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Class Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Basic Class Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Class Name</p>
                <p className="font-medium text-lg">{data.className}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Code</p>
                <p className="font-medium">{data.classCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{data.categoryName || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Show in App</p>
                <Badge variant={data.showInApp ? "default" : "secondary"}>
                  {data.showInApp ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Fare Schemes (IDs only based on current API) */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 text-[#6330B8]">Configuration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="font-medium">{data.commissionRate ? `${data.commissionRate}%` : "0%"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">App Order</p>
                <p className="font-medium">{data.appOrder || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Luggage Capacity</p>
                <p className="font-medium">{data.luggageCapacity || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Seats</p>
                <p className="font-medium">{data.noOfSeats || "-"}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/vehicle-classes/manage")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Class"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}