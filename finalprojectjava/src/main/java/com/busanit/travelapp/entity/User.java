package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
public class User {
    
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "user_name", nullable = false, unique = true)
    private String userName;
    
    @Column(name = "password", nullable = true)
    private String password;
    
    @Column(name = "display_name")
    private String displayName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.USER;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public User() {}
    
    // OAuth2용 생성자
    public User(String email, Role role) {
        this.email = email;
        this.userName = email.split("@")[0]; // 이메일의 @ 앞 부분을 userName으로 설정
        this.role = role;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
        public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        // userName이 null이면 email에서 추출
        if (userName == null && email != null) {
            userName = email.split("@")[0];
        }
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Role Enum
    public enum Role {
        USER, ADMIN
    }
} 