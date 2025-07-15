package com.trafik.teklif_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173") // dev front URL
            .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
            .allowCredentials(true);
  }

  // eğer prod ortamda React dist/ içeriğini direkt sunmak istersen:
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
      .addResourceHandler("/**")
      .addResourceLocations("classpath:/static/"); 
  }
}
