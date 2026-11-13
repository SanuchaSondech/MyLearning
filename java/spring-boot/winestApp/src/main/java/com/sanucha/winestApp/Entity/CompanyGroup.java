package com.sanucha.winestApp.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "company_groups")
public class CompanyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "group_name", nullable = false)
    private String groupName; // เช่น "Main Fund"

    @Column(name = "balance")
    private Double balance = 0.0; // เงินที่เหลือให้ถอนได้ในปัจจุบัน

    @Column(name = "total_revenue")
    private Double totalRevenue = 0.0; // ยอดรายได้สะสมทั้งหมด (เอาไว้ทำสถิติ)

    public CompanyGroup() {
    }

    // Constructor สำหรับสร้างกลุ่มใหม่
    public CompanyGroup(String groupName) {
        this.groupName = groupName;
        this.balance = 0.0;
        this.totalRevenue = 0.0;
    }

    // --- Getter and Setter ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}