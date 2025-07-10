package com.busanit.travelapp.controller;

import com.busanit.travelapp.config.CustomOAuth2User;
import com.busanit.travelapp.entity.Reservation;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.ReservationRepository;
import com.busanit.travelapp.repository.UserRepository;
import com.busanit.travelapp.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationApiController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomService roomService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyReservations() {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String email = null;
            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
                email = oauth2User.getEmail();
            }

            if (email == null) {
                return ResponseEntity.status(401).body("사용자 정보를 찾을 수 없습니다.");
            }

            // 사용자 조회
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (!userOptional.isPresent()) {
                // 사용자가 없으면 빈 예약 목록 반환
                return ResponseEntity.ok(new ArrayList<>());
            }

            User user = userOptional.get();
            
            // 해당 사용자의 예약 목록 조회
            List<Reservation> reservations = reservationRepository.findByUserEmailOrderByCreateDayDesc(email);
            
            // DTO로 변환
            List<Map<String, Object>> reservationDTOs = new ArrayList<>();
            
            for (Reservation reservation : reservations) {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", reservation.getId());
                dto.put("hotelId", reservation.getHotel().getId());
                dto.put("hotelName", reservation.getHotel().getName());
                dto.put("roomName", reservation.getRoom().getName());
                dto.put("checkInDate", reservation.getCheckInDate());
                dto.put("checkOutDate", reservation.getCheckOutDate());
                dto.put("paymentId" , reservation.getPaymentId());
                
                // 숙박 기간 계산
                long nights = ChronoUnit.DAYS.between(reservation.getCheckInDate(), reservation.getCheckOutDate());
                dto.put("nights", nights);
                
                dto.put("totalPrice", reservation.getPrice());


                LocalDate current = LocalDate.now();

                dto.put("status", current.isAfter(reservation.getCheckInDate())?"isPast":"confirmed"); // 기본값으로 confirmed 설정 , 날짜 지나면 과거
                dto.put("createdAt", reservation.getCreateDay());
                
                reservationDTOs.add(dto);
            }

            return ResponseEntity.ok(reservationDTOs);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("예약 정보 조회 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String email = null;
            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
                email = oauth2User.getEmail();
            }

            if (email == null) {
                return ResponseEntity.status(401).body("사용자 정보를 찾을 수 없습니다.");
            }

            roomService.reservationDelete(id);

            return ResponseEntity.ok("예약이 취소되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("예약 취소 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationDetail(@PathVariable Long id) {
        try {
            // 현재 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal().equals("anonymousUser")) {
                return ResponseEntity.status(401).body("로그인이 필요합니다.");
            }

            String email = null;
            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
                email = oauth2User.getEmail();
            }

            if (email == null) {
                return ResponseEntity.status(401).body("사용자 정보를 찾을 수 없습니다.");
            }

            // 예약 조회
            Optional<Reservation> reservationOptional = reservationRepository.findById(id);
            if (!reservationOptional.isPresent()) {
                return ResponseEntity.status(404).body("예약을 찾을 수 없습니다.");
            }

            Reservation reservation = reservationOptional.get();
            
            // 예약 소유자 확인
            if (!reservation.getUserEmail().equals(email)) {
                return ResponseEntity.status(403).body("본인의 예약만 조회할 수 있습니다.");
            }

            // DTO로 변환
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", reservation.getId());
            dto.put("hotelId", reservation.getHotel().getId());
            dto.put("hotelName", reservation.getHotel().getName());
            dto.put("roomName", reservation.getRoom().getName());
            dto.put("checkInDate", reservation.getCheckInDate());
            dto.put("checkOutDate", reservation.getCheckOutDate());
            
            // 숙박 기간 계산
            long nights = ChronoUnit.DAYS.between(reservation.getCheckInDate(), reservation.getCheckOutDate());
            dto.put("nights", nights);
            
            dto.put("totalPrice", reservation.getPrice());
            dto.put("status", "confirmed");
            dto.put("createdAt", reservation.getCreateDay());

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("예약 상세 정보 조회 중 오류가 발생했습니다.");
        }
    }

} 