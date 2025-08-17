package com.trafik.teklif_api.dto.analytics;

import java.util.List;

public record AnalyticsResponse(
        long totalCustomers,
        long totalPolicies,
        long totalQuotes,
        long pendingQuotes,
        long approvedQuotes,
        double totalRevenue,
        List<RecentQuote> recentQuotes
) {
    public record RecentQuote(
            String id,
            String plateNumber,
            double finalPremium,
            String createdAt
    ) {}
}
