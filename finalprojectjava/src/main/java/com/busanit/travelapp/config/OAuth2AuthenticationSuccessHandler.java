package com.busanit.travelapp.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        logger.info("OAuth2 인증 성공!");
        
        try {
            CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
            logger.info("인증된 사용자: {}, 권한: {}", oauthUser.getEmail(), oauthUser.getRole());
            
            // React 앱으로 리다이렉트 (인증 성공 페이지)
            String redirectUrl = "http://localhost:3000/login/success?email=" + oauthUser.getEmail();
            
            logger.info("리다이렉트 URL: {}", redirectUrl);
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            
        } catch (Exception e) {
            logger.error("OAuth2 인증 성공 처리 중 오류 발생", e);
            
            // 오류 시 에러 페이지로 리다이렉트
            String errorUrl = "http://localhost:3000/login/error?message=" + 
                            java.net.URLEncoder.encode(e.getMessage(), "UTF-8");
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }
} 