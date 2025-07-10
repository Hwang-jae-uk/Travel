package com.busanit.travelapp.dto;

import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class TrainBasketDTO {
    private Long id;

    private int fare;
    private int pay;
    private int remainingseats;
    private String arrivestation;
    private String departstation;
    private String passengertype;
    private String seatnumber;
    private String trainline;
    private String trainnumber;
    private String traveldate;
    private String triptype;
    private String username;
    private String departdate; // 출발시간
    private String arrivedate; // 도착시간
    private String paymentid; // 결제Id

}