package com.taxi.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "insurers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insurer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "insurer_name", nullable = false, unique = true, length = 200)
    private String insurerName;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}