package com.sanucha.winestApp.Service.memberService;

import com.sanucha.winestApp.Entity.Member;
import java.util.List;

public interface MemberService {
    Member addMember(Member member);
    Member updateMemberName(Integer id, String newName);
    List<Member> getAllActiveMembers();
    Member getMemberById(Integer id);
    void deleteMember(Integer id);
    void addBalance(Integer memberId, Double amount);
    void withdraw(Integer memberId, Double amount);
}