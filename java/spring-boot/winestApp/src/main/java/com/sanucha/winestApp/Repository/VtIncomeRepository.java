package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.VtIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VtIncomeRepository extends JpaRepository<VtIncome,Integer> {
    @Query("SELECT v FROM VtIncome v WHERE v.member.memberId = :memberId")
    List<VtIncome> findByMemberId(@Param("memberId") Integer memberId);
}