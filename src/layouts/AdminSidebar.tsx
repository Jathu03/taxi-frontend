import {
  Calendar,
  ChevronRight,
  Home,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  Cog,
  CarTaxiFront,
  Building2,
  FileText,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logoText from "@/assets/images/KPV_Taxi_logo_text.png";

type MenuItem = {
  title: string;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  isActive?: boolean;
  children?: MenuItem[];
};
// Menu items.
const items: MenuItem[] = [
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
    title: "TUK Booking ",
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
    icon: Settings,
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
      { title: "Pending Reports", 
        url: "/admin/reports/pending",
        icon: FileText 
      },
      { title: "Dispatched Booking Report", 
        url: "/admin/reports/dispatched", 
        icon: FileText 
      },
      {
        title: "Enroute Bookings Report",
        url: "/admin/reports/enroute",
        icon: FileText,
      },
      { title: "Driver Waiting Booking Report", 
        url: "/admin/reports/waiting",
        icon: FileText 
      },
      { title: "Passenger On Board Report", 
        url: "/admin/reports/passenger-on-board",
        icon: FileText 
      },
      { title: "Completed Bookings Report", 
        url: "/admin/reports/completed-bookings",
        icon: FileText 
      },
      { title: "Modification Details Report", 
        url: "/admin/reports/modification",
        icon: FileText 
      },
      { title: "Cancelled Bookings Report", 
        url: "/admin/reports/cancelled-bookings",
        icon: FileText 
      },
      { title: "Driver Details Report", 
        url: "/admin/reports/driver-details",
        icon: FileText 
      },
      { title: "Driver Activity Log Report", 
        url: "/admin/reports/driver-activity-log",
        icon: FileText 
      },
      { title: "Vehicle Details Report", 
        url: "/admin/reports/vehicle-details",
        icon: FileText 
      },
      { title: "Device Details Report", 
        url: "/admin/reports/device-details",
        icon: FileText 
      },
      { title: "Vehicle Model Details Report", 
        url: "/admin/reports/vehicle-model-details",
        icon: FileText 
      },
      { title: "Vehicle Make Details Report", 
        url: "/admin/reports/vehicle-make-details",
        icon: FileText 
      },
      { title: "Vehicle Class Details Report", 
        url: "/admin/reports/vehicle-class-details",
        icon: FileText 
      },
      { title: "Vehicle Owner Details Report", 
        url: "/admin/reports/vehicle-owner-details",
        icon: FileText 
      },
      { title: "Fare Scheme Details Report", 
        url: "/admin/reports/fare-scheme-details",
        icon: FileText 
      },
      { title: "Corporate Details Report", 
        url: "/admin/reports/corporate-details",
        icon: FileText 
      },
      { title: "Corporate User Details Report", 
        url: "/admin/reports/corporate-user-details",
        icon: FileText 
      },
      { title: "User Details Report", 
        url: "/admin/reports/user-details",
        icon: FileText 
      },
      { title: "Promo Code Details Report", 
        url: "/admin/reports/promo-code-details",
        icon: FileText 
      },
      
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50 border-r border-purple-200/50 z-[90]">
      <SidebarHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200/50 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="overflow-visible h-fit hover:bg-grey-200/30" asChild>
              <Link to="/admin">
                <div className="flex items-center justify-center rounded-lg p-2">
                  <img src={logoText} alt="KPV Taxi Logo" />
                </div>

              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>{" "}
      </SidebarHeader>
      <SidebarContent className="scrollbar-h-screen overflow-y-auto scrollbar-none scrollbar-track-current p-2 gap-0 bg-transparent">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen={(item.children || []).some((child) => child.isActive)}
            className="group/collapsible"
          >
            <SidebarGroup className="">
              <SidebarGroupLabel
                asChild
                className="group/label text-gray-700 hover:bg-purple-100 hover:text-purple-900 text-sm font-semibold"
              >
                <CollapsibleTrigger className="flex items-center text-left whitespace-nowrap w-full rounded-md font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-900 data-[state=open]/collapsible:bg-purple-100 data-[state=open]/collapsible:text-purple-900">
                  <item.icon className="mr-2 inline-block h-4 w-4 align-text-bottom" />
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuSub className="w-full">
                    {(item.children || []).map((child) => {
                      const isActive = child.url === location.pathname;
                      return (
                        <SidebarMenuSubItem key={child.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            className="text-gray-600 hover:text-purple-900 hover:bg-purple-50 data-[active=true]:bg-white-200 data-[active=true]:text-purple-900 data-[active=true]:font-semibold"
                          >
                            <Link to={child.url || "#"}><span><child.icon className="mr-2 inline-block h-4 w-4 align-text-left" /></span>{child.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
