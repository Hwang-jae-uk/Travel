package com.busanit.travelapp.controller;


import com.busanit.travelapp.dto.ReservationBasketDTO;
import com.busanit.travelapp.dto.ReservationDTO;
import com.busanit.travelapp.dto.RoomDTO;
import com.busanit.travelapp.dto.RoomInventoryDTO;
import com.busanit.travelapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomApiController {

    private final RoomService roomService;

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoom(@PathVariable Long id) {

        return ResponseEntity.ok(roomService.getRoom(id));
    }

    @PostMapping("/reservation")
    public ResponseEntity<Void> reserveRoom(@RequestBody ReservationDTO reservationDTO) {
        roomService.ReserveRoom(reservationDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/roomReservation")
    public ResponseEntity<RoomDTO> roomReservation(@RequestBody  ReservationBasketDTO resBasketDTO) {
        roomService.addBasket(resBasketDTO);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/basketList")
    public ResponseEntity<List<ReservationBasketDTO>> getBasketList(@RequestParam String userEmail) {

        return new ResponseEntity<>(roomService.getBasketList(userEmail), HttpStatus.OK);
    }

    @DeleteMapping("basket/{basketId}")
    public ResponseEntity<Void> deleteBasket(@PathVariable Long basketId) {
        roomService.basketDelete(basketId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory/{id}/{checkInDate}")
    public ResponseEntity<RoomInventoryDTO> getInventory(@PathVariable Long id , @PathVariable LocalDate checkInDate) {
        System.out.println("checkInDate : " + checkInDate);
        RoomInventoryDTO roomInventoryDTO = roomService.getRoomInventory(id , checkInDate);
        if (roomInventoryDTO != null) {
            return ResponseEntity.ok(roomInventoryDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
