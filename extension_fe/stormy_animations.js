function animationSeq3() {
   if (anilock) return;
    kx = 150;
    anilock = true;
    const testAnim = setInterval(animator1, 20);
    setSpriteAnimState("images/stormy_run_transparent.gif")
 
    function animator1() {
       setSprite_Rv(kx--, 10, -1, 1);
    
       if (kx <= 0) {
          clearInterval(testAnim);
          setSpriteAnimState("images/stormy_STOP_SCROLLING_transparent.gif")
          setSprite_Rv(kx, 10, 1, 1);
          anilock = false;
       }
    }
 }

 function animationSeq3_5() {
   if (anilock) return;
   kx = 150;
   anilock = true;
   const testAnim = setInterval(animator1, 20);
   setSpriteAnimState("images/stormy_run_transparent.gif")

   function animator1() {
      setSprite_Rv(kx--, 10, -1, 1);
   
      if (kx <= 40) {
         clearInterval(testAnim);
         setSpriteAnimState("images/stormy_NO_YOUTUBE BAP_transparent.gif")
         setSprite_Rv(kx, 10, 1, 1);
         animSeq3_7()
         anilock = false;
      }
   }
}

function animSeq3_7() {
   const v = setInterval(animatorn,650)

   function animatorn() {
      clearInterval(v);
      setSpriteAnimState("images/stormy_NO_YOUTUBE BAP_transparent_F.gif")
   }
}
 
 function animationSeq4() {
   if (anilock) return;
    anilock = true;
    const testAnim = setInterval(animator2, 20);
    setSpriteAnimState("images/stormy_run_transparent.gif")
    
    function animator2() {
       setSprite_Rv(kx++, 10, 1, 1);
    
       if (kx >= 150) { 
          clearInterval(testAnim);
          setSpriteAnimState("images/stormy_temp.webp")
          anilock = false;
       }
    }
 }

 function freezeScroll() {
   
 }

 function StormyFreezeScroll() {
      lockY = window.scrollY
      animationSeq3();
 }

 function StormyStopBap() {
      animationSeq3_5();
 }

 function StormyRetreat() {
      lockY = -1
      animationSeq4();
 }
