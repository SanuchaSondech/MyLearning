package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.ProjectParticipant;
import com.sanucha.winestApp.Service.projectParticipantService.ProjectParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "*")
public class ProjectParticipantController {

    private final ProjectParticipantService participantService;

    @Autowired
    public ProjectParticipantController(ProjectParticipantService participantService) {
        this.participantService = participantService;
    }

    // 1. เพิ่ม Member เข้าไปในโปรเจกต์
    @PostMapping("/add")
    public ResponseEntity<String> addParticipant(
            @RequestParam Integer projectId,
            @RequestParam Integer memberId) {
        try {
            participantService.addParticipant(projectId, memberId);
            return ResponseEntity.ok("เพิ่มสมาชิกเข้าสู่โปรเจกต์เรียบร้อยแล้ว");
        } catch (RuntimeException e) {
            // กรณีหาโปรเจกต์/คนไม่เจอ หรือคนนั้นอยู่ในงานอยู่แล้ว
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. ลบคนออกจากโปรเจกต์ (กรณีเลือกผิดคน)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeParticipant(@PathVariable Integer id) {
        try {
            participantService.removeParticipant(id);
            return ResponseEntity.ok("นำสมาชิกออกจากโปรเจกต์เรียบร้อย");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("ไม่สามารถลบได้: " + e.getMessage());
        }
    }

    // 3. ดูรายชื่อทุกคนที่ทำงานในโปรเจกต์นั้นๆ
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectParticipant>> getParticipantsByProject(@PathVariable Integer projectId) {
        List<ProjectParticipant> participants = participantService.getParticipantsByProjectId(projectId);
        return ResponseEntity.ok(participants);
    }
}