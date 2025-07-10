package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.CafeReviewDto;
import com.busanit.travelapp.service.CafeReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cafe/{cafeId}/reviews")
@RequiredArgsConstructor
public class CafeReviewController {

    private final CafeReviewService cafeReviewService;

    @GetMapping
    public ResponseEntity<List<CafeReviewDto.Response>> getCafeReviews(@PathVariable Long cafeId) {
        List<CafeReviewDto.Response> reviews = cafeReviewService.getReviewsByCafeId(cafeId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/rating")
    public ResponseEntity<CafeReviewDto.RatingInfo> getCafeRating(@PathVariable Long cafeId) {
        CafeReviewDto.RatingInfo ratingInfo = cafeReviewService.getRatingInfo(cafeId);
        return ResponseEntity.ok(ratingInfo);
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable Long cafeId,
            @RequestParam("rating") Integer rating,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        try {
            CafeReviewDto.CreateRequest request = CafeReviewDto.CreateRequest.builder()
                    .rating(rating)
                    .content(content)
                    .build();

            String userEmail = getUserEmail(authentication);
            CafeReviewDto.Response response = cafeReviewService.createReview(cafeId, request, images, userEmail);
            return ResponseEntity.ok(response);
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "리뷰 등록에 실패했습니다."));
        }

    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long cafeId,
            @PathVariable Long reviewId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String userEmail = getUserEmail(authentication);
        cafeReviewService.deleteReview(cafeId, reviewId, userEmail);
        return ResponseEntity.ok(Map.of("message", "리뷰가 삭제되었습니다."));
    }

    private String getUserEmail(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("email");
        }
        return authentication.getName();
    }
} 