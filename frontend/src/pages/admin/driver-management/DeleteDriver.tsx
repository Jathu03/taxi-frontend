"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import axiosClient from "@/api/axiosClient";

export default function DeleteDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const [driver, setDriver] = useState({
    code: "",
    firstName: "",
    lastName: "",
    nic: "",
    contactNumber: "",
  });

  useEffect(() => {
    console.log("=== DELETE PAGE MOUNTED ===");
    console.log("URL param id:", id);
    console.log("Type of id:", typeof id);

    if (!id) {
      console.log("NO ID FOUND - check your route config");
      return;
    }

    // Direct axios call - bypass driverService completely
    axiosClient
      .get(`/api/drivers/${id}`)
      .then((res) => {
        console.log("=== FULL AXIOS RESPONSE ===");
        console.log("res:", res);
        console.log("res.data:", res.data);
        console.log("res.data type:", typeof res.data);
        console.log("res.data keys:", Object.keys(res.data || {}));

        // Check if data is nested
        if (res.data?.data) {
          console.log("res.data.data:", res.data.data);
          console.log("res.data.data keys:", Object.keys(res.data.data || {}));
        }

        // Try to find the driver object
        const d = res.data?.data || res.data;
        console.log("Final extracted driver:", d);
        console.log("d.code:", d?.code);
        console.log("d.firstName:", d?.firstName);

        if (d && d.firstName) {
          setDriver({
            code: d.code || "",
            firstName: d.firstName || "",
            lastName: d.lastName || "-",
            nic: d.nic || "",
            contactNumber: d.contactNumber || "",
          });
          console.log("=== DRIVER STATE SET SUCCESSFULLY ===");
        } else {
          console.log("=== COULD NOT EXTRACT DRIVER DATA ===");
        }
      })
      .catch((err) => {
        console.error("=== AXIOS ERROR ===");
        console.error("err:", err);
        console.error("err.response:", err.response);
        console.error("err.response?.data:", err.response?.data);
        console.error("err.response?.status:", err.response?.status);
      });
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    setIsDeleting(true);

    axiosClient
      .delete(`/api/drivers/${id}`)
      .then((res) => {
        console.log("=== DELETE SUCCESS ===", res);
        toast({
          title: "Driver Deleted",
          description: `${driver.firstName} has been removed from the system.`,
          variant: "destructive",
        });
        navigate("/admin/drivers/manage");
      })
      .catch((err) => {
        console.error("=== DELETE ERROR ===", err);
        toast({
          title: "Delete Failed",
          description: "Failed to delete driver.",
          variant: "destructive",
        });
        setIsDeleting(false);
      });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delete Driver</h1>
          <p className="text-muted-foreground">Confirm driver deletion</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")}>
          Back to List
        </Button>
      </div>

      {/* DEBUG INFO - Remove after fixing */}
      <Card className="border-blue-300 bg-blue-50">
        <CardContent className="p-4">
          <p className="font-mono text-sm">DEBUG: URL id = "{id}"</p>
          <p className="font-mono text-sm">DEBUG: driver.code = "{driver.code}"</p>
          <p className="font-mono text-sm">DEBUG: driver.firstName = "{driver.firstName}"</p>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Confirm Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete the driver account
              and remove all associated data from the system.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Driver Details:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Code:</span>
                <p className="font-medium">{driver.code || "Loading..."}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{driver.firstName || "Loading..."} {driver.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">NIC:</span>
                <p className="font-medium">{driver.nic || "Loading..."}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Contact:</span>
                <p className="font-medium">{driver.contactNumber || "Loading..."}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate("/admin/drivers/manage")} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Driver"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}