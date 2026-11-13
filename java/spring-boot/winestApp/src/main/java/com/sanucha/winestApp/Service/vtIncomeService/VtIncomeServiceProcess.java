package com.sanucha.winestApp.Service.vtIncomeService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.VtIncome;
import com.sanucha.winestApp.Repository.VtIncomeRepository;
import com.sanucha.winestApp.Service.memberService.MemberService;
import com.sanucha.winestApp.Service.companyGroupService.CompanyGroupService;
import com.sanucha.winestApp.Service.statementService.StatementService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VtIncomeServiceProcess implements VtIncomeService {

    private final VtIncomeRepository vtIncomeRepository;
    private final MemberService memberService;
    private final CompanyGroupService companyService;
    private final StatementService statementService;

    @Autowired
    public VtIncomeServiceProcess(VtIncomeRepository vtIncomeRepository,
                                  MemberService memberService,
                                  CompanyGroupService companyService,
                                  StatementService statementService) {
        this.vtIncomeRepository = vtIncomeRepository;
        this.memberService = memberService;
        this.companyService = companyService;
        this.statementService = statementService;
    }

    @Override
    @Transactional
    public VtIncome recordDonation(Integer memberId, Double amount) {
        // ดึงข้อมูล Member
        Member member = memberService.getMemberById(memberId);

        // บันทึกรายได้ลงตารางหลัก (vt_incomes)
        // Constructor คำนวณ netIncome 60% ให้อัตโนมัติ
        VtIncome vtIncome = new VtIncome(member, amount, LocalDate.now());
        VtIncome savedIncome = vtIncomeRepository.save(vtIncome);

        // ดึงยอดเงินที่ผ่านการคำนวณจาก Entity มาใช้
        Double memberShare = vtIncome.getNetIncome();
        Double companyShare = amount - memberShare;

        // บันทึก Statements
        //statementService.record(member, memberShare, "ส่วนแบ่งโดเนท 60%");
        statementService.record(null, companyShare, "ส่วนแบ่งค่าย 40% จาก " + member.getName());

        // อัปเดตยอดเงินสะสมของ Member
        memberService.addBalance(memberId, memberShare);

        // อัปเดตยอดเงินฝั่งค่าย (Revenue + Cash Balance)
        companyService.updateCompanyFinancials(amount, companyShare);

        return savedIncome;
    }

    @Override
    public List<VtIncome> findAll() {
        return vtIncomeRepository.findAll();
    }

    @Override
    public List<VtIncome> findByMemberId(Integer memberId) {
        return vtIncomeRepository.findByMemberId(memberId);
    }
}