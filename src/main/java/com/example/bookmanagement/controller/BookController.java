package com.example.bookmanagement.controller;

import com.example.bookmanagement.dto.BookDTO;
import com.example.bookmanagement.entity.Book;
import com.example.bookmanagement.entity.User;
import com.example.bookmanagement.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.bookmanagement.security.CustomUserDetails;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Book Management", description = "APIs for managing books")
@SecurityRequirement(name = "bearerAuth")
public class BookController {

    @Autowired
    private BookService bookService;
    @Autowired
    private ModelMapper modelMapper;

    @Operation(summary = "Get all books", description = "Retrieves a paginated list of all books")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved books"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @GetMapping
    public Page<BookDTO> getAllBooks(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort criteria (e.g., 'id,asc')") @RequestParam(defaultValue = "id,asc") String[] sort) {
        Sort.Direction dir = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort[0]));
        return bookService.getAllBooks(pageable)
                .map(this::convertToDTO);
    }

    @Operation(summary = "Get book by ID", description = "Retrieves a specific book by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved book"),
        @ApiResponse(responseCode = "404", description = "Book not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @GetMapping("/{id}")
    public BookDTO getBookById(@Parameter(description = "Book ID") @PathVariable Long id) {
        Book book = bookService.getBookById(id).orElseThrow();
        return convertToDTO(book);
    }

    @Operation(summary = "Add new book", description = "Creates a new book (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully created book"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public BookDTO addBook(
            @Parameter(description = "Book details") @RequestBody BookDTO bookDTO,
            @Parameter(description = "Current user details") @AuthenticationPrincipal CustomUserDetails userDetails) {
        Book book = modelMapper.map(bookDTO, Book.class);
        User user = userDetails.getUser();
        Book saved = bookService.addBook(book, user);
        return convertToDTO(saved);
    }

    @Operation(summary = "Update book", description = "Updates an existing book (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated book"),
        @ApiResponse(responseCode = "404", description = "Book not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public BookDTO updateBook(
            @Parameter(description = "Book ID") @PathVariable Long id,
            @Parameter(description = "Updated book details") @RequestBody BookDTO bookDTO) {
        Book book = bookService.getBookById(id).orElseThrow();
        Book updated = modelMapper.map(bookDTO, Book.class);
        Book saved = bookService.updateBook(book, updated);
        return convertToDTO(saved);
    }

    @Operation(summary = "Delete book", description = "Deletes a book (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted book"),
        @ApiResponse(responseCode = "404", description = "Book not found"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@Parameter(description = "Book ID") @PathVariable Long id) {
        Book book = bookService.getBookById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookService.deleteBook(book);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Search books", description = "Search books by various criteria with pagination and sorting")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved search results"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @GetMapping("/search")
    public Page<BookDTO> searchBooks(
            @Parameter(description = "Book title to search for") @RequestParam(required = false) String title,
            @Parameter(description = "Author name to search for") @RequestParam(required = false) String author,
            @Parameter(description = "ISBN to search for") @RequestParam(required = false) String isbn,
            @Parameter(description = "Publication year to search for") @RequestParam(required = false) Integer year,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort criteria (e.g., 'id,asc')") @RequestParam(defaultValue = "id,asc") String[] sort) {
        
        Sort.Direction dir = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort[0]));
        
        return bookService.searchBooks(title, author, isbn, year, pageable)
                .map(this::convertToDTO);
    }

    @Operation(summary = "Get total book count", description = "Retrieves the total number of books in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved book count"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing token")
    })
    @GetMapping("/count")
    public ResponseEntity<Long> getBookCount() {
        return ResponseEntity.ok(bookService.getBookCount());
    }

    private BookDTO convertToDTO(Book book) {
        BookDTO dto = modelMapper.map(book, BookDTO.class);
        if (book.getCreatedBy() != null) {
            dto.setCreatedBy(book.getCreatedBy().getUsername());
        }
        return dto;
    }
} 