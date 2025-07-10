package com.busanit.travelapp.service;

import com.busanit.travelapp.config.CustomOAuth2User;
import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        logger.info("OAuth2 사용자 정보 로드 시작");
        
        try {
            OAuth2User oauth2User = super.loadUser(userRequest);
            
            // 제공자별 이메일 추출
            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            String email = extractEmail(oauth2User, registrationId);
            
            logger.info("OAuth2 사용자 이메일: {}, 제공자: {}", email, registrationId);
            
            // 사용자 정보 저장 또는 업데이트
            User user = saveOrUpdateUser(email);
            
            logger.info("사용자 정보 처리 완료: {}", user.getEmail());
            
            return new CustomOAuth2User(oauth2User, user.getEmail(), user.getRole().name());
            
        } catch (Exception e) {
            logger.error("OAuth2 사용자 정보 처리 중 오류 발생", e);
            throw new OAuth2AuthenticationException("OAuth2 사용자 정보 처리 실패: " + e.getMessage());
        }
    }
    
    private String extractEmail(OAuth2User oauth2User, String registrationId) {
        if ("google".equals(registrationId)) {
            return oauth2User.getAttribute("email");
        } else if ("naver".equals(registrationId)) {
            Map response = oauth2User.getAttribute("response");
            return (String) response.get("email");
        }
        throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 제공자: " + registrationId);
    }
    
    private User saveOrUpdateUser(String email) {
        return userRepository.findByEmail(email)
                .map(existingUser -> {
                    // 기존 사용자의 userName이 null이면 설정
                    if (existingUser.getUserName() == null || existingUser.getUserName().isEmpty()) {
                        existingUser.setUserName(email.split("@")[0]);
                        return userRepository.save(existingUser);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    logger.info("새 사용자 생성: {}", email);
                    User newUser = new User(email, User.Role.USER);
                    return userRepository.save(newUser);
                });
    }
} 