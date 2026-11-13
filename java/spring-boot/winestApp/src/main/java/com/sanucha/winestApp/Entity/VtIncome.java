package com.sanucha.winestApp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vt_incomes")
public class VtIncome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vt_income_id")
    private Integer id;

    @JsonIgnoreProperties({"statements", "participants", "vtIncomes"})
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "vtuber_income")
    private Double vtuberIncome;

    @Column(name = "net_income")
    private Double netIncome;

    @Column(name = "income_date")
    private LocalDate incomeDate;

    public VtIncome() {}

    public VtIncome(Member member, Double vtuberIncome, LocalDate incomeDate) {
        this.member = member;
        this.vtuberIncome = vtuberIncome;
        this.netIncome = vtuberIncome*0.6;
        this.incomeDate = incomeDate;
    }

    public VtIncome(Integer id, Member member, Double vtuberIncome, Double netIncome, LocalDate incomeDate) {
        this.id = id;
        this.member = member;
        this.vtuberIncome = vtuberIncome;
        this.netIncome = netIncome;
        this.incomeDate = incomeDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Double getVtuberIncome() {
        return vtuberIncome;
    }

    public void setVtuberIncome(Double vtuberIncome) {
        this.vtuberIncome = vtuberIncome;
    }

    public Double getNetIncome() {
        return netIncome;
    }

    public void setNetIncome(Double netIncome) {
        this.netIncome = netIncome;
    }

    public LocalDate getIncomeDate() {
        return incomeDate;
    }

    public void setIncomeDate(LocalDate incomeDate) {
        this.incomeDate = incomeDate;
    }
}