package com.sanucha.winestApp.Controller;

import com.sanucha.winestApp.Entity.Project;
import com.sanucha.winestApp.Service.projectService.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*") // เชื่อมต่อกับ Frontend
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // 1. สร้างโปรเจกต์ใหม่ (ชื่อโปรเจกต์ และ ราคารวม)
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestParam String name, @RequestParam Double totalPrice) {
        return ResponseEntity.ok(projectService.createProject(name, totalPrice));
    }

    // 2. ดูโปรเจกต์ทั้งหมด
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // 3. ดูโปรเจกต์ตาม ID (เพื่อดูว่าใครเข้าร่วมบ้าง)
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    // 4. อัปเดตสถานะ "งานเสร็จ" (True/False)
    @PatchMapping("/{id}/work-status")
    public ResponseEntity<String> updateWorkStatus(
            @PathVariable Integer id,
            @RequestParam Boolean isFinished) {
        projectService.updateWorkStatus(id, isFinished);
        return ResponseEntity.ok("อัปเดตสถานะงานเสร็จสมบูรณ์เรียบร้อย");
    }

    // 5. 🔥 ปุ่มกดจ่ายเงิน (Logic 90/10 ที่รอคอย)
    @PostMapping("/{id}/pay")
    public ResponseEntity<String> payProject(@PathVariable Integer id) {
        try {
            projectService.payProject(id);
            return ResponseEntity.ok("ดำเนินการจ่ายเงินเรียบร้อย (Member แบ่งกัน 90% และค่ายหัก 10%)");
        } catch (RuntimeException e) {
            // กรณีไม่มีคนในงาน หรือจ่ายไปแล้ว
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 6. ดูเฉพาะงานที่ "ยังทำไม่เสร็จ"
    @GetMapping("/unfinished")
    public ResponseEntity<List<Project>> getUnfinishedWork() {
        return ResponseEntity.ok(projectService.getUnfinishedWork());
    }

    // 7. ดูเฉพาะงานที่ "ยังไม่ได้จ่ายเงิน" (ค้างจ่าย)
    @GetMapping("/unpaid")
    public ResponseEntity<List<Project>> getUnpaidProjects() {
        return ResponseEntity.ok(projectService.getUnpaidProjects());
    }

    // 8. ลบโปรเจกต์
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(@PathVariable Integer id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok("ลบโปรเจกต์เรียบร้อยแล้ว");
        } catch (RuntimeException e) {
            // กรณีจ่ายเงินไปแล้ว จะลบไม่ได้ตาม Logic ใน Service
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // จ่ายเงินบางส่วน (กดได้หลายครั้งจนกว่าจะครบ totalPrice)
    @PostMapping("/{id}/partial-pay")
    public ResponseEntity<String> partialPayProject(
            @PathVariable Integer id,
            @RequestParam Double amount) {
        try {
            projectService.partialPayProject(id, amount);
            return ResponseEntity.ok("ชำระเงินบางส่วนสำเร็จ");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}