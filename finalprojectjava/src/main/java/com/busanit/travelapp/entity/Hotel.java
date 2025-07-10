package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotel")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Hotel extends BaseEntity{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Long id;                        // 숙소번호
    
    private String name;                    // 숙소명
    private String address;                 // 주소
    private String email;                   // 메일
    private String phone;                   // 전화번호
    private boolean breakfast;              // 조식여부

    @Column(nullable = true)
    private Integer breakfastPrice;         // 조식가격

    @Lob
    private String description;             // 호텔설명

//    private Float ratingAvg;                // 평점
//    private Integer reviewcount;            // 리뷰수


    @Builder.Default
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelImage> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelReview> reviews = new ArrayList<>();
} 