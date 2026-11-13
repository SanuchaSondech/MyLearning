package com.sanucha.winestApp.Service.statementService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.Statement;
import com.sanucha.winestApp.Repository.StatementRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StatementServiceProcess implements StatementService {

    private final StatementRepository statementRepository;

    @Autowired
    public StatementServiceProcess(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }

    @Override
    @Transactional
    public Statement record(Member member, Double amount, String remark) {
        //  member เป็น null คือของค่าย
        Statement statement = new Statement(member, amount, remark, LocalDate.now());
        return statementRepository.save(statement);
    }

    @Override
    public List<Statement> findAll() {
        return statementRepository.findAll();
    }

    @Override
    public List<Statement> findByMemberId(Integer memberId) {
        // เรียกใช้ Method ใหม่ที่เราเพิ่งเพิ่มใน Repo
        return statementRepository.findByMemberMemberId(memberId);
    }

    @Override
    public List<Statement> findCompanyStatements() {
        // เรียกใช้ Method ใหม่ที่ดึงเฉพาะรายการที่ member เป็น null
        return statementRepository.findByMemberIsNull();
    }
}