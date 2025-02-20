package com.fiera_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    @RequestMapping("/hello")
        public String helloController() {
        return "<h1>Hello World</h1>";
    }
    @RequestMapping("/serpa")
        public String serpaController() {
        return "<h1>This is the server side page to Fiction Catalog</h1>";
    }
}