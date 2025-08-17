package com.trafik.teklif_api.dto.policy;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record CreatePolicyFromQuoteRequest(
    @NotNull UUID quoteId,
    @NotNull LocalDate startDate
) {}
