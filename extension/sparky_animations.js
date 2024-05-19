function animationSeq1() {
    if (anilock) return;
    kx = 150;
    anilock = true;
    hideText();
    const testAnim = setInterval(animator1, 20);
    setSpriteAnimState("images/sparky_run_transparent.gif")
 
    function animator1() {
       setSprite(kx--, 30, 1, 1);
    
       if (kx < 40) {
          clearInterval(testAnim);
          setSpriteAnimState("images/sparky_temp.gif")
          anilock = false;

          animationSeq1_5("testing 1 2 3")
       }
    }
 }

 function animationSeq1_5(str) {
   if (anilock) return;
   kx = 150;
   anilock = true;
   hideText();
   const testAnim = setInterval(animator1, 100);
   var strOut = ""
   var ind = 0;
   setSpriteAnimState("images/sparky_talk_transparent.gif")

   function animator1() {
      
   
      if (strOut.length < str.length) {
         strOut += str[ind++]
         displayText(strOut)
      }
      else {
         clearInterval(testAnim);
         setSpriteAnimState("images/sparky_talk_transparent.gif")
         displayText(str)
         anilock = false;
         animSeq1_7();
      }
   }
}

function animSeq1_7() {
   const v = setInterval(animatorn,500)

   function animatorn() {
      clearInterval(v);
      animationSeq2();
   }
}
 
 function animationSeq2() {
    if (anilock) return;
    kx = 40;
    anilock = true;
    hideText()
    const testAnim = setInterval(animator2, 20);
    setSpriteAnimState("images/sparky_run_transparent.gif")
    
    function animator2() {
       setSprite(kx++, 30, -1, 1);
    
       if (kx >= 150) { 
          clearInterval(testAnim);
          setSpriteAnimState("images/sparky_temp.webp")
          anilock = false;
       }
    }
 }


function SparkyBlueRunoutTalk() {
   animationSeq1();
}

function SparkyBlueRunAway() {
   animationSeq2();
}