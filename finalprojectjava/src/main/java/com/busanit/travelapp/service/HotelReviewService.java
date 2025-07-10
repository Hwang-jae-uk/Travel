package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.HotelReviewDto;
import com.busanit.travelapp.entity.Hotel;
import com.busanit.travelapp.entity.HotelReview;
import com.busanit.travelapp.entity.HotelReviewImage;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.HotelRepository;
import com.busanit.travelapp.repository.HotelReviewRepository;
import com.busanit.travelapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HotelReviewService {
    
    private final HotelReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    
    private final String UPLOAD_DIR = "upload/review/";
    private final S3Service s3Service;

    // 특정 호텔의 리뷰 목록 조회
    public List<HotelReviewDto.Response> getHotelReviews(Long hotelId) {
        List<HotelReview> reviews = reviewRepository.findByHotelIdOrderByCreateDayDesc(hotelId);
        return reviews.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    // 리뷰 작성
    @Transactional
    public HotelReviewDto.Response createReview(String userEmail, HotelReviewDto.CreateRequest request, List<MultipartFile> images) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("호텔을 찾을 수 없습니다."));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        HotelReview review = HotelReview.builder()
                .hotel(hotel)
                .user(user)
                .rating(request.getRating())
                .content(request.getContent())
                .build();
        
        // 이미지 처리
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = saveImage(image);
                    HotelReviewImage reviewImage = HotelReviewImage.builder()
                            .hotelReview(review)
                            .imageUrl(imageUrl)
                            .build();
                    review.getImages().add(reviewImage);
                }
            }
        }
        
        HotelReview savedReview = reviewRepository.save(review);
        return convertToResponseDto(savedReview);
    }
    
    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        HotelReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("본인의 리뷰만 삭제할 수 있습니다.");
        }

        if(!review.getImages().isEmpty()){

            // 이미지 파일 삭제
            for (HotelReviewImage image : review.getImages()) {
//                deleteImageFile(image.getImageUrl());
                s3Service.s3delete(image.getImageUrl());

            }
        }
        reviewRepository.delete(review);
    }
    
    // 호텔 평점 정보 조회
    public HotelRatingInfo getHotelRatingInfo(Long hotelId) {
        Double avgRating = reviewRepository.findAverageRatingByHotelId(hotelId);
        Long reviewCount = reviewRepository.countByHotelId(hotelId);
        
        return HotelRatingInfo.builder()
                .averageRating(avgRating != null ? avgRating : 0.0)
                .reviewCount(reviewCount != null ? reviewCount : 0L)
                .build();
    }
    
    // 이미지 저장
    private String saveImage(MultipartFile file) {
        try {
            // 업로드 디렉토리 생성
//            File uploadDir = new File(UPLOAD_DIR);
//            if (!uploadDir.exists()) {
//                uploadDir.mkdirs();
//            }
            
            // 파일명 생성 (UUID + 원본 확장자)
//            String originalFilename = file.getOriginalFilename();
//            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//            String filename = UUID.randomUUID().toString() + extension;



            
            // 파일 저장
//            Path filePath = Paths.get(UPLOAD_DIR + filename);
//            Files.copy(file.getInputStream(), filePath);
            
            return s3Service.hotelReviewUploadFile(file);
            
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장에 실패했습니다.", e);
        }
    }
    
    // 이미지 파일 삭제
//    private void deleteImageFile(String imageUrl) {
//        try {
//            String filename = imageUrl.replace("/review/", "");
//            Path filePath = Paths.get(UPLOAD_DIR + filename);
//            Files.deleteIfExists(filePath);
//        } catch (IOException e) {
//            // 로그만 남기고 예외는 던지지 않음
//            System.err.println("이미지 파일 삭제 실패: " + imageUrl);
//        }
//    }
    
    // Entity to DTO 변환
    private HotelReviewDto.Response convertToResponseDto(HotelReview review) {
        List<String> imageUrls = review.getImages().stream()
                .map(HotelReviewImage::getImageUrl)
                .collect(Collectors.toList());
        
        return HotelReviewDto.Response.builder()
                .id(review.getId())
                .userEmail(review.getUser().getEmail())
                .displayName(review.getUser().getDisplayName() != null ? 
                           review.getUser().getDisplayName() : 
                           review.getUser().getUserName())
                .rating(review.getRating())
                .content(review.getContent())
                .createDay(review.getCreateDay())
                .imageUrls(imageUrls)
                .build();
    }
    
    // 호텔 평점 정보 DTO
    @lombok.Getter
    @lombok.Setter
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    @lombok.Builder
    public static class HotelRatingInfo {
        private Double averageRating;
        private Long reviewCount;
    }
} 