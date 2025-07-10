package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.CafeReviewDto;
import com.busanit.travelapp.entity.*;
import com.busanit.travelapp.repository.CafeRepository;
import com.busanit.travelapp.repository.CafeReviewRepository;
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
@Transactional
public class CafeReviewService {
    
    private final CafeReviewRepository cafeReviewRepository;
    private final CafeRepository cafeRepository;
    private final UserRepository userRepository;

    private final String UPLOAD_DIR = "upload/review/";
    private final S3Service s3Service;

    public List<CafeReviewDto.Response> getReviewsByCafeId(Long cafeId) {
        List<CafeReview> reviews = cafeReviewRepository.findByCafeIdOrderByCreateDayDesc(cafeId);
        return reviews.stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    public CafeReviewDto.RatingInfo getRatingInfo(Long cafeId) {
        Double averageRating = cafeReviewRepository.findAverageRatingByCafeId(cafeId);
        Long reviewCount = cafeReviewRepository.countByCafeId(cafeId);
        
        return CafeReviewDto.RatingInfo.builder()
                .averageRating(averageRating != null ? averageRating : 0.0)
                .reviewCount(reviewCount != null ? reviewCount : 0L)
                .build();
    }
    
    public CafeReviewDto.Response createReview(Long cafeId, CafeReviewDto.CreateRequest request, 
                                              List<MultipartFile> images, String userEmail) {
        
        Cafe cafe = cafeRepository.findById(cafeId)
                .orElseThrow(() -> new RuntimeException("카페를 찾을 수 없습니다."));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        CafeReview review = CafeReview.builder()
                .cafe(cafe)
                .user(user)
                .userEmail(userEmail)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        // 이미지 처리
        if(images != null && !images.isEmpty()) {
            for(MultipartFile image : images) {
                String imageUrl = saveImage(image);
                CafeReviewImage reviewImage = CafeReviewImage.builder()
                        .imageUrl(imageUrl)
                        .cafeReview(review)
                        .build();
                review.getImages().add(reviewImage);
            }
        }
        
        CafeReview savedReview = cafeReviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    // 이미지 저장
    private String saveImage(MultipartFile file) {
        try {
//            // 업로드 디렉토리 생성
//            File uploadDir = new File(UPLOAD_DIR);
//            if (!uploadDir.exists()) {
//                uploadDir.mkdirs();
//            }
//
//            // 파일명 생성 (UUID + 원본 확장자)
//            String originalFilename = file.getOriginalFilename();
//            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//            String filename = UUID.randomUUID().toString() + extension;
//
//            System.out.println("extension:"+extension);
//
//
//            // 파일 저장
//            Path filePath = Paths.get(UPLOAD_DIR + filename);
//            Files.copy(file.getInputStream(), filePath);

            return s3Service.cafeReviewUploadFile(file);

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장에 실패했습니다.", e);
        }
    }
    
    public void deleteReview(Long cafeId, Long reviewId, String userEmail) {
        CafeReview review = cafeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        if (!review.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("본인의 리뷰만 삭제할 수 있습니다.");
        }

        if(!review.getImages().isEmpty() ) {

            for(CafeReviewImage reviewImage : review.getImages()) {
                s3Service.s3delete(reviewImage.getImageUrl());
            }

        }

        cafeReviewRepository.delete(review);
    }

    private CafeReviewDto.Response convertToResponse(CafeReview review) {
        List<String> imageUrls = review.getImages().stream()
                .map(CafeReviewImage::getImageUrl)
                .collect(Collectors.toList());

        return CafeReviewDto.Response.builder()
                .id(review.getId())
                .userEmail(review.getUserEmail())
                .displayName(review.getUser().getDisplayName())
                .rating(review.getRating())
                .content(review.getContent())
                .createDay(review.getCreateDay())
                .imageUrls((imageUrls))
                .build();
    }
} 