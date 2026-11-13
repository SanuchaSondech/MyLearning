package com.sanucha.bookingRoom.repository;

import com.sanucha.bookingRoom.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // 1. ตรวจสอบการจองซ้ำ (Overlap Check)
    // หาว่าห้องนั้นๆ มีคนจองทับช่วงเวลาที่เรากำลังจะจองหรือไม่
    @Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findOverlappingBookings(@Param("roomId") String roomId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    // 2. ตรวจสอบโควตาเวลาของ User ในวันนั้น (2 ชม. / 4 ชม.)
    // หาประวัติการจองของ User คนนั้น ภายในช่วงเวลาของวันนี้ (ตั้งแต่ 00:00 ถึง 23:59)
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId " +
            "AND b.startTime >= :startOfDay AND b.startTime <= :endOfDay")
    List<Booking> findByUserIdAndDate(@Param("userId") String userId,
                                      @Param("startOfDay") LocalDateTime startOfDay,
                                      @Param("endOfDay") LocalDateTime endOfDay);

    // 3. ดึงตารางเวลาของห้องในแต่ละวัน (ใช้โชว์หน้าเว็บ)
    // Spring Data JPA จะสร้าง Query ให้อัตโนมัติจากชื่อ Method นี้
    @Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId AND b.startTime BETWEEN :start AND :end")
    List<Booking> findByRoomIdAndStartTimeBetween(@Param("roomId") String roomId,
                                                  @Param("start") LocalDateTime startOfDay,
                                                  @Param("end") LocalDateTime endOfDay);
}