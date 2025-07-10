package com.busanit.travelapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(
    name = "room_inventory",
    uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "date"})
)
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class RoomInventory extends BaseEntity {


    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventory_id")
    private Long id;                        // 재고 ID
    
    @Column(name = "date", nullable = false)
    private LocalDate date;                 // 해당 날짜
    
    @Column(name = "available_count", nullable = false)
    private Integer availableCount;     // 예약 가능한 룸 개수
    
    @Column(name = "total_count", nullable = false)
    private Integer totalCount;         // 전체 룸 개수 (기본값 1개)

    @Column(name = "reserved_count", nullable = false)
    private Integer reservedCount;      // 예약된 룸 개수
    
    // 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;                      // 해당 룸

    @PrePersist
    public void prePersist() {
        if (this.room != null) {
            if (this.totalCount == null) {
                this.totalCount = this.room.getCapacity();
            }
            if (this.reservedCount == null) {
                this.reservedCount = 1;
            }
            if (this.availableCount == null) {
                this.availableCount = this.room.getCapacity() - this.reservedCount;
            }
        }
    }

} 