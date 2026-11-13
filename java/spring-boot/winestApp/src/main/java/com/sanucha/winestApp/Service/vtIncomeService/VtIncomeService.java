package com.sanucha.winestApp.Service.vtIncomeService;

import com.sanucha.winestApp.Entity.VtIncome;
import java.util.List;

public interface VtIncomeService {

    // บันทึกรายได้โดเนท และกระจายส่วนแบ่งเข้าค่าย/V-Tuber ทันที
    VtIncome recordDonation(Integer memberId, Double amount);

    // ดูประวัติรายได้ทั้งหมด
    List<VtIncome> findAll();

    // ดูรายได้แยกรายบุคคล
    List<VtIncome> findByMemberId(Integer memberId);
}