package com.sanucha.winestApp.Repository;

import com.sanucha.winestApp.Entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member,Integer> {

    // ดึงเฉพาะสมาชิกที่ยังไม่ลาออก
    List<Member> findByActiveTrue();
}
