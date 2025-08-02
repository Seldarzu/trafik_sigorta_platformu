// src/main/java/com/trafik/teklif_api/repository/DriverRepository.java
package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    /**
     * Verilen teklif ID’sine ait şoförü getirir.
     */
    Optional<Driver> findByQuoteId(Long quoteId);
}
