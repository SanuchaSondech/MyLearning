package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.Statement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatementRepository extends JpaRepository<Statement,Integer> {

    // ดึงประวัติเงินเข้า-ออก ของ V-Tuber รายคน
    List<Statement> findByMemberMemberId(Integer memberId);

    // ดึงประวัติเงินเข้า-ออก ของ "ส่วนกลางค่าย" (ที่ member เป็น null)
    List<Statement> findByMemberIsNull();
}
