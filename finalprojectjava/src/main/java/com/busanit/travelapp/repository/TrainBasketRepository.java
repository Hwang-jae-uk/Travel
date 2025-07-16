package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.TrainBasket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface TrainBasketRepository extends JpaRepository<TrainBasket, Long> {

    List<TrainBasket> findByUsernameOrderByIdDesc(String username);

    // paymentid를 기준으로 삭제하는 메소드 추가
    @Transactional // 삭제 쿼리에는 @Transactional 어노테이션이 필요합니다.
    void deleteByPaymentid(String paymentid); // 파라미터 타입은 String


}