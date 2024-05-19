initAnimator();

var lockY = -1;
const content = document.body
      content.addEventListener("mousewheel", (event) => {
         const deltaY = event.deltaY;

         if (lockY == -1)
            window.scroll(window.scrollX,window.scrollY)
         else
            window.scroll(0,lockY)
         
         console.log("A", lockY)
      });

var s = false
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
   // If the received message has the expected format...
   console.log("-->", msg.action)
   switch (msg.action) {
      case "Sparky_Talk":
         SparkyBlueRunoutTalk();
         break;
      case "Sparky_Retreat":
         SparkyBlueRunAway();
         break;
      case "Stormy_HoldOn":
         StormyFreezeScroll();
         break;
      case "Stormy_Bap":
         StormyStopBap();
         break;
      case "Stormy_Retreat":
         StormyRetreat();
         break;
      default:
         break;
   }
   
   sendResponse({result: "yay"});
   
});