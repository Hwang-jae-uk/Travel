package com.busanit.travelapp.dto;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HotelDTO {

    @Schema(description = "호텔 고유 번호")
    private Long id;

    @Schema(description = "호텔 숙소명")
    private String name;

    @Schema(description = "호텔 주소")
    private String address;

    @Schema(description = "호텔 이메일")
    private String email;

    @Schema(description = "호텔 전화번호")
    private String phone;

    @Schema(description = "호텔 조식 여부" , type= "boolean")
    private boolean breakfast;

    @Schema(description = "호텔 조식 가격(호텔 조식 여부가 true일때만)")
    private Integer breakfastPrice;

    @Schema(description = "호텔 소개")
    private String description;

    @ArraySchema(
            schema = @Schema(implementation = HotelImageDTO.class),
            arraySchema = @Schema(description = "호텔 이미지 리스트")
    )
    private List<HotelImageDTO> images ;

    @ArraySchema(
            schema = @Schema(type = "String" , format = "binary"),
            arraySchema = @Schema(description = "호텔 이미지 파일")
    )
    private List<MultipartFile> imagesFiles;

    @ArraySchema(
            schema = @Schema(implementation = HotelImageDTO.class),
            arraySchema = @Schema(description = "호텔 이미지 존재여부확인")
    )
    @Schema(description = "호텔 이지미 존재여부체크")
    @Hidden
    private List<HotelImageDTO> existingImages;

    @Schema(description = "호텔 객실")
    private List<RoomDTO> rooms ;

}
