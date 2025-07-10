package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "train_basket")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrainBasket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "basket_id")
    private Long id;

    @Column(name = "train_line")
    private String trainline;        // 호선

    @Column(name = "seat_number")
    private String seatnumber;       // 좌석번호

    @Column(name = "remaining_seats")
    private Integer remainingseats;  // 잔여석

    @Column(name = "trip_type")
    private String triptype;         // 편도/왕복

    @Column(name = "depart_station")
    private String departstation;    // 출발역

    @Column(name = "arrive_station")
    private String arrivestation;    // 도착역

    @Column(name = "travel_date")
    private String traveldate;       // 날짜

    @Column(name = "train_number")
    private String trainnumber;      // 트레인넘버

    @Column(name = "fare")
    private Integer fare;            // 운임비

    @Column(name = "passenger_type")
    private String passengertype;    // 성인/아동

    @Column(name = "pay")
    private Integer pay; // 결제

    @Column(name = "user_name")
    private String username;

    @Column(name = "depart_date")
    private String departdate; // 출발시간

    @Column(name = "arrive_date")
    private String arrivedate; // 도착시간

    @Column(name = "paymentid")
    private String paymentid; // 결제id
}
