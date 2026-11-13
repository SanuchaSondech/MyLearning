package com.sanucha.BorrowBookAppV3.repository;

import com.sanucha.BorrowBookAppV3.entity.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Integer> {

    // ค้นหารายการที่ยังไม่คืนทั้งหมด
    List<Borrowing> findByReturnDateIsNull();

    // ค้นหาประวัติของผู้ใช้
    List<Borrowing> findByPersonId(Integer personId);

    // ค้นหาเฉพาะรายการที่คนคนั้นยังไม่คืน (Active Borrowing)
    List<Borrowing> findByPersonIdAndReturnDateIsNull(Integer personId);
}
