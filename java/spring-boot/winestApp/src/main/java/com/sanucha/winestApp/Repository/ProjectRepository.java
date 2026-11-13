package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    // หาโปรเจกต์ที่งานยังไม่เสร็จ (is_completed = false)
    List<Project> findByIsCompletedFalse();

    // หาโปรเจกต์ที่ยังจ่ายเงินไม่ครบ (paid_finished = false)
    List<Project> findByPaidFinishedFalse();

}