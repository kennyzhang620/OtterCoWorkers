function animationSeq3() {
    kx = -50;
    anilock = true;
    const testAnim = setInterval(animator1, 40);
    setSpriteAnimState("images/sparky_run_transparent.gif")
 
    function animator1() {
       setSprite(kx++, 30, -1, 1);
    
       if (kx > 40) {
          clearInterval(testAnim);
          setSpriteAnimState("images/sparky_temp.webp")
          anilock = false;
       }
    }
 }
 
 function animationSeq4() {
    kx = 60;
    anilock = true;
    const testAnim = setInterval(animator2, 40);
    setSpriteAnimState("images/sparky_run_transparent.gif")
    
    function animator2() {
       setSprite(kx--, 30, 1, 1);
    
       if (kx <= 0) { 
          clearInterval(testAnim);
          setSpriteAnimState("images/sparky_temp.webp")
          anilock = false;
       }
    }
 }

 function freezeScroll() {
   
 }