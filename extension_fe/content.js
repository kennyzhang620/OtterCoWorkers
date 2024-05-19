initAnimator();

var s = false
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
   // If the received message has the expected format...
   if (msg.command === 'move') {

      if (!s) {
         StormyBlueRunoutTalk();
         s = true
      }
      else {
        StormyBlueRunAway();
         s = false;
      }
       // Call the specified callback, passing
       // the web-page's DOM content as argument
       sendResponse({result: "yay"});
   }
});