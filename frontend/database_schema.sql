DROP DATABASE IF EXISTS taxi_system;
CREATE DATABASE taxi_system;
USE taxi_system;

-- ==================================================================================
-- MICROSERVICE: IDENTITY SERVICE
-- Responsibility: Users, Roles, Authentication, Corporate Profiles
-- ==================================================================================

-- 1. Roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

INSERT INTO roles (role_name, description) VALUES 
('Accountant', 'Can view financial reports and payments'),
('Administrator', 'Full access to all system features'),
('CallCenterAgent', 'Can create bookings and view drivers'),
('Corporate', 'Corporate client access'),
('Driver', 'Driver app access');

-- 2. Users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 4. Corporates (Treated as a Tenant/User Entity)
CREATE TABLE corporates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    company_code VARCHAR(50) UNIQUE NOT NULL,
    primary_contact_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    registration_date DATE,
    cash_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    credit_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    enable_quick_booking BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ==================================================================================
-- MICROSERVICE: FLEET SERVICE
-- Responsibility: Vehicles, Drivers, Assets, Configuration
-- ==================================================================================

-- 5. Vehicle Manufacturers
CREATE TABLE vehicle_manufacturers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    manufacturer_name VARCHAR(100) NOT NULL,
    manufacturer_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Vehicle Models
CREATE TABLE vehicle_models (
    id INT PRIMARY KEY AUTO_INCREMENT,
    manufacturer_id INT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_code VARCHAR(50),
    frame_type ENUM('Sedan', 'Hatchback', 'SUV', 'Van', 'Wagon', 'Convertible', 'Coupe', 'Pickup', 'Bus', 'Lorry', 'Mini', 'Budget', 'ECON', 'Luxury', 'Auto', 'Shuttle', 'Buddy Van', 'Flat Roof', 'Other') DEFAULT 'Sedan',
    transmission_type ENUM('Automatic', 'Manual', 'Tiptronic', 'Auto', 'Manul') DEFAULT 'Automatic',
    fuel_injection_type ENUM('Petrol', 'Diesel', 'Hybrid', 'Electric', 'Gas') DEFAULT 'Petrol',
    trim_level VARCHAR(50),
    turbo VARCHAR(50),
    comments TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES vehicle_manufacturers(id)
);

-- 7. Fare Schemes (Technically Pricing, but often tied to Fleet Config. Shared Ref?)
-- Decision: Stays in Fleet/Config or Booking? usually Booking uses it, but Fleet defines it.
-- Let's put in BOOKING SERVICE as it determines Price, but referenced here for defaults.
-- *WAIT* Vehicle Classes need default_fare_scheme_id.
-- In Shared DB, we can define Fare Schemes FIRST (in Booking section) or here.
-- Let's move Fare Schemes to BOOKING, but we need to create it before Vehicle Classes for the FK.
-- *For a strict logical split*, Classes shouldn't have a hard FK to FareScheme if they are different services.
-- *Compromise*: We will define FareSchemes in BOOKING section, but move Booking section UP?
-- No, let's keep FareSchemes in FLEET/MASTER DATA for now if it's tightly coupled to Class configuration.
-- actually, Fare Calculation is core Domain of Booking. But Class Configuration is Fleet.
-- Let's leave Fare Schemes in BOOKING SERVICE section, and acknowledge the Cross-Service FK.

-- 8. Vehicle Classes
-- NOTE: Foreign Keys to 'fare_schemes' (Booking Service) exist here. 
CREATE TABLE vehicle_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(100) NOT NULL,
    class_code VARCHAR(50),
    commission_percentage DECIMAL(5,2) DEFAULT 0.00,
    luggage_capacity VARCHAR(100),
    seat_count INT DEFAULT 0,
    app_order INT DEFAULT 0,
    comments TEXT,
    description TEXT,
    show_in_app BOOLEAN DEFAULT FALSE,
    show_in_web BOOLEAN DEFAULT FALSE,
    class_image_path VARCHAR(255),
    image_primary_path VARCHAR(255),
    image_secondary_path VARCHAR(255),
    image_tertiary_path VARCHAR(255),
    
    -- Cross-Service FKs (Will be Integers in Microserivces)
    default_fare_scheme_id INT,
    corporate_fare_scheme_id INT,
    roadtrip_fare_scheme_id INT,
    app_fare_scheme_id INT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- FK Constraints added at the end or removed for strict separation
);

