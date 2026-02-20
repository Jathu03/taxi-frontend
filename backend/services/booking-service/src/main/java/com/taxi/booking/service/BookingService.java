package com.taxi.booking.service;

import com.taxi.booking.client.*;
import com.taxi.booking.dto.request.*;
import com.taxi.booking.dto.response.*;
import com.taxi.booking.entity.Booking;
import com.taxi.booking.entity.BookingCancellation;
import com.taxi.booking.entity.BookingStatusHistory;
import com.taxi.booking.enums.BookingStatus;
import com.taxi.booking.repository.BookingCancellationRepository;
import com.taxi.booking.repository.BookingRepository;
import com.taxi.booking.repository.BookingStatusHistoryRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingCancellationRepository cancellationRepository;
    private final BookingStatusHistoryRepository statusHistoryRepository;

    private final VehicleServiceClient vehicleServiceClient;
    private final DriverServiceClient driverServiceClient;
    private final FareServiceClient fareServiceClient;
    private final CorporateServiceClient corporateServiceClient;
    private final PromoServiceClient promoServiceClient;
    private final UserServiceClient userServiceClient;
    private final MailServiceClient mailServiceClient;

    // --- CONSTANTS ---
    // The specific database ID for TUK vehicles
    private static final Integer TUK_CLASS_ID = 8;

    // Default identifier if no specific class is found
    private static final String DEFAULT_CLASS_IDENTIFIER = "GEN";

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        log.info("Creating new booking for customer: {}", request.getCustomerName());

        // 1. Determine the Vehicle Class Identifier
        String classIdentifier = DEFAULT_CLASS_IDENTIFIER;
        VehicleClassResponse vehicleClassDetails = null;

        if (request.getVehicleClassId() != null) {
            try {
                vehicleClassDetails = vehicleServiceClient
                        .getVehicleClassById(request.getVehicleClassId());

                if (vehicleClassDetails == null) {
                    throw new RuntimeException(
                            "Vehicle class not found with ID: " + request.getVehicleClassId());
                }

                // Pass both the object and the ID to the determination logic
                classIdentifier = determineClassIdentifier(vehicleClassDetails, request.getVehicleClassId());

                log.info("Vehicle Class ID: {} | Name: {} | Generated Identifier: {}",
                        request.getVehicleClassId(),
                        vehicleClassDetails.getClassName(),
                        classIdentifier);

            } catch (FeignException.NotFound e) {
                throw new RuntimeException(
                        "Vehicle class not found with ID: " + request.getVehicleClassId());
            } catch (FeignException e) {
                throw new RuntimeException(
                        "Vehicle class validation failed: " + e.getMessage());
            }
        }

        if (request.getCorporateId() != null) {
            try {
                CorporateResponse corp = corporateServiceClient
                        .getCorporateById(request.getCorporateId());
                if (corp == null) {
                    throw new RuntimeException(
                            "Corporate not found with ID: " + request.getCorporateId());
                }
            } catch (FeignException.NotFound e) {
                throw new RuntimeException(
                        "Corporate not found with ID: " + request.getCorporateId());
            } catch (FeignException e) {
                throw new RuntimeException(
                        "Corporate validation failed: " + e.getMessage());
            }
        }

        Booking booking = new Booking();

        // 2. Generate the ID using the determined identifier
        // Format: BK-{IDENTIFIER}-{TIMESTAMP}{RANDOM}
        booking.setBookingId(generateBookingId(classIdentifier));

        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setContactNumber(request.getContactNumber());
        booking.setPassengerName(request.getPassengerName());
        booking.setNumberOfPassengers(request.getNumberOfPassengers());
        booking.setCorporateId(request.getCorporateId());
        booking.setVoucherNumber(request.getVoucherNumber());
        booking.setCostCenter(request.getCostCenter());
        booking.setHireType(request.getHireType());
        booking.setVehicleClassId(request.getVehicleClassId());
        booking.setFareSchemeId(request.getFareSchemeId());
        booking.setPaymentType(request.getPaymentType());
        booking.setPickupAddress(request.getPickupAddress());
        booking.setPickupLatitude(request.getPickupLatitude());
        booking.setPickupLongitude(request.getPickupLongitude());
        booking.setDropAddress(request.getDropAddress());
        booking.setDropLatitude(request.getDropLatitude());
        booking.setDropLongitude(request.getDropLongitude());
        booking.setDestination(request.getDestination());
        booking.setEstimatedDistance(request.getEstimatedDistance());
        booking.setPickupTime(request.getPickupTime());
        booking.setScheduledTime(request.getScheduledTime());
        booking.setIsAdvanceBooking(request.getIsAdvanceBooking());
        booking.setIsTestBooking(request.getIsTestBooking());
        booking.setIsInquiryOnly(request.getIsInquiryOnly());
        booking.setLuggage(request.getLuggage());
        booking.setSpecialRemarks(request.getSpecialRemarks());
        booking.setClientRemarks(request.getClientRemarks());
        booking.setRemarks(request.getRemarks());
        booking.setPercentage(request.getPercentage());
        booking.setSendClientSms(request.getSendClientSms());
        booking.setBookedBy(request.getBookedBy());
        booking.setAppPlatform(request.getAppPlatform());
        booking.setPromoCodeId(request.getPromoCodeId());

        if (Boolean.TRUE.equals(request.getIsInquiryOnly())) {
            booking.setStatus(BookingStatus.INQUIRY);
        } else {
            booking.setStatus(BookingStatus.PENDING);
        }

        if (request.getBookingSource() != null) {
            booking.setBookingSource(
                    com.taxi.booking.enums.BookingSource.valueOf(request.getBookingSource()));
        }

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with id: {}", savedBooking.getBookingId());

        createStatusHistory(savedBooking, null,
                savedBooking.getStatus().name(), "SYSTEM", null);
        sendBookingEmail(savedBooking, "BOOKING_CREATED");

        return convertToResponse(savedBooking);
    }

    @Transactional
    public BookingResponse updateBooking(Integer id, UpdateBookingRequest request) {
        log.info("Updating booking with id: {}", id);

        Booking booking = findBookingById(id);

        if (booking.getStatus() != BookingStatus.INQUIRY
                && booking.getStatus() != BookingStatus.PENDING
                && booking.getStatus() != BookingStatus.DISPATCHED) {
            throw new RuntimeException(
                    "Cannot update booking in current status: " + booking.getStatus());
        }

        // If vehicle class changed, regenerate Booking ID
        if (request.getVehicleClassId() != null
                && !request.getVehicleClassId().equals(booking.getVehicleClassId())) {
            try {
                VehicleClassResponse newVehicleClass = vehicleServiceClient
                        .getVehicleClassById(request.getVehicleClassId());
                if (newVehicleClass == null) {
                    throw new RuntimeException(
                            "Vehicle class not found with ID: " + request.getVehicleClassId());
                }

                String newClassIdentifier = determineClassIdentifier(newVehicleClass, request.getVehicleClassId());
                String oldBookingId = booking.getBookingId();

                booking.setBookingId(generateBookingId(newClassIdentifier));

                log.info("Vehicle class changed. Booking ID updated from {} to {}",
                        oldBookingId, booking.getBookingId());
            } catch (FeignException.NotFound e) {
                throw new RuntimeException(
                        "Vehicle class not found with ID: " + request.getVehicleClassId());
            } catch (FeignException e) {
                throw new RuntimeException(
                        "Vehicle class validation failed: " + e.getMessage());
            }
        }

        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setContactNumber(request.getContactNumber());
        booking.setPassengerName(request.getPassengerName());
        booking.setNumberOfPassengers(request.getNumberOfPassengers());
        booking.setCorporateId(request.getCorporateId());
        booking.setVoucherNumber(request.getVoucherNumber());
        booking.setCostCenter(request.getCostCenter());
        booking.setHireType(request.getHireType());
        booking.setVehicleClassId(request.getVehicleClassId());
        booking.setFareSchemeId(request.getFareSchemeId());
        booking.setPaymentType(request.getPaymentType());
        booking.setPickupAddress(request.getPickupAddress());
        booking.setPickupLatitude(request.getPickupLatitude());
        booking.setPickupLongitude(request.getPickupLongitude());
        booking.setDropAddress(request.getDropAddress());
        booking.setDropLatitude(request.getDropLatitude());
        booking.setDropLongitude(request.getDropLongitude());
        booking.setDestination(request.getDestination());
        booking.setEstimatedDistance(request.getEstimatedDistance());
        booking.setPickupTime(request.getPickupTime());
        booking.setScheduledTime(request.getScheduledTime());
        booking.setIsAdvanceBooking(request.getIsAdvanceBooking());
        booking.setIsTestBooking(request.getIsTestBooking());
        booking.setIsInquiryOnly(request.getIsInquiryOnly());
        booking.setLuggage(request.getLuggage());
        booking.setSpecialRemarks(request.getSpecialRemarks());
        booking.setClientRemarks(request.getClientRemarks());
        booking.setRemarks(request.getRemarks());
        booking.setPercentage(request.getPercentage());
        booking.setSendClientSms(request.getSendClientSms());
        booking.setPromoCodeId(request.getPromoCodeId());

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking updated successfully with id: {}", id);

        return convertToResponse(updatedBooking);
    }

    @Transactional
    public BookingResponse dispatchBooking(Integer id, DispatchBookingRequest request) {
        log.info("Dispatching booking {} to driver {} and vehicle {}",
                id, request.getDriverId(), request.getVehicleId());

        Booking booking = findBookingById(id);

        try {
            DriverResponse driver = driverServiceClient
                    .getDriverById(request.getDriverId());
            if (driver == null) {
                throw new RuntimeException(
                        "Driver not found with ID: " + request.getDriverId());
            }
            if (Boolean.FALSE.equals(driver.getIsActive())
                    || Boolean.TRUE.equals(driver.getIsBlocked())) {
                throw new RuntimeException("Driver is not available for dispatch");
            }
        } catch (FeignException.NotFound e) {
            throw new RuntimeException(
                    "Driver not found with ID: " + request.getDriverId());
        } catch (FeignException e) {
            throw new RuntimeException(
                    "Driver validation failed: " + e.getMessage());
        }

        try {
            VehicleResponse vehicle = vehicleServiceClient
                    .getVehicleById(request.getVehicleId());
            if (vehicle == null) {
                throw new RuntimeException(
                        "Vehicle not found with ID: " + request.getVehicleId());
            }
        } catch (FeignException.NotFound e) {
            throw new RuntimeException(
                    "Vehicle not found with ID: " + request.getVehicleId());
        } catch (FeignException e) {
            throw new RuntimeException(
                    "Vehicle validation failed: " + e.getMessage());
        }

        String oldStatus = booking.getStatus().name();

        booking.setDriverId(request.getDriverId());
        booking.setVehicleId(request.getVehicleId());
        booking.setDispatchedTime(LocalDateTime.now());
        booking.setDispatchedBy(request.getDispatchedBy());
        booking.setStatus(BookingStatus.DISPATCHED);

        if (request.getPassengerName() != null) {
            booking.setPassengerName(request.getPassengerName());
        }
        if (request.getNumberOfPassengers() != null) {
            booking.setNumberOfPassengers(request.getNumberOfPassengers());
        }
        if (request.getLuggage() != null) {
            booking.setLuggage(request.getLuggage());
        }
        if (request.getRemarks() != null) {
            booking.setRemarks(request.getRemarks());
        }
        if (request.getSpecialRemarks() != null) {
            booking.setSpecialRemarks(request.getSpecialRemarks());
        }
        if (request.getPercentage() != null) {
            booking.setPercentage(request.getPercentage());
        }

        Booking dispatchedBooking = bookingRepository.save(booking);
        log.info("Booking dispatched successfully");

        createStatusHistory(dispatchedBooking, oldStatus,
                BookingStatus.DISPATCHED.name(), "USER",
                request.getDispatchedBy());
        sendBookingEmail(dispatchedBooking, "BOOKING_DISPATCHED");

        return convertToResponse(dispatchedBooking);
    }

    @Transactional
    public BookingResponse completeBooking(Integer id, CompleteBookingRequest request) {
        log.info("Completing booking with id: {}", id);

        Booking booking = findBookingById(id);

        if (booking.getStatus() != BookingStatus.PASSENGER_ONBOARD
                && booking.getStatus() != BookingStatus.ENROUTE) {
            throw new RuntimeException(
                    "Cannot complete booking in current status: " + booking.getStatus());
        }

        String oldStatus = booking.getStatus().name();

        booking.setCompletedTime(request.getCompletedTime());
        booking.setTotalDistance(request.getTotalDistance());
        booking.setTotalWaitTime(request.getTotalWaitTime());
        booking.setBilledWaitTime(request.getBilledWaitTime());
        booking.setTotalWaitingFee(request.getTotalWaitingFee());
        booking.setTotalFare(request.getTotalFare());
        booking.setBaseFare(request.getBaseFare());
        booking.setDistanceFare(request.getDistanceFare());
        booking.setTimeFare(request.getTimeFare());
        booking.setSurgeFee(request.getSurgeFee());
        booking.setStartOdometer(request.getStartOdometer());
        booking.setEndOdometer(request.getEndOdometer());
        booking.setSendClientSms(request.getSendClientSms());
        booking.setStatus(BookingStatus.COMPLETED);

        Booking completedBooking = bookingRepository.save(booking);
        log.info("Booking completed successfully");

        createStatusHistory(completedBooking, oldStatus,
                BookingStatus.COMPLETED.name(), "SYSTEM", null);
        sendBookingEmail(completedBooking, "TRIP_COMPLETED");

        return convertToResponse(completedBooking);
    }

    @Transactional
    public void cancelBooking(Integer id, CancelBookingRequest request) {
        log.info("Cancelling booking with id: {}", id);

        Booking booking = findBookingById(id);

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        String oldStatus = booking.getStatus().name();
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        BookingCancellation cancellation = new BookingCancellation();
        cancellation.setBooking(booking);
        cancellation.setCancelledTime(LocalDateTime.now());
        cancellation.setCancelledType(request.getCancelledType());
        cancellation.setCancelledByType(request.getCancelledByType());
        cancellation.setCancelledByUserId(request.getCancelledByUserId());
        cancellation.setCancelledByDriverId(request.getCancelledByDriverId());
        cancellation.setCancellationReason(request.getCancellationReason());
        cancellation.setCancellationFee(
                request.getCancellationFee() != null
                        ? request.getCancellationFee()
                        : BigDecimal.ZERO);

        cancellationRepository.save(cancellation);
        log.info("Booking cancelled successfully");

        createStatusHistory(booking, oldStatus,
                BookingStatus.CANCELLED.name(), request.getCancelledByType(),
                request.getCancelledByUserId() != null
                        ? request.getCancelledByUserId()
                        : request.getCancelledByDriverId());
        sendBookingEmail(booking, "BOOKING_CANCELLED");
    }

    @Transactional
    public BookingResponse updateBookingStatus(Integer id, BookingStatus newStatus,
            String changedByType, Integer changedById) {
        log.info("Updating booking {} status to {}", id, newStatus);

        Booking booking = findBookingById(id);
        String oldStatus = booking.getStatus().name();

        booking.setStatus(newStatus);

        switch (newStatus) {
            case ENROUTE:
                if (booking.getDriverAcceptedTime() == null) {
                    booking.setDriverAcceptedTime(LocalDateTime.now());
                }
                break;
            case WAITING_FOR_CUSTOMER:
                if (booking.getDriverArrivedTime() == null) {
                    booking.setDriverArrivedTime(LocalDateTime.now());
                }
                break;
            case PASSENGER_ONBOARD:
                if (booking.getStartTime() == null) {
                    booking.setStartTime(LocalDateTime.now());
                }
                break;
            default:
                break;
        }

        Booking updatedBooking = bookingRepository.save(booking);

        createStatusHistory(updatedBooking, oldStatus, newStatus.name(),
                changedByType, changedById);

        switch (newStatus) {
            case WAITING_FOR_CUSTOMER:
                sendBookingEmail(updatedBooking, "DRIVER_ARRIVED");
                break;
            case PASSENGER_ONBOARD:
                sendBookingEmail(updatedBooking, "TRIP_STARTED");
                break;
            default:
                break;
        }

        return convertToResponse(updatedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Integer id) {
        return convertToResponse(findBookingById(id));
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByBookingId(String bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with bookingId: " + bookingId));
        return convertToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status,
            Boolean excludeTestBookings) {
        List<Booking> bookings;
        if (Boolean.TRUE.equals(excludeTestBookings)) {
            bookings = bookingRepository.findByStatusAndIsTestBookingFalse(status);
        } else {
            bookings = bookingRepository.findByStatus(status);
        }
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getInquiries() {
        return bookingRepository.findByIsInquiryOnlyTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAdvanceBookings() {
        List<BookingStatus> statuses = List.of(
                BookingStatus.PENDING, BookingStatus.DISPATCHED);
        return bookingRepository
                .findByIsAdvanceBookingTrueAndStatusIn(statuses).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> searchBookings(String filterBy, String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllBookings();
        }
        List<Booking> bookings;
        switch (filterBy.toLowerCase()) {
            case "phone":
                bookings = bookingRepository.searchByPhone(searchTerm);
                break;
            case "customername":
                bookings = bookingRepository.searchByCustomerName(searchTerm);
                break;
            case "bookingid":
                bookings = bookingRepository.searchByBookingId(searchTerm);
                break;
            default:
                bookings = bookingRepository.searchByCustomerName(searchTerm);
        }
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> advancedSearch(BookingSearchRequest request) {
        LocalDateTime startDate = request.getStartDate() != null
                ? request.getStartDate().atStartOfDay()
                : LocalDate.now().minusMonths(1).atStartOfDay();

        LocalDateTime endDate = request.getEndDate() != null
                ? request.getEndDate().atTime(LocalTime.MAX)
                : LocalDateTime.now();

        List<Booking> bookings = bookingRepository.advancedSearch(
                request.getStatus(),
                request.getVehicleClassId(),
                request.getCorporateId(),
                request.getDriverId(),
                request.getBookedBy(),
                request.getHireType(),
                request.getPaymentType(),
                request.getBookingSource(),
                startDate,
                endDate);

        return bookings.stream()
                .filter(b -> !Boolean.TRUE.equals(request.getExcludeTestBookings())
                        || !Boolean.TRUE.equals(b.getIsTestBooking()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingSummaryResponse getBookingSummary(LocalDate startDate,
            LocalDate endDate, Boolean excludeTestBookings) {
        LocalDateTime start = startDate != null
                ? startDate.atStartOfDay()
                : LocalDate.now().atStartOfDay();
        LocalDateTime end = endDate != null
                ? endDate.atTime(LocalTime.MAX)
                : LocalDateTime.now();

        List<Booking> allBookings = bookingRepository
                .findByBookingTimeBetween(start, end);

        if (Boolean.TRUE.equals(excludeTestBookings)) {
            allBookings = allBookings.stream()
                    .filter(b -> !Boolean.TRUE.equals(b.getIsTestBooking()))
                    .collect(Collectors.toList());
        }

        long totalBookings = allBookings.size();
        long completedBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
        long cancelledBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long pendingBookings = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.PENDING).count();

        BigDecimal totalFare = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalFare() != null
                        ? b.getTotalFare()
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDiscount = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getDiscountAmount() != null
                        ? b.getDiscountAmount()
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalWaitingFees = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalWaitingFee() != null
                        ? b.getTotalWaitingFee()
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageFare = completedBookings > 0
                ? totalFare.divide(BigDecimal.valueOf(completedBookings),
                        2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return BookingSummaryResponse.builder()
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .pendingBookings(pendingBookings)
                .totalHireAmount(totalFare)
                .totalDiscountAmount(totalDiscount)
                .totalWaitingFees(totalWaitingFees)
                .averageFare(averageFare)
                .build();
    }

    @Transactional(readOnly = true)
    public List<BookingCancellationResponse> getCancelledBookings(
            LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null
                ? startDate.atStartOfDay()
                : LocalDate.now().minusMonths(1).atStartOfDay();
        LocalDateTime end = endDate != null
                ? endDate.atTime(LocalTime.MAX)
                : LocalDateTime.now();

        return cancellationRepository.findByDateRange(start, end).stream()
                .map(this::convertToCancellationResponse)
                .collect(Collectors.toList());
    }

    // ==================== PRIVATE HELPER METHODS ====================

    private Booking findBookingById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + id));
    }

    /**
     * Extracts a clean identifier from vehicle class details.
     * 1. Checks strict ID match for TUK (ID = 8).
     * 2. Checks string match for TUK (Safety net).
     * 3. Uses sanitized Class Name/Code for others.
     */
    private String determineClassIdentifier(VehicleClassResponse vehicleClass, Integer vehicleClassId) {
        if (vehicleClass == null) {
            return DEFAULT_CLASS_IDENTIFIER;
        }

        // --- 1. PRIORITY CHECK: ID 8 IS TUK ---
        if (TUK_CLASS_ID.equals(vehicleClassId)) {
            return "TUK";
        }

        String className = vehicleClass.getClassName() != null
                ? vehicleClass.getClassName().toUpperCase().trim()
                : "";
        String classCode = vehicleClass.getClassCode() != null
                ? vehicleClass.getClassCode().toUpperCase().trim()
                : "";

        // --- 2. SECONDARY CHECK: String Matching (Safety Net) ---
        // If ID changes in DB or strict check fails, catch "Tuk" by name
        String combined = className + "|" + classCode;
        if (combined.contains("TUK") || combined.contains("THREE") || combined.contains("RICKSHAW")) {
            return "TUK";
        }

        // --- 3. OTHER VEHICLES: Use Name or Code ---
        String identifier = "";

        // Try to use Code first (usually shorter)
        if (!classCode.isEmpty()) {
            identifier = classCode.replaceAll("[^A-Z0-9]", "");
        }
        // If Code is empty, use Name
        else if (!className.isEmpty()) {
            identifier = className.replaceAll("[^A-Z0-9]", "");
        }

        // --- 4. DEFAULT FALLBACK ---
        if (identifier.isEmpty()) {
            return DEFAULT_CLASS_IDENTIFIER;
        }

        // Limit to 10 chars to ensure readability and DB fit
        return identifier.length() > 10 ? identifier.substring(0, 10) : identifier;
    }

    /**
     * Generates booking ID in format: BK-{CLASS}-{TIMESTAMP}{RANDOM}
     * Example: BK-TUK-1715629999ABCD
     */
    private String generateBookingId(String classIdentifier) {
        return "BK-" + classIdentifier + "-"
                + System.currentTimeMillis()
                + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private void createStatusHistory(Booking booking, String oldStatus,
            String newStatus, String changedByType, Integer changedById) {
        BookingStatusHistory history = new BookingStatusHistory();
        history.setBooking(booking);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedByType(changedByType);
        history.setChangedById(changedById);
        statusHistoryRepository.save(history);
    }

    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = BookingResponse.builder()
                .id(booking.getId())
                .bookingId(booking.getBookingId())
                .voucherNumber(booking.getVoucherNumber())
                .costCenter(booking.getCostCenter())
                .customerName(booking.getCustomerName())
                .customerEmail(booking.getCustomerEmail())
                .contactNumber(booking.getContactNumber())
                .passengerName(booking.getPassengerName())
                .numberOfPassengers(booking.getNumberOfPassengers())
                .corporateId(booking.getCorporateId())
                .hireType(booking.getHireType())
                .vehicleClassId(booking.getVehicleClassId())
                .fareSchemeId(booking.getFareSchemeId())
                .paymentType(booking.getPaymentType())
                .pickupAddress(booking.getPickupAddress())
                .pickupLatitude(booking.getPickupLatitude())
                .pickupLongitude(booking.getPickupLongitude())
                .dropAddress(booking.getDropAddress())
                .dropLatitude(booking.getDropLatitude())
                .dropLongitude(booking.getDropLongitude())
                .destination(booking.getDestination())
                .estimatedDistance(booking.getEstimatedDistance())
                .bookingTime(booking.getBookingTime())
                .pickupTime(booking.getPickupTime())
                .scheduledTime(booking.getScheduledTime())
                .isAdvanceBooking(booking.getIsAdvanceBooking())
                .isTestBooking(booking.getIsTestBooking())
                .isInquiryOnly(booking.getIsInquiryOnly())
                .driverId(booking.getDriverId())
                .vehicleId(booking.getVehicleId())
                .dispatchedTime(booking.getDispatchedTime())
                .dispatchedBy(booking.getDispatchedBy())
                .driverAcceptedTime(booking.getDriverAcceptedTime())
                .driverArrivedTime(booking.getDriverArrivedTime())
                .startTime(booking.getStartTime())
                .completedTime(booking.getCompletedTime())
                .currentLocation(booking.getCurrentLocation())
                .currentLatitude(booking.getCurrentLatitude())
                .currentLongitude(booking.getCurrentLongitude())
                .eta(booking.getEta())
                .startOdometer(booking.getStartOdometer())
                .endOdometer(booking.getEndOdometer())
                .totalDistance(booking.getTotalDistance())
                .totalWaitTime(booking.getTotalWaitTime())
                .billedWaitTime(booking.getBilledWaitTime())
                .totalWaitingFee(booking.getTotalWaitingFee())
                .baseFare(booking.getBaseFare())
                .distanceFare(booking.getDistanceFare())
                .timeFare(booking.getTimeFare())
                .surgeFee(booking.getSurgeFee())
                .discountAmount(booking.getDiscountAmount())
                .promoCodeId(booking.getPromoCodeId())
                .totalFare(booking.getTotalFare())
                .luggage(booking.getLuggage())
                .specialRemarks(booking.getSpecialRemarks())
                .clientRemarks(booking.getClientRemarks())
                .remarks(booking.getRemarks())
                .percentage(booking.getPercentage())
                .sendClientSms(booking.getSendClientSms())
                .status(booking.getStatus())
                .bookedBy(booking.getBookedBy())
                .appPlatform(booking.getAppPlatform())
                .bookingSource(booking.getBookingSource() != null
                        ? booking.getBookingSource().name()
                        : null)
                .customerRating(booking.getCustomerRating())
                .customerFeedback(booking.getCustomerFeedback())
                .driverRating(booking.getDriverRating())
                .driverFeedback(booking.getDriverFeedback())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();

        enrichBookingResponse(response, booking);
        return response;
    }

    private void enrichBookingResponse(BookingResponse response, Booking booking) {
        if (booking.getVehicleClassId() != null) {
            try {
                VehicleClassResponse vehicleClass = vehicleServiceClient
                        .getVehicleClassById(booking.getVehicleClassId());
                if (vehicleClass != null) {
                    response.setVehicleClassName(vehicleClass.getClassName());
                    response.setVehicleClassCode(vehicleClass.getClassCode());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle class details: {}", e.getMessage());
            }
        }

        if (booking.getDriverId() != null) {
            try {
                DriverResponse driver = driverServiceClient
                        .getDriverById(booking.getDriverId());
                if (driver != null) {
                    response.setDriverCode(driver.getCode());
                    response.setDriverName(
                            driver.getFirstName() + " " + driver.getLastName());
                    response.setDriverPhone(driver.getContactNumber());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch driver details: {}", e.getMessage());
            }
        }

        if (booking.getVehicleId() != null) {
            try {
                VehicleResponse vehicle = vehicleServiceClient
                        .getVehicleById(booking.getVehicleId());
                if (vehicle != null) {
                    response.setVehicleCode(vehicle.getVehicleCode());
                    response.setVehicleRegistrationNumber(
                            vehicle.getRegistrationNumber());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle details: {}", e.getMessage());
            }
        }

        if (booking.getFareSchemeId() != null) {
            try {
                FareSchemeResponse fareScheme = fareServiceClient
                        .getFareSchemeById(booking.getFareSchemeId());
                if (fareScheme != null) {
                    response.setFareSchemeName(fareScheme.getFareName());
                    response.setFareSchemeCode(fareScheme.getFareCode());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch fare scheme details: {}", e.getMessage());
            }
        }

        if (booking.getCorporateId() != null) {
            try {
                CorporateResponse corporate = corporateServiceClient
                        .getCorporateById(booking.getCorporateId());
                if (corporate != null) {
                    response.setCorporateName(corporate.getName());
                    response.setCorporateCode(corporate.getCode());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch corporate details: {}", e.getMessage());
            }
        }

        if (booking.getPromoCodeId() != null) {
            try {
                PromoCodeResponse promoCode = promoServiceClient
                        .getPromoCodeById(booking.getPromoCodeId());
                if (promoCode != null) {
                    response.setPromoCode(promoCode.getCode());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch promo code details: {}", e.getMessage());
            }
        }

        if (booking.getBookedBy() != null) {
            try {
                UserResponse user = userServiceClient
                        .getUserById(booking.getBookedBy());
                if (user != null) {
                    response.setBookedByName(
                            user.getFirstName() + " " + user.getLastName());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch booked by user details: {}", e.getMessage());
            }
        }

        if (booking.getDispatchedBy() != null) {
            try {
                UserResponse user = userServiceClient
                        .getUserById(booking.getDispatchedBy());
                if (user != null) {
                    response.setDispatchedByName(
                            user.getFirstName() + " " + user.getLastName());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch dispatched by user details: {}", e.getMessage());
            }
        }
    }

    private BookingCancellationResponse convertToCancellationResponse(
            BookingCancellation cancellation) {
        BookingCancellationResponse response = BookingCancellationResponse.builder()
                .id(cancellation.getId())
                .bookingId(cancellation.getBooking().getId())
                .bookingNumber(cancellation.getBooking().getBookingId())
                .cancelledTime(cancellation.getCancelledTime())
                .cancelledType(cancellation.getCancelledType())
                .cancelledByType(cancellation.getCancelledByType())
                .cancelledByUserId(cancellation.getCancelledByUserId())
                .cancelledByDriverId(cancellation.getCancelledByDriverId())
                .cancellationReason(cancellation.getCancellationReason())
                .cancellationFee(cancellation.getCancellationFee())
                .createdAt(cancellation.getCreatedAt())
                .build();

        if (cancellation.getCancelledByUserId() != null) {
            try {
                UserResponse user = userServiceClient
                        .getUserById(cancellation.getCancelledByUserId());
                if (user != null) {
                    response.setCancelledByUserName(
                            user.getFirstName() + " " + user.getLastName());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch cancelled by user details: {}", e.getMessage());
            }
        }

        if (cancellation.getCancelledByDriverId() != null) {
            try {
                DriverResponse driver = driverServiceClient
                        .getDriverById(cancellation.getCancelledByDriverId());
                if (driver != null) {
                    response.setCancelledByDriverName(
                            driver.getFirstName() + " " + driver.getLastName());
                }
            } catch (Exception e) {
                log.warn("Failed to fetch cancelled by driver details: {}", e.getMessage());
            }
        }

        return response;
    }

    private void sendBookingEmail(Booking booking, String templateCode) {
        try {
            java.util.Map<String, String> variables = new java.util.HashMap<>();
            variables.put("bookingId", booking.getBookingId());
            variables.put("customerName", booking.getCustomerName());
            variables.put("pickupAddress",
                    booking.getPickupAddress() != null
                            ? booking.getPickupAddress()
                            : "");
            variables.put("dropAddress",
                    booking.getDropAddress() != null
                            ? booking.getDropAddress()
                            : "");
            variables.put("pickupTime",
                    booking.getPickupTime() != null
                            ? booking.getPickupTime().toString()
                            : "");

            if (booking.getVehicleClassId() != null) {
                try {
                    VehicleClassResponse vehicleClass = vehicleServiceClient
                            .getVehicleClassById(booking.getVehicleClassId());
                    variables.put("vehicleClass",
                            vehicleClass != null
                                    ? vehicleClass.getClassName()
                                    : "");
                } catch (Exception e) {
                    variables.put("vehicleClass", "");
                }
            }

            if (booking.getDriverId() != null) {
                try {
                    DriverResponse driver = driverServiceClient
                            .getDriverById(booking.getDriverId());
                    variables.put("driverName",
                            driver != null
                                    ? driver.getFirstName() + " "
                                            + driver.getLastName()
                                    : "");
                } catch (Exception e) {
                    variables.put("driverName", "");
                }
            }

            if (booking.getVehicleId() != null) {
                try {
                    VehicleResponse vehicle = vehicleServiceClient
                            .getVehicleById(booking.getVehicleId());
                    variables.put("vehicleNumber",
                            vehicle != null
                                    ? vehicle.getRegistrationNumber()
                                    : "");
                } catch (Exception e) {
                    variables.put("vehicleNumber", "");
                }
            }

            variables.put("eta",
                    booking.getEta() != null ? booking.getEta() : "N/A");

            if (booking.getTotalFare() != null) {
                variables.put("totalFare",
                        booking.getTotalFare().toString());
            }
            if (booking.getTotalDistance() != null) {
                variables.put("totalDistance",
                        booking.getTotalDistance().toString());
            }

            if ("BOOKING_CANCELLED".equals(templateCode)) {
                BookingCancellation cancellation = cancellationRepository
                        .findByBookingId(booking.getId()).orElse(null);
                if (cancellation != null) {
                    variables.put("cancellationReason",
                            cancellation.getCancellationReason());
                }
            }

            // 1. Send to Customer
            String customerEmail = booking.getCustomerEmail();
            if (customerEmail != null && !customerEmail.isEmpty()) {
                SendEmailRequest customerRequest = new SendEmailRequest();
                customerRequest.setBookingId(booking.getBookingId());
                customerRequest.setRecipientEmail(customerEmail);
                customerRequest.setRecipientName(booking.getCustomerName());
                customerRequest.setTemplateCode(templateCode);
                customerRequest.setTemplateVariables(variables);
                mailServiceClient.sendEmail(customerRequest);
                log.info("Customer email sent for booking {} with template {}",
                        booking.getBookingId(), templateCode);
            }

            // 2. Send to Driver (if assigned)
            if (booking.getDriverId() != null) {
                try {
                    DriverResponse driver = driverServiceClient.getDriverById(booking.getDriverId());
                    if (driver != null && driver.getUserId() != null) {
                        UserResponse driverUser = userServiceClient.getUserById(driver.getUserId());
                        if (driverUser != null && driverUser.getEmail() != null && !driverUser.getEmail().isEmpty()) {
                            SendEmailRequest driverRequest = new SendEmailRequest();
                            driverRequest.setBookingId(booking.getBookingId());
                            driverRequest.setRecipientEmail(driverUser.getEmail());
                            driverRequest.setRecipientName(driverUser.getFirstName() + " " + driverUser.getLastName());
                            driverRequest.setTemplateCode(templateCode); // Reuse same template or prefix with DRIVER_
                                                                         // if exists
                            driverRequest.setTemplateVariables(variables);

                            mailServiceClient.sendEmail(driverRequest);
                            log.info("Driver email sent to {} for booking {} with template {}",
                                    driverUser.getEmail(), booking.getBookingId(), templateCode);
                        }
                    }
                } catch (Exception e) {
                    log.error("Failed to fetch driver contact details for notification: {}", e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("Failed to process notifications for booking {}: {}",
                    booking.getBookingId(), e.getMessage());
        }
    }
}