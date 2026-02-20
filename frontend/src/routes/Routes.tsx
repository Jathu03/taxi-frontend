import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./ProtectedRoutes";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/home/Dashboard";
import LoginPage from "@/pages/auth/LoginPage";
import SigninPage from "@/pages/auth/Signin";
import Unauthorized from "@/pages/Unauthorized";
import Configuration from "@/pages/admin/home/Configuration";
import DriverDashboard from "@/pages/admin/home/DriverDashboard";
import CityView from "@/pages/admin/home/CityView";
import Settings from "@/pages/admin/home/Settings";

// Bookings
import AddBooking from "@/pages/admin/bookings/AddBooking";
import AddNewBooking from "@/pages/admin/bookings/AddNewBooking";
import CancelBooking from "@/pages/admin/bookings/CancelBooking";
import CompleteBooking from "@/pages/admin/bookings/CompleteBooking";
import Inquiries from "@/pages/admin/bookings/Inquiries";
import ViewBooking from "@/pages/admin/bookings/ViewBooking";
import PendingBookings from "@/pages/admin/bookings/PendingBookings";
import AppPendingBookings from "@/pages/admin/bookings/AppPendingBookings";
import DispatchVehicle from "@/pages/admin/bookings/DispatchVehicle";
import DispatchedBookings from "@/pages/admin/bookings/DispatchedBookings";
import ManualDispatchedBookings from "@/pages/admin/bookings/ManualDispatchedBookings";
import EnrouteBookings from "@/pages/admin/bookings/EnrouteBookings";
import WaitingForCustomer from "@/pages/admin/bookings/WaitingForCustomer";
import PassengerOnboard from "@/pages/admin/bookings/PassengerOnboard";
import CompletedHires from "@/pages/admin/bookings/CompletedHires";
import CancelledHires from "@/pages/admin/bookings/CancelledHires";
import TrackLive from "@/pages/admin/bookings/TrackLive";
import ReviewHire from "@/pages/admin/bookings/ReviewHire";

// TUK Bookings
import TukPendingBookings from "@/pages/admin/tuk-bookings/TukPendingBookings";
import TukAppPendingBookings from "@/pages/admin/tuk-bookings/TukAppPendingBookings";
import TukDispatchedBookings from "@/pages/admin/tuk-bookings/TukDispatchedBookings";
import TukEnrouteBookings from "@/pages/admin/tuk-bookings/TukEnrouteBookings";
import TukWaitingForCustomer from "@/pages/admin/tuk-bookings/TukWaitingForCustomer";
import TukPassengerOnboard from "@/pages/admin/tuk-bookings/TukPassengerOnboard";
import TukCompletedHires from "@/pages/admin/tuk-bookings/TukCompletedHires";
import TukCancelledHires from "@/pages/admin/tuk-bookings/TukCancelledHires";

// Driver Management
import ManageDrivers from "@/pages/admin/driver-management/ManageDrivers";
import AddDriver from "@/pages/admin/driver-management/AddDriver";
import EditDriver from "@/pages/admin/driver-management/EditDriver";
import DeleteDriver from "@/pages/admin/driver-management/DeleteDriver";
import ViewActivityLog from "@/pages/admin/driver-management/ViewActivityLog";

// Vehicle Management
import ManageVehicles from "@/pages/admin/vehicle-management/ManageVehicles";
import AddVehicle from "@/pages/admin/vehicle-management/AddVehicle";
import EditVehicle from "@/pages/admin/vehicle-management/EditVehicle";
import DeleteVehicle from "@/pages/admin/vehicle-management/DeleteVehicle";

// SMS & Promo
import SendSMS from "@/pages/admin/sms/SendSMS";
import ManagePromoCodes from "@/pages/admin/promo-codes/ManagePromoCodes";
import AddPromoCode from "@/pages/admin/promo-codes/AddPromoCode";
import EditPromoCode from "@/pages/admin/promo-codes/EditPromoCode";
import DeletePromoCode from "@/pages/admin/promo-codes/DeletePromoCode";

// Device Management
import ManageDevices from "@/pages/admin/device-management/ManageDevices";
import AddDevice from "@/pages/admin/device-management/AddDevice";
import EditDevice from "@/pages/admin/device-management/EditDevice";
import DeleteDevice from "@/pages/admin/device-management/DeleteDevice";

