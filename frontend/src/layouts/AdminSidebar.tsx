import { ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { menuItems, type MenuItem } from "@/constants/menuItems";
import { isMenuItemAllowed } from "@/lib/permissionUtils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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

export function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isAllowed = (item: MenuItem, parentTitle?: string) => {
    if (!user) return false;

    // Check dynamic permissions from shared utility
    const dynamicPermission = isMenuItemAllowed(user.role, item.title, parentTitle);
    if (dynamicPermission !== undefined) {
      return dynamicPermission;
    }

    // Fallback to static allowedRoles if no dynamic preference exists
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user.role);
  };

  if (!user) return null;

  const filteredItems = menuItems.filter(item => isAllowed(item));

  return (
    <Sidebar className="bg-gradient-to-b from-purple-50 via-blue-50 to-indigo-50 border-r border-purple-200/50 z-[90]">
      <SidebarHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200/50 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="overflow-visible h-fit hover:bg-grey-200/30" asChild>
              <Link to="/admin">
                <div className="flex items-center justify-center rounded-lg p-2">
                  <img src={logoText} alt="KPV Taxi Logo" className="max-h-8" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2 bg-transparent">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const children = (item.children || []).filter(child => isAllowed(child, item.title));
                const hasChildren = children.length > 0;
                const isActive = item.url === location.pathname || children.some(child => child.url === location.pathname);

                if (!hasChildren && item.url) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="text-gray-700 hover:bg-purple-100 hover:text-purple-900 font-medium"
                      >
                        <Link to={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="text-gray-700 hover:bg-purple-100 hover:text-purple-900 font-medium"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {children.map((child) => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={child.url === location.pathname}
                                  className="text-gray-600 hover:text-purple-900 hover:bg-purple-50"
                                >
                                  <Link to={child.url || "#"}>
                                    <child.icon className="mr-2 h-4 w-4" />
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return null;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
