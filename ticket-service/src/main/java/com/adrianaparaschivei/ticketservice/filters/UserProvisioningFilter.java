package com.adrianaparaschivei.ticketservice.filters;

import com.adrianaparaschivei.ticketservice.model.entity.User;
import com.adrianaparaschivei.ticketservice.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

// a Spring Security filter which is run once per request for each HTTP request
@Component
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter {

  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    // extracting the authentication object from the security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null
        && authentication.isAuthenticated()
        && authentication.getPrincipal() instanceof Jwt jwt) {
      UUID keycloakId = UUID.fromString(jwt.getSubject());

      if (!userRepository.existsById(keycloakId)) {
        User user = new User();
        user.setId(keycloakId);
        user.setUsername(jwt.getClaims().get("preferred_username").toString());
        user.setEmail(jwt.getClaims().get("email").toString());
        userRepository.save(user);
      }
    }
    filterChain.doFilter(request, response);
  }
}
