package com.sanucha.bookingRoom.controllers;

import com.sanucha.bookingRoom.entity.Booking;
import com.sanucha.bookingRoom.services.bookingService.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // อนุญาตให้เชื่อมต่อจาก Browser ได้ทุกที่
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. จองห้องใหม่
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(
            @RequestParam String userId,
            @RequestParam String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            Booking booking = bookingService.createBooking(userId, roomId, startTime, endTime);
            return new ResponseEntity<>(booking, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // ส่งข้อความ Error ที่เราเขียนไว้ใน Service ไปบอก User (เช่น โควตาเต็ม หรือ ห้องไม่ว่าง)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. เช็คอิน (ใช้ตอน User มาถึงห้องแล้วกดปุ่มเช็คอิน)
    @PutMapping("/check-in/{id}")
    public ResponseEntity<?> checkIn(@PathVariable Integer id) {
        try {
            Booking booking = bookingService.checkIn(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. ยกเลิกการจอง
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking ID " + id + " has been cancelled.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 4. ดูตารางเวลาของห้องในวันที่ระบุ (เพื่อไปโชว์ในหน้าปฏิทินหรือตาราง)
    @GetMapping("/schedule/{roomId}")
    public ResponseEntity<?> getRoomSchedule(
            @PathVariable String roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            // แปลง LocalDate เป็น LocalDateTime เริ่มต้นวันเพื่อให้ Service ทำงานได้
            LocalDateTime startOfDay = date.atStartOfDay();
            List<Booking> schedule = bookingService.getRoomSchedule(roomId, startOfDay);
            return ResponseEntity.ok(schedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}