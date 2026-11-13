package com.sanucha.bookingRoom.services.roomService;

import com.sanucha.bookingRoom.entity.Room;
import com.sanucha.bookingRoom.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceProcess implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Room addRoom(Room room) {
        if(roomRepository.existsById(room.getRoomId())) {
            throw new RuntimeException("Room ID already exists!");
        }
        return roomRepository.save(room);
    }

    @Override
    public List<Room> getAllAvailableRooms() {
        // แนะนำให้ไปสร้าง method findByIsActive ใน Repository ด้วยครับ
        return roomRepository.findByIsActiveTrue();
    }

    @Override
    public Room getRoomById(String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found!"));
    }

    @Override
    public void updateRoomStatus(String roomId, boolean status) {
        Room room = getRoomById(roomId);
        room.setActive(status);
        roomRepository.save(room);
    }
}