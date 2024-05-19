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

 function stopVideo(element) {
   // getting every iframe from the body
   var iframes = element.querySelectorAll('iframe');
   // reinitializing the values of the src attribute of every iframe to stop the YouTube video.
   for (let i = 0; i < iframes.length; i++) {
      if (iframes[i] !== null) {
         var temp = iframes[i].src;
         iframes[i].src = temp;
      }
   }
}

 function freezeVideo() {
   stopVideo(document.body);
 }

 function StormyFreezeScroll() {
      lockY = window.scrollY
      animationSeq3();
 }

 function StormyStopBap() {
      animationSeq3_5();
      freezeVideo();
 }

 function StormyRetreat() {
      lockY = -1
      animationSeq4();
 }
