package com.busanit.travelapp.Component;

import com.busanit.travelapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationBasketScheduler {

    private final RoomService roomService; // 또는 ReservationBasketService


    // 매일 오전 2시 실행
    @Scheduled(cron = "0 0 2 * * *")
//    @Scheduled(fixedRate = 30000) 테스트용 30초
    public void cleanUpOldBaskets() {
        System.out.println("삭제되는중");
        roomService.deleteExpiredBaskets();

    }
}
