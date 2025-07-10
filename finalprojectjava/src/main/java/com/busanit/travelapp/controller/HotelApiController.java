package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.HotelDTO;
import com.busanit.travelapp.dto.RoomDTO;
import com.busanit.travelapp.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotel")
@RequiredArgsConstructor
public class HotelApiController {

    private final HotelService hotelService;

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addHotel(@ModelAttribute HotelDTO hotelDTO) {

        
        if (hotelDTO.getRooms() != null) {
            for (int i = 0; i < hotelDTO.getRooms().size(); i++) {
                RoomDTO room = hotelDTO.getRooms().get(i);

            }
        }

        hotelService.addHotel(hotelDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<HotelDTO>> getHotels() {
        return ResponseEntity.ok(hotelService.findAllAsDTO());
    }


    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotel(@PathVariable Long id){

        return ResponseEntity.ok(hotelService.getHotel(id));

    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @ModelAttribute HotelDTO hotelDTO) {
        try {
            hotelService.updateHotel(id, hotelDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("호텔 수정에 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        try {
            hotelService.deleteHotel(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("호텔 삭제에 실패했습니다: " + e.getMessage());
        }
    }

}
