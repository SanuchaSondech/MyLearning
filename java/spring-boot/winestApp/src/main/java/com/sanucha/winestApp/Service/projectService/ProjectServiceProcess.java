package com.sanucha.winestApp.Service.projectService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.Project;
import com.sanucha.winestApp.Entity.ProjectParticipant;
import com.sanucha.winestApp.Repository.ProjectParticipantRepository;
import com.sanucha.winestApp.Repository.ProjectRepository;
import com.sanucha.winestApp.Service.companyGroupService.CompanyGroupService;
import com.sanucha.winestApp.Service.memberService.MemberService;
import com.sanucha.winestApp.Service.statementService.StatementService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectServiceProcess implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectParticipantRepository participantRepository;
    private final MemberService memberService;
    private final CompanyGroupService companyService;
    private final StatementService statementService;

    @Autowired
    public ProjectServiceProcess(ProjectRepository projectRepository,
                                 ProjectParticipantRepository participantRepository,
                                 MemberService memberService,
                                 CompanyGroupService companyService,
                                 StatementService statementService) {
        this.projectRepository = projectRepository;
        this.participantRepository = participantRepository;
        this.memberService = memberService;
        this.companyService = companyService;
        this.statementService = statementService;
    }

    @Override
    @Transactional
    public Project createProject(String name, Double totalPrice) {
        Project project = new Project(name, totalPrice, LocalDate.now());
        return projectRepository.save(project);
    }

    @Override
    public Project getProjectById(Integer id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ไม่พบโปรเจกต์ไอดี: " + id));
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    @Transactional
    public void updateWorkStatus(Integer projectId, Boolean isFinished) {
        Project project = getProjectById(projectId);
        project.setCompleted(isFinished);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void payProject(Integer projectId) {
        Project project = getProjectById(projectId);

        if (project.getPaidFinished()) {
            throw new RuntimeException("โปรเจกต์นี้ชำระเงินเรียบร้อยแล้ว ไม่สามารถจ่ายซ้ำได้");
        }

        List<ProjectParticipant> participants = project.getParticipants();
        if (participants == null || participants.isEmpty()) {
            throw new RuntimeException("ไม่สามารถจ่ายเงินได้ เนื่องจากไม่มีผู้เข้าร่วมโปรเจกต์");
        }

        // Logic 90/10
        Double totalPrice = project.getTotalPrice();
        Double companyShare = totalPrice * 0.10;
        Double memberPool = totalPrice * 0.90;
        Double sharePerPerson = memberPool / participants.size();

        // 1. จ่ายเงินให้ Member ทุกคน (addBalance จัดการบันทึก Statement ให้แล้ว)
        for (ProjectParticipant p : participants) {
            Member member = p.getMember();
            memberService.addBalance(member.getMemberId(), sharePerPerson);
        }

        // 2. จัดการส่วนของค่าย
        statementService.record(null, companyShare, "ส่วนแบ่งค่าย 10% จากงาน: " + project.getProjectName());
        companyService.updateCompanyFinancials(totalPrice, companyShare);

        // 3. อัปเดตสถานะการเงินใน Project
        project.setAmountPaid(totalPrice);
        project.setPaidFinished(true);
        projectRepository.save(project);
    }

    @Override
    @Transactional
    public void partialPayProject(Integer projectId, Double payAmount) {
        Project project = getProjectById(projectId);

        if (project.getPaidFinished()) {
            throw new RuntimeException("โปรเจกต์นี้ชำระเงินครบแล้ว");
        }

        List<ProjectParticipant> participants = project.getParticipants();
        if (participants == null || participants.isEmpty()) {
            throw new RuntimeException("ไม่สามารถจ่ายเงินได้ เนื่องจากไม่มีผู้เข้าร่วมโปรเจกต์");
        }

        // คำนวณยอดที่จ่ายได้จริง (ห้ามเกินยอดคงเหลือ)
        Double remaining = project.getTotalPrice() - project.getAmountPaid();
        Double actualPay = Math.min(payAmount, remaining);

        // แบ่ง 90/10
        Double companyShare = actualPay * 0.10;
        Double memberPool   = actualPay * 0.90;
        Double sharePerPerson = memberPool / participants.size();

        // 1. จ่ายให้ Member ทุกคน (addBalance จัดการบันทึก Statement ให้แล้ว)
        for (ProjectParticipant p : participants) {
            Member member = p.getMember();
            memberService.addBalance(member.getMemberId(), sharePerPerson);
        }

        // 2. จัดการส่วนของค่าย
        statementService.record(null, companyShare, "ส่วนแบ่งค่าย 10% จากงาน: " + project.getProjectName());
        companyService.updateCompanyFinancials(actualPay, companyShare);

        // 3. อัปเดต amountPaid และเช็คว่าครบหรือยัง
        project.setAmountPaid(project.getAmountPaid() + actualPay);
        if (project.getAmountPaid() >= project.getTotalPrice()) {
            project.setPaidFinished(true);
        }
        projectRepository.save(project);
    }

    @Override
    public List<Project> getUnfinishedWork() {
        return projectRepository.findByIsCompletedFalse();
    }

    @Override
    public List<Project> getUnpaidProjects() {
        return projectRepository.findByPaidFinishedFalse();
    }

    @Override
    @Transactional
    public void deleteProject(Integer projectId) {
        Project project = getProjectById(projectId);

        // ป้องกันลบโปรเจกต์ที่มีการจ่ายเงินไปแล้ว (ทั้งบางส่วนและครบ)
        if (project.getPaidFinished() || project.getAmountPaid() > 0) {
            throw new RuntimeException("ไม่สามารถลบโปรเจกต์ที่มีการชำระเงินไปแล้วได้");
        }

        List<ProjectParticipant> participants = project.getParticipants();
        if (participants != null) {
            participantRepository.deleteAll(participants);
        }

        projectRepository.delete(project);
    }
}