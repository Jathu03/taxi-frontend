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

/**
 * Service class for Booking operations
 * Handles all business logic for booking management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingCancellationRepository cancellationRepository;
    private final BookingStatusHistoryRepository statusHistoryRepository;

    // Feign Clients
    private final VehicleServiceClient vehicleServiceClient;
    private final DriverServiceClient driverServiceClient;
    private final FareServiceClient fareServiceClient;
    private final CorporateServiceClient corporateServiceClient;
    private final PromoServiceClient promoServiceClient;
    private final UserServiceClient userServiceClient;
    private final MailServiceClient mailServiceClient;

    /**
     * Create a new booking
     */
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        log.info("Creating new booking for customer: {}", request.getCustomerName());

        // Validate vehicle class exists
        if (request.getVehicleClassId() != null) {
            try {
                vehicleServiceClient.getVehicleClassById(request.getVehicleClassId());
            } catch (Exception e) {
                throw new RuntimeException("Vehicle class not found with id: " + request.getVehicleClassId());
            }
        }

        // Validate corporate if provided
        if (request.getCorporateId() != null) {
            try {
                corporateServiceClient.getCorporateById(request.getCorporateId());
            } catch (Exception e) {
                throw new RuntimeException("Corporate not found with id: " + request.getCorporateId());
            }
        }

        Booking booking = new Booking();
        booking.setBookingId(generateBookingId());
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

        // Set status based on inquiry flag
        if (Boolean.TRUE.equals(request.getIsInquiryOnly())) {
            booking.setStatus(BookingStatus.INQUIRY);
        } else {
            booking.setStatus(BookingStatus.PENDING);
        }

        // Set booking source
        if (request.getBookingSource() != null) {
            booking.setBookingSource(com.taxi.booking.enums.BookingSource.valueOf(request.getBookingSource()));
        }

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with id: {}", savedBooking.getBookingId());

        // Create status history
        createStatusHistory(savedBooking, null, savedBooking.getStatus().name(), "SYSTEM", null);

        // Send booking created email
        sendBookingEmail(savedBooking, "BOOKING_CREATED");

        return convertToResponse(savedBooking);
    }

    /**
     * Update booking
     */
    @Transactional
    public BookingResponse updateBooking(Integer id, UpdateBookingRequest request) {
        log.info("Updating booking with id: {}", id);

        Booking booking = findBookingById(id);

        // Only allow update if status is INQUIRY or PENDING
        if (booking.getStatus() != BookingStatus.INQUIRY && booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Cannot update booking in current status: " + booking.getStatus());
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

    /**
     * Dispatch booking to driver/vehicle
     */
    @Transactional
    public BookingResponse dispatchBooking(Integer id, DispatchBookingRequest request) {
        log.info("Dispatching booking {} to driver {} and vehicle {}", id, request.getDriverId(),
                request.getVehicleId());

        Booking booking = findBookingById(id);

        // Verify driver exists and is active
        try {
            DriverResponse driver = driverServiceClient.getDriverById(request.getDriverId());
            if (!driver.getIsActive() || driver.getIsBlocked()) {
                throw new RuntimeException("Driver is not available for dispatch");
            }
        } catch (Exception e) {
            throw new RuntimeException("Driver not found or unavailable: " + request.getDriverId());
        }

        // Verify vehicle exists
        try {
            vehicleServiceClient.getVehicleById(request.getVehicleId());
        } catch (Exception e) {
            throw new RuntimeException("Vehicle not found: " + request.getVehicleId());
        }

        String oldStatus = booking.getStatus().name();

        booking.setDriverId(request.getDriverId());
        booking.setVehicleId(request.getVehicleId());
        booking.setDispatchedTime(LocalDateTime.now());
        booking.setDispatchedBy(request.getDispatchedBy());
        booking.setStatus(BookingStatus.DISPATCHED);

        // Update optional fields
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

        // Create status history
        createStatusHistory(dispatchedBooking, oldStatus, BookingStatus.DISPATCHED.name(), "USER",
                request.getDispatchedBy());

        // Send booking dispatched email
        sendBookingEmail(dispatchedBooking, "BOOKING_DISPATCHED");

        return convertToResponse(dispatchedBooking);
    }

    /**
     * Complete booking
     */
    @Transactional
    public BookingResponse completeBooking(Integer id, CompleteBookingRequest request) {
        log.info("Completing booking with id: {}", id);

        Booking booking = findBookingById(id);

        if (booking.getStatus() != BookingStatus.PASSENGER_ONBOARD &&
                booking.getStatus() != BookingStatus.ENROUTE) {
            throw new RuntimeException("Cannot complete booking in current status: " + booking.getStatus());
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

        // Create status history
        createStatusHistory(completedBooking, oldStatus, BookingStatus.COMPLETED.name(), "SYSTEM", null);

        // Send trip completed email
        sendBookingEmail(completedBooking, "TRIP_COMPLETED");

        return convertToResponse(completedBooking);
    }

    /**
     * Cancel booking
     */
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

        // Create cancellation record
        BookingCancellation cancellation = new BookingCancellation();
        cancellation.setBooking(booking);
        cancellation.setCancelledTime(LocalDateTime.now());
        cancellation.setCancelledType(request.getCancelledType());
        cancellation.setCancelledByType(request.getCancelledByType());
        cancellation.setCancelledByUserId(request.getCancelledByUserId());
        cancellation.setCancelledByDriverId(request.getCancelledByDriverId());
        cancellation.setCancellationReason(request.getCancellationReason());
        cancellation.setCancellationFee(
                request.getCancellationFee() != null ? request.getCancellationFee() : BigDecimal.ZERO);

        cancellationRepository.save(cancellation);
        log.info("Booking cancelled successfully");

        // Create status history
        createStatusHistory(booking, oldStatus, BookingStatus.CANCELLED.name(), request.getCancelledByType(),
                request.getCancelledByUserId() != null ? request.getCancelledByUserId()
                        : request.getCancelledByDriverId());

        // Send booking cancelled email
        sendBookingEmail(booking, "BOOKING_CANCELLED");
    }

    /**
     * Update booking status
     */
    @Transactional
    public BookingResponse updateBookingStatus(Integer id, BookingStatus newStatus, String changedByType,
            Integer changedById) {
        log.info("Updating booking {} status to {}", id, newStatus);

        Booking booking = findBookingById(id);
        String oldStatus = booking.getStatus().name();

        booking.setStatus(newStatus);

        // Update timestamps based on status
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
        }

        Booking updatedBooking = bookingRepository.save(booking);

        // Create status history
        createStatusHistory(updatedBooking, oldStatus, newStatus.name(), changedByType, changedById);

        // Send status-specific emails
        switch (newStatus) {
            case WAITING_FOR_CUSTOMER:
                sendBookingEmail(updatedBooking, "DRIVER_ARRIVED");
                break;
            case PASSENGER_ONBOARD:
                sendBookingEmail(updatedBooking, "TRIP_STARTED");
                break;
        }

        return convertToResponse(updatedBooking);
    }

    /**
     * Get all bookings
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        log.debug("Fetching all bookings");
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get booking by ID
     */
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Integer id) {
        log.debug("Fetching booking with id: {}", id);
        Booking booking = findBookingById(id);
        return convertToResponse(booking);
    }

    /**
     * Get booking by booking ID
     */
    @Transactional(readOnly = true)
    public BookingResponse getBookingByBookingId(String bookingId) {
        log.debug("Fetching booking with bookingId: {}", bookingId);
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with bookingId: " + bookingId));
        return convertToResponse(booking);
    }

    /**
     * Get bookings by status
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(BookingStatus status, Boolean excludeTestBookings) {
        log.debug("Fetching bookings with status: {}", status);
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

    /**
     * Get inquiry bookings
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> getInquiries() {
        log.debug("Fetching inquiry bookings");
        List<Booking> bookings = bookingRepository.findByIsInquiryOnlyTrue();
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get advance bookings
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> getAdvanceBookings() {
        log.debug("Fetching advance bookings");
        List<BookingStatus> statuses = List.of(BookingStatus.PENDING, BookingStatus.DISPATCHED);
        List<Booking> bookings = bookingRepository.findByIsAdvanceBookingTrueAndStatusIn(statuses);
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search bookings
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> searchBookings(String filterBy, String searchTerm) {
        log.debug("Searching bookings with filterBy: {} and searchTerm: {}", filterBy, searchTerm);

        List<Booking> bookings;

        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllBookings();
        }

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
                // Search across all fields
                bookings = bookingRepository.searchByCustomerName(searchTerm);
        }

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Advanced search with multiple filters
     */
    @Transactional(readOnly = true)
    public List<BookingResponse> advancedSearch(BookingSearchRequest request) {
        log.debug("Performing advanced search");

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

    /**
     * Get booking summary
     */
    @Transactional(readOnly = true)
    public BookingSummaryResponse getBookingSummary(LocalDate startDate, LocalDate endDate,
            Boolean excludeTestBookings) {
        log.debug("Calculating booking summary");

        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<Booking> allBookings = bookingRepository.findByBookingTimeBetween(start, end);

        if (Boolean.TRUE.equals(excludeTestBookings)) {
            allBookings = allBookings.stream()
                    .filter(b -> !Boolean.TRUE.equals(b.getIsTestBooking()))
                    .collect(Collectors.toList());
        }

        long totalBookings = allBookings.size();
        long completedBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
        long cancelledBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long pendingBookings = allBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();

        BigDecimal totalFare = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalFare() != null ? b.getTotalFare() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDiscount = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getDiscountAmount() != null ? b.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalWaitingFees = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(b -> b.getTotalWaitingFee() != null ? b.getTotalWaitingFee() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageFare = completedBookings > 0
                ? totalFare.divide(BigDecimal.valueOf(completedBookings), 2, BigDecimal.ROUND_HALF_UP)
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

    /**
     * Get cancelled bookings with cancellation details
     */
    @Transactional(readOnly = true)
    public List<BookingCancellationResponse> getCancelledBookings(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay()
                : LocalDate.now().minusMonths(1).atStartOfDay();
        LocalDateTime end = endDate != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<BookingCancellation> cancellations = cancellationRepository.findByDateRange(start, end);
        return cancellations.stream()
                .map(this::convertToCancellationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Internal method to find booking by ID
     */
    private Booking findBookingById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Generate unique booking ID
     */
    private String generateBookingId() {
        return "BK" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    /**
     * Create status history entry
     */
    private void createStatusHistory(Booking booking, String oldStatus, String newStatus, String changedByType,
            Integer changedById) {
        BookingStatusHistory history = new BookingStatusHistory();
        history.setBooking(booking);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedByType(changedByType);
        history.setChangedById(changedById);
        statusHistoryRepository.save(history);
    }

    /**
     * Convert Booking entity to BookingResponse DTO
     */
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
                .bookingSource(booking.getBookingSource() != null ? booking.getBookingSource().name() : null)
                .customerRating(booking.getCustomerRating())
                .customerFeedback(booking.getCustomerFeedback())
                .driverRating(booking.getDriverRating())
                .driverFeedback(booking.getDriverFeedback())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();

        // Fetch related data from other services
        enrichBookingResponse(response, booking);

        return response;
    }

    /**
     * Enrich booking response with data from other services
     */
    private void enrichBookingResponse(BookingResponse response, Booking booking) {
        // Fetch vehicle class details
        if (booking.getVehicleClassId() != null) {
            try {
                VehicleClassResponse vehicleClass = vehicleServiceClient
                        .getVehicleClassById(booking.getVehicleClassId());
                response.setVehicleClassName(vehicleClass.getClassName());
                response.setVehicleClassCode(vehicleClass.getClassCode());
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle class details: {}", e.getMessage());
            }
        }

        // Fetch driver details
        if (booking.getDriverId() != null) {
            try {
                DriverResponse driver = driverServiceClient.getDriverById(booking.getDriverId());
                response.setDriverCode(driver.getCode());
                response.setDriverName(driver.getFirstName() + " " + driver.getLastName());
                response.setDriverPhone(driver.getContactNumber());
            } catch (Exception e) {
                log.warn("Failed to fetch driver details: {}", e.getMessage());
            }
        }

        // Fetch vehicle details
        if (booking.getVehicleId() != null) {
            try {
                VehicleResponse vehicle = vehicleServiceClient.getVehicleById(booking.getVehicleId());
                response.setVehicleCode(vehicle.getVehicleCode());
                response.setVehicleRegistrationNumber(vehicle.getRegistrationNumber());
            } catch (Exception e) {
                log.warn("Failed to fetch vehicle details: {}", e.getMessage());
            }
        }

        // Fetch fare scheme details
        if (booking.getFareSchemeId() != null) {
            try {
                FareSchemeResponse fareScheme = fareServiceClient.getFareSchemeById(booking.getFareSchemeId());
                response.setFareSchemeName(fareScheme.getFareName());
                response.setFareSchemeCode(fareScheme.getFareCode());
            } catch (Exception e) {
                log.warn("Failed to fetch fare scheme details: {}", e.getMessage());
            }
        }

        // Fetch corporate details
        if (booking.getCorporateId() != null) {
            try {
                CorporateResponse corporate = corporateServiceClient.getCorporateById(booking.getCorporateId());
                response.setCorporateName(corporate.getName());
                response.setCorporateCode(corporate.getCode());
            } catch (Exception e) {
                log.warn("Failed to fetch corporate details: {}", e.getMessage());
            }
        }

        // Fetch promo code details
        if (booking.getPromoCodeId() != null) {
            try {
                PromoCodeResponse promoCode = promoServiceClient.getPromoCodeById(booking.getPromoCodeId());
                response.setPromoCode(promoCode.getCode());
            } catch (Exception e) {
                log.warn("Failed to fetch promo code details: {}", e.getMessage());
            }
        }

        // Fetch booked by user details
        if (booking.getBookedBy() != null) {
            try {
                UserResponse user = userServiceClient.getUserById(booking.getBookedBy());
                response.setBookedByName(user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                log.warn("Failed to fetch booked by user details: {}", e.getMessage());
            }
        }

        // Fetch dispatched by user details
        if (booking.getDispatchedBy() != null) {
            try {
                UserResponse user = userServiceClient.getUserById(booking.getDispatchedBy());
                response.setDispatchedByName(user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                log.warn("Failed to fetch dispatched by user details: {}", e.getMessage());
            }
        }
    }

    /**
     * Convert BookingCancellation to Response DTO
     */
    private BookingCancellationResponse convertToCancellationResponse(BookingCancellation cancellation) {
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

        // Fetch user/driver names
        if (cancellation.getCancelledByUserId() != null) {
            try {
                UserResponse user = userServiceClient.getUserById(cancellation.getCancelledByUserId());
                response.setCancelledByUserName(user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                log.warn("Failed to fetch cancelled by user details: {}", e.getMessage());
            }
        }

        if (cancellation.getCancelledByDriverId() != null) {
            try {
                DriverResponse driver = driverServiceClient.getDriverById(cancellation.getCancelledByDriverId());
                response.setCancelledByDriverName(driver.getFirstName() + " " + driver.getLastName());
            } catch (Exception e) {
                log.warn("Failed to fetch cancelled by driver details: {}", e.getMessage());
            }
        }

        return response;
    }

    /**
     * Send email notification for booking events
     */
    private void sendBookingEmail(Booking booking, String templateCode) {
        try {
            // Prepare template variables
            java.util.Map<String, String> variables = new java.util.HashMap<>();
            variables.put("bookingId", booking.getBookingId());
            variables.put("customerName", booking.getCustomerName());
            variables.put("pickupAddress", booking.getPickupAddress() != null ? booking.getPickupAddress() : "");
            variables.put("dropAddress", booking.getDropAddress() != null ? booking.getDropAddress() : "");
            variables.put("pickupTime", booking.getPickupTime() != null ? booking.getPickupTime().toString() : "");

            // Add vehicle class info
            if (booking.getVehicleClassId() != null) {
                try {
                    VehicleClassResponse vehicleClass = vehicleServiceClient
                            .getVehicleClassById(booking.getVehicleClassId());
                    variables.put("vehicleClass", vehicleClass.getClassName());
                } catch (Exception e) {
                    variables.put("vehicleClass", "");
                }
            }

            // Add driver info for dispatched/ongoing bookings
            if (booking.getDriverId() != null) {
                try {
                    DriverResponse driver = driverServiceClient.getDriverById(booking.getDriverId());
                    variables.put("driverName", driver.getFirstName() + " " + driver.getLastName());
                } catch (Exception e) {
                    variables.put("driverName", "");
                }
            }

            // Add vehicle info
            if (booking.getVehicleId() != null) {
                try {
                    VehicleResponse vehicle = vehicleServiceClient.getVehicleById(booking.getVehicleId());
                    variables.put("vehicleNumber", vehicle.getRegistrationNumber());
                } catch (Exception e) {
                    variables.put("vehicleNumber", "");
                }
            }

            // Add ETA
            variables.put("eta", booking.getEta() != null ? booking.getEta() : "N/A");

            // Add fare info for completed bookings
            if (booking.getTotalFare() != null) {
                variables.put("totalFare", booking.getTotalFare().toString());
            }
            if (booking.getTotalDistance() != null) {
                variables.put("totalDistance", booking.getTotalDistance().toString());
            }

            // Add cancellation reason if applicable
            if ("BOOKING_CANCELLED".equals(templateCode)) {
                BookingCancellation cancellation = cancellationRepository.findByBookingId(booking.getId()).orElse(null);
                if (cancellation != null) {
                    variables.put("cancellationReason", cancellation.getCancellationReason());
                }
            }

            // Create email request
            SendEmailRequest emailRequest = new SendEmailRequest();
            emailRequest.setBookingId(booking.getBookingId());
            // Use customer email if available, otherwise fallback to placeholder or skip
            String recipientEmail = booking.getCustomerEmail();
            if (recipientEmail == null || recipientEmail.isEmpty()) {
                // Fallback to a default or log warning. For now, keeping previous behavior only
                // if strictly needed,
                // but better to rely on the new field.
                // recipientEmail = booking.getContactNumber() + "@example.com";
                log.warn("No customer email found for booking {}", booking.getBookingId());
                return;
            }
            emailRequest.setRecipientEmail(recipientEmail);
            emailRequest.setRecipientName(booking.getCustomerName());
            emailRequest.setTemplateCode(templateCode);
            emailRequest.setTemplateVariables(variables);

            // Send email asynchronously (non-blocking)
            mailServiceClient.sendEmail(emailRequest);
            log.info("Email notification sent for booking {} with template {}", booking.getBookingId(), templateCode);

        } catch (Exception e) {
            // Log error but don't fail the booking operation
            log.error("Failed to send email for booking {}: {}", booking.getBookingId(), e.getMessage());
        }
    }
}