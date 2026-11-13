package com.sanucha.winestApp.Service.projectParticipantService;

import com.sanucha.winestApp.Entity.ProjectParticipant;
import java.util.List;

public interface ProjectParticipantService {
    // เพิ่มคนเข้าโปรเจกต์
    void addParticipant(Integer projectId, Integer memberId);

    // ลบคนออกจากโปรเจกต์
    void removeParticipant(Integer participantId);

    // ดูรายชื่อคนทั้งหมดในโปรเจกต์หนึ่งๆ
    List<ProjectParticipant> getParticipantsByProjectId(Integer projectId);
}