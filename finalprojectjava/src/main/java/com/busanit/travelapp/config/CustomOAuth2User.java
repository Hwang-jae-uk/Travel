package com.busanit.travelapp.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

public class CustomOAuth2User implements OAuth2User {
    
    private final OAuth2User oauth2User;
    private final String email;
    private final String role;
    
    public CustomOAuth2User(OAuth2User oauth2User, String email, String role) {
        this.oauth2User = oauth2User;
        this.email = email;
        this.role = role;
    }
    
    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
        return authorities;
    }
    
    @Override
    public String getName() {
        return email;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getRole() {
        return role;
    }
} 