import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

type Manufacturer = {
  id: string;
  manufacturer: string;
  manufacturerCode: string;
  dateModified: string;
};

const mockManufacturers: Manufacturer[] = [
  { id: "1", manufacturer: "Honda", manufacturerCode: "Honda", dateModified: "12/10/2018 12:45:28 PM" },
  { id: "2", manufacturer: "Toyota", manufacturerCode: "TOYOTA", dateModified: "5/10/2016 11:00:05 AM" },
  { id: "3", manufacturer: "Hyundai", manufacturerCode: "HYUNDAI", dateModified: "5/10/2016 11:01:09 AM" },
  { id: "4", manufacturer: "Mazda", manufacturerCode: "MAZDA", dateModified: "5/10/2016 11:01:27 AM" },
  { id: "5", manufacturer: "Chrysler", manufacturerCode: "CHRYSLER", dateModified: "5/10/2016 11:02:59 AM" },
  { id: "6", manufacturer: "Audi", manufacturerCode: "Q7", dateModified: "8/10/2016 1:21:11 AM" },
  { id: "7", manufacturer: "Suzuki", manufacturerCode: "Suzuki", dateModified: "12/5/2016 10:06:28 AM" },
  { id: "8", manufacturer: "Nissan", manufacturerCode: "NISSAN", dateModified: "7/18/2016 8:20:13 AM" },
  { id: "9", manufacturer: "Zotye", manufacturerCode: "Zotye", dateModified: "8/23/2016 10:03:19 AM" },
  { id: "10", manufacturer: "Dfsk", manufacturerCode: "DFSK", dateModified: "9/22/2017 11:02:22 AM" },
  { id: "11", manufacturer: "renault", manufacturerCode: "kwid", dateModified: "12/5/2016 12:54:20 PM" },
  { id: "12", manufacturer: "bus", manufacturerCode: "bus", dateModified: "12/14/2016 12:21:31 PM" },
  { id: "13", manufacturer: "NV200", manufacturerCode: "Nissan NV200", dateModified: "1/16/2017 10:42:03 AM" },
  { id: "14", manufacturer: "Micro", manufacturerCode: "MICRO", dateModified: "9/22/2017 11:02:11 AM" },
  { id: "15", manufacturer: "Mercedes", manufacturerCode: "Mercedes", dateModified: "4/1/2017 6:44:05 PM" },
  { id: "16", manufacturer: "Perodua", manufacturerCode: "Perodua", dateModified: "4/28/2017 4:01:15 PM" },
  { id: "17", manufacturer: "hyundai", manufacturerCode: "eon", dateModified: "7/11/2017 2:16:06 PM" },
  { id: "18", manufacturer: "Tata", manufacturerCode: "NANO", dateModified: "9/22/2017 11:02:31 AM" },
  { id: "19", manufacturer: "Bajaj", manufacturerCode: "BAJAJ", dateModified: "9/22/2017 11:01:54 AM" },
  { id: "20", manufacturer: "Other", manufacturerCode: "OTHER", dateModified: "9/22/2017 10:48:51 AM" },
  { id: "21", manufacturer: "Mithusbishi", manufacturerCode: "Minicab", dateModified: "6/6/2018 11:30:52 AM" },
  { id: "22", manufacturer: "Datsun", manufacturerCode: "Datsun", dateModified: "6/6/2019 3:38:42 PM" },
  { id: "23", manufacturer: "Proton", manufacturerCode: "Proton", dateModified: "1/13/2022 2:57:05 PM" },
  { id: "24", manufacturer: "Benz", manufacturerCode: "Benz", dateModified: "1/17/2022 8:17:06 PM" },
  { id: "25", manufacturer: "KO-5951", manufacturerCode: "KO-5951", dateModified: "2/13/2022 8:58:37 AM" },
  { id: "26", manufacturer: "BMW", manufacturerCode: "BMW", dateModified: "7/22/2023 9:09:00 AM" },
  { id: "27", manufacturer: "Toyota", manufacturerCode: "Fortune", dateModified: "9/21/2023 7:42:15 PM" },
  { id: "28", manufacturer: "Toyota", manufacturerCode: "CHR", dateModified: "5/7/2025 6:55:21 AM" },
];

export default function ManageManufacturers() {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(mockManufacturers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredManufacturers = manufacturers.filter((manufacturer) => {
    const search = searchTerm.toLowerCase();
    return (
      manufacturer.manufacturer.toLowerCase().includes(search) ||
      manufacturer.manufacturerCode.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#6330B8]">Manage Manufacturers</h1>
          <p className="text-muted-foreground mt-1">Manage vehicle manufacturers and brands</p>
        </div>
        <Button
          onClick={() => navigate("/admin/vehicle-makes/add")}
          className="bg-[#6330B8] hover:bg-[#6330B8]/90"
        >
          Create New Manufacturer
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <Input
              placeholder="Search by manufacturer or manufacturer code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Manufacturer</TableHead>
                  <TableHead className="font-bold text-black">Manufacturer Code</TableHead>
                  <TableHead className="font-bold text-black">Date Modified</TableHead>
                  <TableHead className="font-bold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManufacturers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No manufacturers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManufacturers.map((manufacturer) => (
                    <TableRow key={manufacturer.id}>
                      <TableCell className="font-medium">{manufacturer.manufacturer}</TableCell>
                      <TableCell>{manufacturer.manufacturerCode || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{manufacturer.dateModified}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/admin/vehicle-makes/edit/${manufacturer.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => navigate(`/admin/vehicle-makes/delete/${manufacturer.id}`)}
                          >
                            <Trash className="h-4 w-4" />
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
