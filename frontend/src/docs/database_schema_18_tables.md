# Database Schema: 18 Tables

Based on the detailed analysis of the `src/pages/admin` directory, here are the 18 entities and their columns.

## 1. User Management

### 1. `users`
*   `id` (PK)
*   `username`
*   `email`
*   `password_hash`
*   `first_name`
*   `last_name`
*   `phone_number`
*   `created_at`

### 2. `roles`
*   `id` (PK)
*   `name` (e.g., Administrator, Accountant, Driver, Corporate, CallCenterAgent)

### 3. `user_roles`
*   `user_id` (FK -> users.id)
*   `role_id` (FK -> roles.id)
*   `created_at`

## 2. Fleet Management

### 4. `vehicles`
*   `id` (PK)
*   `vehicle_code` (e.g., CAB-1234)
*   `registration_number` (WP-xxx-xxxx)
*   `chassis_number`
*   `registration_date`
*   `revenue_license_no`
*   `revenue_license_expiry_date`
*   `passenger_capacity`
*   `luggage_capacity`
*   `manufacture_year`
*   `fuel_type` (Petrol, Diesel, Hybrid, Electric)
*   `insurance_provider`
*   `insurance_policy_no`
*   `insurance_expiry_date`
*   `owner_type` (Company, Owner, Other)
*   `status` (Active, Maintenance)
*   `comments`
*   `make_id` (FK -> vehicle_makes.id)
*   `model_id` (FK -> vehicle_models.id)
*   `class_id` (FK -> vehicle_classes.id)
*   `owner_id` (FK -> vehicle_owners.id, nullable if company owned)
*   `default_fare_scheme_id` (FK -> fare_schemes.id)

### 5. `vehicle_owners`
*   `id` (PK)
*   `name` (Personal/Company Name)
*   `nic_or_business_reg_no`
*   `company_name` (if applicable)
*   `email`
*   `primary_contact_number`
*   `secondary_contact_number`
*   `postal_address`

### 6. `drivers`
*   `id` (PK)
*   `driver_code`
*   `user_id` (FK -> users.id)
*   `first_name`
*   `last_name`
*   `nic`
*   `birth_date`
*   `contact_number`
*   `emergency_contact_number`
*   `address`
*   `license_number`
*   `license_expiry_date`
*   `is_verified`
*   `is_blocked`
*   `blocked_reason`
*   `manual_dispatch_only`
*   `current_vehicle_id` (FK -> vehicles.id)
*   `company_type` (CASONS, OTHER)

### 7. `devices`
*   `id` (PK)
*   `device_id` (Hardware ID, e.g., GPS-001)
*   `device_type` (GPS Tracker, Meter, Tablet, Phone)
*   `status` (Active, Inactive, Maintenance)
*   `install_date`
*   `assigned_driver_id` (FK -> drivers.id)
*   `assigned_vehicle_id` (FK -> vehicles.id)
*   `notes`

## 3. Booking & Dispatch

### 8. `bookings`
*   `id` (PK)
*   `booking_number`
*   `customer_name`
*   `passenger_name`
*   `contact_number`
*   `passenger_count`
*   `pickup_time`
*   `pickup_address`
*   `drop_address`
*   `luggage_weight`
*   `hire_type` (On The Meter, Fixed Rate, Package)
*   `vehicle_class_id` (FK -> vehicle_classes.id)
*   `fare_scheme_id` (FK -> fare_schemes.id)
*   `payment_type` (Cash, Card, Credit, Bank Transfer)
*   `corporate_id` (FK -> corporates.id, nullable)
*   `is_advance_booking`
*   `is_test_booking`
*   `is_inquiry_only`
*   `status` (Pending, Dispatched, EnRoute, Completed, Cancelled)
*   `special_remarks`
*   `internal_remarks`

### 9. `tuk_bookings`
*   `id` (PK)
*   `booking_reference` (TAPP-xxx)
*   `customer_name`
*   `phone_number`
*   `pickup_location`
*   `drop_location`
*   `vehicle_type`
*   `booking_time`
*   `app_platform` (Android, iOS)
*   `status` (Pending, Dispatched, Cancelled)

### 10. `activity_logs`
*   `id` (PK)
*   `driver_id` (FK -> drivers.id)
*   `vehicle_id` (FK -> vehicles.id)
*   `login_time`
*   `logout_time`
*   `total_duration`
*   `last_location`

## 4. Master Data / Lookup

### 11. `vehicle_classes`
*   `id` (PK)
*   `name` (e.g., LUXURY, STANDARD, TUK)
*   `description`
*   `is_active`

### 12. `vehicle_makes`
*   `id` (PK)
*   `name` (e.g., Toyota, Nissan)

### 13. `vehicle_models`
*   `id` (PK)
*   `name` (e.g., Prius, Axio)
*   `make_id` (FK -> vehicle_makes.id)

### 14. `fare_schemes`
*   `id` (PK)
*   `code` (e.g., STANDARD, PREMIUM)
*   `min_distance_km`
*   `min_rate_rs`
*   `rate_per_km`
*   `free_wait_time_min`
*   `waiting_charge_per_min`
*   `peak_hour_start`
*   `peak_hour_end`
*   `off_peak_rate_hike_pct`
*   `peak_rate_hike_pct`
*   `is_metered`
*   `is_package`
*   `package_min_time`
*   `package_extra_slot_time`
*   `package_extra_slot_rate`

### 15. `promo_codes`
*   `id` (PK)
*   `code`
*   `description`
*   `discount_type` (Percentage, Amount)
*   `discount_value`
*   `start_date`
*   `end_date`
*   `is_active`
*   `max_amount`
*   `max_usage_count`
*   `max_count_per_user`
*   `min_hire_count`
*   `is_first_time_only`
*   `applicable_vehicle_classes` (JSON array or Text)

## 5. Corporate Management

### 16. `corporates`
*   `id` (PK)
*   `company_name`
*   `company_code`
*   `primary_contact_name`
*   `phone_number`
*   `email`
*   `address`
*   `registration_date`
*   `cash_discount_percentage`
*   `credit_discount_percentage`
*   `is_quick_booking_enabled`

### 17. `corporate_vehicle_classes`
*   `id` (PK)
*   `corporate_id` (FK -> corporates.id)
*   `vehicle_class_id` (FK -> vehicle_classes.id)
*   `is_enabled`

### 18. `corporate_vehicle_categories`
*   `id` (PK)
*   `corporate_id` (FK -> corporates.id)
*   `category_name` (e.g., TUK, Bus - might map to vehicle_classes or be a separate logical grouping)
*   `is_enabled`