-- 9. Vehicle Owners
CREATE TABLE vehicle_owners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_name VARCHAR(255) NOT NULL,
    nic_or_business_reg VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    primary_contact_number VARCHAR(20) NOT NULL,
    secondary_contact_number VARCHAR(20),
    postal_address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Drivers
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    
    -- Cross-Service FK (Identity)
    user_id INT, 
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    nic VARCHAR(20),
    birth_date DATE,
    contact_number VARCHAR(20) NOT NULL,
    emergency_number VARCHAR(20),
    address TEXT,
    license_number VARCHAR(50),
    license_expiry_date DATE,
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_description TEXT,
    manual_dispatch_only BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    company_name VARCHAR(50) DEFAULT 'CASONS',
    current_vehicle_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) -- Allowed in Shared DB
);

-- 11. Vehicles
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_code VARCHAR(50) NOT NULL,
    registration_no VARCHAR(20) NOT NULL UNIQUE,
    chassis_no VARCHAR(50),
    registration_date DATE,
    revenue_license_no VARCHAR(50),
    revenue_license_exp_date DATE,
    passenger_capacity INT DEFAULT 0,
    luggage_capacity INT DEFAULT 0,
    manufacture_year INT,
    fuel_type VARCHAR(50),
    insurer_name VARCHAR(100),
    insurance_no VARCHAR(100),
    insurance_expiry_date DATE,
    
    manufacturer_id INT,
    model_id INT,
    vehicle_class_id INT,
    owner_id INT,
    
    -- Cross-Service FK (Booking)
    fare_scheme_id INT,
    
    company_name VARCHAR(50) DEFAULT 'CASONS',
    comments TEXT,
    status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (manufacturer_id) REFERENCES vehicle_manufacturers(id),
    FOREIGN KEY (model_id) REFERENCES vehicle_models(id),
    FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id),
    FOREIGN KEY (owner_id) REFERENCES vehicle_owners(id)
);

ALTER TABLE drivers ADD CONSTRAINT fk_driver_current_vehicle FOREIGN KEY (current_vehicle_id) REFERENCES vehicles(id);

-- 12. Devices
CREATE TABLE devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id VARCHAR(100) NOT NULL UNIQUE,
    device_type ENUM('GPS Tracker', 'Meter', 'Tablet', 'Phone') NOT NULL,
    status ENUM('Active', 'Inactive', 'Maintenance') DEFAULT 'Active',
    install_date DATE NOT NULL,
    assigned_vehicle_id INT,
    assigned_driver_id INT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id)
);

-- 13. Driver Activity Logs (Telemetry)
CREATE TABLE driver_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT,
    vehicle_id INT,
    activity_type VARCHAR(50),
    last_location VARCHAR(255),
    total_online_duration VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 14. Corporate Rules (Fleet Config for Corporates)
CREATE TABLE corporate_vehicle_classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    corporate_id INT NOT NULL,  -- Cross-Service Reference (Identity)
    vehicle_class_id INT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (corporate_id) REFERENCES corporates(id),
    FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id)
);

CREATE TABLE corporate_vehicle_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    corporate_id INT NOT NULL, -- Cross-Service Reference (Identity)
    category_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (corporate_id) REFERENCES corporates(id)
);


-- ==================================================================================
-- MICROSERVICE: BOOKING SERVICE
-- Responsibility: Bookings, Pricing, Payments, Customers
-- ==================================================================================

-- 15. Fare Schemes (Calculations)
CREATE TABLE fare_schemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fare_code VARCHAR(100) UNIQUE NOT NULL,
    min_km DECIMAL(10,2) DEFAULT 0.00,
    min_rate DECIMAL(10,2) DEFAULT 0.00,
    rate_per_km DECIMAL(10,2) DEFAULT 0.00,
    free_wait_time INT DEFAULT 0,
    waiting_charge_per_min DECIMAL(10,2) DEFAULT 0.00,
    peak_hour_start_time TIME,
    peak_hour_end_time TIME,
    off_peak_min_rate_hike DECIMAL(10,2) DEFAULT 0.00,
    rate_per_km_hike DECIMAL(10,2) DEFAULT 0.00,
    is_metered BOOLEAN DEFAULT FALSE,
    is_package BOOLEAN DEFAULT FALSE,
    package_min_time INT DEFAULT 0,
    additional_time_slot INT DEFAULT 0,
    rate_per_additional_time_slot DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add constraints for Vehicle Classes -> Fare Schemes now that Fare Schemes exist
