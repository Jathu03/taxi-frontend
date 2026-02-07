"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type PromoCode = {
  id: string;
  code: string;
  description: string;
  vehicleClasses: string;
  discountIn: string;
  discountValue: number;
  isFirstTimeOnly: boolean;
  maxAmount: number;
  maxCountPerUser: number;
  maxUsage: number;
  maxHireCount: number;
  minimumHireCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const mockPromoCodes: PromoCode[] = [
  { id: "1", code: "Ride1", description: "Offer", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Percentage", discountValue: 30, isFirstTimeOnly: false, maxAmount: 150.00, maxCountPerUser: 20, maxUsage: 500, maxHireCount: 0, minimumHireCount: 0, startDate: "6/5/2018 5:34:00 AM", endDate: "7/31/2018 5:34:00 AM", isActive: false },
  { id: "2", code: "MON101", description: "Weekend promotoin", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Percentage", discountValue: 10, isFirstTimeOnly: false, maxAmount: 500.00, maxCountPerUser: 15, maxUsage: 100, maxHireCount: 0, minimumHireCount: 0, startDate: "6/4/2018 12:02:00 PM", endDate: "6/7/2018 12:02:00 PM", isActive: false },
  { id: "3", code: "MON100", description: "Days", vehicleClasses: "BUDGET   STANDARD  ", discountIn: "Amount", discountValue: 100, isFirstTimeOnly: false, maxAmount: 0.00, maxCountPerUser: 5, maxUsage: 10, maxHireCount: 0, minimumHireCount: 0, startDate: "5/28/2018 1:13:00 AM", endDate: "6/1/2018 1:13:00 AM", isActive: false },
];

export default function ManagePromoCodes() {
  const navigate = useNavigate();
  const [filterBy, setFilterBy] = useState("code");
  const [searchValue, setSearchValue] = useState("");
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);

  const filteredPromoCodes = promoCodes.filter((promo) => {
    if (!searchValue) return true;
    const value = promo[filterBy as keyof PromoCode]?.toString().toLowerCase() || "";
    return value.includes(searchValue.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Promo Codes</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional discount codes</p>
        </div>
        <Button onClick={() => navigate("/admin/promo-codes/add")}>
          Create New
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promo Code List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Section */}
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <Label>Filter By:</Label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="vehicleClasses">Vehicle Classes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Code</TableHead>
                  <TableHead className="font-bold text-black">Description</TableHead>
                  <TableHead className="font-bold text-black">Vehicle Classes</TableHead>
                  <TableHead className="font-bold text-black">Discount In</TableHead>
                  <TableHead className="font-bold text-black">Discount Value</TableHead>
                  <TableHead className="font-bold text-black">Is First Time Only</TableHead>
                  <TableHead className="font-bold text-black">Max Amount</TableHead>
                  <TableHead className="font-bold text-black">Max Count Per User</TableHead>
                  <TableHead className="font-bold text-black">Max Usage</TableHead>
                  <TableHead className="font-bold text-black">Max Hire Count</TableHead>
                  <TableHead className="font-bold text-black">Minimum Hire Count</TableHead>
                  <TableHead className="font-bold text-black">Start Date</TableHead>
                  <TableHead className="font-bold text-black">End Date</TableHead>
                  <TableHead className="font-bold text-black">Is Active</TableHead>
                  <TableHead className="font-bold text-black">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.code}</TableCell>
                    <TableCell>{promo.description}</TableCell>
                    <TableCell>{promo.vehicleClasses}</TableCell>
                    <TableCell>{promo.discountIn}</TableCell>
                    <TableCell>{promo.discountValue}</TableCell>
                    <TableCell>{promo.isFirstTimeOnly ? "Yes" : ""}</TableCell>
                    <TableCell>{promo.maxAmount.toFixed(2)}</TableCell>
                    <TableCell>{promo.maxCountPerUser}</TableCell>
                    <TableCell>{promo.maxUsage}</TableCell>
                    <TableCell>{promo.maxHireCount}</TableCell>
                    <TableCell>{promo.minimumHireCount}</TableCell>
                    <TableCell>{promo.startDate}</TableCell>
                    <TableCell>{promo.endDate}</TableCell>
                    <TableCell>
                      {promo.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-blue-600"
                          onClick={() => navigate(`/admin/promo-codes/edit/${promo.id}`)}
                        >
                          Edit
                        </Button>
                        <span className="text-muted-foreground">|</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-red-600"
                          onClick={() => navigate(`/admin/promo-codes/delete/${promo.id}`)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
