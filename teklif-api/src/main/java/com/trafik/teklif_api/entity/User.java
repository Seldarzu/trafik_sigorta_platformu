package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name="first_name", nullable=false)
    private String firstName;

    @Column(name="last_name", nullable=false)
    private String lastName;

    @Column(nullable=false, unique=true)
    private String email;
}
