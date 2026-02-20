-- Seed data for notification_types
-- Merging User's Notification Types with Rich HTML Email Templates

USE taxi_system;

-- Clear existing types to avoid duplicates/conflicts during development
-- DELETE FROM notification_types; -- Uncomment if you want to wipe clean first

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'BOOKING_CREATED', 
    'Booking Created', 
    1, 1, 0, 
    'Your booking {{bookingId}} has been created. Pickup: {{pickupAddress}}', 
    'Booking Confirmed - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Booking Confirmed</h1><div style="background:#f9f9f9;padding:20px;"><p>Dear {{customerName}},</p><p>Your taxi booking has been confirmed.</p><p><strong>Booking ID:</strong> {{bookingId}}<br><strong>Pickup:</strong> {{pickupAddress}}<br><strong>Time:</strong> {{pickupTime}}<br><strong>Vehicle:</strong> {{vehicleClass}}</p><p>We will notify you once a driver is assigned.</p></div></body></html>',
    NULL,
    'Sent when a new booking is created',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'BOOKING_DISPATCHED', 
    'Driver Assigned', 
    1, 1, 0, 
    'Driver {{driverName}} ({{vehicleNumber}}) is on the way. ETA: {{eta}}', 
    'Driver Assigned - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Driver On The Way!</h1><div style="background:#f9f9f9;padding:20px;"><p>Dear {{customerName}},</p><p>A driver has been assigned to your booking.</p><p><strong>Driver:</strong> {{driverName}}<br><strong>Vehicle:</strong> {{vehicleNumber}} ({{vehicleClass}})<br><strong>ETA:</strong> {{eta}}</p></div></body></html>',
    NULL,
    'Sent when a driver is dispatched',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'DRIVER_ARRIVED', 
    'Driver Arrived', 
    1, 1, 0, 
    'Your driver has arrived at {{pickupAddress}}', 
    'Your Driver Has Arrived - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Driver Has Arrived!</h1><div style="background:#f9f9f9;padding:20px;"><p>Dear {{customerName}},</p><h2 style="color:orange;">Your driver is waiting!</h2><p><strong>Driver:</strong> {{driverName}}<br><strong>Vehicle:</strong> {{vehicleNumber}}<br><strong>Location:</strong> {{pickupAddress}}</p></div></body></html>',
    NULL,
    'Sent when driver arrives at pickup',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'TRIP_STARTED', 
    'Trip Started', 
    1, 1, 0, 
    'Your trip has started. Have a safe journey!', 
    'Your Trip Has Started - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Trip Started</h1><div style="background:#f9f9f9;padding:20px;"><p>Dear {{customerName}},</p><p>Your trip has started. Have a safe journey!</p><p><strong>From:</strong> {{pickupAddress}}<br><strong>To:</strong> {{dropAddress}}</p></div></body></html>',
    NULL,
    'Sent when trip starts',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'TRIP_COMPLETED', 
    'Trip Completed', 
    1, 1, 0, 
    'Trip completed. Total fare: Rs. {{totalFare}}. Thank you!', 
    'Trip Completed - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Trip Completed</h1><div style="background:#f9f9f9;padding:20px;"><p>Dear {{customerName}},</p><p>Thank you for using our service!</p><p><strong>Total Fare:</strong> Rs. {{totalFare}}<br><strong>Distance:</strong> {{totalDistance}} km</p></div></body></html>',
    NULL,
    'Sent when trip is completed',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, email_subject, email_template, push_title, description, is_active) 
VALUES 
(
    'BOOKING_CANCELLED', 
    'Booking Cancelled', 
    1, 1, 0, 
    'Your booking {{bookingId}} has been cancelled. Reason: {{cancellationReason}}', 
    'Booking Cancelled - {{bookingId}}',
    '<!DOCTYPE html><html><body><h1>Booking Cancelled</h1><div style="background:#f9f9f9;padding:20px;"><h2 style="color:red;">Booking Cancelled</h2><p>Dear {{customerName}},</p><p>Your booking has been cancelled.</p><p><strong>Reason:</strong> {{cancellationReason}}</p></div></body></html>',
    NULL,
    'Sent when booking is cancelled',
    1
)
ON DUPLICATE KEY UPDATE 
    send_email=1, 
    email_subject=VALUES(email_subject), 
    email_template=VALUES(email_template);

-- Add schema-specific types that were in user's original request but might not have email templates yet
INSERT INTO notification_types 
(type_code, type_name, send_sms, send_email, send_push, sms_template, description, is_active) 
VALUES 
(
    'NEW_BOOKING_DRIVER', 
    'New Booking for Driver', 
    1, 0, 1,
    'New booking {{bookingId}} assigned. Pickup: {{pickupAddress}}', 
    'Notification for drivers about new bookings',
    1
)
ON DUPLICATE KEY UPDATE send_sms=1;

SELECT * FROM notification_types;
