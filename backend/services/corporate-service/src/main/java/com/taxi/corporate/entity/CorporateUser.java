package com.taxi.corporate.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "corporate_users", uniqueConstraints = @UniqueConstraint(columnNames = { "corporate_id", "user_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CorporateUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "corporate_id", nullable = false)
    private Corporate corporate;

    // Store user ID only - fetch details from User-Service via Feign
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(name = "can_book", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean canBook = true;

    @Column(name = "can_view_reports", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean canViewReports = false;

    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}