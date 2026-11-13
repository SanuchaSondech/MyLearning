package com.sanucha.BorrowBookAppV3.service.borrowingService;

import com.sanucha.BorrowBookAppV3.entity.Book;
import com.sanucha.BorrowBookAppV3.entity.Borrowing;
import com.sanucha.BorrowBookAppV3.entity.Person;
import com.sanucha.BorrowBookAppV3.repository.BookRepository;
import com.sanucha.BorrowBookAppV3.repository.BorrowingRepository;
import com.sanucha.BorrowBookAppV3.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingServiceProcess implements BorrowingService{

    private final BorrowingRepository borrowingRepository;
    private final PersonRepository personRepository;
    private final BookRepository bookRepository;

    @Autowired
    public BorrowingServiceProcess(BorrowingRepository borrowingRepository, PersonRepository personRepository, BookRepository bookRepository) {
        this.borrowingRepository = borrowingRepository;
        this.personRepository = personRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    @Transactional
    public void borrowBook(Integer personId, Integer bookId) {
        // ตรวจสอบว่าผู้ใช้งานมีจริง
        Optional<Person> personOpt = personRepository.findById(personId);
        if (personOpt.isEmpty()){
            throw new RuntimeException("Not found user ID : " + personId);
        }
        Person person = personOpt.get();

        // ตรวจสอบว่าผู้ใช้ยังไม่ถูกแบน
        if (person.isBanned()){
            throw new RuntimeException("You are banned");
        }

        // ตรวจสอบว่าผู้ใช้มีหนังสือที่ยืมไม่เกิน 3 เล่ม
        List<Borrowing> personBorrowings = borrowingRepository.findByPersonIdAndReturnDateIsNull(personId);
        if (personBorrowings.size() >= 3){
            throw new RuntimeException("Borrowing limit exceeded: You have 3 active borrows.");
        }

        // ตรวจสอบว่าหนังสือมีจริง
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()){
            throw new RuntimeException("Not found book ID : " + bookId);
        }
        Book book = bookOpt.get();

        // ตรวจสอบว่าหนังถูกลืมหรือยัง
        if(!book.isAvailable()){
            throw new RuntimeException("Book is not available for borrowing.");
        }

        // เมื่อเงื่อนไขผ่าน
        Borrowing borrowing = new Borrowing(person, book, LocalDate.now());
        borrowingRepository.save(borrowing);

        // เปลี่ยนสถานะหนังสือ
        book.setAvailable(false);
        bookRepository.save(book);
    }

    @Override
    @Transactional
    public void returnBook(Integer borrowingId) {
        // มีรายการการยืมนั้นจริงไหม
        Optional<Borrowing> borrowingOpt = borrowingRepository.findById(borrowingId);
        if(borrowingOpt.isEmpty()){
            throw new RuntimeException("Borrowing record not found ID: " + borrowingId);
        }
        Borrowing borrowing = borrowingOpt.get();

        // คืนหรือยัง
        if(borrowing.getReturnDate() != null){
            throw new RuntimeException("This book has already been returned.");
        }

        // เมื่อเงื่อนไขผ่าน
        borrowing.setReturnDate(LocalDate.now());
        borrowingRepository.save(borrowing);

        // เปลี่ยนสถานะหนังสือ
        Book book = borrowing.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        // เพิ่มลดคะแนน
        Person person = borrowing.getPerson();
        LocalDate borrowDate = borrowing.getBorrowDate();
        LocalDate nowDate = LocalDate.now();

        long dayBetween = borrowDate.until(nowDate, ChronoUnit.DAYS);

        int currentScore = person.getScore();
        int newScore = currentScore;

        if (dayBetween <= 30){
            if (currentScore < 10){
                newScore = currentScore + 1;
            }
        } else {
            newScore = currentScore - 2;
            if (newScore < 0){
                person.setBanned(true);
            }
        }

        // อัพเดตข้อมูล
        person.setScore(newScore);
        personRepository.save(person);
    }

    @Override
    public List<Borrowing> findActiveBorrowingByPerson(Integer personId) {
        return borrowingRepository.findByPersonIdAndReturnDateIsNull(personId);
    }

    @Override
    public List<Borrowing> findAllHistory() {
        return borrowingRepository.findAll();
    }

    @Override
    public List<Borrowing> findAllHistoryNotreturn() {
        return borrowingRepository.findByReturnDateIsNull();
    }
}