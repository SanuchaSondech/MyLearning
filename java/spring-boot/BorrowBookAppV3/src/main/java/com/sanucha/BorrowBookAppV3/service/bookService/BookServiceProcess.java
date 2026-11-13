package com.sanucha.BorrowBookAppV3.service.bookService;

import com.sanucha.BorrowBookAppV3.entity.Book;
import com.sanucha.BorrowBookAppV3.repository.BookRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookServiceProcess implements BookService{

    private final BookRepository bookRepository;

    @Autowired
    public BookServiceProcess(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Book findById(Integer id) {
        Optional<Book> data = bookRepository.findById(id);
        Book book = null;
        if (data.isPresent()){
            book = data.get();
        } else {
            throw new RuntimeException("Not found book ID : " + id);
        }
        return book;
    }

    @Override
    @Transactional
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Not found book ID : " + id);
        }
        bookRepository.deleteById(id);
    }

    @Override
    public List<Book> findByName(String name) {
        return bookRepository.findByBookNameContainingIgnoreCase(name);
    }
}
