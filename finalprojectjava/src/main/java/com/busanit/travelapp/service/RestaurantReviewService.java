package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.RestaurantReviewDto;
import com.busanit.travelapp.entity.Restaurant;
import com.busanit.travelapp.entity.RestaurantReview;
import com.busanit.travelapp.entity.RestaurantReviewImage;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.RestaurantRepository;
import com.busanit.travelapp.repository.RestaurantReviewRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantReviewService {
    
    private final RestaurantReviewRepository restaurantReviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    
    private final String uploadDir = "upload/review/";
    private final S3Service s3Service;

    public List<RestaurantReviewDto.Response> getReviewsByRestaurantId(Long restaurantId) {
        List<RestaurantReview> reviews = restaurantReviewRepository.findByRestaurantIdOrderByCreateDayDesc(restaurantId);
        return reviews.stream()
                .map(this::convertToResponse)
                .toList();
    }
    
    public RestaurantReviewDto.RatingInfo getRatingInfo(Long restaurantId) {
        Double averageRating = restaurantReviewRepository.findAverageRatingByRestaurantId(restaurantId);
        Long reviewCount = restaurantReviewRepository.countByRestaurantId(restaurantId);
        
        return RestaurantReviewDto.RatingInfo.builder()
                .averageRating(averageRating != null ? averageRating : 0.0)
                .reviewCount(reviewCount != null ? reviewCount : 0L)
                .build();
    }
    
    public RestaurantReviewDto.Response createReview(Long restaurantId, RestaurantReviewDto.CreateRequest request, 
                                                   List<MultipartFile> images, String userEmail) {

        
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("레스토랑을 찾을 수 없습니다."));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        RestaurantReview review = RestaurantReview.builder()
                .restaurant(restaurant)
                .user(user)
                .userEmail(userEmail)
                .rating(request.getRating())
                .content(request.getContent())
                .build();
        
        // Save images if provided
        if (images != null && !images.isEmpty()) {
            List<RestaurantReviewImage> reviewImages = saveImages(images , review);
            review.setImages(reviewImages);
        }
        
        RestaurantReview savedReview = restaurantReviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    private List<RestaurantReviewImage> saveImages(List<MultipartFile> images , RestaurantReview review) {
        List<RestaurantReviewImage> reviewImages = new ArrayList<>();

        // Create upload directory if not exists
//        File uploadDirectory = new File(uploadDir);
//        if (!uploadDirectory.exists()) {
//            uploadDirectory.mkdirs();
//        }

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                try {
//                    String originalFilename = image.getOriginalFilename();
//                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//                    String filename = UUID.randomUUID().toString() + extension;
//
//                    Path filePath = Paths.get(uploadDir + filename);
//                    Files.write(filePath, image.getBytes());

                    String URL = s3Service.restaurantReviewUploadFile(image);

                    RestaurantReviewImage reviewImage = RestaurantReviewImage.builder()
                            .imageUrl(URL)
                            .restaurantReview(review)
                            .build();

                    reviewImages.add(reviewImage);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 저장에 실패했습니다.", e);
                }
            }
        }

        return reviewImages;
    }
    
    public void deleteReview(Long restaurantId, Long reviewId, String userEmail) {
        RestaurantReview review = restaurantReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        if (!review.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("본인의 리뷰만 삭제할 수 있습니다.");
        }
        
        if (!review.getRestaurant().getId().equals(restaurantId)) {
            throw new RuntimeException("잘못된 요청입니다.");
        }
        
        // Delete image files
        if (review.getImages() != null) {
            for (RestaurantReviewImage image : review.getImages()) {
                s3Service.s3delete(image.getImageUrl());
            }
        }
        
        restaurantReviewRepository.delete(review);
    }
    

    

    private RestaurantReviewDto.Response convertToResponse(RestaurantReview review) {
        List<String> imageUrls = new ArrayList<>();
        if (review.getImages() != null) {
            imageUrls = review.getImages().stream()
                    .map(RestaurantReviewImage::getImageUrl)
                    .toList();
        }

        return RestaurantReviewDto.Response.builder()
                .id(review.getId())
                .userEmail(review.getUserEmail())
                .displayName(review.getUser().getDisplayName())
                .rating(review.getRating())
                .content(review.getContent())
                .imageUrls(imageUrls)
                .createDay(review.getCreateDay())
                .build();
    }
} 