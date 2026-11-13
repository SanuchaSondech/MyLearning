package com.sanucha.BorrowBookAppV3.repository;

import com.sanucha.BorrowBookAppV3.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    // ค้นหาหนังสือด้วยชื่อ
    List<Book> findByBookNameContainingIgnoreCase(String name);
}
