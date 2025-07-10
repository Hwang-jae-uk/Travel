package com.busanit.travelapp.dto;


import com.busanit.travelapp.entity.Room;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomInventoryDTO {
    private Long id;
    private LocalDate date;
    private Integer availableCount;
    private Integer reservedCount;
    private Integer totalCount;
    private Long roomId;

}
