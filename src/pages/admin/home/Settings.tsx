import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ROLES = ["admin", "accountant", "callCenterAgent", "corporate", "driver"];
const SECTIONS = [
    "Home",
    "Bookings",
    "TUK Booking ",
    "Driver Management",
    "Vehicle Management",
    "Manage SMS",
    "Manage Promo Codes",
    "Device Management",
    "Vehicle Model Management",
    "Vehicle Make Management",
    "Vehicle Class Management",
    "Vehicle Owner Management",
    "Manage Fares",
    "Corporate Portal",
    "User Management",
    "Reports",
    "Settings"
];

// Initial default mapping based on static requirements
const DEFAULT_PERMISSIONS: Record<string, Record<string, boolean>> = {
    admin: SECTIONS.reduce((acc, s) => ({ ...acc, [s]: true }), {}),
    accountant: {
        Home: true,
        Bookings: true,
        "TUK Booking ": true,
        "Manage Fares": true,
        "Corporate Portal": true,
        Reports: true,
        Settings: false
    },
    callCenterAgent: {
        Home: true,
        Bookings: true,
        "TUK Booking ": true,
        Reports: false,
        Settings: false
    }
};

export default function Settings() {
    const { toast } = useToast();
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
        const saved = localStorage.getItem("sidebar_permissions");
        if (saved) return JSON.parse(saved);
        return DEFAULT_PERMISSIONS;
    });

    const handleToggle = (role: string, section: string, checked: boolean) => {
        setPermissions(prev => {
            const next = {
                ...prev,
                [role]: {
                    ...(prev[role] || {}),
                    [section]: checked
                }
            };
            localStorage.setItem("sidebar_permissions", JSON.stringify(next));
            return next;
        });
    };

    const handleSave = () => {
        localStorage.setItem("sidebar_permissions", JSON.stringify(permissions));
        toast({
            title: "Permissions Saved",
            description: "Role-based visibility settings have been updated. Please refresh to see changes in the sidebar.",
        });
        // Optional: window.location.reload(); 
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold text-[#6330B8]">System Settings</h1>
                <p className="text-muted-foreground mt-1">Manage system roles and security permissions</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>Enable or disable sidebar sections for different user roles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2 font-semibold">Section</th>
                                        {ROLES.map(role => (
                                            <th key={role} className="text-center p-2 font-semibold capitalize">{role}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SECTIONS.map(section => (
                                        <tr key={section} className="border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="p-2 font-medium">{section}</td>
                                            {ROLES.map(role => (
                                                <td key={role} className="p-2 text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={permissions[role]?.[section] || false}
                                                            onCheckedChange={(checked) => handleToggle(role, section, !!checked)}
                                                            disabled={role === 'admin' && section === 'Settings'} // Don't lock admin out of settings
                                                        />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSave} className="bg-[#6330B8] hover:bg-[#6330B8]/90">
                                Save Permissions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
