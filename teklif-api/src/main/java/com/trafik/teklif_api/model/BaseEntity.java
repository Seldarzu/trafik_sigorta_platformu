package com.trafik.teklif_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import java.time.OffsetDateTime;
import java.util.UUID;

@MappedSuperclass @Getter @Setter
public abstract class BaseEntity {
  @Id @UuidGenerator @Column(columnDefinition="uuid") private UUID id;
  @CreationTimestamp @Column(name="created_at", nullable=false, columnDefinition="timestamptz") private OffsetDateTime createdAt;
  @UpdateTimestamp  @Column(name="updated_at", nullable=false, columnDefinition="timestamptz") private OffsetDateTime updatedAt;
}
