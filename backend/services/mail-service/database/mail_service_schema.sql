-- ============================================================================
-- MAIL SERVICE DATABASE TABLES
-- ============================================================================
-- Add these tables to the taxi_system database
-- ============================================================================

USE taxi_system;

-- ============================================================================
-- EMAIL LOGS TABLE
-- ============================================================================

CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(20),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(200),
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100),
    email_content TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    sent_at DATETIME,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
);

CREATE INDEX idx_email_logs_booking ON email_logs(booking_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_created ON email_logs(created_at);


-- ============================================================================
-- EMAIL TEMPLATES TABLE
-- ============================================================================

CREATE TABLE email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_code VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_templates_code ON email_templates(template_code);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);


-- ============================================================================
-- SEED DATA FOR EMAIL TEMPLATES
-- ============================================================================

INSERT INTO email_templates (template_code, template_name, subject, body_template, description) VALUES

-- 1. Booking Created
('BOOKING_CREATED', 'Booking Confirmation', 
 'Booking Confirmed - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Your taxi booking has been confirmed. Here are the details:</p>
            
            <div class="info-row">
                <span class="label">Booking ID:</span> {{bookingId}}
            </div>
            <div class="info-row">
                <span class="label">Pickup Address:</span> {{pickupAddress}}
            </div>
            <div class="info-row">
                <span class="label">Pickup Time:</span> {{pickupTime}}
            </div>
            <div class="info-row">
                <span class="label">Vehicle Class:</span> {{vehicleClass}}
            </div>
            
            <p>We will notify you once a driver is assigned to your booking.</p>
            <p>Thank you for choosing our service!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when a new booking is created'),

-- 2. Booking Dispatched
('BOOKING_DISPATCHED', 'Driver Assigned', 
 'Driver Assigned - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; }
        .highlight { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Driver On The Way!</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Great news! A driver has been assigned to your booking.</p>
            
            <div class="highlight">
                <div class="info-row">
                    <span class="label">Driver Name:</span> {{driverName}}
                </div>
                <div class="info-row">
                    <span class="label">Vehicle Number:</span> {{vehicleNumber}}
                </div>
                <div class="info-row">
                    <span class="label">Vehicle Type:</span> {{vehicleClass}}
                </div>
                <div class="info-row">
                    <span class="label">ETA:</span> {{eta}}
                </div>
            </div>
            
            <div class="info-row">
                <span class="label">Booking ID:</span> {{bookingId}}
            </div>
            <div class="info-row">
                <span class="label">Pickup Address:</span> {{pickupAddress}}
            </div>
            
            <p>Your driver is on the way to pick you up. Please be ready!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when a driver is dispatched to the booking'),

-- 3. Driver Arrived
('DRIVER_ARRIVED', 'Driver Has Arrived', 
 'Your Driver Has Arrived - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .alert { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Driver Has Arrived!</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            
            <div class="alert">
                <h2 style="margin: 0; color: #FF9800;">Your driver is waiting for you!</h2>
            </div>
            
            <p><strong>Driver:</strong> {{driverName}}</p>
            <p><strong>Vehicle:</strong> {{vehicleNumber}} ({{vehicleClass}})</p>
            <p><strong>Location:</strong> {{pickupAddress}}</p>
            
            <p>Please proceed to your pickup location.</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when driver arrives at pickup location'),

-- 4. Trip Started
('TRIP_STARTED', 'Trip Started', 
 'Your Trip Has Started - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Trip Started</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Your trip has started. Have a safe journey!</p>
            
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
            <p><strong>Driver:</strong> {{driverName}}</p>
            <p><strong>Vehicle:</strong> {{vehicleNumber}}</p>
            <p><strong>From:</strong> {{pickupAddress}}</p>
            <p><strong>To:</strong> {{dropAddress}}</p>
            
            <p>We hope you have a pleasant journey!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when the trip starts'),

-- 5. Trip Completed
('TRIP_COMPLETED', 'Trip Completed', 
 'Trip Completed - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .fare-box { background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .total { font-size: 24px; font-weight: bold; color: #4CAF50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Trip Completed</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Thank you for using our service! Your trip has been completed.</p>
            
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
            <p><strong>Driver:</strong> {{driverName}}</p>
            <p><strong>Distance:</strong> {{totalDistance}} km</p>
            
            <div class="fare-box">
                <p style="margin: 5px 0;"><strong>Total Fare:</strong></p>
                <p class="total">Rs. {{totalFare}}</p>
            </div>
            
            <p>We hope you had a pleasant journey. Thank you for choosing our service!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when the trip is completed'),

-- 6. Booking Cancelled
('BOOKING_CANCELLED', 'Booking Cancelled', 
 'Booking Cancelled - {{bookingId}}',
 '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
            <p>Dear {{customerName}},</p>
            <p>Your booking has been cancelled.</p>
            
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
            <p><strong>Cancellation Reason:</strong> {{cancellationReason}}</p>
            
            <p>If you did not request this cancellation or have any questions, please contact our support team.</p>
            <p>We hope to serve you again soon!</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>',
 'Email sent when a booking is cancelled');


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created
SELECT 'email_logs table created' AS status;
SELECT 'email_templates table created' AS status;

-- Check seed data
SELECT COUNT(*) AS template_count FROM email_templates;
SELECT template_code, template_name FROM email_templates;
