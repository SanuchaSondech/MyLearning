package com.sanucha.bookingRoom.controllers;

import com.sanucha.bookingRoom.entity.Room;
import com.sanucha.bookingRoom.services.roomService.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // 1. เพิ่มห้องใหม่ (สำหรับ Admin)
    @PostMapping("/add")
    public ResponseEntity<?> addRoom(@RequestBody Room room) {
        try {
            Room newRoom = roomService.addRoom(room);
            return new ResponseEntity<>(newRoom, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. ดึงรายชื่อห้องทั้งหมดที่เปิดใช้งานอยู่ (สำหรับ User เลือกจอง)
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAllAvailableRooms() {
        List<Room> rooms = roomService.getAllAvailableRooms();
        return ResponseEntity.ok(rooms);
    }

    // 3. ดึงข้อมูลห้องเดียวตาม ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable String id) {
        try {
            Room room = roomService.getRoomById(id);
            return ResponseEntity.ok(room);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 4. อัปเดตสถานะห้อง (สำหรับ Admin ปิดปรับปรุงห้อง)
    // ตัวอย่าง URL: PUT /api/rooms/update-status/R101?status=false
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateRoomStatus(@PathVariable String id, @RequestParam boolean status) {
        try {
            roomService.updateRoomStatus(id, status);
            return ResponseEntity.ok("Room " + id + " status updated to: " + (status ? "Active" : "Inactive"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}