package com.sanucha.BorrowBookAppV3.repository;

import com.sanucha.BorrowBookAppV3.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person,Integer> {
    boolean existsByPhoneNumber(String phoneNumber);
    Optional<Person> findByPhoneNumber(String phoneNumber);
}
