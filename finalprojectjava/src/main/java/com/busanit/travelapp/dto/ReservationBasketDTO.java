package com.busanit.travelapp.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationBasketDTO {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String userEmail;
    private Long hotelId;
    private Long roomId;

}
