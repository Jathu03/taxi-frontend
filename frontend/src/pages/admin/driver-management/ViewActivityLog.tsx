"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export type ActivityLog = {
  id: number;
  driverId: number;
  driverCode: string;
  driverName: string;
  activityType: string;
  vehicleId: number | null;
  vehicleCode: string;
  location: string;
  logDate: string;
  onlineTime: string | null;
  offlineTime: string | null;
  totalOnlineDuration: number | null;
};

// Helper: Format minutes to hours
function formatDuration(minutes: number | null): string {
  if (!minutes && minutes !== 0) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export default function ViewActivityLog() {
  const { toast } = useToast();

  const [filterBy, setFilterBy] = useState("driverName");
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // --- Fetch All Activity Logs ---
  const fetchLogs = async () => {
    setIsLoading(true);

    try {
      // Step 1: Fetch all drivers
      const driversRes = await fetch("http://localhost:8080/api/drivers?page=0&size=100");
      const driversData = await driversRes.json();

      // Extract driver list
      let drivers: any[] = [];
      if (driversData?.content) {
        drivers = driversData.content;
      } else if (Array.isArray(driversData)) {
        drivers = driversData;
      } else if (driversData?.data?.content) {
        drivers = driversData.data.content;
      }

      if (drivers.length === 0) {
        setLogs([]);
        setIsLoading(false);
        return;
      }

      // Step 2: Fetch activity logs for each driver
      const allLogs: ActivityLog[] = [];

      for (const driver of drivers) {
        try {
          const logsRes = await fetch(
            `http://localhost:8080/api/driver-activity-logs/driver/${driver.id}?page=0&size=50&sortBy=createdAt&sortDir=desc`
          );

          if (logsRes.ok) {
            const logsData = await logsRes.json();

            let logList: any[] = [];
            if (logsData?.content) {
              logList = logsData.content;
            } else if (Array.isArray(logsData)) {
              logList = logsData;
            }

            // Map to our format
            logList.forEach((log: any) => {
              allLogs.push({
                id: log.id,
                driverId: log.driverId,
                driverCode: log.driverCode || "-",
                driverName: log.driverName || "-",
                activityType: log.activityType || "-",
                vehicleId: log.vehicleId,
                vehicleCode: log.vehicleCode || "-",
                location: log.location || "-",
                logDate: log.logDate || "-",
                onlineTime: log.onlineTime,
                offlineTime: log.offlineTime,
                totalOnlineDuration: log.totalOnlineDuration,
              });
            });
          }
        } catch (err) {
          console.warn(`Failed to fetch logs for driver ${driver.id}`, err);
        }
      }

      // Sort by logDate descending
      allLogs.sort((a, b) => {
        if (a.logDate < b.logDate) return 1;
        if (a.logDate > b.logDate) return -1;
        return 0;
      });

      setLogs(allLogs);
      setCurrentPage(0);

    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load activity logs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // --- Client-side Filtering ---
  const filteredLogs = logs.filter((log) => {
    // Text search
    if (searchValue) {
      const value = log[filterBy as keyof ActivityLog]?.toString().toLowerCase() || "";
      if (!value.includes(searchValue.toLowerCase())) return false;
    }

    // Date range filter
    if (log.logDate && log.logDate !== "-") {
      if (log.logDate < startDate || log.logDate > endDate) return false;
    }

    return true;
  });

  // --- Pagination ---
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when searching
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">Driver Activity Logs</h1>
        <p className="text-muted-foreground mt-1">View driver activity history and online duration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Section */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <Label>Filter By:</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driverName">Driver Name</SelectItem>
                  <SelectItem value="driverCode">Driver Code</SelectItem>
                  <SelectItem value="activityType">Activity Type</SelectItem>
                  <SelectItem value="vehicleCode">Vehicle Code</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              Search
            </Button>
            <Button onClick={fetchLogs} variant="outline" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Code</TableHead>
                  <TableHead className="font-bold text-black">Driver Name</TableHead>
                  <TableHead className="font-bold text-black">Activity Type</TableHead>
                  <TableHead className="font-bold text-black">Vehicle Code</TableHead>
                  <TableHead className="font-bold text-black">Location</TableHead>
                  <TableHead className="font-bold text-black">Log Date</TableHead>
                  <TableHead className="font-bold text-black">Total Online Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading activity logs...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.driverCode}</TableCell>
                      <TableCell>{log.driverName}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.activityType === "ONLINE"
                              ? "bg-green-100 text-green-700"
                              : log.activityType === "OFFLINE"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {log.activityType}
                        </span>
                      </TableCell>
                      <TableCell>{log.vehicleCode}</TableCell>
                      <TableCell>{log.location}</TableCell>
                      <TableCell>{log.logDate}</TableCell>
                      <TableCell>{formatDuration(log.totalOnlineDuration)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Page {currentPage + 1} of {totalPages || 1} (Total: {filteredLogs.length})
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 0 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage >= totalPages - 1 || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}