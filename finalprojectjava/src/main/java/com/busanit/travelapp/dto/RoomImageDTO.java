package com.busanit.travelapp.dto;


import jakarta.persistence.Entity;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImageDTO {

    private Long id;
    private MultipartFile file;
    private String imageUrl;

}
