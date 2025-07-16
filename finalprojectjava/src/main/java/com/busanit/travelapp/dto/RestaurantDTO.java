package com.busanit.travelapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String phone;
    private String cuisine;
    private String openTime;
    private String closeTime;
    private String description;
    private boolean hasParking;
    private boolean hasReservation;
    private boolean hasDelivery;


    private List<RestaurantImageDTO> images;
    private List<RestaurantImageDTO> existingImages;
    private List<MultipartFile> imagesFiles;

} 