package com.sanucha.BorrowBookAppV3.service.borrowingService;

import com.sanucha.BorrowBookAppV3.entity.Borrowing;

import java.util.List;

public interface BorrowingService {
    // ยืมหนังสือ
    void borrowBook(Integer personId, Integer bookId);
    // คืนหนังสือ
    void returnBook(Integer borrowingId);
    // ค้นหารายการการยืมของคนนั้น ๆ
    List<Borrowing> findActiveBorrowingByPerson(Integer personId);
    // ดูประวัติทั้งหมด
    List<Borrowing> findAllHistory();
    // ดูรายการที้ยังไม่คืนทั้งหมด
    List<Borrowing> findAllHistoryNotreturn();
}
