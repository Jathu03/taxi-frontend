import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { menuItems, type MenuItem } from "@/constants/menuItems";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Settings as SettingsIcon,
    Edit2,
    RotateCcw,
    UserCheck
} from "lucide-react";

const ROLES = ["admin", "accountant", "callCenterAgent", "corporate", "driver"];

export default function Settings() {
    const { toast } = useToast();
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(() => {
        const saved = localStorage.getItem("sidebar_permissions");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing permissions:", e);
            }
        }

        const defaults: Record<string, Record<string, boolean>> = {};
        ROLES.forEach(role => {
            defaults[role] = {};
            menuItems.forEach(item => {
                const isAdmin = role === 'admin';
                const isAccountant = role === 'accountant' && ["Home", "Bookings", "TUK Booking", "Manage Fares", "Corporate Portal", "Reports"].includes(item.title);
                const isCallAgent = role === 'callCenterAgent' && ["Home", "Bookings", "TUK Booking"].includes(item.title);

                if (isAdmin || isAccountant || isCallAgent) {
                    defaults[role][item.title] = true;
                    item.children?.forEach(child => {
                        defaults[role][`${item.title}:${child.title}`] = true;
                    });
                }
            });
        });
        return defaults;
    });

    const handleToggle = (role: string, key: string, checked: boolean, parentKey?: string) => {
        setPermissions(prev => {
            const next = {
                ...prev,
                [role]: { ...(prev[role] || {}), [key]: checked }
            };

            if (!parentKey) {
                const parent = menuItems.find(item => item.title === key);
                parent?.children?.forEach(child => {
                    next[role][`${key}:${child.title}`] = checked;
                });
            } else if (checked) {
                next[role][parentKey] = true;
            }
            return next;
        });
    };

    const handleSelectAllSub = (role: string, parent: MenuItem, checked: boolean) => {
        setPermissions(prev => {
            const next = { ...prev, [role]: { ...(prev[role] || {}) } };
            if (checked) next[role][parent.title] = true;
            parent.children?.forEach(child => {
                next[role][`${parent.title}:${child.title}`] = checked;
            });
            return next;
        });
    };

    const handleSelectAllMain = (role: string, checked: boolean) => {
        setPermissions(prev => {
            const next = { ...prev, [role]: { ...(prev[role] || {}) } };
            menuItems.forEach(item => {
                next[role][item.title] = checked;
                item.children?.forEach(child => {
                    next[role][`${item.title}:${child.title}`] = checked;
                });
            });
            return next;
        });
    };

    const handleSave = () => {
        localStorage.setItem("sidebar_permissions", JSON.stringify(permissions));
        toast({ title: "Permissions Saved", description: "Changes applied. Please refresh." });
    };

    const handleResetDefaults = () => {
        localStorage.removeItem("sidebar_permissions");
        window.location.reload();
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-white via-purple-50/20 to-blue-50/20 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#6330B8] tracking-tight">Access Control Center</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Define granular permissions across all system modules</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleResetDefaults} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
                    </Button>
                    <Button onClick={handleSave} className="bg-[#6330B8] hover:bg-[#5225a1] shadow-md shadow-purple-200 px-6">
                        Confirm & Apply Changes
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#6330B8]/5 to-transparent border-b">
                    <div>
                        <CardTitle className="text-xl font-bold">Module Visibility</CardTitle>
                        <CardDescription>Main sidebar sections and their access per role.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="text-left p-6 font-bold text-slate-600 w-[300px]">Section Name</th>
                                    {ROLES.map(role => (
                                        <th key={role} className="p-6 font-bold text-slate-600 capitalize">
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{role}</span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleSelectAllMain(role, true)}
                                                        className="text-[10px] text-purple-600 hover:text-purple-800 hover:underline"
                                                    >
                                                        All
                                                    </button>
                                                    <span className="text-[10px] text-slate-300">|</span>
                                                    <button
                                                        onClick={() => handleSelectAllMain(role, false)}
                                                        className="text-[10px] text-slate-500 hover:text-slate-700 hover:underline"
                                                    >
                                                        None
                                                    </button>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="text-right p-6 font-bold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {menuItems.map(item => (
                                    <tr key={item.title} className="hover:bg-purple-50/40 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg text-[#6330B8]">
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 text-base">{item.title}</span>
                                                    {item.children && <p className="text-xs text-muted-foreground">{item.children.length} Subsections</p>}
                                                </div>
                                            </div>
                                        </td>
                                        {ROLES.map(role => (
                                            <td key={role} className="p-6">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        checked={permissions[role]?.[item.title] || false}
                                                        onCheckedChange={(checked) => handleToggle(role, item.title, !!checked)}
                                                        disabled={role === 'admin' && item.title === 'Settings'}
                                                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-[#6330B8] data-[state=checked]:border-[#6330B8]"
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                        <td className="p-6 text-right">
                                            {item.children && item.children.length > 0 ? (
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-white border text-purple-600 border-purple-200 hover:bg-purple-50 font-semibold shadow-sm rounded-full px-4"
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                                                            Configure Sub-permissions
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="sm:max-w-xl border-l shadow-2xl overflow-y-auto bg-slate-50/50">
                                                        <SheetHeader className="mb-8 border-b pb-6 bg-white -mx-6 px-6 py-8">
                                                            <div className="flex items-center gap-4 mb-2">
                                                                <div className="p-3 bg-purple-100 rounded-2xl text-[#6330B8]">
                                                                    <item.icon className="h-8 w-8" />
                                                                </div>
                                                                <div>
                                                                    <SheetTitle className="text-3xl font-black text-slate-900">{item.title}</SheetTitle>
                                                                    <SheetDescription className="text-base text-slate-500 font-medium">
                                                                        Detailed sub-section permissions for this module.
                                                                    </SheetDescription>
                                                                </div>
                                                            </div>
                                                        </SheetHeader>

                                                        <div className="space-y-6">
                                                            {ROLES.map(role => (
                                                                <Card key={role} className="border-none shadow-sm overflow-hidden ring-1 ring-slate-200">
                                                                    <div className="p-4 bg-white flex items-center justify-between border-b">
                                                                        <div className="flex items-center gap-2">
                                                                            <UserCheck className="h-5 w-5 text-purple-600" />
                                                                            <h3 className="font-bold text-lg text-slate-800 capitalize">{role} Access</h3>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 text-xs font-bold border-purple-100 text-purple-700 hover:bg-purple-50"
                                                                                onClick={() => handleSelectAllSub(role, item, true)}
                                                                            >
                                                                                Select All
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 text-xs font-bold border-slate-100 text-slate-600 hover:bg-slate-50"
                                                                                onClick={() => handleSelectAllSub(role, item, false)}
                                                                            >
                                                                                Clear All
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                    <CardContent className="p-4 bg-slate-50/30">
                                                                        <div className="grid grid-cols-1 gap-2">
                                                                            {item.children?.map(child => (
                                                                                <div
                                                                                    key={child.title}
                                                                                    className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-purple-100 hover:bg-white transition-all cursor-pointer group/item"
                                                                                    onClick={() => handleToggle(role, `${item.title}:${child.title}`, !permissions[role]?.[`${item.title}:${child.title}`], item.title)}
                                                                                >
                                                                                    <Checkbox
                                                                                        id={`${role}-${item.title}-${child.title}`}
                                                                                        checked={permissions[role]?.[`${item.title}:${child.title}`] || false}
                                                                                        onCheckedChange={(checked) => handleToggle(role, `${item.title}:${child.title}`, !!checked, item.title)}
                                                                                        disabled={role === 'admin' && item.title === 'Settings'}
                                                                                        className="h-5 w-5 border-slate-300 pointer-events-none data-[state=checked]:bg-[#6330B8] data-[state=checked]:border-[#6330B8]"
                                                                                    />
                                                                                    <Label
                                                                                        className="flex-1 cursor-pointer font-semibold text-slate-700 group-hover/item:text-[#6330B8] transition-colors"
                                                                                    >
                                                                                        {child.title}
                                                                                    </Label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                        <div className="mt-12 mb-8">
                                                            <Button onClick={handleSave} className="w-full py-6 text-lg font-bold bg-[#6330B8] hover:bg-[#5225a1] shadow-lg shadow-purple-100 rounded-xl">
                                                                Confirm All Changes
                                                            </Button>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-medium italic">No sub-sections</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
