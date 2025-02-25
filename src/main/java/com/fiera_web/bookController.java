package com.fiera_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import model.books.*;
import dbUtils.*;
import view.bookView;

@RestController
public class bookController {

    @RequestMapping(value = "/books/getAll", produces = "application/json")
    public String allBooks() {

        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = bookView.getAllBooks(dbc);

        dbc.close(); // EVERY code path that opens a db connection must close it
                     // (or else you have a database connection leak).

        return Json.toJson(list); // convert sdl obj to JSON Format and return that.
    }
}