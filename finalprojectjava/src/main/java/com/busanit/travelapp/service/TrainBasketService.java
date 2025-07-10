package com.busanit.travelapp.service;

import com.busanit.travelapp.entity.TrainBasket;
import com.busanit.travelapp.dto.TrainBasketDTO;
import com.busanit.travelapp.repository.TrainBasketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor

public class TrainBasketService {
    private final TrainBasketRepository trainBasketRepository;

    @Transactional
    public void addTrainBasket(TrainBasketDTO trainBasketDTO) {
        //기차 기본 정보 저장
        TrainBasket trainBasket = TrainBasket.builder()
                .trainline(trainBasketDTO.getTrainline()) // 호선
                .seatnumber(trainBasketDTO.getSeatnumber()) // 좌석번호
                .remainingseats(trainBasketDTO.getRemainingseats()) // 잔여석
                .triptype(trainBasketDTO.getTriptype()) // 편도/왕복
                .departstation(trainBasketDTO.getDepartstation()) // 출발역
                .arrivestation(trainBasketDTO.getArrivestation()) // 도착역
                .traveldate(trainBasketDTO.getTraveldate()) // 날짜
                .trainnumber(trainBasketDTO.getTrainnumber()) // 트레인넘버
                .fare(trainBasketDTO.getFare()) // 운임비
                .passengertype(trainBasketDTO.getPassengertype()) // 성인/아동
                .pay(trainBasketDTO.getPay()) // 결제 boolean
                .username(trainBasketDTO.getUsername()) //사용자 email
                .departdate(trainBasketDTO.getDepartdate()) // 출발시간
                .arrivedate(trainBasketDTO.getArrivedate()) // 도착시간
                .paymentid(trainBasketDTO.getPaymentid()) // 결제 id
                .build();

        trainBasketRepository.save(trainBasket);
    }

    // train DB에서 삭제
    public void deleteBasket(String paymentid){
        trainBasketRepository.deleteByPaymentid(paymentid);
    }
}