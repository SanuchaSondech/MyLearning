package com.sanucha.winestApp.Service.statementService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.Statement;
import java.util.List;

public interface StatementService {

    // บันทึกรายการเงิน (รองรับทั้ง Member และ ของค่ายเอง)
    Statement record(Member member, Double amount, String remark);

    // ดูประวัติทั้งหมด
    List<Statement> findAll();

    // ดูประวัติแยกตามรายคน (สำคัญมากเวลา V-Tuber มาเช็คยอดตัวเอง)
    List<Statement> findByMemberId(Integer memberId);

    // ดูรายการของ "ค่าย" (กรณี member เป็น null)
    List<Statement> findCompanyStatements();
}