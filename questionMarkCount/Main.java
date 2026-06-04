import java.util.*; 
import java.io.*;

class Main {

  public static boolean QuestionsMarks(String str) {
    boolean atLeastOnce = false;
    for(int i = 0; i < str.length(); i++) {      
      if(!(str.charAt(i) >= '0' && str.charAt(i) <= '9'))
        continue;
      int a = 0;
      int j = i;
      while(j < str.length() && str.charAt(j) >= '0' && str.charAt(j) <= '9') {
        a = a * 10 + ((int)str.charAt(j) - 48);
        j++;
      }
      if(a <= 10) {
        int count = 0;
        while(j < str.length() && !(str.charAt(j) >= '0' && str.charAt(j) <= '9')) {
          if(str.charAt(j) == '?')
            count++;
          j++;
        }
        int b = 0;
        while(j < str.length() && str.charAt(j) >= '0' && str.charAt(j) <= '9') {
          b = b * 10 + ((int)str.charAt(j) - 48);
          j++;
        }
        if(a + b == 10) {
          if(count != 3)
            return false;
          atLeastOnce = true;
        }
      }
    }  
    return atLeastOnce;
  }

  public static void main (String[] args) {  

    // keep this function call here     
    Scanner s = new Scanner(System.in);
    System.out.print(QuestionsMarks(s.nextLine())); 
  }

}