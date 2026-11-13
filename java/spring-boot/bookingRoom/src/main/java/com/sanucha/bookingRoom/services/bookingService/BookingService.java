package com.sanucha.bookingRoom.services.bookingService;

import com.sanucha.bookingRoom.entity.Booking;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {
    // 1. จองห้อง (รวม Logic เช็คโควตา 2/4 ชม. และจองซ้ำ)
    Booking createBooking(String userId, String roomId, LocalDateTime startTime, LocalDateTime endTime);

    // 2. เช็คอิน (รวม Logic กฎ 15 นาที)
    Booking checkIn(Integer bookingId);

    // 3. ยกเลิกการจอง
    void cancelBooking(Integer bookingId);

    // 4. ดูตารางเวลาห้องในวันที่กำหนด
    List<Booking> getRoomSchedule(String roomId, LocalDateTime date);
}