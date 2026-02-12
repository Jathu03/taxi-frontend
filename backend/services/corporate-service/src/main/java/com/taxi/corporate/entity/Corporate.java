package com.taxi.corporate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.taxi.corporate.enums.BillingType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "corporates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Corporate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "primary_contact", length = 200)
    private String primaryContact;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_type", length = 20)
    private BillingType billingType = BillingType.MONTHLY;

    @Column(name = "credit_limit", precision = 12, scale = 2)
    private BigDecimal creditLimit = BigDecimal.ZERO;

    @Column(name = "current_balance", precision = 12, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Column(name = "cash_discount_rate", precision = 5, scale = 2)
    private BigDecimal cashDiscountRate = BigDecimal.ZERO;

    @Column(name = "credit_discount_rate", precision = 5, scale = 2)
    private BigDecimal creditDiscountRate = BigDecimal.ZERO;

    @Column(name = "enable_quick_booking", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean enableQuickBooking = false;

    @Column(name = "require_voucher", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean requireVoucher = false;

    @Column(name = "require_cost_center", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean requireCostCenter = false;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}