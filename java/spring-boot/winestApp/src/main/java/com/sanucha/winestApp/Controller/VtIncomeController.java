package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.VtIncome;
import com.sanucha.winestApp.Service.vtIncomeService.VtIncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vt-income")
@CrossOrigin(origins = "*")
public class VtIncomeController {

    private final VtIncomeService vtIncomeService;

    @Autowired
    public VtIncomeController(VtIncomeService vtIncomeService) {
        this.vtIncomeService = vtIncomeService;
    }

    // 1. บันทึกรายได้โดเนท (หักแบ่ง 60/40 ทันที)
    @PostMapping("/record")
    public ResponseEntity<VtIncome> recordDonation(
            @RequestParam Integer memberId,
            @RequestParam Double amount) {
        try {
            VtIncome result = vtIncomeService.recordDonation(memberId, amount);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 2. ดูรายการรายได้โดเนททั้งหมดในระบบ
    @GetMapping
    public ResponseEntity<List<VtIncome>> getAllIncomes() {
        return ResponseEntity.ok(vtIncomeService.findAll());
    }

    // 3. ดูประวัติรายได้โดเนทเฉพาะของ Member แต่ละคน
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<VtIncome>> getIncomesByMember(@PathVariable Integer memberId) {
        return ResponseEntity.ok(vtIncomeService.findByMemberId(memberId));
    }
}