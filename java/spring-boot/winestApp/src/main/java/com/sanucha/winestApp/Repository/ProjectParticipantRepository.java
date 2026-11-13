package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.Member;
import com.sanucha.winestApp.Entity.Project;
import com.sanucha.winestApp.Entity.ProjectParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant,Integer> {

    List<ProjectParticipant> findByProjectProjectId(Integer projectId);
    boolean existsByProjectAndMember(Project project, Member member);

}
