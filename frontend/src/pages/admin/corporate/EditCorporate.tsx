import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { corporateService } from "@/services/corporate/corporateService";
import type { CreateCorporateRequest } from "@/services/corporate/types";

interface CorporateFormData {
  name: string;
  code: string;
  primaryContact: string;
  phone: string;
  email: string;
  address: string;
  registrationDate: string;
  billingType: string;
  creditLimit: string;
  cashDiscountRate: string;
  creditDiscountRate: string;
  enableQuickBooking: string;
  requireVoucher: string;
  requireCostCenter: string;
}

export default function EditCorporate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CorporateFormData>({
    name: "",
    code: "",
    primaryContact: "",
    phone: "",
    email: "",
    address: "",
    registrationDate: "",
    billingType: "",
    creditLimit: "",
    cashDiscountRate: "",
    creditDiscountRate: "",
    enableQuickBooking: "No",
    requireVoucher: "No",
    requireCostCenter: "No",
  });

  // Fetch existing corporate data on mount
  useEffect(() => {
    const fetchCorporate = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await corporateService.getCorporateById(Number(id));

        // Map API response to form data (convert types to strings for inputs)
        setFormData({
          name: data.name || "",
          code: data.code || "",
          primaryContact: data.primaryContact || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          registrationDate: data.registrationDate || "",
          billingType: data.billingType || "",
          creditLimit: data.creditLimit ? String(data.creditLimit) : "",
          cashDiscountRate: data.cashDiscountRate
            ? String(data.cashDiscountRate)
            : "",
          creditDiscountRate: data.creditDiscountRate
            ? String(data.creditDiscountRate)
            : "",
          enableQuickBooking: data.enableQuickBooking ? "Yes" : "No",
          requireVoucher: data.requireVoucher ? "Yes" : "No",
          requireCostCenter: data.requireCostCenter ? "Yes" : "No",
        });
      } catch (error) {
        console.error("Failed to fetch corporate:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        navigate("/admin/corporate/manage");
      } finally {
        setLoading(false);
      }
    };

    fetchCorporate();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildRequestPayload = (): CreateCorporateRequest => {
    const payload: CreateCorporateRequest = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    };

    if (formData.primaryContact.trim()) {
      payload.primaryContact = formData.primaryContact.trim();
    }
    if (formData.address.trim()) {
      payload.address = formData.address.trim();
    }
    if (formData.registrationDate) {
      payload.registrationDate = formData.registrationDate;
    }
    if (formData.billingType) {
      payload.billingType = formData.billingType as
        | "DAILY"
        | "MONTHLY"
        | "PREPAID";
    }
    if (formData.creditLimit.trim()) {
      const parsed = parseFloat(formData.creditLimit);
      if (!isNaN(parsed)) payload.creditLimit = parsed;
    }
    if (formData.cashDiscountRate.trim()) {
      const parsed = parseFloat(formData.cashDiscountRate);
      if (!isNaN(parsed)) payload.cashDiscountRate = parsed;
    }
    if (formData.creditDiscountRate.trim()) {
      const parsed = parseFloat(formData.creditDiscountRate);
      if (!isNaN(parsed)) payload.creditDiscountRate = parsed;
    }

    payload.enableQuickBooking = formData.enableQuickBooking === "Yes";
    payload.requireVoucher = formData.requireVoucher === "Yes";
    payload.requireCostCenter = formData.requireCostCenter === "Yes";

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.code.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = buildRequestPayload();
      const response = await corporateService.updateCorporate(
        Number(id),
        payload
      );

      toast({
        title: "Success",
        description: `Corporate client "${response.name}" updated successfully.`,
      });

      navigate("/admin/corporate/manage");
    } catch (error) {
      console.error("Failed to update corporate:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <span className="text-lg text-muted-foreground">
          Loading corporate details...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-[#6330B8]">
          Edit Corporate Client
        </h1>
        <p className="text-muted-foreground mt-1">
          Update corporate client information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the corporate client's basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Company Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter company code"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryContact">Primary Contact</Label>
                <Input
                  id="primaryContact"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleInputChange}
                  placeholder="Enter primary contact name"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationDate">Registration Date</Label>
                <Input
                  id="registrationDate"
                  name="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Update contact details for the corporate client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter company address"
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing & Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Billing & Configuration</CardTitle>
            <CardDescription>
              Update billing type, discount rates, and booking settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingType">Billing Type</Label>
                <Select
                  value={formData.billingType}
                  onValueChange={(value) =>
                    handleSelectChange("billingType", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="PREPAID">Prepaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  name="creditLimit"
                  type="number"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashDiscountRate">
                  Cash Discount Rate (%)
                </Label>
                <Input
                  id="cashDiscountRate"
                  name="cashDiscountRate"
                  type="number"
                  step="0.01"
                  value={formData.cashDiscountRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditDiscountRate">
                  Credit Discount Rate (%)
                </Label>
                <Input
                  id="creditDiscountRate"
                  name="creditDiscountRate"
                  type="number"
                  step="0.01"
                  value={formData.creditDiscountRate}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enableQuickBooking">
                  Enable Quick Booking
                </Label>
                <Select
                  value={formData.enableQuickBooking}
                  onValueChange={(value) =>
                    handleSelectChange("enableQuickBooking", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requireVoucher">Require Voucher</Label>
                <Select
                  value={formData.requireVoucher}
                  onValueChange={(value) =>
                    handleSelectChange("requireVoucher", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requireCostCenter">
                  Require Cost Center
                </Label>
                <Select
                  value={formData.requireCostCenter}
                  onValueChange={(value) =>
                    handleSelectChange("requireCostCenter", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-[#6330B8] hover:bg-[#7C3AED]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Corporate Client"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/corporate/manage")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}