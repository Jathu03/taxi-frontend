import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { menuItems } from "@/constants/menuItems";
import { cn } from "@/lib/utils";
import {
    Settings as SettingsIcon,
    RotateCcw,
    ChevronRight,
    LayoutGrid,
} from "lucide-react";

const ROLES = ["admin", "accountant", "callCenterAgent", "corporate", "driver"];

export default function Settings() {
    const { toast } = useToast();
    const [activeCategory, setActiveCategory] = useState<string>("Main Sections");
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

    const categories = useMemo(() => {
        const itemsWithChildren = menuItems.filter(item => item.children && item.children.length > 0);
        return [
            { id: "Main Sections", title: "Main Sections", icon: LayoutGrid },
            ...itemsWithChildren.map(item => ({ id: item.title, title: item.title, icon: item.icon }))
        ];
    }, []);

    const activeRows = useMemo(() => {
        if (activeCategory === "Main Sections") {
            return menuItems.map(item => ({
                key: item.title,
                title: item.title,
                icon: item.icon,
                isChild: false,
                parentKey: null,
                childrenCount: item.children?.length || 0
            }));
        }
        const parent = menuItems.find(item => item.title === activeCategory);
        return parent?.children?.map(child => ({
            key: `${parent.title}:${child.title}`,
            title: child.title,
            icon: child.icon || parent.icon,
            isChild: true,
            parentKey: parent.title,
            childrenCount: 0
        })) || [];
    }, [activeCategory]);

    const handleToggle = (role: string, key: string, checked: boolean, parentKey?: string | null) => {
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

    const handleSelectAll = (role: string, checked: boolean) => {
        setPermissions(prev => {
            const next = { ...prev, [role]: { ...(prev[role] || {}) } };
            activeRows.forEach(row => {
                next[role][row.key] = checked;
                if (!row.isChild) {
                    const item = menuItems.find(i => i.title === row.key);
                    item?.children?.forEach(child => {
                        next[role][`${row.key}:${child.title}`] = checked;
                    });
                } else if (checked && row.parentKey) {
                    next[role][row.parentKey] = true;
                }
            });
            return next;
        });
    };

    const handleSave = () => {
        localStorage.setItem("sidebar_permissions", JSON.stringify(permissions));
        toast({ title: "Permissions Saved", description: "Changes applied. Reloading..." });
        setTimeout(() => window.location.reload(), 500);
    };

    const handleResetDefaults = () => {
        localStorage.removeItem("sidebar_permissions");
        window.location.reload();
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-white via-slate-50 to-blue-50/20 min-h-screen font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-[#6330B8] tracking-tight">Access Control Center</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Configure granular module visibility and permissions across roles</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleResetDefaults} variant="outline" className="border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all font-bold">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
                    </Button>
                    <Button onClick={handleSave} className="bg-[#6330B8] hover:bg-[#5225a1] shadow-lg shadow-purple-200 px-8 py-6 text-lg font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Confirm & Apply Changes
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl grid grid-cols-12 min-h-[700px]">
                {/* Sidebar */}
                <aside className="col-span-3 border-r bg-slate-50/30 p-4 space-y-2">
                    <div className="px-4 py-2 mb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Categories</span>
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 group relative",
                                activeCategory === cat.id
                                    ? "bg-white shadow-md text-[#6330B8] ring-1 ring-purple-100"
                                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                activeCategory === cat.id ? "bg-purple-100 text-[#6330B8]" : "bg-slate-100 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-400"
                            )}>
                                <cat.icon className="h-5 w-5" />
                            </div>
                            <span className="font-bold whitespace-nowrap">{cat.title}</span>
                            {activeCategory === cat.id && (
                                <ChevronRight className="h-4 w-4 ml-auto text-purple-400" />
                            )}
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <main className="col-span-9 p-0 flex flex-col">
                    <div className="p-8 border-b bg-white">
                        <h2 className="text-2xl font-black text-slate-800">{activeCategory}</h2>
                        <p className="text-slate-500 font-medium italic">
                            {activeCategory === "Main Sections"
                                ? "Manage which top-level modules are visible to each role."
                                : `Manage specific sub-permissions for the ${activeCategory} module.`}
                        </p>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50/80 backdrop-blur-md border-b">
                                    <th className="text-left p-6 font-black text-slate-600 w-[350px]">
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase tracking-widest text-xs">Section / Feature</span>
                                        </div>
                                    </th>
                                    {ROLES.map(role => (
                                        <th key={role} className="p-6 font-black text-slate-600 capitalize">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-xs uppercase tracking-widest">{role}</span>
                                                <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
                                                    <button
                                                        onClick={() => handleSelectAll(role, true)}
                                                        className="px-2 py-0.5 text-[9px] font-black text-purple-600 hover:bg-purple-50 rounded"
                                                    >
                                                        ALL
                                                    </button>
                                                    <div className="w-[1px] bg-slate-100" />
                                                    <button
                                                        onClick={() => handleSelectAll(role, false)}
                                                        className="px-2 py-0.5 text-[9px] font-black text-slate-400 hover:bg-slate-50 rounded"
                                                    >
                                                        NONE
                                                    </button>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {activeRows.map(row => (
                                    <tr key={row.key} className="hover:bg-purple-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "p-2.5 rounded-xl transition-all",
                                                    row.isChild ? "bg-slate-50 text-slate-400 ml-4" : "bg-purple-50 text-[#6330B8] shadow-sm shadow-purple-50"
                                                )}>
                                                    <row.icon className={cn(row.isChild ? "h-4 w-4" : "h-5 w-5")} />
                                                </div>
                                                <div>
                                                    <span className={cn("font-black text-slate-800", row.isChild ? "text-sm text-slate-600" : "text-lg tracking-tight")}>{row.title}</span>
                                                    {!row.isChild && row.childrenCount > 0 && (
                                                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mt-0.5">{row.childrenCount} Detailed Settings Available</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        {ROLES.map(role => (
                                            <td key={role} className="p-6">
                                                <div className="flex justify-center">
                                                    <div className="relative group/check">
                                                        <Checkbox
                                                            id={`${role}-${row.key}`}
                                                            checked={permissions[role]?.[row.key] || false}
                                                            onCheckedChange={(checked) => handleToggle(role, row.key, !!checked, row.parentKey)}
                                                            disabled={role === 'admin' && (row.key === 'Settings' || row.key === 'Home' || row.key === 'Dashboard')}
                                                            className="h-6 w-6 rounded-lg border-2 border-slate-200 transition-all data-[state=checked]:bg-[#6330B8] data-[state=checked]:border-[#6330B8] hover:border-purple-300"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {activeRows.length === 0 && (
                            <div className="flex flex-col items-center justify-center p-20 text-center">
                                <div className="p-6 bg-slate-50 rounded-full mb-4">
                                    <SettingsIcon className="h-12 w-12 text-slate-300 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No settings found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">This module doesn't have any specific sub-permissions configured.</p>
                            </div>
                        )}
                    </div>
                </main>
            </Card>
        </div>
    );
}
