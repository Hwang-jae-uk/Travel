package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.HotelReviewDto;
import com.busanit.travelapp.service.HotelReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel/{hotelId}/reviews")
@RequiredArgsConstructor
public class HotelReviewController {
    
    private final HotelReviewService reviewService;
    
    // 특정 호텔의 리뷰 목록 조회
    @GetMapping
    public ResponseEntity<List<HotelReviewDto.Response>> getHotelReviews(@PathVariable Long hotelId) {
        List<HotelReviewDto.Response> reviews = reviewService.getHotelReviews(hotelId);
        return ResponseEntity.ok(reviews);
    }
    
    // 호텔 평점 정보 조회
    @GetMapping("/rating")
    public ResponseEntity<HotelReviewService.HotelRatingInfo> getHotelRating(@PathVariable Long hotelId) {
        HotelReviewService.HotelRatingInfo ratingInfo = reviewService.getHotelRatingInfo(hotelId);
        return ResponseEntity.ok(ratingInfo);
    }
    
    // 리뷰 작성
    @PostMapping
    public ResponseEntity<?> createReview(
            @PathVariable Long hotelId,
            @RequestParam("rating") Integer rating,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {
        
        // 로그인 확인
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "로그인이 필요합니다."));
        }
        
        // 사용자 이메일 추출
        String userEmail = null;
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            userEmail = oauth2User.getAttribute("email");
        }
        
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "사용자 정보를 찾을 수 없습니다."));
        }
        
        try {
            HotelReviewDto.CreateRequest request = HotelReviewDto.CreateRequest.builder()
                    .hotelId(hotelId)
                    .rating(rating)
                    .content(content)
                    .build();
            
            HotelReviewDto.Response response = reviewService.createReview(userEmail, request, images);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long hotelId,
            @PathVariable Long reviewId,
            Authentication authentication) {
        
        // 로그인 확인
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "로그인이 필요합니다."));
        }
        
        // 사용자 이메일 추출
        String userEmail = null;
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            userEmail = oauth2User.getAttribute("email");
        }
        
        if (userEmail == null) {
            return ResponseEntity.status(401).body(Map.of("error", "사용자 정보를 찾을 수 없습니다."));
        }
        
        try {
            reviewService.deleteReview(reviewId, userEmail);
            return ResponseEntity.ok(Map.of("message", "리뷰가 삭제되었습니다."));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 