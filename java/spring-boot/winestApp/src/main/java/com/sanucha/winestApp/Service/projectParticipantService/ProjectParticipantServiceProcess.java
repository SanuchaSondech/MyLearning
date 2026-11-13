package com.sanucha.winestApp.Service.projectParticipantService;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.Project;
import com.sanucha.winestApp.Entity.ProjectParticipant;
import com.sanucha.winestApp.Repository.ProjectParticipantRepository;
import com.sanucha.winestApp.Repository.ProjectRepository;
import com.sanucha.winestApp.Service.memberService.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectParticipantServiceProcess implements ProjectParticipantService {

    @Autowired private ProjectParticipantRepository participantRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private MemberService memberService;

    @Override
    @Transactional
    public void addParticipant(Integer projectId, Integer memberId) {
        // เช็คก่อนว่า Project มีจริงไหม
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("ไม่พบโปรเจกต์ไอดี: " + projectId));

        // เช็คว่า Member มีจริงไหม
        Member member = memberService.getMemberById(memberId);

        // ตรวจสอบว่าคนนี้อยู่ในโปรเจกต์นี้อยู่แล้วหรือยัง (ป้องกันการเพิ่มซ้ำ)
        boolean exists = participantRepository.existsByProjectAndMember(project, member);
        if (exists) throw new RuntimeException("Member คนนี้อยู่ในโปรเจกต์แล้ว");

        ProjectParticipant participant = new ProjectParticipant(member, project);
        participantRepository.save(participant);
    }

    @Override
    @Transactional
    public void removeParticipant(Integer participantId) {
        participantRepository.deleteById(participantId);
    }

    @Override
    public List<ProjectParticipant> getParticipantsByProjectId(Integer projectId) {
        return participantRepository.findByProjectProjectId(projectId);
    }
}