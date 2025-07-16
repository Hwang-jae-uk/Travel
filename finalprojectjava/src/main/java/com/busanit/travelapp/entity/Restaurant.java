package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurant")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phone;

    private String cuisine; // 음식 종류 (한식, 중식, 일식, 양식 등)

    private String openTime;

    private String closeTime;

    @Column(name = "has_parking")
    private boolean hasParking;

    @Column(name = "has_reservation")
    private boolean hasReservation; // 예약 가능 여부

    @Column(name = "has_delivery")
    private boolean hasDelivery; // 배달 가능 여부

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RestaurantImage> images;


    @Builder.Default
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantReview> reviews = new ArrayList<>();
} 