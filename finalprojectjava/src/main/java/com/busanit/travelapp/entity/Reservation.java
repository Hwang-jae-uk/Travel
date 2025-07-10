package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservations")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reservation extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;                        // 예약번호
    
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;          // 체크인 날짜
    
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;         // 체크아웃 날짜

    
    @Column(name = "user_email")
    private String userEmail;              // 예약자 이메일

    @Column
    private Long price;

    @Column(name = "paymentId")
    private String paymentId;
    
    // 관계 설정
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_email", referencedColumnName = "email")
//    private User user;                      // 예약한 사용자
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;                    // 예약한 호텔

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_basket_id")
    private ReservationBasket reservationBasket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;                      // 예약한 룸
    

} 