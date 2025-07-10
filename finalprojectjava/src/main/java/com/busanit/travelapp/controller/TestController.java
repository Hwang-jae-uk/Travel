package com.busanit.travelapp.controller;

import com.busanit.travelapp.entity.User;
import com.busanit.travelapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/hello")
    public String hello() {
        return "Spring Boot 서버가 정상 동작합니다! 🚀";
    }
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @PostMapping("/user")
    public User createTestUser(@RequestParam String email) {
        User user = new User(email, User.Role.USER);
        return userRepository.save(user);
    }
    
    @GetMapping("/db-test")
    public String testDatabase() {
        try {
            long count = userRepository.count();
            return "데이터베이스 연결 성공! 사용자 수: " + count;
        } catch (Exception e) {
            return "데이터베이스 연결 실패: " + e.getMessage();
        }
    }
} 