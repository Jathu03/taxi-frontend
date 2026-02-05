import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FareScheme {
  id: string;
  code: string;
  metered: boolean;
  minKm: string;
  minRate: string;
  ratePerKm: string;
  ratePerKmHike: string;
}

export default function ManageFares() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [fares] = useState<FareScheme[]>([
    {
      id: "1",
      code: "Mileage Calculator",
      metered: false,
      minKm: "1.00",
      minRate: "0.00",
      ratePerKm: "0.00",
      ratePerKmHike: "0.00",
    },
    {
      id: "2",
      code: "STANDARD",
      metered: false,
      minKm: "1.00",
      minRate: "0.00",
      ratePerKm: "0.00",
      ratePerKmHike: "0.00",
    },
    {
      id: "3",
      code: "Central Bank Standard",
      metered: false,
      minKm: "1.00",
      minRate: "133.62",
      ratePerKm: "133.62",
      ratePerKmHike: "133.62",
    },
  ]);

  const filteredFares = fares.filter((fare) =>
    fare.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Fare Scheme</h1>
          <p className="text-muted-foreground mt-1">Configure fare schemes and pricing</p>
        </div>
        <Button
          onClick={() => navigate("/admin/fares/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Fare Scheme
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fare Scheme List</CardTitle>
          <CardDescription>View and manage all fare schemes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Metered</TableHead>
                  <TableHead>Min Km</TableHead>
                  <TableHead>Min Rate</TableHead>
                  <TableHead>Rate Per Km</TableHead>
                  <TableHead>Rate Per Km ^</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFares.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No fare schemes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFares.map((fare) => (
                    <TableRow key={fare.id}>
                      <TableCell className="font-medium">{fare.code}</TableCell>
                      <TableCell>
                        {fare.metered ? (
                          <Badge>Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>{fare.minKm}</TableCell>
                      <TableCell>{fare.minRate}</TableCell>
                      <TableCell>{fare.ratePerKm}</TableCell>
                      <TableCell>{fare.ratePerKmHike}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/fares/edit/${fare.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/fares/delete/${fare.id}`)}
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
