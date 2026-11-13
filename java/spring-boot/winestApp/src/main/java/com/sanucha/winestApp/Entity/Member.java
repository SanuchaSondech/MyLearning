package com.sanucha.winestApp.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Integer memberId;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;

    @Column(name = "role")
    private String role;

    @Column(name = "balance")
    private Double balance = 0.0;

    @Column(name = "active")
    private Boolean active = true; // ค่าเริ่มต้นคือ true (ยังทำงานอยู่)

    @JsonManagedReference(value = "member-statement")
    @OneToMany(mappedBy = "member")
    private List<Statement> statements;

    @JsonManagedReference(value = "member-participant")
    @OneToMany(mappedBy = "member")
    private List<ProjectParticipant> participants;

    @JsonManagedReference(value = "member-income")
    @OneToMany(mappedBy = "member")
    private List<VtIncome> vtIncomes;

    public Member() {}

    public Member(String name, Integer age, String role) {
        this.name = name;
        this.age = age;
        this.role = role;
    }

    public Member(Integer memberId, String name, Integer age, String role, Double balance, Boolean active, List<Statement> statements, List<ProjectParticipant> participants, List<VtIncome> vtIncomes) {
        this.memberId = memberId;
        this.name = name;
        this.age = age;
        this.role = role;
        this.balance = balance;
        this.active = active;
        this.statements = statements;
        this.participants = participants;
        this.vtIncomes = vtIncomes;
    }

    public Integer getMemberId() {
        return memberId;
    }

    public void setMemberId(Integer memberId) {
        this.memberId = memberId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public List<Statement> getStatements() {
        return statements;
    }

    public void setStatements(List<Statement> statements) {
        this.statements = statements;
    }

    public List<ProjectParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ProjectParticipant> participants) {
        this.participants = participants;
    }

    public List<VtIncome> getVtIncomes() {
        return vtIncomes;
    }

    public void setVtIncomes(List<VtIncome> vtIncomes) {
        this.vtIncomes = vtIncomes;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}