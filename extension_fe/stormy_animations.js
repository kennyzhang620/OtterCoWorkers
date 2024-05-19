function animationSeq1() {
    if (anilock) return;
    kx = 150;
    anilock = true;
    const testAnim = setInterval(animator1, 20);
    setSpriteAnimState("images/stormy_run_transparent.gif")
 
    function animator1() {
       setSprite(kx--, 30, 1, 1);
    
       if (kx < 40) {
          clearInterval(testAnim);
          setSpriteAnimState("images/stormy_temp.webp")
          anilock = false;
       }
    }
 }
 
 function animationSeq2() {
    if (anilock) return;
    kx = 40;
    anilock = true;
    const testAnim = setInterval(animator2, 20);
    setSpriteAnimState("images/stormy_run_transparent.gif")
    
    function animator2() {
       setSprite(kx++, 30, -1, 1);
    
       if (kx >= 150) { 
          clearInterval(testAnim);
          setSpriteAnimState("images/stormy_temp.webp")
          anilock = false;
       }
    }
 }

function StormyBlueRunoutTalk() {
   animationSeq1();
}

function StormyBlueRunAway() {
   animationSeq2();
}