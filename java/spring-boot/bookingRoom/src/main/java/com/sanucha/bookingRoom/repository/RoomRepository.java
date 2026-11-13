package com.sanucha.bookingRoom.repository;

import com.sanucha.bookingRoom.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    List<Room> findByIsActiveTrue();
}
