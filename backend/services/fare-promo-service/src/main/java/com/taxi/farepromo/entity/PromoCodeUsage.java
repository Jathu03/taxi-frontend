package com.taxi.farepromo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_code_usage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCodeUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promo_code_id", nullable = false)
    private PromoCode promoCode;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "discount_applied", precision = 10, scale = 2)
    private BigDecimal discountApplied;

    @CreationTimestamp
    @Column(name = "used_at")
    private LocalDateTime usedAt;
}