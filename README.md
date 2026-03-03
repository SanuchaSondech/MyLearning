# MyLearning

Frontend สำหรับระบบ **Winest Management** (เชื่อม API ที่สร้างด้วย Spring Boot)

## วิธีรันหน้าเว็บ

```bash
cd frontend
python3 -m http.server 5500
```

จากนั้นเปิด `http://localhost:5500`

## ฟีเจอร์ที่หน้าเว็บรองรับ

- จัดการข้อมูลค่าย (setup/info/withdraw)
- จัดการสมาชิก (เพิ่ม, เปลี่ยนชื่อ, เพิ่มยอด, soft delete, ดู active)
- จัดการโปรเจกต์ (สร้าง, เปลี่ยนสถานะงาน, จ่ายเงิน, ลบ, ดูงานค้าง)
- จัดการผู้เข้าร่วมโปรเจกต์
- บันทึกรายได้ VT และดูประวัติ
- ดู Statement แบบรวม/รายสมาชิก/ฝั่งค่าย

## การตั้งค่า API

- กรอก API Base URL ด้านบนของหน้าเว็บ เช่น `http://localhost:8080`
- ระบบจะจำค่าไว้ใน `localStorage`
