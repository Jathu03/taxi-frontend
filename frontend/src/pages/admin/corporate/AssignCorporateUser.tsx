"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Building2, User } from "lucide-react";
import { toast } from "sonner";

import { corporateService } from "@/services/corporate/corporateService";
import type { CorporateResponse, UserSimpleResponse } from "@/services/corporate/types";

export default function AssignCorporateUser() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Capture params from URL
  const { corporateId: urlCorpId, userId: urlUserId } = useParams();

  // Data passed from the Manage List page via navigate state (optional)
  const existingData = location.state?.assignment;
  const isEditMode = !!urlUserId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [corporates, setCorporates] = useState<CorporateResponse[]>([]);
  const [users, setUsers] = useState<UserSimpleResponse[]>([]);

  // 2. Initialize State
  // We prioritize urlCorpId to ensure we don't get "NaN"
  const [formData, setFormData] = useState({
    corporateId: urlCorpId || existingData?.corporateId?.toString() || "",
    corporateName: existingData?.corporateName || "",
    
    userId: urlUserId || existingData?.userId?.toString() || "",
    userName: existingData?.username || existingData?.name || "",
    
    designation: existingData?.designation || "",
    division: existingData?.department || existingData?.division || "", 
    canBook: existingData?.canBook ?? true,
    canViewReports: existingData?.canViewReports ?? false,
    isActive: existingData?.isActive ?? true, 
  });

  // 3. Ensure State updates if URL params change (Fixes the undefined issue on refresh)
  useEffect(() => {
    if (urlCorpId) {
      setFormData(prev => ({ ...prev, corporateId: urlCorpId }));
    }
  }, [urlCorpId]);

  useEffect(() => {
    const init = async () => {
      try {
        const [corpsData, usersData] = await Promise.all([
          corporateService.getAllCorporates(),
          corporateService.getAvailableUsers(),
        ]);
        setCorporates(corpsData);

        // Handle User List for Dropdown
        let allUsers = [...usersData];
        if (isEditMode && urlUserId) {
          const exists = usersData.find((u) => u.id === Number(urlUserId));
          if (!exists) {
            allUsers.push({
              id: Number(urlUserId),
              username: formData.userName || "current_user",
              firstName: formData.userName?.split(' ')[0] || "User",
              lastName: "",
            });
          }
        }
        setUsers(allUsers);
        
        // Auto-fill Corporate Name if we have the ID but not the name
        if (formData.corporateId && !formData.corporateName) {
            // Compare as strings to be safe
            const c = corpsData.find(c => String(c.id) === String(formData.corporateId));
            if(c) setFormData(prev => ({...prev, corporateName: c.name}));
        }

      } catch (error) {
        console.error("Failed to load initial data", error);
        toast.error("Failed to load selection data.");
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [isEditMode, urlUserId]); // Removed formData.corporateId dependency to prevent loops

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 4. Validate IDs before sending to avoid NaN
    const finalCorpId = Number(formData.corporateId);
    const finalUserId = Number(formData.userId);

    if (isNaN(finalCorpId) || finalCorpId === 0) {
      toast.error("Invalid Corporate ID selected.");
      return;
    }
    if (isNaN(finalUserId) || finalUserId === 0) {
      toast.error("Invalid User selected.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: finalUserId,
        designation: formData.designation,
        department: formData.division,
        canBook: formData.canBook,
        canViewReports: formData.canViewReports,
        isActive: formData.isActive, 
      };

      if (isEditMode) {
        await corporateService.updateCorporateUser(
          finalCorpId, 
          finalUserId, 
          payload
        );
        toast.success("User details updated!");
      } else {
        await corporateService.assignUserToCorporate(finalCorpId, payload);
        toast.success("User assigned successfully!");
      }

      navigate(-1);
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(error.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#6330B8]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-50/50">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#6330B8]">
            {isEditMode ? "Edit Assignment" : "Assign User"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditMode 
              ? "Update settings for this user assignment." 
              : "Link a user to a corporate account."}
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4 flex flex-row justify-between items-center">
          <CardTitle className="text-base font-medium text-gray-800">
            Assignment Information
          </CardTitle>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {formData.isActive ? 'Active' : 'Inactive'}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Corporate Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700">
                <Building2 className="h-4 w-4 text-purple-600" /> Corporate Account
              </Label>
              
              {/* If URL has ID, lock the field. Otherwise allow selection */}
              {urlCorpId ? (
                <Input 
                  value={formData.corporateName || `Corporate ID: ${urlCorpId}`} 
                  readOnly 
                  className="bg-gray-100 text-gray-600 border-gray-200 cursor-not-allowed font-medium"
                />
              ) : (
                <Select
                  value={String(formData.corporateId)}
                  onValueChange={(val) => setFormData({ ...formData, corporateId: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    {corporates.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} <span className="text-gray-400 text-xs">({c.code})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* 2. User Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4 text-purple-600" /> User
              </Label>

              {isEditMode ? (
                <Input 
                  value={formData.userName || `User ID: ${formData.userId}`} 
                  readOnly 
                  className="bg-gray-100 text-gray-600 border-gray-200 cursor-not-allowed font-medium"
                />
              ) : (
                <Select
                  value={String(formData.userId)}
                  onValueChange={(val) => setFormData({ ...formData, userId: val })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.firstName} {u.lastName} <span className="text-gray-400 text-xs">({u.username})</span>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500 text-center">No available users found</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Division / Department</Label>
                <Input
                  placeholder="e.g. IT, HR, Sales"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  placeholder="e.g. Manager, Staff"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <Label className="text-base font-semibold text-gray-800">Account Status</Label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!formData.isActive ? 'font-bold text-red-600' : 'text-gray-500'}`}>Inactive</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      formData.isActive ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${formData.isActive ? 'font-bold text-green-600' : 'text-gray-500'}`}>Active</span>
                </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <Label className="text-gray-700 font-semibold">Permissions</Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-3 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="canBook"
                    checked={formData.canBook}
                    onCheckedChange={(c) => setFormData({ ...formData, canBook: !!c })}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="canBook" className="cursor-pointer font-medium">
                      Enable Booking Creation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allows this user to create new taxi bookings.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id="canViewReports"
                    checked={formData.canViewReports}
                    onCheckedChange={(c) => setFormData({ ...formData, canViewReports: !!c })}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="canViewReports" className="cursor-pointer font-medium">
                      Enable Report Viewing
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allows this user to view booking history and reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#6330B8] hover:bg-[#5028a0] text-white font-medium py-2.5 transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Assignment" : "Assign User"}
                  </>
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}