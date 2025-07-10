package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.RestaurantReviewDto;
import com.busanit.travelapp.service.RestaurantReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurant/{restaurantId}/reviews")
@RequiredArgsConstructor
public class RestaurantReviewController {

    private final RestaurantReviewService restaurantReviewService;

    @GetMapping
    public ResponseEntity<List<RestaurantReviewDto.Response>> getRestaurantReviews(@PathVariable Long restaurantId) {
        try {
            List<RestaurantReviewDto.Response> reviews = restaurantReviewService.getReviewsByRestaurantId(restaurantId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/rating")
    public ResponseEntity<RestaurantReviewDto.RatingInfo> getRestaurantRating(@PathVariable Long restaurantId) {
        try {
            RestaurantReviewDto.RatingInfo ratingInfo = restaurantReviewService.getRatingInfo(restaurantId);
            return ResponseEntity.ok(ratingInfo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable Long restaurantId,
            @RequestParam("rating") Integer rating,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }

        try {
            RestaurantReviewDto.CreateRequest request = RestaurantReviewDto.CreateRequest.builder()
                    .rating(rating)
                    .content(content)
                    .build();

            String userEmail = getUserEmail(authentication);
            RestaurantReviewDto.Response response = restaurantReviewService.createReview(restaurantId, request, images, userEmail);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "리뷰 등록에 실패했습니다."));
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long restaurantId,
            @PathVariable Long reviewId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }

        try {
            String userEmail = getUserEmail(authentication);
            restaurantReviewService.deleteReview(restaurantId, reviewId, userEmail);
            return ResponseEntity.ok(Map.of("message", "리뷰가 삭제되었습니다."));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "리뷰 삭제에 실패했습니다."));
        }
    }

    private String getUserEmail(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        }
        return authentication.getName();
    }
} 