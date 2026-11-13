package com.sanucha.winestApp.Service.projectService;

import com.sanucha.winestApp.Entity.Project;
import java.util.List;

public interface ProjectService {

    // 1. สร้างโปรเจกต์ใหม่
    Project createProject(String name, Double totalPrice);

    // 2. ดูข้อมูลโปรเจกต์จาก ID
    Project getProjectById(Integer id);

    // 3. ดูรายชื่อโปรเจกต์ทั้งหมด
    List<Project> getAllProjects();

    // 4. เปลี่ยนสถานะ "งานเสร็จ" (isCompleted) - ตามรูปภาพ "เสร็จงานก่อนหรือจ่ายเงินครบก่อนก็ได้"
    void updateWorkStatus(Integer projectId, Boolean isFinished);

    // 5. จ่ายเงิน (Logic 90/10) - เมื่อจ่ายแล้วจะเซต paidFinished = true
    void payProject(Integer projectId);

    // 6. ดูโปรเจกต์ที่งานยังไม่เสร็จ (isCompleted = false)
    List<Project> getUnfinishedWork();

    // 7. ดูโปรเจกต์ที่ยังจ่ายเงินไม่ครบ (paidFinished = false)
    List<Project> getUnpaidProjects();

    // 8. ลบโปรเจกต์ (ลบข้อมูลที่เกี่ยวข้องทั้งหมด)
    void deleteProject(Integer projectId);

    void partialPayProject(Integer projectId, Double payAmount);
}