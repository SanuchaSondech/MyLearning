package com.sanucha.BorrowBookAppV3.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_ID")
    private Integer bookId;

    @Column(name = "book_name", nullable = false)
    private String bookName;

    @Column(name = "writer", nullable = false)
    private String writer;

    @Column(name = "publisher", nullable = false)
    private String publisher;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @JsonManagedReference
    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Borrowing> borrowings;

    public Book(){

    }

    public Book(String bookName, String writer, String publisher) {
        this.bookName = bookName;
        this.writer = writer;
        this.publisher = publisher;
    }

    public Book(Integer bookId, String bookName, String writer, String publisher, Boolean isAvailable, List<Borrowing> borrowings) {
        this.bookId = bookId;
        this.bookName = bookName;
        this.writer = writer;
        this.publisher = publisher;
        this.isAvailable = isAvailable;
        this.borrowings = borrowings;
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public List<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(List<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }

    public Boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(Boolean available) {
        this.isAvailable = available;
    }

    @Override
    public String toString() {
        return String.format("----bookId : %d----\nbookName : %s\nwriter : %s\npublisher : %s\nisAvailable : %b",
                bookId, bookName, writer, publisher, isAvailable);
    }
}