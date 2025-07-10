package com.busanit.travelapp.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CafeDTO {
    private Long id;                        // 카페번호

    private String name;                    // 카페명
    private String address;                 // 주소
    private String email;                   // 메일
    private String phone;                   // 전화번호
    private String openTime;                // 영업시간 시작
    private String closeTime;               // 영업시간 종료
    private boolean wifi;                   // 와이파이 여부
    private boolean parking;                // 주차 가능 여부
    private String description;             // 카페 소개

    private List<CafeImageDTO> images;
    private List<MultipartFile> imagesFiles;
    private List<CafeImageDTO> existingImages;

} 