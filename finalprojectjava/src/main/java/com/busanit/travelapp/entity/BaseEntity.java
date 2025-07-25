package com.busanit.travelapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
public class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDay;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime updateDay;

}
