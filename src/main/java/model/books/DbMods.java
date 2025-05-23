package model.books;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dbUtils.*;

public class DbMods {
    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */

    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        // Validation
        //errorMsgs.book_id = Validate.integerMsg(inputData.book_id, false);
        errorMsgs.book_title = Validate.stringMsg(inputData.book_title, 45, true);
        // if (inputData.userPassword.compareTo(inputData.userPassword2) != 0) { // case sensative comparison
        //     errorMsgs.userPassword2 = "Both passwords must match";
        // }
        errorMsgs.isbn = Validate.integerMsg(inputData.isbn, false);
        errorMsgs.book_img = Validate.stringMsg(inputData.book_img, 300, false);        
        errorMsgs.pub_date = Validate.dateMsg(inputData.pub_date, false);
        errorMsgs.web_user_id = Validate.integerMsg(inputData.web_user_id, true);

        return errorMsgs;
    } // validate

    public static StringData insert(StringData inputData, DbConn dbc) {
        
        StringData errorMsgs = new StringData();
        errorMsgs = validate(inputData);
        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            // Start preparing SQL statement
            String sql = "INSERT INTO books (book_title, isbn, book_img, pub_date, " +
                    "web_user_id) values (?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.book_title);
            pStatement.setInt(2, Validate.convertInteger(inputData.isbn));
            pStatement.setString(3, inputData.book_img);
            pStatement.setDate(4, Validate.convertDate(inputData.pub_date));
            pStatement.setInt(5, Validate.convertInteger(inputData.web_user_id));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That ID is already taken - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        // For update, we also need to check that book_id has been supplied by the user...
        errorMsgs.book_id = Validate.integerMsg(updateData.book_id, true);

        if (errorMsgs.characterCount() > 0) { // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /* Useful to know the exact field names in the database... 
             * String sql =
             * "SELECT web_user_id, user_email, user_password, user_image, membership_fee, "
             * "birthday, web_user.user_role_id, user_role_type "+
             * "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id "
             * "ORDER BY web_user_id ";
             */

            String sql = "UPDATE books SET book_title = ?, isbn = ?, "+
                    "book_img = ?, pub_date = ?, web_user_id = ? WHERE book_id = ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setInt(6, Validate.convertInteger(updateData.book_id)); 
            pStatement.setString(1, updateData.book_title);
            pStatement.setInt(2, Validate.convertInteger(updateData.isbn));
            pStatement.setString(3, updateData.book_img);
            pStatement.setDate(4, Validate.convertDate(updateData.pub_date));
            pStatement.setInt(5, Validate.convertInteger(updateData.web_user_id));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to
                                             // the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk
                    // sql update OR the web User id (supplied by the client side) does not exist.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid Web User Id - " + errorMsgs.errorMsg;
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That title is already taken - " + errorMsgs.errorMsg;
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update

    public static StringData getById(DbConn dbc, String id) {
        StringData sd = new StringData();
        // This case already tested in the controller, but ("belt and suspenders")
        // we are double checking here as well.
        if (id == null) {
            sd.errorMsg = "Cannot getById (book): id is null";
            return sd;
        }

        Integer intId;
        try {
            intId = Integer.valueOf(id);
        } catch (Exception e) {
            sd.errorMsg = "Cannot getById (book): URL parameter 'id' can't be converted to an Integer.";
            return sd;
        }
        try {
            String sql = "SELECT book_id, book_title, isbn, book_img, pub_date,"
                    + "books.web_user_id, user_email "
                    + "FROM books, web_user WHERE books.web_user_id = web_user.web_user_id "
                    + "AND book_id = ?";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the
            // the first (and only) ?
            stmt.setInt(1, intId);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set

                // plainInteger returns integer converted to string with no commas.
                sd.book_id = Format.fmtInteger(results.getObject("book_id"));
                sd.book_title = Format.fmtString(results.getObject("book_title"));
                sd.isbn = Format.fmtInteger(results.getObject("isbn"));
                sd.book_img = Format.fmtString(results.getObject("book_img"));
                sd.pub_date = Format.fmtDate(results.getObject("pub_date"));
                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sd.user_email = Format.fmtString(results.getObject("user_email"));

            } else {
                sd.errorMsg = "Book Not Found.";
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.books.DbMods.getById(): " + e.getMessage();
        }
        return sd;
    } // getById

    public static StringData delete(DbConn dbc, String book_id) {

        StringData sd = new StringData();

        if (book_id == null) {
            sd.errorMsg = "model.books.DbMods.delete: " +
                    "cannot delete book record because 'book_id' is null";
            return sd;
        }

        sd.errorMsg = dbc.getErr();
        if (sd.errorMsg.length() > 0) { // cannot proceed, db error
            return sd;
        }

        try {

            String sql = "DELETE FROM books WHERE book_id = ?";

            // Compile the SQL (checking for syntax errors against the connected DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode book data into the prepared statement.
            pStatement.setString(1, book_id);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                sd.errorMsg = "Record not deleted - there was no record with book_id " + book_id;
            } else if (numRowsDeleted > 1) {
                sd.errorMsg = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in model.books.DbMods.delete(): " + e.getMessage();
        }

        return sd;
    }

}
