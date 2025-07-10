package com.busanit.travelapp.service;

import com.busanit.travelapp.dto.HotelDTO;
import com.busanit.travelapp.dto.HotelImageDTO;
import com.busanit.travelapp.dto.RoomDTO;
import com.busanit.travelapp.dto.RoomImageDTO;
import com.busanit.travelapp.entity.*;
import com.busanit.travelapp.repository.HotelRepository;
import com.busanit.travelapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final S3Service s3Service;


    public List<HotelDTO> findAllAsDTO() {
        List<Hotel> hotelList = hotelRepository.findAll();
        return hotelList.stream()
                .map(this::convertToHotelDTO)
                .collect(Collectors.toList());
    }

    private HotelDTO convertToHotelDTO(Hotel hotel) {
        return HotelDTO.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .address(hotel.getAddress())
                .email(hotel.getEmail())
                .phone(hotel.getPhone())
                .breakfast(hotel.isBreakfast())
                .breakfastPrice(hotel.getBreakfastPrice())
                .description(hotel.getDescription())
                .images(hotel.getImages().stream().map(hotelImage -> {
                    HotelImageDTO hotelImageDTO = HotelImageDTO.builder()
                            .id(hotelImage.getId())
                            .imageUrl(hotelImage.getImageUrl())
                            .build();
                    return hotelImageDTO;
                }).collect(Collectors.toList())) // Assumes images are strings
                .rooms(hotel.getRooms().stream().map(room -> {
                    RoomDTO roomDTO = RoomDTO.builder()
                            .name(room.getName())
                            .capacity(room.getCapacity())
                            .bathrooms(room.getBathrooms())
                            .beds(room.getBeds())
                            .people(room.getPeople())
                            .id(room.getId())
                            .price(room.getPrice())
                            .roomImages(room.getRoomImages().stream().map(roomImage -> {
                                RoomImageDTO roomImageDTO = RoomImageDTO.builder()
                                        .id(roomImage.getId())
                                        .imageUrl(roomImage.getImageUrl())
                                        .build();
                                return roomImageDTO;
                            }).collect(Collectors.toList()))
                            .build();
                    return roomDTO;
                }).collect(Collectors.toList())).build();

    }

    @Transactional
    public void addHotel(HotelDTO hotelDTO) {
        // 호텔 기본 정보 저장
        Hotel hotel = Hotel.builder()
                .name(hotelDTO.getName())
                .address(hotelDTO.getAddress())
                .email(hotelDTO.getEmail())
                .phone(hotelDTO.getPhone())
                .breakfast(hotelDTO.isBreakfast())
                .breakfastPrice(hotelDTO.getBreakfastPrice())
                .description(hotelDTO.getDescription())
                .build();

        hotelRepository.save(hotel);

        // 호텔 이미지 저장
//        String hotelDirPath = "C:\\upload/hotels/" + hotel.getName();
//        File hotelDir = new File(hotelDirPath);
//        if (!hotelDir.exists()) {
//            hotelDir.mkdirs();
//        }

        List<HotelImage> hotelImages = new ArrayList<>();
        if (hotelDTO.getImagesFiles() != null && !hotelDTO.getImagesFiles().isEmpty()) {
            for (MultipartFile file : hotelDTO.getImagesFiles()) {
                try {
//                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//                    String filePath = hotelDirPath + "/" + fileName;
//                    File destFile = new File(filePath);
//                    file.transferTo(destFile);
                    String URL = s3Service.hotelUploadFile(file);

                    HotelImage hotelImage = HotelImage.builder()
                            .imageUrl(URL)
                            .hotel(hotel)
                            .build();
                    hotelImages.add(hotelImage);
                } catch (IOException e) {
                    System.err.println("호텔 이미지 저장 실패: " + e.getMessage());
                }
            }
        }

        // 객실 정보 저장
        List<Room> rooms = new ArrayList<>();
        if (hotelDTO.getRooms() != null) {
            for (RoomDTO roomDTO : hotelDTO.getRooms()) {
                Room room = Room.builder()
                        .name(roomDTO.getName())
                        .price(roomDTO.getPrice())
                        .capacity(roomDTO.getCapacity())
                        .beds(roomDTO.getBeds())
                        .bathrooms(roomDTO.getBathrooms())
                        .people(roomDTO.getPeople())
                        .hotel(hotel)
                        .build();

                // 객실 이미지 저장
//                String roomDirPath = hotelDirPath + "/rooms/" + room.getName();
//                File roomDir = new File(roomDirPath);
//                if (!roomDir.exists()) {
//                    roomDir.mkdirs();
//                }

                List<RoomImage> roomImages = new ArrayList<>();
                if (roomDTO.getRoomImagesFiles() != null) {
                    for (MultipartFile file : roomDTO.getRoomImagesFiles()) {
                        try {
//                            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//                            String filePath = roomDirPath + "/" + fileName;
//                            File destFile = new File(filePath);
//                            file.transferTo(destFile);

                            String URL = s3Service.hotelRoomUploadFile(file);

                            RoomImage roomImage = RoomImage.builder()
                                    .imageUrl(URL)
                                    .room(room)
                                    .build();
                            roomImages.add(roomImage);
                        } catch (IOException e) {
                            System.err.println("객실 이미지 저장 실패: " + e.getMessage());
                        }
                    }
                }
                room.setRoomImages(roomImages);
                rooms.add(room);
            }
        }

        hotel.setImages(hotelImages);
        hotel.setRooms(rooms);
        hotelRepository.save(hotel);

        System.out.println("호텔 저장 완료 ID: " + hotel.getId());
        System.out.println("이미지 개수: " + hotelImages.size());
        System.out.println("객실 개수: " + rooms.size());
    }

    public HotelDTO getHotel(Long id) {

        Hotel hotel = hotelRepository.findById(id).orElseThrow(RuntimeException::new);
        HotelDTO hotelDTO = convertToHotelDTO(hotel);

        return hotelDTO;

    }

    @Transactional
    public void updateHotel(Long id, HotelDTO hotelDTO) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("호텔을 찾을 수 없습니다."));

        // 호텔 기본 정보 업데이트
        hotel.setName(hotelDTO.getName());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setEmail(hotelDTO.getEmail());
        hotel.setPhone(hotelDTO.getPhone());
        hotel.setBreakfast(hotelDTO.isBreakfast());
        hotel.setBreakfastPrice(hotelDTO.getBreakfastPrice());
        hotel.setDescription(hotelDTO.getDescription());

        // 파일 저장 디렉토리 생성
