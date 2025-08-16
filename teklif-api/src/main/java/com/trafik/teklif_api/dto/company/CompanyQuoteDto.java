// src/main/java/com/trafik/teklif_api/dto/quote/CompanyQuoteDto.java
package com.trafik.teklif_api.dto.company;

import java.math.BigDecimal;
import java.util.UUID;

public record CompanyQuoteDto(
        UUID companyId,
        String companyName,
        BigDecimal premium,       // ham prim
        BigDecimal finalPremium,  // indirim/çarpan sonrası net prim
        BigDecimal coverageAmount // kişi başı bedeni zarar teminatı (UI bundan türetiyor)
) {}
