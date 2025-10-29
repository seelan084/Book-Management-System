package com.example.bookmanagement.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.bookmanagement.entity.Book;
import com.example.bookmanagement.dto.BookDTO;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
            .setSkipNullEnabled(true)
            .setAmbiguityIgnored(true);
        
        modelMapper.createTypeMap(Book.class, BookDTO.class)
            .addMappings(mapper -> {
                mapper.skip(BookDTO::setCreatedBy);
            });
        
        return modelMapper;
    }
} 