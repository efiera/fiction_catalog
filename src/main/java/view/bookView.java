package view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import model.books.*;
import dbUtils.*;

public class bookView {

    public static StringDataList getAllBooks(DbConn dbc) {

        // sdl will be an empty array and DbError with "" 
        StringDataList sdl = new StringDataList(); 

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }
        
        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();
        
        try {
            String sql = "SELECT * "
                    + "FROM books "
                    + "ORDER BY book_id ";  // always order by something, not just random order.
            
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {
                
                sd = new StringData();
                
                // the Format methods do not throw exceptions. If they find illegal data (like you 
                // tried to format a date as an integer), they return an error message (instead of 
                // returning the formatted value). So, you'll see these error messages right in the 
                // API output (JSON data) and/or you'll see it on the page in the UI.

                sd.book_id = Format.fmtInteger(results.getObject("book_id"));
                sd.book_title = Format.fmtString(results.getObject("book_title"));
                //sd.isbn = Format.fmtInteger(results.getObject("isbn"));
                //sd.book_img = Format.fmtString(results.getObject("user_image"));
                //sd.pub_date = Format.fmtDate(results.getObject("birthday"));
                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in bookView.getAllBooks(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }
}
