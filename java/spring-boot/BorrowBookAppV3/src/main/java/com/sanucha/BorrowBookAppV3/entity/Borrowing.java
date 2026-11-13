package com.sanucha.BorrowBookAppV3.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Borrowing")
public class Borrowing {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "borrow_id")
    private Integer borrowId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "borrow_date", nullable = false)
    private LocalDate borrowDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    public Borrowing(){

    }

    public Borrowing(Person person, Book book, LocalDate borrowDate) {
        this.person = person;
        this.book = book;
        this.borrowDate = borrowDate;
    }

    public Borrowing(Integer borrowId, Person person, Book book, LocalDate borrowDate, LocalDate returnDate) {
        this.borrowId = borrowId;
        this.person = person;
        this.book = book;
        this.borrowDate = borrowDate;
        this.returnDate = returnDate;
    }

    public Integer getBorrowId() {
        return borrowId;
    }

    public void setBorrowId(Integer borrowId) {
        this.borrowId = borrowId;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDate borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    @Override
    public String toString() {
        return String.format("----Borrow ID : %d----\nPerson : %s (ID : %s)\nBook : %s (ID : %s)\nBorrow Date : %s\nReturn Date : %s",
                borrowId,
                (person != null) ? person.getPersonName() : "N/A",
                (person != null) ? person.getPersonId() : "N/A",
                (book != null) ? book.getBookName() : "N/A",
                (book != null) ? book.getBookId() : "N/A",
                borrowDate,
                (returnDate != null) ? returnDate : "Not returned yet");
    }
}