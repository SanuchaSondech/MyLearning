package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.CompanyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyGroupRepository extends JpaRepository<CompanyGroup,Integer> {
}
