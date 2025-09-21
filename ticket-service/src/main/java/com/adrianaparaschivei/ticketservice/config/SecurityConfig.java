package com.adrianaparaschivei.ticketservice.config;

import com.adrianaparaschivei.ticketservice.filters.UserProvisioningFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(
      HttpSecurity http, UserProvisioningFilter userProvisioningFilter) throws Exception {
    // all requests should be authenticated
    http.authorizeHttpRequests(authorize -> authorize
                    .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll()
                    // catch-all: any other request must be authenticated
                    .anyRequest().authenticated())
        // no CSRF protection because we use JWT tokens(stateless), so no need for it since no
        // sessions
        .csrf(csrf -> csrf.disable())
        // make sure we use stateless session, session won't be used to store user's state.
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class);
    return http.build();
  }
}
