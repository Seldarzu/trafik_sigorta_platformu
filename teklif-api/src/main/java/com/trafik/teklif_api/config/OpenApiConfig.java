package com.trafik.teklif_api.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
  @Bean
  public OpenAPI apiInfo() {
    return new OpenAPI()
      .info(new Info()
        .title("Trafik Sigorta Teklif Platformu API")
        .version("1.0.0")
        .description("Acentelerin trafik sigortasi tekliflerini yöneten REST API"));
  }
}
