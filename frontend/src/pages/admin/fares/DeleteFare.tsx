import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Services
import fareService from "@/services/fare-schemes/fareService";
import type { FareSchemeResponse } from "@/services/fare-schemes/types";

export default function DeleteFare() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [fareData, setFareData] = useState<FareSchemeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchFare = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await fareService.getById(Number(id));
        if (response.success) {
          setFareData(response.data);
        } else {
          toast({
            title: "Error",
            description: "Could not fetch fare scheme details.",
            variant: "destructive",
          });
          navigate("/admin/fares/manage");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
        navigate("/admin/fares/manage");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFare();
  }, [id, navigate, toast]);

  // 2. Handle Delete
  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    try {
      const response = await fareService.delete(Number(id));
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Fare scheme has been deleted successfully.",
        });
        navigate("/admin/fares/manage");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete fare scheme.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!fareData) return null;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Delete Fare Scheme</h1>
          <p className="text-muted-foreground mt-1">Review fare scheme details before deletion</p>
        </div>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700">Confirm Deletion</CardTitle>
          </div>
          <CardDescription>
            Are you sure you want to delete this fare scheme? This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Fare Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fare Code</p>
                <p className="text-sm font-semibold">{fareData.fareCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Distance (Km)</p>
                <p className="text-sm font-semibold">{fareData.minimumDistance}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Rate (Rs.)</p>
                <p className="text-sm font-semibold">{fareData.minimumRate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate Per Km</p>
                <p className="text-sm font-semibold">{fareData.ratePerKm}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Free Wait Time (min)</p>
                <p className="text-sm font-semibold">{fareData.freeWaitTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Waiting Charge Per min</p>
                <p className="text-sm font-semibold">{fareData.waitingChargePerMin}</p>
              </div>
            </div>
          </div>

          {/* Peak Hour Configuration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Peak Hour Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peak Hour Start Time</p>
                <p className="text-sm font-semibold">{fareData.peakHourStartTime || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peak Hour End Time</p>
                <p className="text-sm font-semibold">{fareData.peakHourEndTime || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Off Peak Min Rate Hike</p>
                <p className="text-sm font-semibold">{fareData.offPeakMinRateHike}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate Per Km Hike</p>
                <p className="text-sm font-semibold">{fareData.ratePerKmHike}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">On the Meter</p>
                <div>
                  {fareData.isMetered ? (
                    <Badge>Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Additional Package Informations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Time</p>
                <p className="text-sm font-semibold">{fareData.minimumTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Additional Time Slot</p>
                <p className="text-sm font-semibold">{fareData.additionalTimeSlot}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate Per Additional Time Slot</p>
                <p className="text-sm font-semibold">{fareData.ratePerAdditionalTimeSlot}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Is Package</p>
                <div>
                  {fareData.isPackage ? (
                    <Badge>Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/fares/manage")}
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
                "Delete Fare Scheme"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}