# Booking Service Design Documentation

## 1. Overview

The **Booking Service** is the core orchestrator of the Taxi Management System. It handles the complete lifecycle of a booking—from the initial customer inquiry to trip completion or cancellation.

---

## 2. Database Schema

Managed via a decoupled microservice approach using unique identifiers for cross-service references.

### Tables

| Table                     | Description                                                        |
| :------------------------ | :----------------------------------------------------------------- |
| **bookings**              | Stores core trip data: customer info, locations, status, and fare. |
| **booking_cancellations** | Audit log for cancelled trips, including reasons and metadata.     |

---

## 3. Key Architectural Concepts

### 3.1 Booking ID Generation

To ensure human-readability and efficient sorting, IDs follow this logic:

- **Format:** `BK` + `YYYYMMDD` + `4-digit sequence`
- **Example:** `BK202601300001`
- **Reset Logic:** Sequence resets every 10,000 bookings using a modulo operation.

### 3.2 Status State Machine

The system strictly enforces the following flow to maintain data integrity:

`INQUIRY` → `PENDING` → `DISPATCHED` → `ENROUTE` → `WAITING_FOR_CUSTOMER` → `PASSENGER_ONBOARD` → `COMPLETED`

> **Note:** A booking can transition to `CANCELLED` from any status except `COMPLETED`.

---

## 4. Core Service Operations

### 4.1 Dispatch Logic

- **Validation:** Target booking must be in `PENDING` status.
- **Action:** Assigns a `driverId` and `vehicleId` simultaneously.
- **Audit:** Captures `dispatchedBy` (Agent ID) and `dispatchedTime`.

### 4.2 Trip Execution

- **Start Trip:** Triggered when the passenger enters the vehicle. Sets `startTime`.
- **Complete Trip:** Calculates final metrics:
  - **Total Distance:** GPS-based calculation.
  - **Billed Wait Time:** `Total Wait` - `Free Wait Period`.
  - **Fare Calculation:** Base + Distance + (Billed Wait × Rate).

### 4.3 Cancellations

- Cancellations are stored in a separate table to keep the main `bookings` table performant.
- Requires a `cancelledType` (e.g., `CUSTOMER_CANCELLED`, `SYSTEM_CANCELLED`) for business analytics.

---

## 5. Integration Points

As a microservice, this component communicates with others via IDs:

- **Vehicle Service:** To validate `vehicleClassId` and assigned `vehicleId`.
- **Driver Service:** To check availability and update driver busy/online status.
- **Notification Service:** Triggers SMS/Push alerts on `Status Change`.
- **Corporate Service:** Validates billing eligibility for B2B clients.

---

## 6. Critical Timestamps for Analytics

| Timestamp        | Trigger Event   | Analytics Use Case               |
| :--------------- | :-------------- | :------------------------------- |
| `bookingTime`    | Record Created  | Demand forecasting               |
| `dispatchedTime` | Driver Assigned | Dispatcher performance (Latency) |
| `startTime`      | Trip Begun      | Passenger wait-time analysis     |
| `completedTime`  | Trip Finished   | Driver utilization & turnover    |

---

_Created on: 2026-01-30_
