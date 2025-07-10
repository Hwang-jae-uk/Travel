package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.*;
import com.busanit.travelapp.entity.*;
import com.busanit.travelapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final ReservationBasketRepository reservationBasketRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final RoomInventoryRepository roomInventoryRepository;

    public RoomInventoryDTO getRoomInventory(Long id , LocalDate checkInDate) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) {
            return null;
        }

        RoomInventory roomInventory = roomInventoryRepository.findByRoomAndDate(room , checkInDate).orElse(null);

        if(roomInventory != null) {
            RoomInventoryDTO roomInventoryDTO = RoomInventoryDTO.builder()
                    .roomId(room.getId())
                    .availableCount(roomInventory.getAvailableCount())
                    .date(checkInDate)
                    .totalCount(roomInventory.getTotalCount())
                    .reservedCount(roomInventory.getReservedCount())
                    .build();
            return roomInventoryDTO;
        } else {
            // RoomInventory가 없으면 기본 용량 반환
            RoomInventoryDTO roomInventoryDTO = RoomInventoryDTO.builder()
                    .roomId(room.getId())
                    .availableCount(room.getCapacity())
                    .date(checkInDate)
                    .totalCount(room.getCapacity())
                    .reservedCount(0)
                    .build();
            return roomInventoryDTO;
        }
    }

    public RoomDTO getRoom(Long id) {
        Optional<Room> room = roomRepository.findById(id);
        RoomDTO roomDTO = RoomDTO.builder()
                .id(room.get().getId())
                .name(room.get().getName())
                .price(room.get().getPrice())
                .capacity(room.get().getCapacity())
                .people(room.get().getPeople())
                .beds(room.get().getBeds())
                .bathrooms(room.get().getBathrooms())
                .roomImages(room.get().getRoomImages().stream().map(roomImage -> {
                    RoomImageDTO roomImageDTO = RoomImageDTO.builder()
                            .id(roomImage.getId())
                            .imageUrl(roomImage.getImageUrl())
                            .build();
                    return roomImageDTO;
                }).collect(Collectors.toList()))
                .build();
        return roomDTO;
    }

//    public RoomDTO convertRoomToDTO(Room room) {
//        RoomDTO roomDTO = RoomDTO.builder()
//                .id(room.getId())
//                .name(room.getName())
//                .bathrooms(room.getBathrooms())
//                .price(room.getPrice())
//                .beds(room.getBeds())
//                .bathrooms(room.getBathrooms())
//                .capacity(room.getCapacity())
//                .hotel(room.getHotel())
//                .build();
//
//        return roomDTO;
//    }


    public void ReserveRoom(ReservationDTO reservationDTO) {
        Room room = roomRepository.findById(reservationDTO.getRoomId()).orElse(null);
        if (room == null) {
            throw new RuntimeException("Room not found");
        }

        // 날짜별로 이미 생성된 RoomInventory가 있는지 먼저 확인
        RoomInventory roomInventory = roomInventoryRepository
                .findByRoomAndDate(room, reservationDTO.getCheckInDate())
                .orElse(null);

        if (roomInventory == null) {
            // 없다면 새로 생성
            roomInventory = RoomInventory.builder()
                    .room(room)
                    .date(reservationDTO.getCheckInDate())
                    .totalCount(room.getCapacity())
                    .reservedCount(1)
                    .availableCount(room.getCapacity() - 1)
                    .build();
        } else {
            // 있다면 예약 수만 증가
            roomInventory.setReservedCount(roomInventory.getReservedCount() + 1);
            roomInventory.setAvailableCount(roomInventory.getAvailableCount() - 1);
        }

        roomInventoryRepository.save(roomInventory);

        Reservation reservation = Reservation.builder()
                .price(reservationDTO.getPrice())
                .checkInDate(reservationDTO.getCheckInDate())
                .userEmail(reservationDTO.getUserEmail())
                .checkOutDate(reservationDTO.getCheckOutDate())
                .checkInDate(reservationDTO.getCheckInDate())
                .room(roomRepository.findById(reservationDTO.getRoomId()).orElse(null))
                .hotel(roomRepository.findById(reservationDTO.getRoomId()).orElse(null).getHotel())
                .reservationBasket(reservationBasketRepository.findById(reservationDTO.getReservationBasketId()).orElse(null))
                .paymentId(reservationDTO.getPaymentId())
                .build();

        reservationRepository.save(reservation);
    }




    public void cancelRoom(Long id) {
        Room room = roomRepository.findById(id).orElse(null);

        roomRepository.save(room);

    }
    public void addBasket(ReservationBasketDTO resBasketDTO) {
        User user = userRepository.findByEmail(resBasketDTO.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hotel hotel = hotelRepository.findById(resBasketDTO.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = roomRepository.findById(resBasketDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        ReservationBasket reservationBasket = ReservationBasket.builder()
                .id(resBasketDTO.getId())
                .checkInDate(resBasketDTO.getCheckInDate())
                .checkOutDate(resBasketDTO.getCheckOutDate())
                .user(user)
                .room(room)
                .hotel(hotel)
                .build();

        reservationBasketRepository.save(reservationBasket);
    }

    public List<ReservationBasketDTO> getBasketList(String userEmail) {
        List<ReservationBasket> basketList = reservationBasketRepository.findByUserEmail(userEmail);

        List<ReservationBasketDTO> resBasketDTOList = new ArrayList<>();
        basketList.stream().forEach(reservationBasket -> {
            ReservationBasketDTO reservationBasketDTO = ReservationBasketDTO.builder()
                    .id(reservationBasket.getId())
                    .checkInDate(reservationBasket.getCheckInDate())
                    .checkOutDate(reservationBasket.getCheckOutDate())
                    .userEmail(reservationBasket.getUser().getEmail())
                    .roomId(reservationBasket.getRoom().getId())
                    .hotelId(reservationBasket.getHotel().getId())
                    .build();
            resBasketDTOList.add(reservationBasketDTO);
        });
        return resBasketDTOList;
    }

    public void basketDelete(Long id) {
        reservationBasketRepository.deleteById(id);
    }


    @Transactional
    public void deleteExpiredBaskets() {
        LocalDate today = LocalDate.now();
        List<ReservationBasket> expiredBaskets = reservationBasketRepository.findAllByCheckInDateBefore(today); // 오늘이전 삭제

//        List<ReservationBasket> expiredBaskets = reservationBasketRepository.findAllByCheckInDateLessThanEqual(today); 테스트용 오늘포함
        if(!expiredBaskets.isEmpty()) {
            reservationBasketRepository.deleteAll(expiredBaskets);
            reservationBasketRepository.flush();
            System.out.println("호텔예약 바구니가 시간이 만료되어 삭제되었습니다");
        }
    }

    public void reservationDelete(Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();

        RoomInventory roomInventory = roomInventoryRepository.findByRoomAndDate(reservation.getRoom() , reservation.getCheckInDate()).orElseThrow();

        roomInventory.setReservedCount(roomInventory.getReservedCount() - 1);
        roomInventory.setAvailableCount(roomInventory.getAvailableCount() + 1);


        reservationRepository.deleteById(id);

    }

}
