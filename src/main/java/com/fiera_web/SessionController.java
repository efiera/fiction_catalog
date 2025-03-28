package com.fiera_web;

import org.springframework.web.bind.annotation.*;
import dbUtils.*;
import jakarta.servlet.http.*;
import model.webUser.StringData;
import view.WebUserView;

@RestController
public class SessionController {

    @RequestMapping(
        value = "/session/logonAPI",
        method = RequestMethod.GET,
        produces = "application/json",
        params = {"email", "password"}
    )
    public String logon(@RequestParam String email, @RequestParam String password, HttpSession session) {
        DbConn dbc = new DbConn();
        StringData userData;

        if (dbc.getErr().length() > 0) {
            userData = new StringData();
            userData.errorMsg = dbc.getErr();
        } else {
            userData = WebUserView.findUser(dbc, email, password);
            if (userData.errorMsg.length() == 0) {
                session.setAttribute("loggedOnUser", userData);
            } else {
                session.invalidate();
            }
        }
        dbc.close();
        return Json.toJson(userData);
    }

    @GetMapping(value = "/session/getProfileAPI", produces = "application/json")
    public String getProfile(HttpSession session) {
        StringData userData = new StringData();
        Object sessionUser = session.getAttribute("loggedOnUser");
        if (sessionUser != null) {
            userData = (StringData) sessionUser;
        } else {
            userData.errorMsg = "Cannot show profile -- no user logged in";
        }
        return Json.toJson(userData);
    }

    @GetMapping(value = "/session/logoffAPI", produces = "application/json")
    public String logoff(HttpSession session) {
        StringData sd = new StringData();
        if (session != null) {
            Object user = session.getAttribute("loggedOnUser");
            if (user != null) {
                System.out.println("Logging off");
            }
            session.invalidate();
        }
        sd.errorMsg = "User is now logged off";
        return Json.toJson(sd);
    }
}