# Admin UI Sections to Database Mapping

This guide maps the **13 main sections** of your Admin Panel sidebar to the database tables.

---

### **1. User Management**
*   **Main Table:** `users`
*   **Divergent Subsection:**
    *   **Roles:** Stored in `user_roles` (junction) and `roles` tables.

### **2. Driver Management**
*   **Main Table:** `drivers`
*   **Divergent Subsection:**
    *   **Activity Logs:** Stored in `driver_activity_logs`.
    *   **Vehicle Assignment:** Updates `current_vehicle_id` column (links to `vehicles`).

### **3. Customer Management**
*   **Main Table:** `customers`
*   **Note:** Simply stores customer profiles.

### **4. Vehicle Management**
*   **Main Table:** `vehicles`
*   **Subsections (Dropdowns):**
    *   **Model:** Links to `vehicle_models`.
    *   **Manufacturer:** Links to `vehicle_manufacturers`.
    *   **Class/Owner:** Links to `vehicle_classes` / `vehicle_owners`.

### **5. Booking Management**
*   **Main Table:** `bookings`
*   **Divergent Subsections:**
    *   **Payment Type:** stored in `payments` table.
    *   **Inquiries:** Stored in `inquiries` table (separate from bookings).
    *   **Passenger Info:** Stored directly in `bookings` (snapshot), linked to `customers`.

### **6. Corporates**
*   **Main Table:** `corporates`
*   **Divergent Subsection:**
    *   **Vehicle Classes Config:** Stored in `corporate_vehicle_classes`.

### **7. Fare Management**
*   **Main Table:** `fare_schemes`
*   **Note:** Defines the pricing rules used by vehicles/bookings.

### **8. Promo Codes**
*   **Main Table:** `promo_codes`
*   **Divergent Subsection:**
    *   **Applicable Classes:** Stored in `promo_code_vehicle_classes`.

### **9. Device Management**
*   **Main Table:** `devices`
*   **Note:** Links physical devices to `vehicles` or `drivers`.

### **10. Vehicle Classes**
*   **Main Table:** `vehicle_classes`
*   **Note:** Defines the categories (Luxury, Budget) and links to default `fare_schemes`.

### **11. Vehicle Models**
*   **Main Table:** `vehicle_models`
*   **Note:** Technical specs (frame, fuel, transmission) stored here.

### **12. Vehicle Manufacturers**
*   **Main Table:** `vehicle_manufacturers`
*   **Note:** Simple list of brands (Toyota, Honda).

### **13. SMS Portal**
*   **Main Table:** `sms_logs`
*   **Note:** Tracks all messages sent from any tab (Bulk/Group/Single).
