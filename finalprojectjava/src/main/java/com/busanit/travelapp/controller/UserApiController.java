package com.busanit.travelapp.controller;

import com.busanit.travelapp.config.CustomOAuth2User;
import com.busanit.travelapp.dto.UserInfoDTO;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.UserRepository;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserApiController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo() {
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

            // 데이터베이스에서 사용자 정보 조회
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            Map<String, Object> userInfo = new HashMap<>();
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                userInfo.put("email", user.getEmail());
                userInfo.put("name", user.getUserName());
                userInfo.put("displayName", user.getDisplayName());
                userInfo.put("joinDate", user.getCreatedAt());
                userInfo.put("role", user.getRole());
            } else {
                // 데이터베이스에 없다면 기본 정보만 반환
                userInfo.put("email", email);
                userInfo.put("name", email.split("@")[0]);
                userInfo.put("displayName", email.split("@")[0]);
                userInfo.put("joinDate", LocalDateTime.now());
                userInfo.put("role", "USER");
            }

            return ResponseEntity.ok(userInfo);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("사용자 정보 조회 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
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

            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("사용자 프로필 조회 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getUserInfo(@AuthenticationPrincipal CustomOAuth2User oauth2User) {
        return ResponseEntity.ok(new UserInfoDTO(oauth2User.getEmail()));
    }

    @PutMapping("/nickname")
    public ResponseEntity<?> updateNickname(@RequestBody Map<String, String> payload) {
        try {
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

            String newNickname = payload.get("nickname");
            if (newNickname == null || newNickname.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("닉네임은 비워둘 수 없습니다.");
            }

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Update display_name instead of user_name
                user.setDisplayName(newNickname);
                userRepository.save(user);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "닉네임이 성공적으로 변경되었습니다.");
                response.put("nickname", newNickname);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("닉네임 변경 중 오류가 발생했습니다.");
        }
    }
} 