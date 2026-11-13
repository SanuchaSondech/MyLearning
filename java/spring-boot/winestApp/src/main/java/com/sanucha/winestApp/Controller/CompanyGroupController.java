package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.CompanyGroup;
import com.sanucha.winestApp.Service.companyGroupService.CompanyGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "*") // เชื่อมต่อกับ Frontend ได้ทุกที่
public class CompanyGroupController {

    private final CompanyGroupService companyGroupService;

    @Autowired
    public CompanyGroupController(CompanyGroupService companyGroupService) {
        this.companyGroupService = companyGroupService;
    }

    // 1. ดึงข้อมูลค่าย (ชื่อ, ยอดเงินคงเหลือ, รายได้รวมทั้งหมด)
    @GetMapping("/info")
    public ResponseEntity<CompanyGroup> getCompanyInfo() {
        try {
            return ResponseEntity.ok(companyGroupService.getCompanyInfo());
        } catch (RuntimeException e) {
            // กรณีรันแอปครั้งแรกแล้วยังไม่ได้สร้างบริษัท
            return ResponseEntity.notFound().build();
        }
    }

    // 2. สร้างบริษัท (เรียกใช้แค่ครั้งเดียวตอนเริ่มระบบ)
    @PostMapping("/setup")
    public ResponseEntity<?> createCompany(@RequestParam String name) {
        try {
            CompanyGroup newCompany = companyGroupService.create(name);
            return ResponseEntity.ok(newCompany);
        } catch (RuntimeException e) {
            // กรณีพยายามสร้างซ้ำ (Service คุณล็อคไว้ให้มีได้แค่ 1)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. เบิกเงินออกจากค่าย
    @PostMapping("/withdraw")
    public ResponseEntity<String> withdrawCompany(@RequestParam Double amount) {
        try {
            companyGroupService.withdrawCompany(amount);
            return ResponseEntity.ok("เบิกเงินจากค่ายสำเร็จจำนวน: " + amount);
        } catch (RuntimeException e) {
            // กรณีเงินในค่ายไม่พอเบิก
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}