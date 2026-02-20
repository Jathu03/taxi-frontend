import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

// Map of section redirects to their first child page
const sectionRedirects: Record<string, string> = {
  '/admin/bookings': '/admin/bookings/pending',
  '/admin/tuk': '/admin/tuk/pending',
  '/admin/drivers': '/admin/drivers/manage',
  '/admin/vehicles': '/admin/vehicles/manage',
  '/admin/sms': '/admin/sms/send',
  '/admin/promo-codes': '/admin/promo-codes/manage',
  '/admin/devices': '/admin/devices/manage',
  '/admin/vehicle-models': '/admin/vehicle-models/manage',
  '/admin/vehicle-makes': '/admin/vehicle-makes/manage',
  '/admin/vehicle-classes': '/admin/vehicle-classes/manage',
  '/admin/vehicle-owners': '/admin/vehicle-owners/manage',
  '/admin/fares': '/admin/fares/scheme',
  '/admin/corporate': '/admin/corporate/manage',
  '/admin/users': '/admin/users/manage',
};

const getPageTitle = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return "Dashboard";
  
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return [{label: "Home", path: "/admin"}, {label: "Dashboard", path: "/admin"}];
  
  const breadcrumbs = [{label: "Home", path: "/admin"}];
  let currentPath = '';
  
  for (let i = 1; i < segments.length; i++) {
    currentPath += '/' + segments[i];
    const fullPath = '/admin' + currentPath;
    const label = segments[i].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Use redirect path if this is a parent section
    const redirectPath = sectionRedirects[fullPath] || fullPath;
    breadcrumbs.push({label, path: redirectPath});
  }
  
  return breadcrumbs;
};

export const Header = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const currentPage = getPageTitle(location.pathname);

  return (
    <header className="bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 sticky top-0 z-[100] flex h-16 shrink-0 items-center gap-2 border-b border-purple-200/50 px-4 shadow-md">
      <SidebarTrigger className="-ml-1 text-purple-700 hover:bg-purple-200" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-purple-300" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <>
              {index > 0 && <BreadcrumbSeparator key={`sep-${index}`} className="text-purple-400" />}
              <BreadcrumbItem key={crumb.label} className={index === 0 ? "hidden md:block" : ""}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="text-purple-900 font-medium">{currentPage}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-purple-700 hover:text-purple-900"><Link to={crumb.path}>{crumb.label}</Link></BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
