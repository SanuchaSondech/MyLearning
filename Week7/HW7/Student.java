public class Student {

    private String id ;
    private String name;
    private double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }

    // เทียบว่าใช่คนเดียวกันไหม
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        } else if (!(obj instanceof Student)) {
            return false;
        }
        Student other = (Student) obj;
        return id.equals(other.id);
    }

}
