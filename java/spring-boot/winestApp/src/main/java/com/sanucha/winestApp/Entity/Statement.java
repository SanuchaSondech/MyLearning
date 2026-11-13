package com.sanucha.winestApp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "statements")
public class Statement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statement_id")
    private Integer statementId;

    @JsonBackReference(value = "member-statement")
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "remark")
    private String remark;

    @Column(name = "statement_date")
    private LocalDate statementDate = LocalDate.now();

    public Statement() {}

    // Constructor สำหรับสร้างรายการใหม่ (ไม่ใส่ ID)
    public Statement(Member member, Double amount, String remark, LocalDate statementDate) {
        this.member = member;
        this.amount = amount;
        this.remark = remark;
        this.statementDate = statementDate;
    }

    // --- Getter and Setter ---

    public Integer getStatementId() {
        return statementId;
    }

    public void setStatementId(Integer statementId) {
        this.statementId = statementId;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public LocalDate getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(LocalDate statementDate) {
        this.statementDate = statementDate;
    }
}