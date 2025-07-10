package com.busanit.travelapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "cafe_review_image")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CafeReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_review_id")
    private CafeReview cafeReview;

    @Column(nullable = false)
    private String imageUrl;
} 