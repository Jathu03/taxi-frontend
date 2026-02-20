# UI to Database Mapping Guide

This document maps every section in your Admin Panel UI to the corresponding database tables and columns. Use this to understand exactly where your data goes when you click "Save".

---

## 1. User Management
**UI Page:** `AddUser.tsx`

| UI Section | Database Table | Columns Used |
| :--- | :--- | :--- |
| **User Information** | `users` | `first_name`, `last_name`, `username`, `email`, `password_hash`, `phone_number` |
| **Roles (Checkboxes)** | `user_roles` | Links `user_id` to `role_id` (via `roles` table) |

---

## 2. Driver Management
**UI Page:** `AddDriver.tsx`

### Section: Personal Details
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Code | `drivers` | `code` |
| Name (First/Last) | `drivers` | `first_name`, `last_name` |
| NIC # | `drivers` | `nic` |
| Birth Date | `drivers` | `birth_date` |
| Contact/Emergency # | `drivers` | `contact_number`, `emergency_number` |
| Address | `drivers` | `address` |
| IsBlocked / Description | `drivers` | `is_blocked`, `blocked_description` |
| Manual Dispatch Only | `drivers` | `manual_dispatch_only` |
| Is Verified | `drivers` | `is_verified` |

### Section: Driver Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Licence # | `drivers` | `license_number` |
| Licence Expiry Date | `drivers` | `license_expiry_date` |
| **Vehicle # (Dropdown)** | `drivers` | `current_vehicle_id` (FK to `vehicles`) |
| **User (Dropdown)** | `drivers` | `user_id` (FK to `users`) |
| Company | `drivers` | `company_name` |

---

## 3. Fleet Management (Vehicle)
**UI Page:** `AddVehicle.tsx`

### Section: Registration Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Vehicle Code | `vehicles` | `vehicle_code` |
| Registration # | `vehicles` | `registration_no` |
| Chasis # | `vehicles` | `chassis_no` |
| Reg Date | `vehicles` | `registration_date` |

### Section: License Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Rev Licence # | `vehicles` | `revenue_license_no` |
| Rev Licence Exp Date | `vehicles` | `revenue_license_exp_date` |

### Section: Passenger Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Passenger Capacity | `vehicles` | `passenger_capacity` |
| Luggage Capacity | `vehicles` | `luggage_capacity` |
| Comments | `vehicles` | `comments` |

### Section: Manufacture Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Man Year | `vehicles` | `manufacture_year` |
| **Manufacturer** | `vehicles` | `manufacturer_id` (FK to `vehicle_manufacturers`) |
| **Model** | `vehicles` | `model_id` (FK to `vehicle_models`) |
| Fuel Type | `vehicles` | `fuel_type` |

### Section: Insurance Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Insurer | `vehicles` | `insurer_name` |
| Insurance # | `vehicles` | `insurance_no` |
| Insurance Exp Date | `vehicles` | `insurance_expiry_date` |

### Section: Other Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| **Owner** | `vehicles` | `owner_id` (FK to `vehicle_owners`) |
| **Class** | `vehicles` | `vehicle_class_id` (FK to `vehicle_classes`) |
| **Fare Scheme** | `vehicles` | `fare_scheme_id` (FK to `fare_schemes`) |
| Company | `vehicles` | `company_name` |

---

## 4. Bookings
**UI Page:** `AddBooking.tsx`

### Section: Personal Details
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| **Customer** | `bookings` | `customer_id` (FK to `customers`) |
| Corporate Id | `bookings` | `corporate_id` (FK to `corporates`) |
| Contact # / Name | `bookings` | `contact_number_input`, `passenger_name` |
| No. of Pass | `bookings` | `passenger_count` |

### Section: Pickup Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Hire Type | `bookings` | `hire_type` |
| Pickup Time | `bookings` | `pickup_time` |
| Pickup Address | `bookings` | `pickup_address` |
| Drop Address | `bookings` | `drop_address` |
| Special Remarks | `bookings` | `special_remarks` |

### Section: Other Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Luggage (Kg) | `bookings` | `luggage_weight` |
| Remarks | `bookings` | `remarks` |
| Checkboxes (Adv/Test) | `bookings` | `is_advance_booking`, `is_test_booking` |

### Section: Vehicle Information
| UI Field | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| **Vehicle Class** | `bookings` | `vehicle_class_id` (FK to `vehicle_classes`) |
| **Fare Scheme** | `bookings` | `fare_scheme_id` (FK to `fare_schemes`) |
| **Payment Type** | `payments` | Separated into `payments.payment_type` |

---

## 5. Operations (Fares, Promos)

### Page: `AddFare.tsx`
| UI Section | Database Table | Columns Used |
| :--- | :--- | :--- |
| **Basic Fare Info** | `fare_schemes` | `fare_code`, `min_km`, `min_rate`, `rate_per_km`, `free_wait_time`, `waiting_charge_per_min` |
| **Peak Hour Config** | `fare_schemes` | `peak_hour_start_time`, `peak_hour_end_time`, `off_peak_min_rate_hike`, `rate_per_km_hike`, `is_metered` |
| **Package Info** | `fare_schemes` | `is_package`, `package_min_time`, `additional_time_slot`, `rate_per_additional_time_slot` |

### Page: `AddPromoCode.tsx`
| UI Section | Database Table | Columns Used |
| :--- | :--- | :--- |
| **Promo Code Details** | `promo_codes` | `code`, `description`, `discount_type`, `discount_value`, `start_date`, `end_date`, `is_active` |
| **Vehicle Classes** | `promo_code_vehicle_classes` | Junction table linking `promo_code_id` + `vehicle_class_id` |
| **Limitations** | `promo_codes` | `max_amount`, `is_first_time_only`, `max_count_per_user`, `max_usage`, `min_hire_count`, `max_hire_count` |

---

## 6. Logs & Tracking

### Page: `ViewActivityLog.tsx`
| UI Display | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Driver/Vehicle Info | `driver_activity_logs` | Joined with `drivers` and `vehicles` tables |
| Last Location | `driver_activity_logs` | `last_location` |
| Duration | `driver_activity_logs` | `total_online_duration` |

### Page: `SendSMS.tsx`
| UI Tab | Database Table | Coordinate Column |
| :--- | :--- | :--- |
| Bulk SMS | `sms_logs` | `message_type` = 'Bulk', `recipient_number` |
| Vehicle Class SMS | `sms_logs` | `message_type` = 'VehicleClass', `related_vehicle_class` |
| Driver SMS | `sms_logs` | `message_type` = 'Driver', `recipient_driver_id` |
