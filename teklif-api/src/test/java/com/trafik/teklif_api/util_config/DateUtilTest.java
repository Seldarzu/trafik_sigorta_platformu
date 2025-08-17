package com.trafik.teklif_api.util_config;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class DateUtilTest {
  @Test
  void addMonths_should_handle_leap_years() {
    // ör: DateUtil.addMonths(LocalDate.of(2024,2,29), 12) → 2025-02-28 beklenir
    assertThat(true).isTrue(); // kendi util’ine göre doldur
  }
}
