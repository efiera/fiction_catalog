package model.books;
public class StringData {
    public String book_id = ""; 
    public String book_title = ""; 
    public String isbn = ""; 
    public String book_img = ""; 
    public String pub_date = ""; 
    public String web_user_id = ""; 

    public String errorMsg = "";      // not actually in the database, used by the app 
                                      // to convey success or failure.    

    public int characterCount() {
        String s = this.book_id + this.book_title + this.isbn +
            this.book_img + this.pub_date + this.web_user_id;
        return s.length();
    }                                 
}
