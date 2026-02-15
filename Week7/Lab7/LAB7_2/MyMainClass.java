package LAB7_2;
class Animal {
  public void animalSound() {
    System.out.println("The animal makes a sound");
  }
}

class Pig extends Animal {
  public void animalSound() {
    System.out.println("The pig says: wee wee");
  }
}

class Dog extends Animal {
  public void animalSound() {
    System.out.println("The dog says: bow wow");
  }

  public void wagTail() {
    System.out.println("Dog wags its tail");
  }
}

public class MyMainClass {
  public static void main(String[] args) {
    Animal myAnimal = new Animal();  // Create a Animal object
    Animal myPig = new Pig();  // Create a Pig object
    Animal myDog = new Dog();  // Create a Dog object

    myAnimal.animalSound();
    myPig.animalSound();
    myDog.animalSound();

    Animal animal = new Dog(); // Upcasting
    animal.animalSound(); // Output: Dog barks

    if (animal instanceof Dog) {
            Dog dog = (Dog) animal;
            dog.wagTail(); // Output: Dog wags its tail
        }

  }
}
