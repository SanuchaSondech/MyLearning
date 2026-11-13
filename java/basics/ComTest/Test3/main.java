class Character {

    private String name ;
    private int health ;
    private int attackPower ;

    // คอสตูมเมอร์
    public Character(String name, int health, int attackPower){

        name = this.name ;
        health = this.health ;
        attackPower = this.attackPower ;
    }

    // การโจมตีปกติ
    public void attack(Character taarget){

        this.health = this.health - attackPower;
        String Massege = String.format("%s performs a powerful strike on %s for %d damage", name, this.name, attackPower) ;
        System.out.println(Massege);
    }

    // การโจมตีพิเศษ
    public void attack(Character taarget, int bonusDamage){
 
        this.health = this.health - (attackPower + bonusDamage);
        String Massege = String.format("%s performs a powerful strike on %s for %d damage",  name, this.name, attackPower) ;
        System.out.println(Massege);
    }
    
} 

class Hero extends Character {

    // คอสตูมเมอร์
    public Hero(String name, int health, int attackPower){

        super(name, health, attackPower);
    }

    // การโจมตีของ Hero
     public void attack(Character taarget){

        
        String Massege = String.format("%s performs a powerful strike on %s for %d damage", ) ;
        System.out.println(Massege);
    } 

}

class Monster extends Character {

    // คอสตูมเมอร์
    public Monster(String name, int health, int attackPower){

            super(name, health, attackPower);
    }

    // การโจมตีของ Monster
     public void attack(Character taarget){

        String Massege = String.format("%s performs a powerful strike on %s for %d damage", ) ;
        System.out.println(Massege);
    } 

}

public class main {
    public static void main (String arg[]){

        // สร้าง Hero
        Character Aragon = new Hero("Aragon", 100, 30);

        // สร้าง Monster
        Character Orc = new Monster("Orc", 100, 20);







    }
}
