// src/main/java/com/trafik/teklif_api/repository/CustomerNoteRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.CustomerNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerNoteRepository extends JpaRepository<CustomerNote, UUID> {
    List<CustomerNote> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
}

