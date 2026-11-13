package com.sanucha.BorrowBookAppV3.service.personService;

import com.sanucha.BorrowBookAppV3.entity.Person;
import java.util.List;

public interface PersonService {
    // ค้นหาทั้งหมด (ต้องเป็น List<Person>)
    List<Person> findAll();

    // ค้นหาผู้ใช้จากไอดี
    Person findById(Integer id);

    // บันทึกผู้ใช้
    Person save(Person person);

    // ลบผู้ใช้
    void deleteById(Integer id);

    // ---------- ระบบสมาชิก -----------
    // ระบบ Register
    Person register(Person person);

    // ระบบ Login
    Person login(String phoneNumber, String password);
}