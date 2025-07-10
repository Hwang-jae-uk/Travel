package com.busanit.travelapp.repository;

import com.busanit.travelapp.entity.Room;
import com.busanit.travelapp.entity.RoomInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface RoomInventoryRepository extends JpaRepository<RoomInventory, Long> {

    Optional<RoomInventory> findByRoomAndDate(Room room, LocalDate date);
}
