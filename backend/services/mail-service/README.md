# Mail Service

Email notification microservice for the Taxi Management System.

## Overview

The Mail Service handles all email notifications triggered by booking events. It provides a centralized email management system with template-based emails, logging, and retry mechanisms.

## Features

- **Template-Based Emails**: Reusable HTML email templates with variable substitution
- **Email Logging**: Track all sent emails with status and error information
- **Retry Mechanism**: Automatic retry for failed emails
- **Status Tracking**: Monitor email delivery status (PENDING, SENT, FAILED)
- **Integration**: Seamless integration with booking-service via Feign Client

## Technology Stack

- **Spring Boot 3.2.0**
- **Java 21**
- **Spring Mail** (JavaMailSender)
- **Spring Data JPA**
- **MySQL 8.0+**
- **Thymeleaf** (for email templating)
- **OpenFeign** (for inter-service communication)
- **Lombok**

## Project Structure

```
mail-service/
├── src/
│   ├── main/
│   │   ├── java/com/taxi/mail/
│   │   │   ├── entity/
│   │   │   │   ├── EmailLog.java
│   │   │   │   └── EmailTemplate.java
│   │   │   ├── repository/
│   │   │   │   ├── EmailLogRepository.java
│   │   │   │   └── EmailTemplateRepository.java
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   └── SendEmailRequest.java
│   │   │   │   └── response/
│   │   │   │       └── EmailResponse.java
│   │   │   ├── enums/
│   │   │   │   ├── EmailStatus.java
│   │   │   │   └── EmailTemplateCode.java
│   │   │   ├── service/
│   │   │   │   ├── EmailService.java
│   │   │   │   └── EmailTemplateService.java
│   │   │   ├── controller/
│   │   │   │   ├── EmailController.java
│   │   │   │   └── EmailTemplateController.java
│   │   │   ├── config/
│   │   │   │   ├── MailConfig.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── MailServiceApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── templates/
│   └── test/
├── database/
│   └── mail_service_schema.sql
└── pom.xml
```

## Database Schema

### Tables

1. **email_logs**: Tracks all sent emails
2. **email_templates**: Stores reusable email templates

### Email Templates

The service comes with 6 pre-configured email templates:

1. **BOOKING_CREATED**: Sent when a new booking is created
2. **BOOKING_DISPATCHED**: Sent when a driver is assigned
3. **DRIVER_ARRIVED**: Sent when driver arrives at pickup location
4. **TRIP_STARTED**: Sent when the trip starts
5. **TRIP_COMPLETED**: Sent when the trip is completed
6. **BOOKING_CANCELLED**: Sent when a booking is cancelled

## Configuration

### Database Setup

1. Run the SQL script to create tables and seed data:
```bash
mysql -u root -p taxi_system < database/mail_service_schema.sql
```

### Application Properties

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/taxi_system
spring.datasource.username=root
spring.datasource.password=your_password

# Mail Configuration (Gmail Example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: For Gmail, you need to generate an App Password:
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App Passwords → Generate new password
4. Use the generated password in `spring.mail.password`

## Running the Service

### Using Maven

```bash
cd mail-service
mvn spring-boot:run
```

The service will start on port **8086**.

### Using JAR

```bash
mvn clean package
java -jar target/mail-service-1.0.0.jar
```

## API Endpoints

### Email Operations

#### Send Email
```http
POST /api/emails/send
Content-Type: application/json

{
  "bookingId": "BK12345",
  "recipientEmail": "customer@example.com",
  "recipientName": "John Doe",
  "templateCode": "BOOKING_CREATED",
  "templateVariables": {
    "customerName": "John Doe",
    "bookingId": "BK12345",
    "pickupAddress": "123 Main St",
    "vehicleClass": "STANDARD"
  }
}
```

#### Get Email Logs for Booking
```http
GET /api/emails/logs/{bookingId}
```

#### Retry Failed Email
```http
POST /api/emails/retry/{emailLogId}
```

#### Get Failed Emails
```http
GET /api/emails/failed?maxRetries=3
```

### Template Management

#### Get All Templates
```http
GET /api/email-templates
```

#### Get Template by Code
```http
GET /api/email-templates/code/BOOKING_CREATED
```

#### Create Template
```http
POST /api/email-templates
Content-Type: application/json

{
  "templateCode": "NEW_TEMPLATE",
  "templateName": "New Template",
  "subject": "Subject with {{variable}}",
  "bodyTemplate": "<html>...</html>",
  "description": "Template description",
  "isActive": true
}
```

#### Update Template
```http
PUT /api/email-templates/{id}
```

#### Toggle Template Status
```http
PATCH /api/email-templates/{id}/toggle
```

## Integration with Booking Service

The booking-service automatically triggers emails on these events:

1. **Booking Created** → `BOOKING_CREATED` template
2. **Booking Dispatched** → `BOOKING_DISPATCHED` template
3. **Driver Arrived** → `DRIVER_ARRIVED` template
4. **Trip Started** → `TRIP_STARTED` template
5. **Trip Completed** → `TRIP_COMPLETED` template
6. **Booking Cancelled** → `BOOKING_CANCELLED` template

### Booking Service Configuration

Add to `booking-service/src/main/resources/application.properties`:
```properties
mail.service.url=http://localhost:8086
```

## Template Variables

Each email template supports dynamic variables using `{{variableName}}` syntax:

### Common Variables
- `{{bookingId}}`: Booking ID
- `{{customerName}}`: Customer name
- `{{pickupAddress}}`: Pickup location
- `{{dropAddress}}`: Drop location
- `{{vehicleClass}}`: Vehicle class name
- `{{pickupTime}}`: Scheduled pickup time

### Dispatch/Trip Variables
- `{{driverName}}`: Driver's full name
- `{{vehicleNumber}}`: Vehicle registration number
- `{{eta}}`: Estimated time of arrival

### Completion Variables
- `{{totalFare}}`: Total fare amount
- `{{totalDistance}}`: Total distance traveled

### Cancellation Variables
- `{{cancellationReason}}`: Reason for cancellation

## Error Handling

- Email sending failures are logged in `email_logs` table
- Failed emails can be retried up to a configurable number of times
- Service continues to function even if email sending fails
- All errors are logged for debugging

## Monitoring

### Health Check
```http
GET /actuator/health
```

### Application Info
```http
GET /actuator/info
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**: Verify username and password
2. **Check firewall**: Ensure port 587 is not blocked
3. **Gmail users**: Use App Password, not regular password
4. **Check logs**: Review application logs for error messages
5. **Test connection**: Use telnet to test SMTP connection
   ```bash
   telnet smtp.gmail.com 587
   ```

### Template Not Found

1. **Verify template code**: Check `email_templates` table
2. **Check active status**: Ensure `is_active = 1`
3. **Run seed data**: Re-run the SQL script if templates are missing

## Development

### Adding New Templates

1. Insert template into database:
```sql
INSERT INTO email_templates (template_code, template_name, subject, body_template, description)
VALUES ('NEW_EVENT', 'New Event', 'Subject', '<html>...</html>', 'Description');
```

2. Add enum value to `EmailTemplateCode.java`
3. Trigger email from booking-service:
```java
sendBookingEmail(booking, "NEW_EVENT");
```

## License

Internal use only - Taxi Management System
