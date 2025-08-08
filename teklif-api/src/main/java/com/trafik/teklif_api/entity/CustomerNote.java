// src/main/java/com/trafik/teklif_api/entity/CustomerNote.java
package com.trafik.teklif_api.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_notes")
public class CustomerNote {
    @Id
    @Column(columnDefinition="uuid")
    private UUID id;

    @ManyToOne
    @JoinColumn(name="customer_id", nullable=false)
    private Customer customer;

    @Column(name="note", nullable=false, columnDefinition="TEXT")
    private String note;

    @Column(name="created_at", nullable=false)
    private OffsetDateTime createdAt;

    public CustomerNote() { }

    @PrePersist
    void onCreate() {
        this.id = UUID.randomUUID();
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
