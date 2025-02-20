"use strict";

function MakeBook({
    theTitle = "worker", 
    thePrice = 0,
    imgURL = null}) {

    var bookObj = document.createElement("div");
    bookObj.classList.add("book");

    bookObj.title = theTitle;
    var price = thePrice;

    bookObj.setTitle = function (newTitle) {
        bookObj.title = newTitle;
        display(); // show updated property on the page
    };

    bookObj.changePrice = function (changeRate) {
        var n = Number(changeRate);
        console.log("changing price by adding " + n);
        price = price + n;
        display(); // show updated price on the page
    };

    bookObj.innerHTML = `
      <div class='bookInfoClass'></div>
      <button class='titleButtonClass'>Change Title to: </button>
      <input class='newTitleInputClass'/> <br/>
      <button class='priceButtonClass'>Change Price By Amount: </button>
      <input class='priceAddInputClass'/> 
    `;
    if (imgURL == null) {
        bookObj.innerHTML += "<p>image not available</p>";
    } else {
        bookObj.innerHTML += `<p><img src='${imgURL}'/></p>`;
    };

    var bookInfo = bookObj.getElementsByClassName("bookInfoClass")[0];
    var titleButton = bookObj.getElementsByClassName("titleButtonClass")[0];
    var newTitleInput = bookObj.getElementsByClassName("newTitleInputClass")[0];
    var priceButton = bookObj.getElementsByClassName("priceButtonClass")[0];
    var priceAdd = bookObj.getElementsByClassName("priceAddInputClass")[0];

    var display = function ( ) {
        bookInfo.innerHTML = `
          <p>
             Title: ${bookObj.title} <br/>
             Price: ${formatCurrency(price)} <br/>
          </p>
        `;
    };
    display();

    titleButton.onclick = function () {
        bookObj.setTitle(newTitleInput.value);
    };

    priceButton.onclick = function () {
        if (isNaN(priceAdd.value)) {
            console.log("not a number");
            return;
        }
        bookObj.changePrice(priceAdd.value);
    };

    function strToNum(str) {
        str += ""; // convert to string, if it's not a string.

        // remove formatting characters, if there are any
        str = str.replace("$", "");
        str = str.replace(",", "");

        var num = Number(str); // convert to number again.
        return num;
    }

    //private function to format price        
    function formatCurrency(numStr) {

        var num = strToNum(numStr); // convert formatted string to number.

        var formattedNum = num.toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits: 2});
        console.log("formattedNum:" + formattedNum);
        return formattedNum;
    }

    return bookObj;
}