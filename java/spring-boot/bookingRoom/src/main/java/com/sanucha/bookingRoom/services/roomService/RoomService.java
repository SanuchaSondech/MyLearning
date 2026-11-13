package com.sanucha.bookingRoom.services.roomService;

import com.sanucha.bookingRoom.entity.Room;
import java.util.List;

public interface RoomService {
    Room addRoom(Room room); // สำหรับ Admin เพิ่มห้องใหม่
    List<Room> getAllAvailableRooms(); // ดึงเฉพาะห้องที่เปิดใช้งาน (isActive = true)
    Room getRoomById(String roomId); // ค้นหาห้อง
    void updateRoomStatus(String roomId, boolean status); // ปิด-เปิดห้อง
}