// Vehicle Model/Make/Class
import ManageModels from "@/pages/admin/vehicle-model-management/ManageModels";
import AddModel from "@/pages/admin/vehicle-model-management/AddModel";
import EditModel from "@/pages/admin/vehicle-model-management/EditModel";
import DeleteModel from "@/pages/admin/vehicle-model-management/DeleteModel";
import ManageManufacturers from "@/pages/admin/vehicle-make-management/ManageManufacturers";
import AddManufacturer from "@/pages/admin/vehicle-make-management/AddManufacturer";
import EditManufacturer from "@/pages/admin/vehicle-make-management/EditManufacturer";
import DeleteManufacturer from "@/pages/admin/vehicle-make-management/DeleteManufacturer";
import ManageClasses from "@/pages/admin/vehicle-class-management/ManageClasses";
import AddClass from "@/pages/admin/vehicle-class-management/AddClass";
import EditClass from "@/pages/admin/vehicle-class-management/EditClass";
import DeleteClass from "@/pages/admin/vehicle-class-management/DeleteClass";

// Owner/Fares/Corporate
import ManageOwners from "@/pages/admin/vehicle-owner-management/ManageOwners";
import AddOwner from "@/pages/admin/vehicle-owner-management/AddOwner";
import EditOwner from "@/pages/admin/vehicle-owner-management/EditOwner";
import DeleteOwner from "@/pages/admin/vehicle-owner-management/DeleteOwner";
import FareScheme from "@/pages/admin/fares/FareScheme";
import ManageFares from "@/pages/admin/fares/ManageFares";
import AddFare from "@/pages/admin/fares/AddFare";
import EditFare from "@/pages/admin/fares/EditFare";
import DeleteFare from "@/pages/admin/fares/DeleteFare";
import ManageCorporates from "@/pages/admin/corporate/ManageCorporates";
import AddCorporate from "@/pages/admin/corporate/AddCorporate";
import EditCorporate from "@/pages/admin/corporate/EditCorporate";
import DeleteCorporate from "@/pages/admin/corporate/DeleteCorporate";
import ManageCorporateUsers from "@/pages/admin/corporate/ManageCorporateUsers";
import ManageCorporateVehicleClasses from "@/pages/admin/corporate/ManageCorporateVehicleClasses";
import ManageCorporateVehicleCategories from "@/pages/admin/corporate/ManageCorporateVehicleCategories";
import ManageUsers from "@/pages/admin/user-management/ManageUsers";
import AddUser from "@/pages/admin/user-management/AddUser";
import EditUser from "@/pages/admin/user-management/EditUser";
import ResetPassword from "@/pages/admin/user-management/ResetPassword";
import DeleteUser from "@/pages/admin/user-management/DeleteUser";
import AssignCorporateUser from "@/pages/admin/corporate/AssignCorporateUser";

// Report
import UnifiedDispatchedReports from "@/pages/admin/reports/UnifiedDispatchedReports";
import UnifiedPendingReports from "@/pages/admin/reports/UnifiedPendingReports";
import UnifiedEnRouteReports from "@/pages/admin/reports/UnifiedEnRouteReports";
import WaitingBookingsReport from "@/pages/admin/reports/WaitingBookingsReport";
import PassengerOnboardReport from "@/pages/admin/reports/PassengerOnboardReport";
import CompletedBookingsReport from "@/pages/admin/reports/CompletedBookingsReport";
import CancelledHiresReport from "@/pages/admin/reports/CancelledHiresReport";
import DriverReport from "@/pages/admin/reports/DriverReport";
import DriverActivityLog from "@/pages/admin/reports/DriverActivityLog";
import VehicleReport from "@/pages/admin/reports/VehicleReport";
import DeviceDetailsReport from "@/pages/admin/reports/DeviceDetailsReport";
import PromoCodeReport from "@/pages/admin/reports/PromoCodeReport";
import VehicleModelReport from "@/pages/admin/reports/VehicleModelReport";
import VehicleMakeReport from "@/pages/admin/reports/VehicleMakeReport";
import VehicleClassReport from "@/pages/admin/reports/VehicleClassReport";
import VehicleOwnerReport from "@/pages/admin/reports/VehicleOwnerReport";
import FareSchemeReport from "@/pages/admin/reports/FareSchemeReport";
import CorporateReport from "@/pages/admin/reports/CorporateReport";
import CorporateUserReport from "@/pages/admin/reports/CorporateUsersReport";
import UserReport from "@/pages/admin/reports/UserReport";
import UnifiedModificationReport from "@/pages/admin/reports/UnifiedModificationReport";

