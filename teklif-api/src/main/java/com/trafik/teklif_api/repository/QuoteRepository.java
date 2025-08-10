package com.trafik.teklif_api.repository;

import com.trafik.teklif_api.entity.Quote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuoteRepository
        extends JpaRepository<Quote, String>, JpaSpecificationExecutor<Quote> {

    @EntityGraph(attributePaths = {"driver", "vehicle"})
    List<Quote> findTop10ByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"driver", "vehicle"})
    List<Quote> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    // getAll(page,size) için kullandığımız imza
    @EntityGraph(attributePaths = {"driver", "vehicle"})
    Page<Quote> findAllBy(Pageable pageable);
}
