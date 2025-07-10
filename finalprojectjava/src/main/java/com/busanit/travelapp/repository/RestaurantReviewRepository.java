package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.RestaurantReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long> {

    // 레스토랑별 리뷰 조회 (최신순)
    List<RestaurantReview> findByRestaurantIdOrderByCreateDayDesc(Long restaurantId);

    // 레스토랑별 평균 평점 조회
    @Query("SELECT AVG(r.rating) FROM RestaurantReview r WHERE r.restaurant.id = :restaurantId")
    Double findAverageRatingByRestaurantId(@Param("restaurantId") Long restaurantId);

    // 레스토랑별 리뷰 개수 조회
    Long countByRestaurantId(Long restaurantId);


    // 사용자 이메일과 리뷰 ID로 리뷰 조회 (삭제 권한 확인용)
    RestaurantReview findByIdAndUserEmail(Long id, String userEmail);
} 