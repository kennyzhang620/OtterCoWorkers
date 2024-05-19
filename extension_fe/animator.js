var animElement = null;
var animImg = null;
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
    appendElement(document.getElementsByTagName("header")[0], SpriteElement(0,0))
    animElement = document.getElementById("anim_spr");
    animImg = document.getElementById("anim_img");
    setSprite(-80, -80, 1, 1);

    console.log("Animator set!")
 }
 
 function setSprite(x,y, scaleX, scaleY) {
    if (animElement != null) {
 
       animElement.style.left = `${x}vw`;
       animElement.style.top = `${y}vh`;
       animElement.style.transform = `scale(${scaleX}, ${scaleY})`;
    }
 }
 
 function setSpriteAnimState(src) {
    const imgp = chrome.runtime.getURL(src);
    if (animElement != null && animImg != null) {
       animImg.src = imgp;
    }
 }
 