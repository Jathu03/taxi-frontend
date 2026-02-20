# Database Schema Analysis & Proposal

Based on the analysis of the existing UI forms and project structure, here is the proposed database schema. The analysis focuses on the `src/pages/admin` and `src/types` directories to deduce the necessary entities and their attributes.

## 1. Identified Entities & Tables

### Core Entities
| Table Name | Reasoning |
| :--- | :--- |
| **`users`** | Core authentication and authorization entity. Used for system login and managing staff (Admins, Accountants, Call Center Agents) as well as Drivers who need system access. |
| **`drivers`** | Explicit `driver-management` section. Drivers have specific attributes like license details, assigned vehicle, and verification status separate from a basic user. |
| **`vehicles`** | Explicit `vehicle-management` section. Vehicles are a central asset linked to drivers and bookings. |
| **`bookings`** | The core business transaction. `bookings` directory handles creation, dispatch, and tracking of trips. |
| **`corporates`** | Explicit `corporate` section. Represents business clients with specific billing rules (discounts) and contact info. |

### Lookup/Configuration Entities
| Table Name | Reasoning |
| :--- | :--- |
| **`vehicle_classes`** | `vehicle-class-management` directory exists. Used in vehicles and bookings (e.g., Luxury, Standard, Van). |
| **`vehicle_makes`** | `vehicle-make-management` directory exists. Used in vehicle registration (e.g., Toyota, Nissan). |
| **`vehicle_models`** | `vehicle-model-management` directory exists. Used in vehicle registration (e.g., Prius, Axio). |
| **`fare_schemes`** | `fares` directory exists. Determines pricing logic (e.g., Metered, Fixed, Mileage). |
| **`roles`** | `user-management` UI allows assigning multiple roles (Admin, Driver, etc.) to a user. Best modeled as a reference table or handled via a join table. |

---

## 2. Table definitions & Relationships

### 1. `users`
**Source:** `src/pages/admin/user-management/AddUser.tsx`
*   **Purpose:** Stores login credentials and profile info for all system users (staff, drivers, etc).
*   **Fields:**
    *   `id` (PK)
    *   `first_name`: string (Required)
    *   `last_name`: string (Required)
    *   `username`: string (Unique, Required)
    *   `email`: string (Unique, Required)
    *   `password_hash`: string (Required)
    *   `phone_number`: string (Required)
    *   `created_at`: datetime
    *   `updated_at`: datetime
*   **Relationships:**
    *   **One-to-Many** with `user_roles` (Junction table to handle `accountant`, `administrator`, `driver`, etc flags).

### 2. `roles` (and `user_roles`)
**Source:** `src/pages/admin/user-management/AddUser.tsx`
*   **Purpose:** Manages the boolean flags seen in UI: Accountant, Administrator, CallCenterAgent, Corporate, Driver.
*   **Fields (`roles`):**
    *   `id` (PK)
    *   `name`: string (e.g., 'ADMIN', 'DRIVER')
*   **Fields (`user_roles`):**
    *   `user_id` (FK -> `users.id`)
    *   `role_id` (FK -> `roles.id`)

### 3. `corporates`
**Source:** `src/pages/admin/corporate/AddCorporate.tsx`
*   **Purpose:** Corporate clients for billing and bookings.
*   **Fields:**
    *   `id` (PK)
    *   `company_name`: string
    *   `company_code`: string (Unique?)
    *   `primary_contact_name`: string
    *   `phone`: string
    *   `email`: string
    *   `address`: text
    *   `registration_date`: date
    *   `cash_discount_rate`: decimal (e.g., 5.00)
    *   `credit_discount_rate`: decimal
    *   `is_quick_booking_enabled`: boolean
*   **Relationships:**
    *   **One-to-Many** with `bookings` (A corporate account can have many bookings).

