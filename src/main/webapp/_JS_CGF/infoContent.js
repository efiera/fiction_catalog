"use strict";

function infoContent() {

  var ele = document.createElement("div");
  ele.classList.add("infoContent");
  ele.innerHTML = `
    <h2>Info</h2>
    <p>I love cats!</p>
  `;
  return ele;
  
}

