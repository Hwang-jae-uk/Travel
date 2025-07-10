package com.busanit.travelapp.dto;

import com.busanit.travelapp.entity.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String userEmail;
    private Long price;
    private Long reservationBasketId;
    private Long hotelId;
    private Long roomId;
    private String paymentId;


}
