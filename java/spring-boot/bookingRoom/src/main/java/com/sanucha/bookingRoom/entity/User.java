package com.sanucha.bookingRoom.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "User")
public class User {

    @Id
    @Column(name = "user_id")
    private String id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "user_role", nullable = false)
    private String userRole;

    @Column(name = "user_name", nullable = false)
    private String userName;

    // เพิ่มฟิลด์ email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    public User() {}

    public User(String id, String password) {
        this.id = id;
        this.password = password;
    }

    public User(String id, String password, String userRole, String userName, String email) {
        this.id = id;
        this.password = password;
        this.userRole = userRole;
        this.userName = userName;
        this.email = email;
    }

    public User(String id, String password, String userRole, String userName, String email, List<Booking> bookings) {
        this.id = id;
        this.password = password;
        this.userRole = userRole;
        this.userName = userName;
        this.email = email;
        this.bookings = bookings;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        return String.format(
                "----userId : %s----\nuserName : %s\nemail : %s\nuserRole : %s\npassword : %s",
                id, userName, email, userRole, password
        );
    }
}