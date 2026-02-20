package com.taxi.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_owners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "nic_or_business_reg", length = 50)
    private String nicOrBusinessReg;

    @Column(name = "company", length = 200)
    private String company;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "primary_contact", nullable = false, length = 20)
    private String primaryContact;

    @Column(name = "secondary_contact", length = 20)
    private String secondaryContact;

    @Column(name = "postal_address", columnDefinition = "TEXT")
    private String postalAddress;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (isActive == null) {
            isActive = true;
        }
    }
}