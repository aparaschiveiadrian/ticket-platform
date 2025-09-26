package com.adrianaparaschivei.ticketservice.config;

import com.adrianaparaschivei.ticketservice.filters.UserProvisioningFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain filterChain(
      HttpSecurity http,
      UserProvisioningFilter userProvisioningFilter,
      JwtAuthConverter jwtAuthConverter)
      throws Exception {
    // all requests should be authenticated
    http.authorizeHttpRequests(
            authorize ->
                authorize
                    .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**")
                    .permitAll()
                    .requestMatchers("/api/v1/events")
                    .hasRole("ORGANIZER")
                    .requestMatchers("/api/v1/ticket-validations/**")
                    .hasRole("STAFF")

                    // catch-all: any other request must be authenticated
                    .anyRequest()
                    .authenticated())
        // no CSRF protection because we use JWT tokens(stateless), so no need for it since no
        // sessions
        .csrf(csrf -> csrf.disable())
        // enable CORS
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // make sure we use stateless session, session won't be used to store user's state.
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(
            oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)))
        .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class);
    return http.build();
  }
}