ALTER TABLE vehicle_classes ADD CONSTRAINT fk_class_default_fare FOREIGN KEY (default_fare_scheme_id) REFERENCES fare_schemes(id);
ALTER TABLE vehicle_classes ADD CONSTRAINT fk_class_corp_fare FOREIGN KEY (corporate_fare_scheme_id) REFERENCES fare_schemes(id);
ALTER TABLE vehicle_classes ADD CONSTRAINT fk_class_road_fare FOREIGN KEY (roadtrip_fare_scheme_id) REFERENCES fare_schemes(id);
ALTER TABLE vehicle_classes ADD CONSTRAINT fk_class_app_fare FOREIGN KEY (app_fare_scheme_id) REFERENCES fare_schemes(id);

ALTER TABLE vehicles ADD CONSTRAINT fk_vehicle_fare FOREIGN KEY (fare_scheme_id) REFERENCES fare_schemes(id);


-- 16. Customers
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    corporate_id INT, -- Cross-Service (Identity)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (corporate_id) REFERENCES corporates(id)
);

-- 17. Promo Codes
CREATE TABLE promo_codes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type ENUM('Percentage', 'Amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2),
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    is_first_time_only BOOLEAN DEFAULT FALSE,
    max_count_per_user INT DEFAULT 0,
    max_usage INT DEFAULT 0,
    min_hire_count INT DEFAULT 0,
    max_hire_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promo_code_vehicle_classes (
    promo_code_id INT NOT NULL,
    vehicle_class_id INT NOT NULL, -- Cross-Service (Fleet)
    PRIMARY KEY (promo_code_id, vehicle_class_id),
    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id),
    FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id)
);

-- 18. Bookings
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    customer_name_input VARCHAR(100),
    contact_number_input VARCHAR(20),
    passenger_name VARCHAR(100),
    passenger_count INT DEFAULT 1,
    
    corporate_id INT,                        -- Cross-Service (Identity)
    vehicle_class_id INT,                    -- Cross-Service (Fleet)
    fare_scheme_id INT,                      -- Local
    driver_id INT,                           -- Cross-Service (Fleet)
    vehicle_id INT,                          -- Cross-Service (Fleet)
    
    pickup_time DATETIME NOT NULL,
    pickup_address TEXT NOT NULL,
    drop_address TEXT,
    destination VARCHAR(255),
    hire_type ENUM('On The Meter', 'Fixed Rate', 'Package') DEFAULT 'On The Meter',
    is_advance_booking BOOLEAN DEFAULT FALSE,
    is_test_booking BOOLEAN DEFAULT FALSE,
    is_inquiry_only BOOLEAN DEFAULT FALSE,
    luggage_weight DECIMAL(10,2),
    special_remarks TEXT,
    remarks TEXT,
    status ENUM('Pending', 'Dispatched', 'EnRoute', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (corporate_id) REFERENCES corporates(id),
    FOREIGN KEY (vehicle_class_id) REFERENCES vehicle_classes(id),
    FOREIGN KEY (fare_scheme_id) REFERENCES fare_schemes(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 19. Payments
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    payment_type ENUM('Cash', 'Card', 'Credit Payments', 'Bank Transfer') DEFAULT 'Cash',
    amount DECIMAL(10,2),
    status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- 20. Inquiries
CREATE TABLE inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inquiry_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100),
    contact_number VARCHAR(20),
    organization_source VARCHAR(100),
    hire_type VARCHAR(50),
    pickup_address TEXT,
    vehicle_class_name VARCHAR(50),
    booking_time_text VARCHAR(50),
    status ENUM('Open', 'Converted', 'Closed') DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ==================================================================================
-- MICROSERVICE: NOTIFICATION SERVICE (Or Common)
-- Responsibility: SMS, Emails, Alerts
-- ==================================================================================

-- 21. SMS Logs
CREATE TABLE sms_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_number VARCHAR(20) NOT NULL,
    message_body TEXT NOT NULL,
    message_type ENUM('Bulk', 'VehicleClass', 'Driver') NOT NULL,
    status ENUM('Sent', 'Failed') DEFAULT 'Sent',
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    recipient_driver_id INT,        -- Cross-Service (Fleet)
    related_vehicle_class VARCHAR(50),
    
    FOREIGN KEY (recipient_driver_id) REFERENCES drivers(id)
);