### 4. `vehicles`
**Source:** `src/pages/admin/vehicle-management/AddVehicle.tsx`
*   **Purpose:** Fleet inventory.
*   **Fields:**
    *   `id` (PK)
    *   `vehicle_code`: string (e.g., CAB-1234)
    *   `registration_number`: string (Primary functional ID)
    *   `chassis_number`: string
    *   `registration_date`: date
    *   `revenue_license_no`: string
    *   `revenue_license_expiry`: date
    *   `passenger_capacity`: integer
    *   `luggage_capacity`: integer
    *   `comments`: text
    *   `manufacture_year`: integer
    *   `fuel_type`: enum/string (Petrol, Diesel, Hybrid, Electric)
    *   `insurer`: string (Could be FK to an `insurers` table if managed, otherwise string)
    *   `insurance_policy_no`: string
    *   `insurance_expiry`: date
    *   `owner_name`: string
    *   `is_company_owned`: boolean
    *   `status`: enum (Active, Maintenance, etc.)
*   **Foreign Keys:**
    *   `make_id` (FK -> `vehicle_makes`) - inferred from "Manufacturer" dropdown.
    *   `model_id` (FK -> `vehicle_models`) - inferred from "Model" dropdown.
    *   `class_id` (FK -> `vehicle_classes`) - inferred from "Class" dropdown.
    *   `fare_scheme_id` (FK -> `fare_schemes`) - Default scheme for this vehicle.
*   **Relationships:**
    *   **One-to-Many** with `drivers` (A vehicle can be assigned to a driver, though typically 1:1 at a time, history might be needed).

### 5. `drivers`
**Source:** `src/pages/admin/driver-management/AddDriver.tsx`
*   **Purpose:** Driver profiles and compliance details.
*   **Fields:**
    *   `id` (PK)
    *   `code`: string
    *   `first_name`: string
    *   `last_name`: string
    *   `nic`: string (National ID)
    *   `birth_date`: date
    *   `contact_number`: string
    *   `emergency_contact_number`: string
    *   `address`: text
    *   `license_number`: string
    *   `license_expiry_date`: date
    *   `is_blocked`: boolean
    *   `blocked_reason`: string
    *   `is_verified`: boolean
    *   `manual_dispatch_only`: boolean
    *   `company`: string (e.g., CASONS)
*   **Foreign Keys:**
    *   `user_id` (FK -> `users.id`) - Links driver profile to login credentials.
    *   `current_vehicle_id` (FK -> `vehicles.id`) - The vehicle currently assigned to this driver.
*   **Relationships:**
    *   **One-to-Many** with `bookings` (A driver fulfills many bookings).

### 6. `bookings`
**Source:** `src/pages/admin/bookings/AddNewBooking.tsx`
*   **Purpose:** Trip records.
*   **Fields:**
    *   `id` (PK)
    *   `booking_number`: string (Unique, user-facing ID)
    *   `customer_name`: string (or FK if customers are a separate entity)
    *   `passenger_name`: string
    *   `contact_number`: string
    *   `passenger_count`: integer
    *   `pickup_datetime`: datetime
    *   `pickup_address`: text
    *   `drop_address`: text (or `destination`)
    *   `hire_type`: enum (On The Meter, Fixed Rate, Package)
    *   `payment_type`: enum (Cash, Card, Credit, Bank Transfer)
    *   `luggage_weight_kg`: decimal
    *   `special_remarks`: text
    *   `internal_remarks`: text
    *   `is_advance_booking`: boolean
    *   `is_test_booking`: boolean
    *   `is_inquiry_only`: boolean
    *   `status`: enum (Pending, Dispatched, EnRoute, Completed, Cancelled)
*   **Foreign Keys:**
    *   `vehicle_class_id` (FK -> `vehicle_classes`) - Requested vehicle type.
    *   `corporate_id` (FK -> `corporates.id`) - Optional, if corporate booking.
    *   `assigned_driver_id` (FK -> `drivers.id`) - assigned upon dispatch.
    *   `assigned_vehicle_id` (FK -> `vehicles.id`) - assigned upon dispatch.
    *   `fare_scheme_id` (FK -> `fare_schemes`) - Selected pricing structure.

---
**Note:** Lookup tables like `vehicle_classes`, `vehicle_makes`, `vehicle_models`, and `fare_schemes` are assumed to have standard `id`, `name`, and `description` fields based on their usage in dropdowns.
