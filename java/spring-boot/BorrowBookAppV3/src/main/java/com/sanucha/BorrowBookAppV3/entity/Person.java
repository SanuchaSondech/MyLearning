package com.sanucha.BorrowBookAppV3.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Person")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Integer personId;

    @Column(name = "person_name", nullable = false)
    private String personName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "score", nullable = false)
    private Integer score = 10;

    private boolean isBanned = false;

    @JsonManagedReference
    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Borrowing> borrowings;

    public Person(){

    }

    public Person(String personName, Integer age, String phoneNumber, String password) {
        this.personName = personName;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }

    public Person(Integer personId, String personName, Integer age, String phoneNumber, String password, Integer score, boolean isBanned, List<Borrowing> borrowings) {
        this.personId = personId;
        this.personName = personName;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.score = score;
        this.isBanned = isBanned;
        this.borrowings = borrowings;
    }

    public Integer getPersonId() {
        return personId;
    }

    public void setPersonId(Integer personId) {
        this.personId = personId;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<Borrowing> getBorrowings() {
        return borrowings;
    }

    public void setBorrowings(List<Borrowing> borrowings) {
        this.borrowings = borrowings;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public void setBanned(boolean banned) {
        isBanned = banned;
    }

    @Override
    public String toString() {
        return String.format("----personId : %d----\npersonName : %s\nage : %d\nphoneNumber : %s\npassword : %s\nscore : %d\nisBanned : %b",
                personId, personName, age, phoneNumber, password, score, isBanned);
    }
}