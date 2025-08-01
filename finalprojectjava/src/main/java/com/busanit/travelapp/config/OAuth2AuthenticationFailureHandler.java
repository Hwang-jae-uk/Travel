package com.busanit.travelapp.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationFailureHandler.class);
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        
        logger.error("OAuth2 인증 실패: {}", exception.getMessage(), exception);
        
        // React 앱의 에러 페이지로 리다이렉트
        String errorUrl = "http://localhost:3000/login/error?message=" + 
                         java.net.URLEncoder.encode(exception.getMessage(), "UTF-8");
        
        logger.info("오류 리다이렉트 URL: {}", errorUrl);
        getRedirectStrategy().sendRedirect(request, response, errorUrl);
    }
} 