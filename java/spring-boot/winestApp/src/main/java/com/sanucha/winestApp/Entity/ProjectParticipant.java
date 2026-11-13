package com.sanucha.winestApp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "project_participants")
public class ProjectParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Integer participantId;

    // แก้เป็น — ส่ง member กลับมาแต่ตัด fields ที่ circular ออก
    @JsonIgnoreProperties({"statements", "participants", "vtIncomes"})
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @JsonBackReference(value = "project-participant")
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    public ProjectParticipant() {}

    public ProjectParticipant(Member member, Project project) {
        this.member = member;
        this.project = project;
    }

    public ProjectParticipant(Integer participantId, Member member, Project project) {
        this.participantId = participantId;
        this.member = member;
        this.project = project;
    }

    // --- Getter and Setter ---

    public Integer getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Integer participantId) {
        this.participantId = participantId;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}