// src/main/java/com/trafik/teklif_api/dto/SelectCompanyRequest.java
package com.trafik.teklif_api.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record SelectCompanyRequest(@NotNull UUID companyId) {}
