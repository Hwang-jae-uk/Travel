package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.ReservationBasket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservationBasketRepository extends JpaRepository<ReservationBasket, Long> {
    
    // 사용자별 바구니 목록 조회 (최신순)
    List<ReservationBasket> findByUserEmail(String userEmail);

    List<ReservationBasket> findAllByCheckInDateBefore(LocalDate date);
    
}
