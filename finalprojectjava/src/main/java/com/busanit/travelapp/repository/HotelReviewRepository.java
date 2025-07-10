package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.HotelReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelReviewRepository extends JpaRepository<HotelReview, Long> {
    
    // 특정 호텔의 리뷰 목록 조회 (최신순)
    @Query("SELECT r FROM HotelReview r WHERE r.hotel.id = :hotelId ORDER BY r.createDay DESC")
    List<HotelReview> findByHotelIdOrderByCreateDayDesc(@Param("hotelId") Long hotelId);
    
    // 특정 사용자의 리뷰 목록 조회
    List<HotelReview> findByUserUserNameOrderByCreateDayDesc(String userName);
    
    // 특정 호텔의 평균 평점 계산
    @Query("SELECT AVG(r.rating) FROM HotelReview r WHERE r.hotel.id = :hotelId")
    Double findAverageRatingByHotelId(@Param("hotelId") Long hotelId);
    
    // 특정 호텔의 리뷰 개수
    Long countByHotelId(Long hotelId);
} 