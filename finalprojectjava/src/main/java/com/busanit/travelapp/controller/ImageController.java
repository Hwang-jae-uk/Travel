package com.busanit.travelapp.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final Path uploadDir = Paths.get("C:/upload");

    @GetMapping("/upload/{type}/{Name}/{filename:.+}")
    public ResponseEntity<Resource> serveImage(
            @PathVariable String type,
            @PathVariable String Name,
            @PathVariable String filename) {
        try {
            // 이미지 파일 경로 구성
            Path imagePath = uploadDir.resolve(type).resolve(Name).resolve(filename);
            Resource resource = new UrlResource(imagePath.toUri());

            // 파일이 존재하고 읽을 수 있는지 확인
            if (resource.exists() && resource.isReadable()) {
                // 파일 확장자에 따라 적절한 MediaType 설정
                String contentType = getContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/upload/{type}/{hotelName}/rooms/{roomName}/{filename:.+}")
    public ResponseEntity<Resource> serveRoomImage(
            @PathVariable String type,
            @PathVariable String hotelName,
            @PathVariable String roomName,
            @PathVariable String filename) {
        try {
            // 객실 이미지 파일 경로 구성
            Path imagePath = uploadDir.resolve(type)
                    .resolve(hotelName)
                    .resolve("rooms")
                    .resolve(roomName)
                    .resolve(filename);
            Resource resource = new UrlResource(imagePath.toUri());

            // 파일이 존재하고 읽을 수 있는지 확인
            if (resource.exists() && resource.isReadable()) {
                // 파일 확장자에 따라 적절한 MediaType 설정
                String contentType = getContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/review/{filename:.+}")
    public ResponseEntity<Resource> serveReviewImage(@PathVariable String filename) {
        try {
            // 리뷰 이미지 파일 경로 구성 (upload/review/ 디렉토리)
            Path imagePath = Paths.get("upload/review").resolve(filename);
            System.out.println("리뷰 이미지 요청 - 파일명: " + filename);
            System.out.println("리뷰 이미지 경로: " + imagePath.toAbsolutePath());
            
            Resource resource = new UrlResource(imagePath.toUri());

            // 파일이 존재하고 읽을 수 있는지 확인
            if (resource.exists() && resource.isReadable()) {
                System.out.println("리뷰 이미지 찾음: " + filename);
                // 파일 확장자에 따라 적절한 MediaType 설정
                String contentType = getContentType(filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                System.out.println("리뷰 이미지 파일을 찾을 수 없음: " + imagePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            System.out.println("리뷰 이미지 로드 중 오류: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private String getContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "application/octet-stream";
        }
    }
} 