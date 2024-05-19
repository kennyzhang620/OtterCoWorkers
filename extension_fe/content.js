var animElement = null;
var kx = 0; ky = 0;

function appendElement(classL, htmlL) {
   var newNode = document.createRange().createContextualFragment(htmlL);
   classL.appendChild(newNode);
}

function clearElements(classL) {
   while (classL.firstChild) {
       classL.removeChild(classL.firstChild);
   }

}

function sparkyElement(x, y) {

   const imgp = chrome.runtime.getURL("images/sparky_run_transparent.gif");
   const out = `
   <img src="${imgp}" id="sparky" style="
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    z-index: 9;
">
   `
   return out;
}

function initSparky() {
   appendElement(document.getElementsByTagName("header")[0], sparkyElement(0,0))
   animElement = document.getElementById("sparky");
}

function setSparky(x,y, scaleX, scaleY) {
   if (animElement != null) {

      animElement.style.left = `${x}%`;
      animElement.style.top = `${y}%`;
      animElement.style.transform = `scale(${scaleX}, ${scaleY})`;
   }
}

function setSparkyAnimState(src) {
   const imgp = chrome.runtime.getURL(src);
   if (animElement != null) {
      animElement.src = imgp;
   }
}

function animationSeq1() {
   kx = -50;

   const testAnim = setInterval(animator1, 40);
   setSparkyAnimState("images/sparky_run_transparent.gif")

   function animator1() {
      setSparky(kx++, 30, -1, 1);
   
      if (kx > 40) {
         clearInterval(testAnim);
         setSparkyAnimState("images/stormy_temp.webp")
      }
   }
}

function animationSeq2() {
   kx = 60;

   const testAnim = setInterval(animator2, 40);
   setSparkyAnimState("images/sparky_run_transparent.gif")
   
   function animator2() {
      setSparky(kx--, 30, 1, 1);
   
      if (kx <= 0) { 
         clearInterval(testAnim);
         setSparkyAnimState("images/stormy_temp.webp")
      }
   }
}



console.log('adding listener')
initSparky();


var s = false
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
   // If the received message has the expected format...
   if (msg.command === 'move') {

      if (!s) {
         animationSeq1();
         s = true
      }
      else {
         animationSeq2();
         s = false;
      }
       // Call the specified callback, passing
       // the web-page's DOM content as argument
       sendResponse({result: "yay"});
   }
});