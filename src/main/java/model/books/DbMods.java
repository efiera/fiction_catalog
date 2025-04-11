package model.books;

import dbUtils.*;

public class DbMods {
    /*
     * Returns a "StringData" object that is full of field level validation
     * error messages (or "" for any field that passes validation).
     */

    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        // Validation
        errorMsgs.book_id = Validate.integerMsg(inputData.book_id, true);
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
            String sql = "INSERT INTO books (book_id, book_title, isbn, book_img, pub_date, " +
                    "web_user_id) values (?,?,?,?,?,?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setInt(1, Validate.convertInteger(inputData.book_id)); 
            pStatement.setString(2, inputData.book_title);
            pStatement.setInt(3, Validate.convertInteger(inputData.isbn));
            pStatement.setString(4, inputData.book_img);
            pStatement.setDate(5, Validate.convertDate(inputData.pub_date));
            pStatement.setInt(6, Validate.convertInteger(inputData.web_user_id));

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

}
