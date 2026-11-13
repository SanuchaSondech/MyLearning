package com.sanucha.BorrowBookAppV3.service.bookService;

import com.sanucha.BorrowBookAppV3.entity.Book;

import java.util.List;

public interface BookService {
    // ค้นหาทั้งหมด
    List<Book> findAll();

    // ค้นหาหนังสือจากไอดี
    Book findById(Integer id);

    // บันทึกหนังสือ
    Book save(Book book);

    // ลบหนังสือ
    void deleteById(Integer id);

    // สร้างเพิ่ม----------------------------------

    // ค้นหาหนังสือจากชื่อ
    List<Book> findByName(String name);

}
