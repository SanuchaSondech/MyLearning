package com.sanucha.winestApp.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Integer projectId;

    @Column(name = "project_name")
    private String projectName;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "amount_paid")
    private Double amountPaid = 0.0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false; // งานเสร็จหรือยัง

    @Column(name = "paid_finished")
    private Boolean paidFinished = false; // จ่ายครบยัง

    @Column(name = "start_date")
    private LocalDate startDate;

    @JsonManagedReference(value = "project-participant")
    @OneToMany(mappedBy = "project")
    private List<ProjectParticipant> participants;

    public Project() {}

    public Project(String projectName, Double totalPrice, LocalDate startDate) {
        this.projectName = projectName;
        this.totalPrice = totalPrice;
        this.startDate = startDate;
    }

    public Project(Integer projectId, String projectName, Double totalPrice, Double amountPaid, Boolean isCompleted, Boolean paidFinished, LocalDate startDate, List<ProjectParticipant> participants) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.totalPrice = totalPrice;
        this.amountPaid = amountPaid;
        this.isCompleted = isCompleted;
        this.paidFinished = paidFinished;
        this.startDate = startDate;
        this.participants = participants;
    }

    // --- Getter and Setter ---

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public Boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }

    public Boolean getPaidFinished() {
        return paidFinished;
    }

    public void setPaidFinished(Boolean paidFinished) {
        this.paidFinished = paidFinished;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public List<ProjectParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ProjectParticipant> participants) {
        this.participants = participants;
    }
}