//        String hotelDirPath = "C:\\upload/hotels/" + hotel.getName();
//        File hotelDir = new File(hotelDirPath);
//        if (!hotelDir.exists()) {
//            hotelDir.mkdirs();
//        }

        // 호텔 이미지 처리 (기존 이미지 + 새 이미지)
        List<HotelImage> allHotelImages = new ArrayList<>();
        
        // 1. 남아있는 기존 이미지 처리
        if (hotelDTO.getExistingImages() != null) {
            for (HotelImageDTO existingImageDTO : hotelDTO.getExistingImages()) {
                // 기존 이미지 중에서 남아있는 것들만 유지
                HotelImage existingImage = hotel.getImages().stream()
                        .filter(img -> img.getId().equals(existingImageDTO.getId()))
                        .findFirst()
                        .orElse(null);
                
                if (existingImage != null) {
                    allHotelImages.add(existingImage);
                }
            }
        }
        
        // 2. 새로 추가된 이미지 처리
        if (hotelDTO.getImagesFiles() != null && !hotelDTO.getImagesFiles().isEmpty()) {
            for (MultipartFile file : hotelDTO.getImagesFiles()) {
                try {
                    String URL = s3Service.hotelUploadFile(file);

                    HotelImage hotelImage = HotelImage.builder()
                            .imageUrl(URL)
                            .hotel(hotel)
                            .build();
                    allHotelImages.add(hotelImage);
                } catch (IOException e) {
                    System.err.println("호텔 이미지 저장 실패: " + e.getMessage());
                }
            }
        }
        
        // 3. 이미지 업데이트 - clear() 제거하고 개별 관리
        // hotel.getImages().clear(); ← 이 부분이 문제였음! 주석처리
        
        // 기존 이미지 중 제거할 이미지들 찾기
        List<HotelImage> imagesToRemove = hotel.getImages().stream()
                .filter(existingImg -> allHotelImages.stream()
                        .noneMatch(newImg -> newImg.getId() != null && newImg.getId().equals(existingImg.getId())))
                .collect(Collectors.toList());
        
        // 제거할 이미지들 삭제
        for (HotelImage imageToRemove : imagesToRemove) {
            hotel.getImages().remove(imageToRemove);
            s3Service.s3delete(imageToRemove.getImageUrl());
        }
        
        // 새 이미지들 추가
        for (HotelImage hotelImage : allHotelImages) {
            if (hotelImage.getId() == null) { // 새 이미지만 추가
                hotelImage.setHotel(hotel);
                hotel.getImages().add(hotelImage);
            }
        }

        // 객실 정보 업데이트 (프론트엔드에서 보낸 객실들만 유지)
        if (hotelDTO.getRooms() != null) {
            List<Room> updatedRooms = new ArrayList<>();
            
            for (RoomDTO roomDTO : hotelDTO.getRooms()) {
                Room room;
                
                // 기존 룸이 있으면 업데이트, 없으면 새로 생성
                if (roomDTO.getId() != null) {
                    // 기존 룸 찾기
                    room = hotel.getRooms().stream()
                            .filter(r -> r.getId().equals(roomDTO.getId()))
                            .findFirst()
                            .orElse(null);
                    
                    if (room != null) {
                        // 기존 룸 정보 업데이트
                        room.setName(roomDTO.getName());
                        room.setPrice(roomDTO.getPrice());
                        room.setCapacity(roomDTO.getCapacity());
                        room.setBeds(roomDTO.getBeds());
                        room.setBathrooms(roomDTO.getBathrooms());
                        room.setPeople(roomDTO.getPeople());
                    } else {
                        // ID가 있지만 찾을 수 없는 경우 새로 생성
                        room = Room.builder()
                                .name(roomDTO.getName())
                                .price(roomDTO.getPrice())
                                .capacity(roomDTO.getCapacity())
                                .beds(roomDTO.getBeds())
                                .bathrooms(roomDTO.getBathrooms())
                                .people(roomDTO.getPeople())
                                .hotel(hotel)
                                .build();
                    }
                } else {
                    // 새 룸 생성
                    room = Room.builder()
                            .name(roomDTO.getName())
                            .price(roomDTO.getPrice())
                            .capacity(roomDTO.getCapacity())
                            .beds(roomDTO.getBeds())
                            .bathrooms(roomDTO.getBathrooms())
                            .people(roomDTO.getPeople())
                            .hotel(hotel)
                            .build();
                }

                // 룸 이미지 처리 (기존 이미지 + 새 이미지)
                List<RoomImage> allRoomImages = new ArrayList<>();
                
                // 1. 남아있는 기존 룸 이미지 처리
                if (roomDTO.getExistingRoomImages() != null && !roomDTO.getExistingRoomImages().isEmpty()) {
                    for (String existingImageUrl : roomDTO.getExistingRoomImages()) {
                        // 기존 룸 이미지 중에서 남아있는 것들만 유지
                        RoomImage existingRoomImage = room.getRoomImages() != null ? 
                            room.getRoomImages().stream()
                                .filter(img -> img.getImageUrl().equals(existingImageUrl))
                                .findFirst()
                                .orElse(null) : null;
                        
                        if (existingRoomImage != null) {
                            allRoomImages.add(existingRoomImage);
                        }
                    }
                }
                
                // 2. 새로 추가된 룸 이미지 처리
                if (roomDTO.getRoomImagesFiles() != null && !roomDTO.getRoomImagesFiles().isEmpty()) {
                    // 객실 이미지 저장
//                    String roomDirPath = hotelDirPath + "/rooms/" + room.getName();
//                    File roomDir = new File(roomDirPath);
//                    if (!roomDir.exists()) {
//                        roomDir.mkdirs();
//                    }

                    for (MultipartFile file : roomDTO.getRoomImagesFiles()) {
                        try {
                            String URL = s3Service.hotelRoomUploadFile(file);

                            RoomImage roomImage = RoomImage.builder()
                                    .imageUrl(URL)
                                    .room(room)
                                    .build();
                            allRoomImages.add(roomImage);
                        } catch (IOException e) {
                            System.err.println("객실 이미지 저장 실패: " + e.getMessage());
                        }
                    }
                }
                
                // 3. 룸 이미지 업데이트 - clear() 제거하고 개별 관리
                if (room.getRoomImages() == null) {
                    room.setRoomImages(new ArrayList<>());
                }
                
                // 기존 룸 이미지 중 제거할 이미지들 찾기
                List<RoomImage> roomImagesToRemove = room.getRoomImages().stream()
                        .filter(existingImg -> allRoomImages.stream()
                                .noneMatch(newImg -> newImg.getId() != null && newImg.getId().equals(existingImg.getId())))
                        .collect(Collectors.toList());
                
                // 제거할 룸 이미지들 삭제
                for (RoomImage imageToRemove : roomImagesToRemove) {
                    s3Service.s3delete(imageToRemove.getImageUrl());
                    room.getRoomImages().remove(imageToRemove);
                }
                
                // 새 룸 이미지들 추가
                for (RoomImage roomImage : allRoomImages) {
                    if (roomImage.getId() == null) { // 새 이미지만 추가
                        roomImage.setRoom(room);
                        room.getRoomImages().add(roomImage);
                    }
                }
                
                updatedRooms.add(room);
            }
            
            // 객실 업데이트 - clear() 제거하고 개별 관리
            // 기존 객실 중 제거할 객실들 찾기
            List<Room> roomsToRemove = hotel.getRooms().stream()
                    .filter(existingRoom -> updatedRooms.stream()
                            .noneMatch(newRoom -> newRoom.getId() != null && newRoom.getId().equals(existingRoom.getId())))
                    .collect(Collectors.toList());
            
            // 제거할 객실들 삭제
            for (Room roomToRemove : roomsToRemove) {
                for (RoomImage imageToRemove : roomToRemove.getRoomImages()) {
                    s3Service.s3delete(imageToRemove.getImageUrl());

                }
                hotel.getRooms().remove(roomToRemove);
            }
            
            // 새 객실들 추가
            for (Room room : updatedRooms) {
                if (room.getId() == null) { // 새 객실만 추가
                    room.setHotel(hotel);
                    hotel.getRooms().add(room);
                }
            }
        }


        hotelRepository.save(hotel);

        System.out.println("호텔 수정 완료 ID: " + hotel.getId());
    }

    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("호텔을 찾을 수 없습니다."));
        
        // 호텔과 관련된 파일들 삭제 (선택사항)
