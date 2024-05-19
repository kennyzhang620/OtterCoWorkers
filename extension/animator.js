var animElement = null;
var animImg = null;
var animText = null
var kx = 0; ky = 0; 
var anilock = false

function appendElement(classL, htmlL) {
    var newNode = document.createRange().createContextualFragment(htmlL);
    classL.appendChild(newNode);
 }
 
 function clearElements(classL) {
    while (classL.firstChild) {
        classL.removeChild(classL.firstChild);
    }
 
 }
 
 function SpriteElement(x, y) {
 
    const out = `
    <div id="anim_spr" style="
     position: fixed;
     left: ${x}px;
     top: ${y}px;
     z-index: 9;
     color:black;
 "><div id="textbox" style="width:70%; height: 100px; border: 5px solid #3f289c; border-radius:5px; background-color:white;padding: 0.5em;
 font-size: 15pt;">test</div><img id="anim_img" src=""/></div>
    `
    return out;
 }
 
 function initAnimator() {
    appendElement(document.body, SpriteElement(0,0))
    animElement = document.getElementById("anim_spr");
    animImg = document.getElementById("anim_img");
    animText = document.getElementById("textbox");
    setSprite(-80, -80, 1, 1);
    hideText();

    console.log("Animator set!")
 }
 
 function setSprite(x,y, scaleX, scaleY) {
    if (animElement != null) {
 
       animElement.style.left = `${x}vw`;
       animElement.style.top = `${y}vh`;
       animElement.style.right = `auto`;
       animElement.style.bottom = `auto`;
       animElement.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
 }

 function setSprite_Rv(x,y, scaleX, scaleY) {
    if (animElement != null) {
 
       animElement.style.right = `${x}vw`;
       animElement.style.bottom = `${y}vh`;
       animElement.style.left = `auto`;
       animElement.style.top = `auto`;
       animElement.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
 }
 
 function setSpriteAnimState(src) {
    const imgp = chrome.runtime.getURL(src);
    if (animElement != null && animImg != null) {
       animImg.src = imgp;
    }
 }

 function displayText(str) {
    animText.style.display = "block";
    animText.innerHTML = str
 }

 function hideText() {
    animText.style.display = "none";
 }
 