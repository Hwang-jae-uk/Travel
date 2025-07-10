package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.TrainBasketDTO;
import com.busanit.travelapp.service.TrainBasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class TrainBasketController {
    private final TrainBasketService trainBasketService;

    @PostMapping("/train")
    public ResponseEntity<?> addTrainBasket(@RequestBody TrainBasketDTO dto) {
        trainBasketService.addTrainBasket(dto);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/train/{paymentid}")
    public ResponseEntity<Void> deleteBasket(@PathVariable String paymentid) {

        trainBasketService.deleteBasket(paymentid);

        return ResponseEntity.ok().build();
    }

}
