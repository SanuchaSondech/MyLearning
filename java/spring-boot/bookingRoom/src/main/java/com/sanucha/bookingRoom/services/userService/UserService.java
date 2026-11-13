package com.sanucha.bookingRoom.services.userService;

import com.sanucha.bookingRoom.entity.User;

public interface UserService {

    User register(User user);

    User login(String id, String password);
}
