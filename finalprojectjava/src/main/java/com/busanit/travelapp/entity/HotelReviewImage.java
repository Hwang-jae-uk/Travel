package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hotel_review_image")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HotelReviewImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_image_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private HotelReview hotelReview;
    
    @Column(name = "image_url", nullable = false)
    private String imageUrl;
} 