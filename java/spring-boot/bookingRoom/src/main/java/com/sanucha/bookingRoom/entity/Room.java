package com.sanucha.bookingRoom.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "Rooms")
public class Room {
    @Id
    @Column(name = "room_id", nullable = false)
    private String roomId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @JsonIgnore
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Booking> bookings;

    public Room(){

    }

    public Room(String roomId, Boolean isActive) {
        this.roomId = roomId;
        this.isActive = isActive;
    }

    public Room(String roomId, Boolean isActive, List<Booking> bookings) {
        this.roomId = roomId;
        this.isActive = isActive;
        this.bookings = bookings;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        return String.format("----RoomID : %s----\nStatus : %s",
                roomId, (isActive != null && isActive) ? "Available" : "Closed");
    }
}
