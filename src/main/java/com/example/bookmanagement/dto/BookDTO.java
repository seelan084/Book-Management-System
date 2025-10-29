package com.example.bookmanagement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private Integer publicationYear;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy; // username
    private String bookLink;
} 