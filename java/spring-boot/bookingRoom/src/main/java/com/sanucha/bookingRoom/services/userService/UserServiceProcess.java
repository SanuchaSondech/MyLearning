package com.sanucha.bookingRoom.services.userService;

import com.sanucha.bookingRoom.entity.User;
import com.sanucha.bookingRoom.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceProcess implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public User register(User user) {
        // 1. ตรวจสอบว่า ID นี้มีในระบบหรือยัง
        if (userRepository.existsById(user.getId())) {
            throw new RuntimeException("User ID: " + user.getId() + " is already registered.");
        }

        // 2. ตรวจสอบ Email ซ้ำ
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("This email is already in use.");
        }

        return userRepository.save(user);
    }

    @Override
    public User login(String id, String password) {
        // 1. ค้นหาด้วย ID (String)
        Optional<User> existUser = userRepository.findById(id);

        if (existUser.isEmpty()) {
            throw new RuntimeException("User ID not found.");
        }
        User user = existUser.get();

        // 2. เช็ครหัสผ่าน
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password.");
        }

        return user;
    }
}