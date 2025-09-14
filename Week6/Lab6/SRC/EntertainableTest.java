package SRC;

public class EntertainableTest {

    public static void main(String[] args) {

        
        Entertainable bts = new BTS();
        bts.sing();
        bts.dance();

        Entertainable aespa = new Aespa();
        aespa.sing();
        aespa.dance();

        Entertainable fora = new Fora();
        fora.sing();
        fora.dance();

        Entertainable blackPink = new Entertainable(){

            @Override
            public void sing() {
                System.out.println("BlackPink is singing a song.");
            }

            @Override
            public void dance() {
                System.out.println("BlackPink is dancing to the music.");
            }
        };

    }
}
