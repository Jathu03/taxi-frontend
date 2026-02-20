-- Normalize Enum values to UPPERCASE for consistency
-- Run this in your MySQL database (taxi_system)

-- 1. Normalize Vehicle Models
UPDATE vehicle_models SET 
    frame = UPPER(frame), 
    transmission_type = UPPER(transmission_type),
    turbo = UPPER(turbo);

-- 2. Normalize Vehicles
UPDATE vehicles SET 
    fuel_type = UPPER(fuel_type);

-- 3. (Optional) Check for any invalid values that couldn't be mapped
-- If a value is NULL after these updates (and it wasn't before), 
-- it means the value was invalid for the Enum.
