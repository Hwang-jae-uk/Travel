package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotel_review")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HotelReview extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_name", referencedColumnName = "user_name", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer rating; // 1-5 별점
    
    @Lob
    @Column(nullable = false)
    private String content; // 리뷰 내용
    
    @Builder.Default
    @OneToMany(mappedBy = "hotelReview", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<HotelReviewImage> images = new ArrayList<>();
} 