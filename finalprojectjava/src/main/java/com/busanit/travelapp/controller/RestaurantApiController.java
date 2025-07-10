package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.RestaurantDTO;
import com.busanit.travelapp.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@Log4j2
public class RestaurantApiController {

    private final RestaurantService restaurantService;

    // 모든 레스토랑 조회
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        try {
            List<RestaurantDTO> restaurants = restaurantService.getAllRestaurants();
            return ResponseEntity.ok(restaurants);
        } catch (Exception e) {
            log.error("레스토랑 목록 조회 실패: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // 레스토랑 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurant(@PathVariable Long id) {
        try {
            RestaurantDTO restaurant = restaurantService.getRestaurant(id);
            return ResponseEntity.ok(restaurant);
        } catch (RuntimeException e) {
            log.error("레스토랑 상세 조회 실패: ", e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("레스토랑 상세 조회 중 오류 발생: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // 레스토랑 등록
    @PostMapping
    public ResponseEntity<String> createRestaurant(@ModelAttribute RestaurantDTO restaurantDTO) {
        try {
            
            restaurantService.createRestaurant(restaurantDTO);
            return ResponseEntity.ok("레스토랑이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            log.error("레스토랑 등록 실패: ", e);
            return ResponseEntity.badRequest().body("레스토랑 등록 실패: " + e.getMessage());
        }
    }

    // 레스토랑 수정
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDTO> updateRestaurant(RestaurantDTO restaurantDTO) {
        try {
            restaurantService.updateRestaurant(restaurantDTO);
            return ResponseEntity.ok().build();
        }catch (Exception e) {

            return ResponseEntity.internalServerError().build();
        }
    }

    // 레스토랑 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long id) {
        try {
            restaurantService.deleteRestaurant(id);
            return ResponseEntity.ok("음식점이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {

            return ResponseEntity.badRequest().body("카페 삭제 실패");
        }
    }
} 