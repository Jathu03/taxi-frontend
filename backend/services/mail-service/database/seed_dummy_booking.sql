-- Seed required data to test notifications
-- We need a valid Booking, Vehicle Class, Fare Scheme etc. to satisfy Foregin Key constraints

USE taxi_system;

-- 1. Ensure Vehicle Classes exist (from your schema script, they might already be there, but being safe)
INSERT INTO vehicle_classes (class_name, class_code, no_of_seats) VALUES 
('Standard Car', 'STANDARD', 4)
ON DUPLICATE KEY UPDATE class_name=class_name;

-- 2. Create a dummy Booking so we can link notifications to it
-- We need at least one booking with ID 1001 (or we let Auto Increment set it and use that)

-- First, assume purely for testing we force an ID or just insert and rely on it being the first one (ID 1)
INSERT INTO bookings 
(
    booking_id, 
    customer_name, 
    contact_number, 
    pickup_address, 
    booking_time, 
    status,
    vehicle_class_id
) 
VALUES 
(
    'BK-TEST-001', 
    'Jathurshan', 
    '0771234567', 
    '123 Main Street, Colombo', 
    NOW(), 
    'PENDING',
    (SELECT id FROM vehicle_classes WHERE class_code='STANDARD' LIMIT 1)
);

-- Output the ID of the inserted booking so we know what to use in our JSON test
SELECT id as 'Use_This_ID_In_JSON', booking_id FROM bookings WHERE booking_id = 'BK-TEST-001';
