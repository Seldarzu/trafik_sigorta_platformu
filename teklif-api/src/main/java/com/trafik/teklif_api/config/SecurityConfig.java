// src/main/java/com/trafik/teklif_api/config/SecurityConfig.java
package com.trafik.teklif_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          // CORS kurallarını uygula ( aşağıdaki corsConfigurationSource bean’i )
          .cors(Customizer.withDefaults())

          // CSRF kapalı (stateless API için)
          .csrf(csrf -> csrf.disable())

          // Oturum yönetimi stateless
          .sessionManagement(sm -> sm
              .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
          )

          // Form-login kapalı
          .formLogin(form -> form.disable())

          // Basic auth kapalı
          .httpBasic(basic -> basic.disable())

          // Yetkilendirme kuralları
          .authorizeHttpRequests(auth -> auth
              // React uygulaması ve API:
              .requestMatchers(
                  "/api/**",
                  // Swagger/OpenAPI UI ve JSON uç noktaları
                  "/swagger-ui.html",
                  "/swagger-ui/**",
                  "/v3/api-docs/**",
                  "/v3/api-docs.yaml",
                  "/webjars/**"
              ).permitAll()
              // Geri kalan her şeye authentication şartı
              .anyRequest().authenticated()
          );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // React geliştirme sunucusu
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Tüm path’ler için CORS ayarlarını uygula
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
