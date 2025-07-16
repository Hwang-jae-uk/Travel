package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.HotelDTO;
import com.busanit.travelapp.dto.RoomDTO;
import com.busanit.travelapp.service.HotelService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Tag(name= "Hotel-Controller" , description = "Hotel CRUD API 엔드포인트")
@RestController
@RequestMapping("/api/hotel")
@RequiredArgsConstructor
public class HotelApiController {

    private final HotelService hotelService;

    @PostMapping("/")
    @Operation(
            summary = "호텔등록",
            description = "호텔등록",
            responses = {
                    @ApiResponse(responseCode = "200" , description = "등록성공"),
                    @ApiResponse(responseCode = "400" , description = "잘못된 요청. 요청 데이터가 유효하지 않음"),
                    @ApiResponse(responseCode = "404" , description = "요청한 리소스가 없음"),
                    @ApiResponse(responseCode = "500" , description = "서버 오류")
    }
    )
    public ResponseEntity<?> addHotel(@ParameterObject @ModelAttribute HotelDTO hotelDTO) {

        try {
            hotelService.addHotel(hotelDTO);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.badRequest().body("호텔 등록에 실패했습니다.");
        }

    }

    @GetMapping("/list")
    @Operation(summary = "호텔리스트" ,
                description = "호텔리스트를 가져와서 호텔페이지에 뿌림",
                responses = {
                        @ApiResponse(responseCode = "200" , description = "성공"),
                        @ApiResponse(responseCode = "400" , description = "잘못된 요청. 요청 데이터가 유효하지 않음"),
                        @ApiResponse(responseCode = "404" , description = "요청한 리소스가 없음"),
                        @ApiResponse(responseCode = "500" , description = "서버 오류")
                })

    public ResponseEntity<List<HotelDTO>> getHotels() {
        return ResponseEntity.ok(hotelService.findAllAsDTO());
    }



    @GetMapping("/{id}")
    @Operation(summary = "호텔디테일" ,
            description = "호텔1개를 가져와서 디테일페이지에 보여줌",
            responses = {
                    @ApiResponse(responseCode = "200" , description = "성공"),
                    @ApiResponse(responseCode = "400" , description = "잘못된 요청. 요청 데이터가 유효하지 않음"),
                    @ApiResponse(responseCode = "404" , description = "요청한 리소스가 없음"),
                    @ApiResponse(responseCode = "500" , description = "서버 오류")
            },
            parameters = {
                    @Parameter(name = "id" , description = "호텔 id" , required = true)
            }
    )
    public ResponseEntity<HotelDTO> getHotel(@PathVariable Long id){

        return ResponseEntity.ok(hotelService.getHotel(id));

    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "호텔정보 수정",
                description = "호텔정보 수정",
            responses = {
                    @ApiResponse(responseCode = "200" , description = "수정성공"),
                    @ApiResponse(responseCode = "400" , description = "잘못된 요청. 요청 데이터가 유효하지 않음"),
                    @ApiResponse(responseCode = "404" , description = "요청한 리소스가 없음"),
                    @ApiResponse(responseCode = "500" , description = "서버 오류")
            },
            parameters = {
                @Parameter(name = "id" , description = "호텔 id" , required = true)
            })
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @ParameterObject @ModelAttribute HotelDTO hotelDTO) {
        try {
            hotelService.updateHotel(id, hotelDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("호텔 수정에 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "호텔삭제" , description = "호텔 id를 가져와 호텔삭제" ,
    responses = {
            @ApiResponse(responseCode = "200" , description = "삭제성공"),
            @ApiResponse(responseCode = "400" , description = "잘못된 요청. 요청 데이터가 유효하지 않음"),
            @ApiResponse(responseCode = "404" , description = "요청한 리소스가 없음"),
            @ApiResponse(responseCode = "500" , description = "서버 오류")
    } , parameters = {
            @Parameter(name = "id" , description = "호텔 id")
    })
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        try {
            hotelService.deleteHotel(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("호텔 삭제에 실패했습니다: " + e.getMessage());
        }
    }

}
