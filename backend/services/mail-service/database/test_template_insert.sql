-- Test script to verify and insert the BOOKING_CONFIRMED template
USE taxi_system;

-- First, check if the template exists
SELECT * FROM email_templates WHERE template_code = 'BOOKING_CONFIRMED';

-- If it doesn't exist, insert it
INSERT INTO email_templates 
(template_code, template_name, subject, body_template, description, is_active, created_at) 
VALUES 
(
    'BOOKING_CONFIRMED', 
    'Booking Confirmation', 
    'Your booking {{bookingId}} is confirmed 🚖', 
    'Hello {{customerName}},<br><br>
    Your ride has been confirmed.<br>
    Driver: <b>{{driverName}}</b><br>
    Vehicle: <b>{{vehicleNumber}}</b><br>
    Pickup: <b>{{pickupLocation}}</b><br>
    Time: <b>{{pickupTime}}</b><br><br>
    Thank you for choosing us!', 
    'Sent when booking is confirmed', 
    true, 
    NOW()
)
ON DUPLICATE KEY UPDATE
    template_name = VALUES(template_name),
    subject = VALUES(subject),
    body_template = VALUES(body_template),
    description = VALUES(description),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- Verify the insert
SELECT * FROM email_templates WHERE template_code = 'BOOKING_CONFIRMED';
