package com.busanit.travelapp.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HotelImageDTO {
    private Long id;
    private MultipartFile file;
    private String imageUrl;
}
