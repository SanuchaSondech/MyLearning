package com.sanucha.BorrowBookAppV3.service.personService;

import com.sanucha.BorrowBookAppV3.entity.Person;
import com.sanucha.BorrowBookAppV3.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class PersonServiceProcess implements PersonService{

    private final PersonRepository personRepository;

    @Autowired
    public PersonServiceProcess(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    @Override
    public List<Person> findAll() {
        return personRepository.findAll();
    }

    @Override
    public Person findById(Integer id) {
        Optional<Person> data = personRepository.findById(id);
        Person person = null;
        if (data.isPresent()){
            person = data.get();
        } else {
            throw new RuntimeException("Not found user ID : " + id);
        }
        return person;
    }

    @Override
    @Transactional
    public Person save(Person person) {
        return personRepository.save(person);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Not found user ID : " + id);
        }
        personRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Person register(Person person) {
        if(personRepository.existsByPhoneNumber(person.getPhoneNumber())){
            throw new RuntimeException("This phone number is already in use.");
        }
        person.setScore(10);
        person.setBanned(false);
        return personRepository.save(person);
    }

    @Override
    public Person login(String phoneNumber, String password) {
        Optional<Person> existPerson = personRepository.findByPhoneNumber(phoneNumber);

        if (existPerson.isEmpty()){
            throw new RuntimeException("This phone number is not found in data base.");
        }

        Person person = existPerson.get();
        if (!person.getPassword().equals(password)){
            throw new RuntimeException("The password is incorrect.");
        }

        return person;
    }
}
