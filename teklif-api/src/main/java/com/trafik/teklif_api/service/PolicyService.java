// src/main/java/com/trafik/teklif_api/service/PolicyService.java
package com.trafik.teklif_api.service;

import com.trafik.teklif_api.dto.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PolicyService {
    PolicyResponse create(CreatePolicyRequest req);
    List<PolicyResponse> getAll(int page, int size);
    Optional<PolicyResponse> getById(UUID id);
    PolicyResponse update(UUID id, UpdatePolicyRequest req);
    void delete(UUID id);
    PolicyResponse renew(UUID id);
    List<PolicyResponse> getExpiring();
    List<PolicyResponse> search(Optional<UUID> customerId,
                                Optional<LocalDate> from,
                                Optional<LocalDate> to,
                                int page,
                                int size);
}
