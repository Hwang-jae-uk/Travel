package com.busanit.travelapp.controller;

import com.busanit.travelapp.config.CustomOAuth2User;
import com.busanit.travelapp.entity.TrainBasket;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.TrainBasketRepository;
import com.busanit.travelapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/train-reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainReservationApiController {

    @Autowired
    private TrainBasketRepository trainBasketRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<?> getMyTrainReservations() {
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

            // 해당 사용자의 기차 예약 목록 조회 (TrainBasket에서 결제 완료된 것들)
            // TrainBasket은 username 필드를 사용하므로 email에서 사용자명 추출
            String username = email;
            List<TrainBasket> trainBaskets = trainBasketRepository.findByUsernameOrderByIdDesc(username);

            // DTO로 변환
            List<Map<String, Object>> reservationDTOs = new ArrayList<>();

            for (TrainBasket basket : trainBaskets) {
                // 결제 완료된 예약만 포함 (pay 필드가 1이면 결제 완료)
                if (basket.getPay() != null && basket.getPay() == 1) {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", basket.getId());
                    dto.put("trainName", basket.getTrainline() != null ? basket.getTrainline() : "KTX");
                    dto.put("departureStation", basket.getDepartstation());
                    dto.put("arrivalStation", basket.getArrivestation());
                    dto.put("departureTime", basket.getDepartdate());
                    dto.put("arrivalTime", basket.getArrivedate());
                    dto.put("seatInfo", basket.getSeatnumber());
                    dto.put("totalPrice", basket.getFare());

                    LocalDate current = LocalDate.now();
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
                    String rawDate = basket.getTraveldate().split(" ")[0];
                    LocalDate travelDate = LocalDate.parse(rawDate, formatter);

                    dto.put("status", current.isAfter(travelDate)?"isPast":"confirmed"); // 기본값으로 confirmed 설정 , 날짜 지나면 과거
                    dto.put("createdAt", basket.getTraveldate());
                    dto.put("paymentid", basket.getPaymentid());
                    dto.put("trainNumber", basket.getTrainnumber());
                    dto.put("travelDate", basket.getTraveldate());
                    dto.put("PassengerType", basket.getPassengertype());






                    reservationDTOs.add(dto);
                }
            }

            return ResponseEntity.ok(reservationDTOs);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("기차 예약 정보 조회 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelTrainReservation(@PathVariable Long id) {
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

            // 기차 예약 조회
            Optional<TrainBasket> basketOptional = trainBasketRepository.findById(id);
            if (!basketOptional.isPresent()) {
                return ResponseEntity.status(404).body("기차 예약을 찾을 수 없습니다.");
            }

            TrainBasket basket = basketOptional.get();

            // 예약 소유자 확인
            String username = email.split("@")[0];
            if (!basket.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("본인의 예약만 취소할 수 있습니다.");
            }

            // 예약 삭제
            trainBasketRepository.delete(basket);

            return ResponseEntity.ok("기차 예약이 취소되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("기차 예약 취소 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTrainReservationDetail(@PathVariable Long id) {
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

            // 기차 예약 조회
            Optional<TrainBasket> basketOptional = trainBasketRepository.findById(id);
            if (!basketOptional.isPresent()) {
                return ResponseEntity.status(404).body("기차 예약을 찾을 수 없습니다.");
            }

            TrainBasket basket = basketOptional.get();

            // 예약 소유자 확인
            String username = email.split("@")[0];
            if (!basket.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("본인의 예약만 조회할 수 있습니다.");
            }

            // DTO로 변환
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", basket.getId());
            dto.put("trainName", basket.getTrainline() != null ? basket.getTrainline() : "KTX");
            dto.put("departureStation", basket.getDepartstation());
            dto.put("arrivalStation", basket.getArrivestation());
            dto.put("departureTime", basket.getDepartdate());
            dto.put("arrivalTime", basket.getArrivedate());
            dto.put("seatInfo", basket.getSeatnumber());
            dto.put("totalPrice", basket.getFare());
            dto.put("status", "confirmed");
            dto.put("createdAt", basket.getTraveldate());

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("기차 예약 상세 정보 조회 중 오류가 발생했습니다.");
        }
    }
} 