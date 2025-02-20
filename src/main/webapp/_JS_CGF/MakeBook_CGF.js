function MakeBook_CGF() {

    var ele = document.createElement("div");

    var myBook = MakeBook({theTitle: "awesome", thePrice: 20, imgURL : 'pics/book_blue.jpg'});
    ele.appendChild(myBook);

    var yourBook = MakeBook({});
    ele.appendChild(yourBook);

    return ele;
}