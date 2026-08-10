package com.contoso.demo.orderservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Uses the deprecated WebMvcConfigurerAdapter on purpose so the
 * modernization agent has a deprecated-API migration to perform
 * (WebMvcConfigurerAdapter -> WebMvcConfigurer in Spring 5+).
 */
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PATCH");
    }
}
