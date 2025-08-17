// src/main/java/com/trafik/teklif_api/dto/UpdatePolicyRequest.java
package com.trafik.teklif_api.dto;

import java.time.LocalDateTime;
import com.trafik.teklif_api.model.enums.PolicyStatus;

public record UpdatePolicyRequest(
    LocalDateTime endDate,
    PolicyStatus status
) {}
