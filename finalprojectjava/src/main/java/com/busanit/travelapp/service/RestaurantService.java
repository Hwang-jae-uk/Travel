package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.*;
import com.busanit.travelapp.entity.*;
import com.busanit.travelapp.repository.RestaurantRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.tomcat.util.http.fileupload.FileUtils.deleteDirectory;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final ObjectMapper objectMapper;
    private final S3Service s3Service;

    // 모든 레스토랑 조회
    public List<RestaurantDTO> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        return restaurants.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 레스토랑 상세 조회
    public RestaurantDTO getRestaurant(Long id) {
        log.info("Finding restaurant with id: {}", id);

        // 먼저 레스토랑과 이미지를 조회
        Restaurant restaurant = restaurantRepository.findByIdWithImages(id);

        if (restaurant == null) {
            log.error("Restaurant not found with id: {}", id);
            // 모든 레스토랑 ID 로그 출력
            List<Restaurant> allRestaurants = restaurantRepository.findAll();
            log.info("Available restaurant IDs: {}",
                    allRestaurants.stream().map(Restaurant::getId).collect(Collectors.toList()));
            throw new RuntimeException("Restaurant not found with id: " + id);
        }


        log.info("Found restaurant: {} with {} images and {} dishes",
                restaurant.getName(),
                restaurant.getImages() != null ? restaurant.getImages().size() : 0);

        return convertToDTO(restaurant);
    }

    // 레스토랑 등록 (새로운 FormData 방식)
    @Transactional
    public void createRestaurant(RestaurantDTO restaurantDTO) {

        Restaurant restaurant = Restaurant.builder()
                .name(restaurantDTO.getName())
                .address(restaurantDTO.getAddress())
                .phone(restaurantDTO.getPhone())
                .cuisine(restaurantDTO.getCuisine())
                .openTime(restaurantDTO.getOpenTime())
                .closeTime(restaurantDTO.getCloseTime())
                .hasDelivery(restaurantDTO.isHasDelivery())
                .description(restaurantDTO.getDescription())
                .hasParking(restaurantDTO.isHasParking())
                .hasReservation(restaurantDTO.isHasReservation())
                .build();

        restaurantRepository.save(restaurant);

        //레스토랑 이미지 저장
//        String restaurantDirPath = "c:\\upload/restaurants/"+restaurant.getName();
//        File restaurantDir = new File(restaurantDirPath);
//        if(!restaurantDir.exists()){
//            restaurantDir.mkdir();
//        }

        List<RestaurantImage> restaurantImages = new ArrayList<>();
        if(restaurantDTO.getImagesFiles() != null && !restaurantDTO.getImagesFiles().isEmpty()){
            for(MultipartFile file : restaurantDTO.getImagesFiles()){
                try{
//                    String fileName = file.getOriginalFilename();
//                    String filePath = "c:\\upload/restaurants/"+restaurant.getName() + "/" + fileName;
//                    File destFile = new File(filePath);
//                    file.transferTo(destFile);
                    String Url = s3Service.restaurantUploadFile(file);

                    RestaurantImage restaurantImage = RestaurantImage.builder()
                            .imagePath(Url)
                            .restaurant(restaurant)
                            .build();
                    restaurantImages.add(restaurantImage);
                }catch (IOException e){
                    System.err.println("음식점 이미지 저장 실패: " + e.getMessage());
                }
            }
        }
        restaurant.setImages(restaurantImages);

        restaurantRepository.save(restaurant);


    }

    // 레스토랑 수정
    public void updateRestaurant(RestaurantDTO restaurantDTO) {
        try {
            Restaurant restaurant = restaurantRepository.findById(restaurantDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantDTO.getId()));

            // 기본 정보 업데이트
            restaurant.setName(restaurantDTO.getName());
            restaurant.setAddress(restaurantDTO.getAddress());
            restaurant.setPhone(restaurantDTO.getPhone());
            restaurant.setCuisine(restaurantDTO.getCuisine());
            restaurant.setOpenTime(restaurantDTO.getOpenTime());
            restaurant.setCloseTime(restaurantDTO.getCloseTime());
            restaurant.setHasParking(restaurantDTO.isHasParking());
            restaurant.setHasReservation(restaurantDTO.isHasReservation());
            restaurant.setHasDelivery(restaurantDTO.isHasDelivery());
            restaurant.setDescription(restaurantDTO.getDescription());


            // 파일 저장 디렉토리 생성
//            String restaurantDirPath = "c:\\upload/restaurants/"+restaurant.getName();
//            File restaurantDir = new File(restaurantDirPath);
//            if(!restaurantDir.exists()){
//                restaurantDir.mkdir();
//            }
            // 레스토랑 이미지 처리 (기존 이미지 + 새 이미지)
            List<RestaurantImage> allrestaurantImages = new ArrayList<>();

            // 1. 남아 있는 기존 이미지 처리
            if(restaurantDTO.getExistingImages() !=null){
                for(RestaurantImageDTO existingImageDTO : restaurantDTO.getExistingImages()){
                    RestaurantImage existingIamge = restaurant.getImages().stream()
                            .filter(img->img.getId().equals(existingImageDTO.getId()))
                            .findFirst()
                            .orElse(null);
                    if(existingIamge != null){
                        allrestaurantImages.add(existingIamge);
                    }
                }
            }

            // 2. 새로 추가된 이미지 처리
            if(restaurantDTO.getImagesFiles() != null && !restaurantDTO.getImagesFiles().isEmpty()){
                for(MultipartFile file : restaurantDTO.getImagesFiles()){
                    try {
//                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//                        String filePath = restaurantDirPath + "/" + fileName;
//                        File destFile = new File(filePath);
//                        file.transferTo(destFile);

                        String URL = s3Service.restaurantUploadFile(file);

                        RestaurantImage restaurantImage = RestaurantImage.builder()
                                .imagePath(URL)
                                .restaurant(restaurant)
                                .build();
                        allrestaurantImages.add(restaurantImage);
                    } catch (IOException e) {
                        System.err.println("레스토랑 이미지 저장 실패: " + e.getMessage());
                    }
                }
            }

            // 3. 기존 이미지 중 제거할 이미지들 찾기
            List<RestaurantImage> restaurantsRemove = restaurant.getImages().stream()
                    .filter(existingImg -> allrestaurantImages.stream()
                            .noneMatch(newImg -> newImg.getId()!=null &&newImg.getId().equals(existingImg.getId())))
                    .collect(Collectors.toList());

            // 제거할 이미지들 삭제
            for (RestaurantImage restaurantRemove : restaurantsRemove) {
                s3Service.s3delete(restaurantRemove.getImagePath());
                restaurant.getImages().remove(restaurantRemove);
            }

            // 새 이미지들 추가
//            for (RestaurantImage restaurantImage : allrestaurantImages) {
//                if(restaurantImage.getId()!=null){
//                    restaurantImage.setRestaurant(restaurant);
//                    restaurant.getImages().add(restaurantImage);
//                }
//            }
            for (RestaurantImage restaurantImage : allrestaurantImages) {
                restaurantImage.setRestaurant(restaurant);
                if (!restaurant.getImages().contains(restaurantImage)) {
                    restaurant.getImages().add(restaurantImage);
                }
            }


            restaurant = restaurantRepository.save(restaurant);

        } catch (Exception e) {
            log.error("Error updating restaurant: ", e);
            throw new RuntimeException("Failed to update restaurant", e);
        }
    }

    // 레스토랑 삭제
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));

        // 이미지 파일 삭제
        try {
//            String restaurantDirPath = "C:\\upload/restaurants/" + restaurant.getName();
//            File restaurantDir = new File(restaurantDirPath);
//            if (restaurantDir.exists()) {
//                deleteDirectory(restaurantDir);
//            }
            if(!restaurant.getImages().isEmpty()){
                for(RestaurantImage restaurantImage : restaurant.getImages()){
                    s3Service.s3delete(restaurantImage.getImagePath());
                }
            }
            if(!restaurant.getReviews().isEmpty()){
                for(RestaurantReview review : restaurant.getReviews()){
                    if(!review.getImages().isEmpty()){
                        for(RestaurantReviewImage reviewImage : review.getImages()){
                            s3Service.s3delete(reviewImage.getImageUrl());
                        }
                    }
                }
            }
            restaurantRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Entity를 DTO로 변환 (목록용)
    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        List<RestaurantImageDTO> imageUrls = restaurant.getImages() != null ?
                restaurant.getImages().stream()
                        .map(image -> new RestaurantImageDTO(image.getId() , image.getImagePath(), image.getRestaurant().getId()))
                        .collect(Collectors.toList()) : new ArrayList<>();


        return RestaurantDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .cuisine(restaurant.getCuisine())
                .openTime(restaurant.getOpenTime())
                .closeTime(restaurant.getCloseTime())
                .hasParking(restaurant.isHasParking())
                .hasReservation(restaurant.isHasReservation())
                .hasDelivery(restaurant.isHasDelivery())
                .description(restaurant.getDescription())
                .images(imageUrls)

                .build();
    }



    // @PostConstruct  // DB 초기화 방지를 위해 주석 처리
    public void init() {
        // 테스트 데이터가 없을 때만 생성 (현재 비활성화)
        // if (restaurantRepository.count() == 0) {
        //     log.info("Initializing test restaurant data...");
        //     createTestData();
        // }
    }

}