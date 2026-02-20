import React from "react";
import {
    Calendar,
    Home,
    Inbox,
    LayoutDashboard,
    Search,
    Settings as SettingsIcon,
    Cog,
    CarTaxiFront,
    Building2,
    FileText,
} from "lucide-react";

export type MenuItem = {
    title: string;
    url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.FC<any>;
    isActive?: boolean;
    children?: MenuItem[];
    allowedRoles?: string[];
};

export const menuItems: MenuItem[] = [
    {
        title: "Home",
        icon: Home,
        children: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: LayoutDashboard,
            },
            {
                title: "Configuration",
                url: "/admin/configuration",
                icon: Cog,
            },
            {
                title: "Driver Dashboard",
                url: "/admin/driver-dashboard",
                icon: CarTaxiFront,
            },
            {
                title: "City View",
                url: "/admin/city-view",
                icon: Building2,
            },
        ],
    },
    {
        title: "Bookings",
        icon: Inbox,
        children: [
            {
                title: "Add Booking",
                url: "/admin/bookings/add",
                icon: Home,
            },
            {
                title: "Inquiries",
                url: "/admin/bookings/inquiries",
                icon: Home,
            },
            {
                title: "Pending Bookings",
                url: "/admin/bookings/pending",
                icon: Home,
            },
            {
                title: "App Pending Bookings",
                url: "/admin/bookings/app-pending",
                icon: Home,
            },
            {
                title: "Dispatched Bookings",
                url: "/admin/bookings/dispatched",
                icon: Home,
            },
            {
                title: "Manual Disp. Bookings",
                url: "/admin/bookings/manual-dispatched",
                icon: Home,
            },
            {
                title: "Enroute Bookings",
                url: "/admin/bookings/enroute",
                icon: Home,
            },
            {
                title: "Waiting for Customer",
                url: "/admin/bookings/waiting",
                icon: Home,
            },
            {
                title: "Passenger Onboard",
                url: "/admin/bookings/onboard",
                icon: Home,
            },
            {
                title: "Completed Hires",
                url: "/admin/bookings/completed",
                icon: Home,
            },
            {
                title: "Cancelled Hires",
                url: "/admin/bookings/cancelled",
                icon: Home,
            },
        ],
    },
    {
        title: "TUK Booking",
        url: "#",
        icon: Calendar,
        children: [
            {
                title: "Pending Bookings",
                url: "/admin/tuk/pending",
                icon: Home,
            },
            {
                title: "App Pending Bookings",
                url: "/admin/tuk/app-pending",
                icon: Home,
            },
            {
                title: "Dispatched Bookings",
                url: "/admin/tuk/dispatched",
                icon: Home,
            },
            {
                title: "Enroute Bookings",
                url: "/admin/tuk/enroute",
                icon: Home,
            },
            {
                title: "Waiting for Customer",
                url: "/admin/tuk/waiting",
                icon: Home,
            },
            {
                title: "Passenger Onboard",
                url: "/admin/tuk/onboard",
                icon: Home,
            },
            {
                title: "Completed Hires",
                url: "/admin/tuk/completed",
                icon: Home,
            },
            {
                title: "Cancelled Hires",
                url: "/admin/tuk/cancelled",
                icon: Home,
            },
        ],
    },
    {
        title: "Driver Management",
        url: "#",
        icon: Search,
        children: [
            {
                title: "Manage Drivers",
                url: "/admin/drivers/manage",
                icon: Home,
            },
            {
                title: "Add new Driver",
                url: "/admin/drivers/add",
                icon: Home,
            },
            {
                title: "View Activity Log",
                url: "/admin/drivers/activity-log",
                icon: Home,
            },
        ],
    },
    {
        title: "Vehicle Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Vehicle",
                url: "/admin/vehicles/manage",
                icon: Home,
            },
            {
                title: "Add new Vehicle",
                url: "/admin/vehicles/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Manage SMS",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Send SMS",
                url: "/admin/sms/send",
                icon: Home,
            },
        ],
    },
    {
        title: "Manage Promo Codes",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Promo Codes",
                url: "/admin/promo-codes/manage",
                icon: Home,
            },
        ],
    },
    {
        title: "Device Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Devices",
                url: "/admin/devices/manage",
                icon: Home,
            },
            {
                title: "Add New Device",
                url: "/admin/devices/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Vehicle Model Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Models",
                url: "/admin/vehicle-models/manage",
                icon: Home,
            },
            {
                title: "Add New Model",
                url: "/admin/vehicle-models/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Vehicle Make Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Manufacturers",
                url: "/admin/vehicle-makes/manage",
                icon: Home,
            },
            {
                title: "Add New Manufacturer",
                url: "/admin/vehicle-makes/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Vehicle Class Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Classes",
                url: "/admin/vehicle-classes/manage",
                icon: Home,
            },
            {
                title: "Add New Class",
                url: "/admin/vehicle-classes/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Vehicle Owner Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Owners",
                url: "/admin/vehicle-owners/manage",
                icon: Home,
            },
            {
                title: "Add New Owner",
                url: "/admin/vehicle-owners/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Manage Fares",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Fare Scheme",
                url: "/admin/fares/scheme",
                icon: Home,
            },
            {
                title: "Manage Fare Schemes",
                url: "/admin/fares/manage",
                icon: Home,
            },
            {
                title: "Add New Fare Scheme",
                url: "/admin/fares/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Corporate Portal",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Corporates",
                url: "/admin/corporate/manage",
                icon: Home,
            },
            {
                title: "Add New Corporate",
                url: "/admin/corporate/add",
                icon: Home,
            },
        ],
    },
    {
        title: "User Management",
        url: "#",
        icon: SettingsIcon,
        children: [
            {
                title: "Manage Users",
                url: "/admin/users/manage",
                icon: Home,
            },
            {
                title: "Add User",
                url: "/admin/users/add",
                icon: Home,
            },
        ],
    },
    {
        title: "Reports",
        url: "#",
        icon: FileText,
        children: [
            {
                title: "Pending Reports",
                url: "/admin/reports/pending",
                icon: FileText
            },
            {
                title: "Dispatched Booking Report",
                url: "/admin/reports/dispatched",
                icon: FileText
            },
            {
                title: "Enroute Bookings Report",
                url: "/admin/reports/enroute",
                icon: FileText,
            },
            {
                title: "Driver Waiting Booking Report",
                url: "/admin/reports/waiting",
                icon: FileText
            },
            {
                title: "Passenger On Board Report",
                url: "/admin/reports/passenger-on-board",
                icon: FileText
            },
            {
                title: "Completed Bookings Report",
                url: "/admin/reports/completed-bookings",
                icon: FileText
            },
            //{
            //    title: "Modification Details Report",
            //    url: "/admin/reports/modification",
            //    icon: FileText
            //},
            {
                title: "Cancelled Bookings Report",
                url: "/admin/reports/cancelled-bookings",
                icon: FileText
            },
            {
                title: "Driver Details Report",
                url: "/admin/reports/driver-details",
                icon: FileText
            },
            {
                title: "Driver Activity Log Report",
                url: "/admin/reports/driver-activity-log",
                icon: FileText
            },
            {
                title: "Vehicle Details Report",
                url: "/admin/reports/vehicle-details",
                icon: FileText
            },
            {
                title: "Device Details Report",
                url: "/admin/reports/device-details",
                icon: FileText
            },
            {
                title: "Vehicle Model Details Report",
                url: "/admin/reports/vehicle-model-details",
                icon: FileText
            },
            {
                title: "Vehicle Make Details Report",
                url: "/admin/reports/vehicle-make-details",
                icon: FileText
            },
            {
                title: "Vehicle Class Details Report",
                url: "/admin/reports/vehicle-class-details",
                icon: FileText
            },
            {
                title: "Vehicle Owner Details Report",
                url: "/admin/reports/vehicle-owner-details",
                icon: FileText
            },
            {
                title: "Fare Scheme Details Report",
                url: "/admin/reports/fare-scheme-details",
                icon: FileText
            },
            {
                title: "Corporate Details Report",
                url: "/admin/reports/corporate-details",
                icon: FileText
            },
            {
                title: "User Details Report",
                url: "/admin/reports/user-details",
                icon: FileText
            },
            {
                title: "Promo Code Details Report",
                url: "/admin/reports/promo-code-details",
                icon: FileText
            },
        ],
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: SettingsIcon,
        allowedRoles: ["admin"],
    },
];
