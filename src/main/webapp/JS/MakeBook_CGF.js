"use strict"; 

function MakeBook_CGF() {

    var ele = document.createElement("div");

    var myBook = MakeBook({theTitle: "awesome", thePrice: 20, imgURL : 'pics/book_blue.jpg',
        imgObjList: [
            { "display": "blue book", "val": "pics/book_blue.jpg" },
            { "display": "purple book", "val": "pics/book_purple.png" },
            { "display": "red book", "val": "pics/book_red.png" }
            ]
    });
    ele.appendChild(myBook);

    var yourBook = MakeBook({});
    ele.appendChild(yourBook);

    return ele;
}