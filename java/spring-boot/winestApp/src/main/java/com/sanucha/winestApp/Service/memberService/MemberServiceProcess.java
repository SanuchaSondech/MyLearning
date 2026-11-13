package com.sanucha.winestApp.Service.memberService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Repository.MemberRepository;
import com.sanucha.winestApp.Service.statementService.StatementService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberServiceProcess implements MemberService {

    private final MemberRepository memberRepository;
    private final StatementService statementService;

    @Autowired
    public MemberServiceProcess(MemberRepository memberRepository, StatementService statementService) {
        this.memberRepository = memberRepository;
        this.statementService = statementService;
    }

    // ใน MemberServiceProcess.java
    @Override
    public List<Member> getAllActiveMembers() {
        return memberRepository.findByActiveTrue();
    }

    @Override
    public Member getMemberById(Integer id) {
        Optional<Member> data = memberRepository.findById(id);
        if (data.isPresent()) {
            return data.get();
        } else {
            throw new RuntimeException("ไม่พบสมาชิก ID : " + id);
        }
    }

    @Override
    @Transactional
    public Member addMember(Member member) {
        // ตั้งค่าเริ่มต้นตาม Business Logic ของค่าย
        if (member.getBalance() == null) {
            member.setBalance(0.0);
        }
        return memberRepository.save(member);
    }

    @Override
    @Transactional
    public Member updateMemberName(Integer id, String newName) {
        Member member = getMemberById(id); // เรียกใช้ findById ด้านบน
        member.setName(newName);
        return memberRepository.save(member);
    }

    @Override
    @Transactional
    public void deleteMember(Integer id) {
        // 1. เช็คว่ามีตัวตนไหม
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบสมาชิก ID : " + id));

        // 2. เช็คยอดเงิน (ห้ามลาออกถ้ายังมีเงินค้าง หรือติดหนี้)
        if (Math.abs(member.getBalance()) > 0.001) {
            throw new RuntimeException("ไม่สามารถลาออกได้: ยังมียอดเงินค้างในบัญชี " + member.getBalance());
        }

        // 3. เปลี่ยนสถานะเป็นลาออก (Soft Delete)
        member.setActive(false);
        memberRepository.save(member);
    }

    @Override
    @Transactional
    public void addBalance(Integer memberId, Double amount) {
        if (amount <= 0) {
            throw new RuntimeException("จำนวนเงินที่ฝากต้องมากกว่า 0");
        }

        // 1. ดึงข้อมูล Member
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสมาชิก ID: " + memberId));

        // 2. คำนวณยอดใหม่
        Double newBalance = member.getBalance() + amount;
        member.setBalance(newBalance);

        // 3. บันทึก Member
        memberRepository.save(member);

        // 4. บันทึก Statement
        String remark = "ฝากเงิน/ปรับปรุงยอด: " + member.getName();
        statementService.record(member, amount, remark);
    }

    @Override
    @Transactional
    public void withdraw(Integer memberId, Double amount) {
        if (amount <= 0) {
            throw new RuntimeException("จำนวนเงินที่ถอนต้องมากกว่า 0");
        }

        // 1. ดึงข้อมูล Member
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("ไม่พบสมาชิก ID: " + memberId));

        // 2. เช็กยอดเงินว่าพอถอนหรือไม่
        if (member.getBalance() < amount) {
            throw new RuntimeException("ยอดเงินคงเหลือไม่พอสำหรับการถอน (ยอดคงเหลือ: " + member.getBalance() + ")");
        }

        // 3. คำนวณยอดใหม่ (หักออก)
        Double newBalance = member.getBalance() - amount;
        member.setBalance(newBalance);

        // 4. บันทึก Member
        memberRepository.save(member);

        // 5. บันทึก Statement (ติดลบเพื่อให้เห็นว่าเงินออก)
        String remark = "ถอนเงินสมาชิก: " + member.getName();
        statementService.record(member, -amount, remark);
    }
}