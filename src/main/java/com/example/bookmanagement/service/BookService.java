package com.example.bookmanagement.service;

import com.example.bookmanagement.entity.Book;
import com.example.bookmanagement.entity.User;
import com.example.bookmanagement.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public Book addBook(Book book, User user) {
        book.setCreatedBy(user);
        return bookRepository.save(book);
    }

    public Book updateBook(Book book, Book updated) {
        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setIsbn(updated.getIsbn());
        book.setPublicationYear(updated.getPublicationYear());
        book.setBookLink(updated.getBookLink());
        return bookRepository.save(book);
    }

    public void deleteBook(Book book) {
        bookRepository.delete(book);
    }

    public Page<Book> searchBooks(String title, String author, String isbn, Integer year, Pageable pageable) {
        if (title != null && author != null && isbn != null) {
            return bookRepository.findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCaseAndIsbnContainingIgnoreCase(
                title, author, isbn, pageable);
        } else if (title != null && author != null) {
            return bookRepository.findByTitleContainingIgnoreCaseAndAuthorContainingIgnoreCase(title, author, pageable);
        } else if (title != null && isbn != null) {
            return bookRepository.findByTitleContainingIgnoreCaseAndIsbnContainingIgnoreCase(title, isbn, pageable);
        } else if (author != null && isbn != null) {
            return bookRepository.findByAuthorContainingIgnoreCaseAndIsbnContainingIgnoreCase(author, isbn, pageable);
        } else if (title != null) {
            return bookRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else if (author != null) {
            return bookRepository.findByAuthorContainingIgnoreCase(author, pageable);
        } else if (isbn != null) {
            return bookRepository.findByIsbnContainingIgnoreCase(isbn, pageable);
        } else if (year != null) {
            return bookRepository.findByPublicationYear(year, pageable);
        } else {
            return Page.empty();
        }
    }

    public long getBookCount() {
        return bookRepository.count();
    }
} 