package com.busanit.travelapp.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HotelReviewDto {
    
    private Long id;
    private Long hotelId;
    private String userEmail;
    private Integer rating;
    private String content;
    private LocalDateTime createDay;
    private List<String> imageUrls;
    
    // 리뷰 작성/수정용 DTO
    @Getter @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CreateRequest {
        private Long hotelId;
        private Integer rating;
        private String content;
    }
    
    // 리뷰 응답용 DTO
    @Getter @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String userEmail;
        private String displayName;
        private Integer rating;
        private String content;
        private LocalDateTime createDay;
        private List<String> imageUrls;
    }
} 