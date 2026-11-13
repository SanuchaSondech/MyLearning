package com.sanucha.bookingRoom.services.bookingService;

import com.sanucha.bookingRoom.entity.Booking;
import com.sanucha.bookingRoom.entity.Room;
import com.sanucha.bookingRoom.entity.User;
import com.sanucha.bookingRoom.repository.BookingRepository;
import com.sanucha.bookingRoom.repository.RoomRepository;
import com.sanucha.bookingRoom.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingServiceProcess implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    @Transactional
    public Booking createBooking(String userId, String roomId, LocalDateTime startTime, LocalDateTime endTime) {
        // 1. ตรวจสอบว่ามี User และ Room ในระบบหรือไม่
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 2. ตรวจสอบว่าห้องเปิดให้ใช้งานหรือไม่
        if (!room.getActive()) {
            throw new RuntimeException("This room is currently closed or not available.");
        }

        // 3. ตรวจสอบเวลาทับซ้อน (Overlap)
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(roomId, startTime, endTime);
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("This room is already booked for the selected time slot.");
        }

        // 4. คำนวณระยะเวลาการจองครั้งนี้ (หน่วยเป็นนาที)
        long requestedMinutes = Duration.between(startTime, endTime).toMinutes();

        // 5. ตรวจสอบโควตารายวัน ตาม UserRole
        LocalDateTime startOfDay = startTime.with(LocalTime.MIN);
        LocalDateTime endOfDay = startTime.with(LocalTime.MAX);
        
        List<Booking> todayBookings = bookingRepository.findByUserIdAndDate(userId, startOfDay, endOfDay);
        
        long usedMinutesToday = todayBookings.stream()
                .mapToLong(b -> Duration.between(b.getStartTime(), b.getEndTime()).toMinutes())
                .sum();

        long maxAllowedMinutes = 0;
        if ("undergraduateStudent".equalsIgnoreCase(user.getUserRole())) {
            maxAllowedMinutes = 120; // ป.ตรี 2 ชั่วโมง
        } else if ("graduateStudent".equalsIgnoreCase(user.getUserRole()) || "staff".equalsIgnoreCase(user.getUserRole())) {
            maxAllowedMinutes = 240; // ป.โท และ Staff 4 ชั่วโมง
        } else {
            throw new RuntimeException("Invalid User Role");
        }

        if (usedMinutesToday + requestedMinutes > maxAllowedMinutes) {
            throw new RuntimeException("Booking failed: Quota exceeded. You can only book up to " 
                    + (maxAllowedMinutes / 60) + " hours per day.");
        }

        // 6. บันทึกการจอง
        Booking booking = new Booking(user, room, startTime, endTime);
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking checkIn(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime now = LocalDateTime.now();

        // เช็คว่ามาเช็คอินก่อนเวลาเริ่มไหม (อนุโลมให้เช็คอินล่วงหน้าได้นิดหน่อย หรือจะบังคับว่าต้องถึงเวลาก่อนก็ได้)
        if (now.isBefore(booking.getStartTime())) {
            throw new RuntimeException("You can only check in when your booking time starts.");
        }

        // กฎ 15 นาที: ถ้ายกเลิกอัตโนมัติ เราสามารถลบทิ้ง หรือ throw error ได้
        LocalDateTime deadline = booking.getStartTime().plusMinutes(15);
        if (now.isAfter(deadline)) {
            // ในที่นี้เลือกลบการจองทิ้งเลย เพราะถือว่าสละสิทธิ์
            bookingRepository.delete(booking);
            throw new RuntimeException("Booking cancelled automatically: You are more than 15 minutes late.");
        }

        // บันทึกเวลาเช็คอิน
        booking.setCheckInTime(now);
        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // เราสามารถลบออกจาก Database ไปเลย เพราะไม่ได้มีฟิลด์ Status
        bookingRepository.delete(booking);
    }

    @Override
    public List<Booking> getRoomSchedule(String roomId, LocalDateTime date) {
        LocalDateTime startOfDay = date.with(LocalTime.MIN);
        LocalDateTime endOfDay = date.with(LocalTime.MAX);
        
        // ดึงการจองทั้งหมดของห้องนี้ในวันที่เลือก (ต้องไปเพิ่ม Query ใน Repository นิดนึงครับ)
        return bookingRepository.findByRoomIdAndStartTimeBetween(roomId, startOfDay, endOfDay);
    }
}