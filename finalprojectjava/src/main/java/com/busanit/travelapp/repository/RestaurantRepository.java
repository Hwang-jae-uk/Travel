package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    
    // 레스토랑과 이미지 정보를 함께 조회
    @Query("SELECT r FROM Restaurant r LEFT JOIN FETCH r.images WHERE r.id = :id")
    Restaurant findByIdWithImages(Long id);

} 