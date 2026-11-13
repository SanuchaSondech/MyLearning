package com.sanucha.winestApp.Service.companyGroupService;

import com.sanucha.winestApp.Entity.CompanyGroup;

public interface CompanyGroupService {

    // สำหรับนำเข้าชื่อบริษัท
    CompanyGroup create(String name);

    // อัพเดต totalRevenue และ balance ของบริษัท เมื่อมีเงินเข้า
    void updateCompanyFinancials(Double incomingAmount, Double companyShare);

    // ถอน balance ออกจากบริษัท
    void withdrawCompany(Double amount);

    // ดูข้อมูลบริษัท
    CompanyGroup getCompanyInfo();
}