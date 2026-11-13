package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Service.memberService.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 1. ดึงรายชื่อ Member ที่ยังทำงานอยู่ทั้งหมด
    @GetMapping
    public ResponseEntity<List<Member>> getAllActiveMembers() {
        return ResponseEntity.ok(memberService.getAllActiveMembers());
    }

    // 2. ดึงข้อมูล Member รายคน
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Integer id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    // 3. เพิ่ม Member ใหม่
    @PostMapping
    public ResponseEntity<Member> addMember(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.addMember(member));
    }

    // 4. แก้ไขชื่อ Member
    @PatchMapping("/{id}/name")
    public ResponseEntity<Member> updateMemberName(
            @PathVariable Integer id,
            @RequestParam String newName) {
        return ResponseEntity.ok(memberService.updateMemberName(id, newName));
    }

    // 5. ลบ Member (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Integer id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.ok(Map.of("message", "ดำเนินการให้สมาชิกสถานะเป็นลาออกเรียบร้อยแล้ว"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 6. API ฝากเงิน (Deposit)
    @PostMapping("/{id}/deposit")
    public ResponseEntity<?> deposit(
            @PathVariable Integer id,
            @RequestParam Double amount) {
        try {
            memberService.addBalance(id, amount);
            return ResponseEntity.ok(Map.of("message", "ฝากเงินสำเร็จ", "amount", amount));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 7. API ถอนเงิน (Withdraw)
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<?> withdraw(
            @PathVariable Integer id,
            @RequestParam Double amount) {
        try {
            memberService.withdraw(id, amount);
            return ResponseEntity.ok(Map.of("message", "ถอนเงินสำเร็จ", "amount", amount));
        } catch (RuntimeException e) {
            // จะคืนค่า Error กรณีเงินไม่พอ หรือหา User ไม่เจอ
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}