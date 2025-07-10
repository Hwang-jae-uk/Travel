package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.*;
import com.busanit.travelapp.entity.*;
import com.busanit.travelapp.repository.CafeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CafeService {

    private final CafeRepository cafeRepository;
    private final S3Service s3Service;

    public List<CafeDTO> findAllAsDTO() {
        List<Cafe> cafeList = cafeRepository.findAll();
        return cafeList.stream()
                .map(this::convertToCafeDTO)
                .collect(Collectors.toList());
    }

    private CafeDTO convertToCafeDTO(Cafe cafe) {
        return CafeDTO.builder()
                .id(cafe.getId())
                .name(cafe.getName())
                .address(cafe.getAddress())
                .email(cafe.getEmail())
                .phone(cafe.getPhone())
                .openTime(cafe.getOpenTime())
                .closeTime(cafe.getCloseTime())
                .wifi(cafe.isWifi())
                .parking(cafe.isParking())
                .description(cafe.getDescription())
                .images(cafe.getImages().stream().map(cafeImage -> {
                    CafeImageDTO cafeImageDTO = CafeImageDTO.builder()
                            .id(cafeImage.getId())
                            .imageUrl(cafeImage.getImageUrl())
                            .build();
                    return cafeImageDTO;
                }).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void addCafe(CafeDTO cafeDTO) {
        // 카페 기본 정보 저장
        Cafe cafe = Cafe.builder()
                .name(cafeDTO.getName())
                .address(cafeDTO.getAddress())
                .email(cafeDTO.getEmail())
                .phone(cafeDTO.getPhone())
                .openTime(cafeDTO.getOpenTime())
                .closeTime(cafeDTO.getCloseTime())
                .wifi(cafeDTO.isWifi())
                .parking(cafeDTO.isParking())
                .description(cafeDTO.getDescription())
                .build();

        cafeRepository.save(cafe);

        // 카페 이미지 저장
//        String cafeDirPath = "C:\\upload/cafes/" + cafe.getName();
//        File cafeDir = new File(cafeDirPath);
//        if (!cafeDir.exists()) {
//            cafeDir.mkdirs();
//        }

        List<CafeImage> cafeImages = new ArrayList<>();
        if (cafeDTO.getImagesFiles() != null && !cafeDTO.getImagesFiles().isEmpty()) {
            for (MultipartFile file : cafeDTO.getImagesFiles()) {
                try {
//                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//                    String filePath = cafeDirPath + "/" + fileName;
//                    File destFile = new File(filePath);
//                    file.transferTo(destFile);

                    String URL = s3Service.cafeUploadFile(file);

                    CafeImage cafeImage = CafeImage.builder()
                            .imageUrl(URL)
                            .cafe(cafe)
                            .build();
                    cafeImages.add(cafeImage);
                } catch (IOException e) {
                    System.err.println("카페 이미지 저장 실패: " + e.getMessage());
                }
            }
        }

        cafe.setImages(cafeImages);
        cafeRepository.save(cafe);

        System.out.println("카페 저장 완료 ID: " + cafe.getId());
        System.out.println("이미지 개수: " + cafeImages.size());
    }

    public CafeDTO getCafe(Long id) {
        Cafe cafe = cafeRepository.findById(id).orElseThrow(RuntimeException::new);
        CafeDTO cafeDTO = convertToCafeDTO(cafe);
        return cafeDTO;
    }

    @Transactional
    public void updateCafe(Long id, CafeDTO cafeDTO) {
        Cafe cafe = cafeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("카페를 찾을 수 없습니다."));

        // 카페 기본 정보 업데이트
        cafe.setId(id);
        cafe.setName(cafeDTO.getName());
        cafe.setAddress(cafeDTO.getAddress());
        cafe.setEmail(cafeDTO.getEmail());
        cafe.setPhone(cafeDTO.getPhone());
        cafe.setOpenTime(cafeDTO.getOpenTime());
        cafe.setCloseTime(cafeDTO.getCloseTime());
        cafe.setWifi(cafeDTO.isWifi());
        cafe.setParking(cafeDTO.isParking());
        cafe.setDescription(cafeDTO.getDescription());



        // 카페 이미지 업데이트 (기존 이미지 + 새 이미지 처리)
        List<CafeImage> allCafeImages = new ArrayList<>();
        
        // 1. 남아있는 기존 이미지 처리
        if (cafeDTO.getExistingImages() != null) {
            for (CafeImageDTO existingImageDTO : cafeDTO.getExistingImages()) {
                CafeImage existingImage = cafe.getImages().stream()
                        .filter(img -> img.getId().equals(existingImageDTO.getId()))
                        .findFirst()
                        .orElse(null);
                
                if (existingImage != null) {
                    allCafeImages.add(existingImage);
                }
            }
        }
        
        // 2. 새로 추가된 이미지 처리
        if (cafeDTO.getImagesFiles() != null && !cafeDTO.getImagesFiles().isEmpty()) {
            for (MultipartFile file : cafeDTO.getImagesFiles()) {
                try {
                    String URL = s3Service.cafeUploadFile(file);

                    CafeImage cafeImage = CafeImage.builder()
                            .imageUrl(URL)
                            .cafe(cafe)
                            .build();
                    allCafeImages.add(cafeImage);
                } catch (IOException e) {
                    System.err.println("카페 이미지 저장 실패: " + e.getMessage());
                }
            }
        }
        // 기존 이미지 중 제거할 이미지들 찾기
        List<CafeImage> imagesToRemove = cafe.getImages().stream()
                .filter(existingImg -> allCafeImages.stream()
                        .noneMatch(newImg -> newImg.getId()!=null &&
                                newImg.getId().equals(existingImg.getId())))
                .collect(Collectors.toList());

        for(CafeImage imageToRemove : imagesToRemove){
            s3Service.s3delete(imageToRemove.getImageUrl());
        }



        // 3. 모든 이미지 교체
        cafe.getImages().clear();
        for (CafeImage cafeImage : allCafeImages) {
            cafeImage.setCafe(cafe);
            cafe.getImages().add(cafeImage);
        }

        cafeRepository.save(cafe);
        System.out.println("카페 수정 완료 ID: " + cafe.getId());
    }

    @Transactional
    public void deleteCafe(Long id) {
        Cafe cafe = cafeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("카페를 찾을 수 없습니다."));


        try {
//            String cafeDirPath = "C:\\upload/cafes/" + cafe.getName();
//            File cafeDir = new File(cafeDirPath);
//            if (cafeDir.exists()) {
//                deleteDirectory(cafeDir);
//            }

            for (CafeImage cafeImage : cafe.getImages()) {
                s3Service.s3delete(cafeImage.getImageUrl());
            }
            for(CafeReview cafeReview : cafe.getReviews()) {
                for (CafeReviewImage cafeReviewImage : cafeReview.getImages()) {
                    s3Service.s3delete(cafeReviewImage.getImageUrl());
                }
            }


            cafeRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("카페 파일 삭제 실패: " + e.getMessage());
        }
        

        System.out.println("카페 삭제 완료 ID: " + id);
    }
    
//    private void deleteDirectory(File directory) {
//        if (directory.exists()) {
//            File[] files = directory.listFiles();
//            if (files != null) {
//                for (File file : files) {
//                    if (file.isDirectory()) {
//                        deleteDirectory(file);
//                    } else {
//                        file.delete();
//                    }
//                }
//            }
//            directory.delete();
//        }
//    }
} 