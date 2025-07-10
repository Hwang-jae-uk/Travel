package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservation_basket")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationBasket extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "basket_id")
    private Long id;                        // 바구니 아이템 ID
    
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;          // 체크인 날짜
    
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;         // 체크아웃 날짜
    
    // 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user;                      // 바구니 소유자
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;                    // 선택한 호텔
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;                      // 선택한 룸
    
    
} 