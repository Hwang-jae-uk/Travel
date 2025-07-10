# Travel App Backend (Spring Boot)

## 🚀 프로젝트 개요
React 프론트엔드와 연동되는 여행 관련 Spring Boot 백엔드 애플리케이션입니다.

## 🛠 기술 스택
- **Spring Boot 3.5.0**
- **Java 21**
- **Spring Security + OAuth2**
- **Spring Data JPA**
- **MySQL 8.0**
- **JWT Authentication**

## 🔧 설정 및 실행

### 1. 데이터베이스 설정
```sql
CREATE DATABASE finalproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 애플리케이션 실행
```bash
./gradlew bootRun
```

### 3. 포트
- 백엔드: `http://localhost:8080`
- 프론트엔드: `http://localhost:3000` (별도 프로젝트)

## 🔐 OAuth2 로그인
- **Google OAuth2** 지원
- **Naver OAuth2** 지원

### OAuth2 엔드포인트
- Google 로그인: `/oauth2/authorization/google`
- Naver 로그인: `/oauth2/authorization/naver`

## 📚 API 엔드포인트

### 인증 관련
- `GET /api/auth/status` - 인증 상태 확인
- `POST /api/auth/logout` - 로그아웃

### 호텔 관련
- `GET /api/hotels/**` - 호텔 관련 API

## 🗂 프로젝트 구조
```
src/main/java/com/busanit/travelapp/
├── config/           # 보안 및 OAuth2 설정
├── controller/       # REST API 컨트롤러
├── entity/          # JPA 엔티티
├── repository/      # 데이터 접근 계층
├── service/         # 비즈니스 로직
└── Test06022Application.java
```

## 🌟 주요 기능
- OAuth2 소셜 로그인 (Google, Naver)
- JWT 토큰 기반 인증
- CORS 설정으로 React 앱과 연동
- JPA를 통한 데이터베이스 자동 관리

## 📝 개발 노트
- `hibernate.ddl-auto=update`로 테이블 자동 생성
- Profile 설정: `db`, `ouath2`
- React 프론트엔드와 포트 3000에서 연동 