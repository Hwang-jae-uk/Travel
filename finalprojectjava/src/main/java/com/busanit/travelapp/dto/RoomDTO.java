package com.busanit.travelapp.dto;

import com.busanit.travelapp.entity.Hotel;
import com.busanit.travelapp.entity.RoomImage;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO {
    private Long id;
    private String name;
    private Integer price;
    private Integer capacity;
    private Integer beds;
    private Integer bathrooms;
    private Integer people;
    private Hotel hotel;
    private List<MultipartFile> roomImagesFiles;
    private List<RoomImageDTO> roomImages;
    private List<String> existingRoomImages;

}
