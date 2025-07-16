package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.Reservation;
import com.busanit.travelapp.entity.ReservationBasket;
import com.busanit.travelapp.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserEmailOrderByCreateDayDesc(String userEmail);
    Optional<Reservation> findByReservationBasket(ReservationBasket reservationBasket);

    
}
