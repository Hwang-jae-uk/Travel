package com.busanit.travelapp.controller;

import com.busanit.travelapp.dto.CafeDTO;
import com.busanit.travelapp.service.CafeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafe")
@RequiredArgsConstructor
public class CafeApiController {

    private final CafeService cafeService;

    @GetMapping("/list")
    public ResponseEntity<List<CafeDTO>> getAllCafes() {
        List<CafeDTO> cafes = cafeService.findAllAsDTO();
        return ResponseEntity.ok(cafes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CafeDTO> getCafe(@PathVariable Long id) {
        CafeDTO cafe = cafeService.getCafe(id);
        return ResponseEntity.ok(cafe);
    }

    @PostMapping
    public ResponseEntity<String> createCafe(CafeDTO cafeDTO) {
        try {
            cafeService.addCafe(cafeDTO);
            return ResponseEntity.ok("카페가 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("카페 등록 실패: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCafe(@PathVariable Long id, @ModelAttribute CafeDTO cafeDTO) {
        try {
            cafeService.updateCafe(id, cafeDTO);
            return ResponseEntity.ok("카페가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("카페 수정 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCafe(@PathVariable Long id) {
        try {
            cafeService.deleteCafe(id);
            return ResponseEntity.ok("카페가 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("카페 삭제 실패: " + e.getMessage());
        }
    }
} 