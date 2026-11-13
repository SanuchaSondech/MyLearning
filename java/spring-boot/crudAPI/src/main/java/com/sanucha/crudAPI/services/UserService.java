package com.sanucha.crudAPI.services;

import com.sanucha.crudAPI.entity.User;

import java.util.List;

public interface UserService {
    // บันทึกลงฐานข้อมูล
    User save(User user);
    //ดึงข้อมูลทั้งหมด
    List<User> findAll();
    //ดึงข้อมูลด้วย id
    User findById(Integer id);
    // ลบข้อมูลด้วย id
    void deleteById(Integer id);
}
