package com.sanucha.winestApp.Service.companyGroupService;

import com.sanucha.winestApp.Entity.CompanyGroup;
import com.sanucha.winestApp.Repository.CompanyGroupRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyGroupServiceProcess implements CompanyGroupService{

    private final CompanyGroupRepository companyGroupRepository;

    @Autowired
    public CompanyGroupServiceProcess(CompanyGroupRepository companyGroupRepository) {
        this.companyGroupRepository = companyGroupRepository;
    }

    @Override
    @Transactional
    public CompanyGroup create(String name) {
        // ตรวจสอบว่ามีบริษัทอยู่ในระบบหรือยัง (ปกติควรมีแค่ 1)
        if (!companyGroupRepository.findAll().isEmpty()) {
            throw new RuntimeException("ระบบรองรับการสร้างบริษัทได้เพียงแห่งเดียวเท่านั้น");
        }
        CompanyGroup company = new CompanyGroup(name);
        return companyGroupRepository.save(company);
    }

    @Override
    @Transactional
    public void updateCompanyFinancials(Double incomingAmount, Double companyShare) {
        // ดึงข้อมูลบริษัทตัวแรกมาจัดการ
        CompanyGroup company = getCompanyInfo();

        // 1. สะสมยอดรายได้ทั้งหมด (Total Revenue)
        double currentRevenue = (company.getTotalRevenue() != null) ? company.getTotalRevenue() : 0.0;
        company.setTotalRevenue(currentRevenue + incomingAmount);

        // 2. เพิ่มยอดเงินสดที่บริษัทใช้ได้จริง (Balance)
        double currentBalance = (company.getBalance() != null) ? company.getBalance() : 0.0;
        company.setBalance(currentBalance + companyShare);

        companyGroupRepository.save(company);
    }

    @Override
    @Transactional
    public void withdrawCompany(Double amount) {
        CompanyGroup company = getCompanyInfo();

        if (company.getBalance() < amount) {
            throw new RuntimeException("ยอดเงินคงเหลือไม่เพียงพอสำหรับการเบิก (ยอดปัจจุบัน: " + company.getBalance() + ")");
        }

        company.setBalance(company.getBalance() - amount);
        companyGroupRepository.save(company);
    }

    @Override
    public CompanyGroup getCompanyInfo() {
        List<CompanyGroup> companies = companyGroupRepository.findAll();
        if (companies.isEmpty()) {
            throw new RuntimeException("ไม่พบข้อมูลบริษัทในระบบ");
        }
        return companies.get(0); // ดึง Record แรกออกมา
    }

}
