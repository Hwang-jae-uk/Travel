package com.busanit.travelapp.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelDTO {
    private Long id;                        // 숙소번호

    private String name;                    // 숙소명
    private String address;                 // 주소
    private String email;                   // 메일
    private String phone;             // 전화번호


    private boolean breakfast;              // 조식여부
    private Integer breakfastPrice;                  // 가격
    private String description;             // 호텔설명

//    private Float ratingAvg;                // 평점
//    private Integer reviewcount;            // 리뷰수


    private List<HotelImageDTO> images ;
    private List<MultipartFile> imagesFiles;
    private List<HotelImageDTO> existingImages;

    private List<RoomDTO> rooms ;

}
