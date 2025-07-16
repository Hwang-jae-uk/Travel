package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.CafeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CafeReviewRepository extends JpaRepository<CafeReview, Long> {

    // 카페별 리뷰 조회 (최신순)
    List<CafeReview> findByCafeIdOrderByCreateDayDesc(Long cafeId);

    // 카페별 평균 평점 조회
    @Query("SELECT AVG(r.rating) FROM CafeReview r WHERE r.cafe.id = :cafeId")
    Double findAverageRatingByCafeId(@Param("cafeId") Long cafeId);

    // 카페별 리뷰 개수 조회
    Long countByCafeId(Long cafeId);

} 