//        try {
//            String hotelDirPath = "C:\\upload/hotels/" + hotel.getName();
//            File hotelDir = new File(hotelDirPath);
//            if (hotelDir.exists()) {
//                deleteDirectory(hotelDir);
//            }
//        } catch (Exception e) {
//            System.err.println("호텔 파일 삭제 실패: " + e.getMessage());
//        }
        List<HotelImage> hotelImages = hotel.getImages();
        for(HotelImage hotelImage : hotelImages) {
            String URL1 = hotelImage.getImageUrl();
            s3Service.s3delete(URL1);
        }

        List<Room> rooms = hotel.getRooms();
        for(Room room : rooms) {
            for(RoomImage roomImage : room.getRoomImages()) {
                s3Service.s3delete(roomImage.getImageUrl());
            }
        }

        List<HotelReview> hotelReviews = hotel.getReviews();
        for(HotelReview review : hotelReviews) {
            for(HotelReviewImage reviewImage : review.getImages()) {
                String URL2 = reviewImage.getImageUrl();
                s3Service.s3delete(URL2);
            }
        }
        // 데이터베이스에서 호텔 삭제 (Cascade로 관련 이미지, 객실 등도 함께 삭제됨)
        hotelRepository.delete(hotel);
        
        System.out.println("호텔 삭제 완료 ID: " + id);
    }
    
//    private void deleteDirectory(File directory) {
//        if (directory.exists()) {
//            File[] files = directory.listFiles();
//            if (files != null) {
//                for (File file : files) {
//                    if (file.isDirectory()) {
//                        deleteDirectory(file);
//                    } else {
//                        file.delete();
//                    }
//                }
//            }
//            directory.delete();
//        }
//    }



}
