package com.example.bookmanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.ContentCachingRequestWrapper;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String requestURI = request.getRequestURI();
            logger.debug("Processing request to: " + requestURI);
            logger.debug("Request method: " + request.getMethod());
            logger.debug("Request headers: " + Collections.list(request.getHeaderNames()).stream().collect(Collectors.toMap(headerName -> headerName, request::getHeader)));
            
            
            if (requestURI.startsWith("/api/auth/") || requestURI.startsWith("/auth/")) {
                logger.debug("Skipping token validation for public endpoint: " + requestURI);
                filterChain.doFilter(request, response);
                return;
            }
            
            
            ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
            
            String jwt = getJwtFromRequest(wrappedRequest);
            if (StringUtils.hasText(jwt)) {
                logger.debug("JWT token found in request");
                if (tokenProvider.validateToken(jwt)) {
                    String username = tokenProvider.getUsernameFromJWT(jwt);
                    logger.debug("Valid JWT token for user: " + username);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(wrappedRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Authentication set in SecurityContext for user: " + username);
                } else {
                    logger.debug("Invalid JWT token");
                }
            } else {
                logger.debug("No JWT token found in request");
            }
            
            filterChain.doFilter(wrappedRequest, response);
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
            filterChain.doFilter(request, response);
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
} 