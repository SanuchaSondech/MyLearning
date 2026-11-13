package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.Statement;
import com.sanucha.winestApp.Service.statementService.StatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin(origins = "*")
public class StatementController {

    private final StatementService statementService;

    @Autowired
    public StatementController(StatementService statementService) {
        this.statementService = statementService;
    }

    // 1. ดึงธุรกรรมทั้งหมดในระบบ (Audit Log)
    @GetMapping
    public ResponseEntity<List<Statement>> getAllStatements() {
        return ResponseEntity.ok(statementService.findAll());
    }

    // 2. ดึงประวัติรายได้ของ Member รายคน (ใช้ @PathVariable รับ ID)
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Statement>> getStatementsByMember(@PathVariable Integer memberId) {
        List<Statement> statements = statementService.findByMemberId(memberId);
        return ResponseEntity.ok(statements);
    }

    // 3. ดึงประวัติรายได้ของ "ค่าย" (รายการที่ member_id เป็น NULL)
    @GetMapping("/company")
    public ResponseEntity<List<Statement>> getCompanyStatements() {
        List<Statement> statements = statementService.findCompanyStatements();
        return ResponseEntity.ok(statements);
    }
}