export const router = createBrowserRouter([
  {
    path: "",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/signup",
    element: <SigninPage />,
  },
  {
    path: "/signup",
    element: <SigninPage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin", "accountant", "callCenterAgent", "corporate", "driver"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          // Home
          { path: "", element: <Dashboard /> },
          { path: "configuration", element: <Configuration /> },
          { path: "driver-dashboard", element: <DriverDashboard /> },
          { path: "city-view", element: <CityView /> },
          { path: "settings", element: <Settings /> },

          // Bookings
          { path: "bookings/add", element: <AddBooking /> },
          { path: "bookings/add-new-booking", element: <AddNewBooking /> },
          { path: "bookings/:id", element: <AddNewBooking /> },
          { path: "bookings/edit/:id", element: <AddNewBooking /> },
          { path: "bookings/cancel-booking", element: <CancelBooking /> },
          { path: "bookings/cancel/:id", element: <CancelBooking /> },
          { path: "bookings/complete-booking", element: <CompleteBooking /> },
          { path: "bookings/inquiries", element: <Inquiries /> },
          { path: "bookings/view/:id", element: <CancelBooking /> },
          { path: "bookings/pending", element: <PendingBookings /> },
          { path: "bookings/app-pending", element: <AppPendingBookings /> },
          { path: "bookings/dispatch-vehicle", element: <DispatchVehicle /> },
          { path: "bookings/dispatched", element: <DispatchedBookings /> },
          { path: "bookings/manual-dispatched", element: <ManualDispatchedBookings /> },
          { path: "bookings/enroute", element: <EnrouteBookings /> },
          { path: "bookings/waiting", element: <WaitingForCustomer /> },
          { path: "bookings/onboard", element: <PassengerOnboard /> },
          { path: "bookings/track/:bookingId", element: <TrackLive /> },
          { path: "bookings/completed", element: <CompletedHires /> },
          { path: "bookings/review/:id", element: <ReviewHire /> },
          { path: "bookings/cancelled", element: <CancelledHires /> },

          // TUK Bookings
          { path: "tuk/pending", element: <TukPendingBookings /> },
          { path: "tuk/app-pending", element: <TukAppPendingBookings /> },
          { path: "tuk/dispatched", element: <TukDispatchedBookings /> },
          { path: "tuk/enroute", element: <TukEnrouteBookings /> },
          { path: "tuk/waiting", element: <TukWaitingForCustomer /> },
          { path: "tuk/onboard", element: <TukPassengerOnboard /> },
          { path: "tuk/track/:bookingId", element: <TrackLive /> },
          { path: "tuk/completed", element: <TukCompletedHires /> },
          { path: "tuk/review/:id", element: <ReviewHire /> },
          { path: "tuk/view/:id", element: <ViewBooking /> },
          { path: "tuk/cancelled", element: <TukCancelledHires /> },

          // Driver Management
          { path: "drivers/manage", element: <ManageDrivers /> },
          { path: "drivers/add", element: <AddDriver /> },
          { path: "drivers/edit/:id", element: <EditDriver /> },
          { path: "drivers/delete/:id", element: <DeleteDriver /> },
          { path: "drivers/activity-log", element: <ViewActivityLog /> },

          // Vehicle Management
          { path: "vehicles/manage", element: <ManageVehicles /> },
          { path: "vehicles/add", element: <AddVehicle /> },
          { path: "vehicles/edit/:id", element: <EditVehicle /> },
          { path: "vehicles/delete/:id", element: <DeleteVehicle /> },

          // SMS & Promo
          { path: "sms/send", element: <SendSMS /> },
          { path: "promo-codes/manage", element: <ManagePromoCodes /> },
          { path: "promo-codes/add", element: <AddPromoCode /> },
          { path: "promo-codes/edit/:id", element: <EditPromoCode /> },
          { path: "promo-codes/delete/:id", element: <DeletePromoCode /> },

          // Device Management
          { path: "devices/manage", element: <ManageDevices /> },
          { path: "devices/add", element: <AddDevice /> },
          { path: "devices/edit/:id", element: <EditDevice /> },
          { path: "devices/delete/:id", element: <DeleteDevice /> },

          // Vehicle Model/Make/Class
          { path: "vehicle-models/manage", element: <ManageModels /> },
          { path: "vehicle-models/add", element: <AddModel /> },
          { path: "vehicle-models/edit/:id", element: <EditModel /> },
          { path: "vehicle-models/delete/:id", element: <DeleteModel /> },
          { path: "vehicle-makes/manage", element: <ManageManufacturers /> },
          { path: "vehicle-makes/add", element: <AddManufacturer /> },
          { path: "vehicle-makes/edit/:id", element: <EditManufacturer /> },
          { path: "vehicle-makes/delete/:id", element: <DeleteManufacturer /> },
          { path: "vehicle-classes/manage", element: <ManageClasses /> },
          { path: "vehicle-classes/add", element: <AddClass /> },
          { path: "vehicle-classes/edit/:id", element: <EditClass /> },
          { path: "vehicle-classes/delete/:id", element: <DeleteClass /> },

          // Owner/Fares/Corporate
          { path: "vehicle-owners/manage", element: <ManageOwners /> },
          { path: "vehicle-owners/add", element: <AddOwner /> },
          { path: "vehicle-owners/edit/:id", element: <EditOwner /> },
          { path: "vehicle-owners/delete/:id", element: <DeleteOwner /> },
          { path: "fares/scheme", element: <FareScheme /> },
          { path: "fares/manage", element: <ManageFares /> },
          { path: "fares/add", element: <AddFare /> },
          { path: "fares/edit/:id", element: <EditFare /> },
          { path: "fares/delete/:id", element: <DeleteFare /> },

          { path: "corporate/manage", element: <ManageCorporates /> },
          { path: "corporate/add", element: <AddCorporate /> },
          { path: "corporate/edit/:id", element: <EditCorporate /> },
          { path: "corporate/delete/:id", element: <DeleteCorporate /> },

          { path: "corporate/:corporateId/users", element: <ManageCorporateUsers /> },
          { path: "corporate/:corporateId/users/add", element: <AssignCorporateUser /> },
          { path: "corporate/:corporateId/users/:userId/edit", element: <AssignCorporateUser /> },

          // (Optional) Corporate Vehicle Classes / Categories
          { path: "corporate/:id/vehicle-classes", element: <ManageCorporateVehicleClasses /> },

          { path: "corporate/:id/vehicle-categories", element: <ManageCorporateVehicleCategories /> },

          // User Management
          { path: "users/manage", element: <ManageUsers /> },
          { path: "users/add", element: <AddUser /> },
          { path: "users/edit/:id", element: <EditUser /> },
          { path: "users/reset-password/:id", element: <ResetPassword /> },
          { path: "users/delete/:id", element: <DeleteUser /> },

          // Report (can keep as absolute if you want)
          { path: "/admin/reports/pending", element: <UnifiedPendingReports /> },
          { path: "/admin/reports/dispatched", element: <UnifiedDispatchedReports /> },
          { path: "/admin/reports/enroute", element: <UnifiedEnRouteReports /> },
          { path: "/admin/reports/waiting", element: <WaitingBookingsReport /> },
          { path: "/admin/reports/passenger-on-board", element: <PassengerOnboardReport /> },
          { path: "/admin/reports/completed-bookings", element: <CompletedBookingsReport /> },
          { path: "/admin/reports/cancelled-bookings", element: <CancelledHiresReport /> },
          { path: "/admin/reports/driver-details", element: <DriverReport /> },
          { path: "/admin/reports/driver-activity-log", element: <DriverActivityLog /> },
          { path: "/admin/reports/vehicle-details", element: <VehicleReport /> },
          { path: "/admin/reports/device-details", element: <DeviceDetailsReport /> },
          { path: "/admin/reports/vehicle-model-details", element: <VehicleModelReport /> },
          { path: "/admin/reports/vehicle-make-details", element: <VehicleMakeReport /> },
          { path: "/admin/reports/vehicle-class-details", element: <VehicleClassReport /> },
          { path: "/admin/reports/vehicle-owner-details", element: <VehicleOwnerReport /> },
          { path: "/admin/reports/fare-scheme-details", element: <FareSchemeReport /> },
          { path: "/admin/reports/corporate-details", element: <CorporateReport /> },
          { path: "/admin/reports/corporate-user-details", element: <CorporateUserReport /> },
          { path: "/admin/reports/user-details", element: <UserReport /> },
          { path: "/admin/reports/promo-code-details", element: <PromoCodeReport /> },
          { path: "/admin/reports/modification", element: <UnifiedModificationReport /> },
        ],
      },
    ],
  },
]);