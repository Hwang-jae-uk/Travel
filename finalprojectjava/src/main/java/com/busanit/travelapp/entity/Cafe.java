package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cafe")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cafe extends BaseEntity{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cafe_id")
    private Long id;                        // 카페번호
    
    private String name;                    // 카페명
    private String address;                 // 주소
    private String email;                   // 메일
    private String phone;                   // 전화번호
    private String openTime;                // 영업시간 시작
    private String closeTime;               // 영업시간 종료
    private boolean wifi;                   // 와이파이 여부
    private boolean parking;                // 주차 가능 여부

    @Lob
    private String description;             // 카페 소개

    @Builder.Default
    @OneToMany(mappedBy = "cafe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CafeImage> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "cafe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CafeReview> reviews = new ArrayList<>();
} 