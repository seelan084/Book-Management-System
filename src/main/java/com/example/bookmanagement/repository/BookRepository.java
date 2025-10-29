package com.example.bookmanagement.repository;

import com.example.bookmanagement.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    Page<Book> findByIsbnContainingIgnoreCase(String isbn, Pageable pageable);
    Page<Book> findByPublicationYear(Integer year, Pageable pageable);
    Page<Book> findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(String title, String author, Pageable pageable);
    Page<Book> findByTitleContainingIgnoreCaseAndIsbnContainingIgnoreCase(String title, String isbn, Pageable pageable);
    Page<Book> findByAuthorContainingIgnoreCaseAndIsbnContainingIgnoreCase(String author, String isbn, Pageable pageable);
    Page<Book> findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCaseAndIsbnContainingIgnoreCase(
        String title, String author, String isbn, Pageable pageable);
} 