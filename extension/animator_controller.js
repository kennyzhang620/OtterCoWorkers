initAnimator();

var lockY = -1;
window.addEventListener("mousewheel", (event) => {
   const deltaY = event.deltaY;

   if (lockY == -1)
      window.scroll(window.scrollX,window.scrollY)
   else
      window.scroll(0,lockY)
   
   console.log("A", lockY)
});


var responseCust = "Okay, let's get to work! I'll be here to make sure you're staying on task. Don't forget to take breaks once in a while and stay hydrated!"

function senddata(txt, callback) {
   var txtFile = new XMLHttpRequest();
         txtFile.open("POST", "http://localhost:5010/response", true);

         txtFile.setRequestHeader("Accept", "application/json");
         txtFile.setRequestHeader("Content-Type", "application/json");

         let image_encoded = `{
         "textString": "${txt}"
         }`;
         txtFile.onload = function (e) {
            if (txtFile.readyState === 4) {
               if (txtFile.status === 200) {
                     var csvData = txtFile.responseText;

                     console.log(csvData, "Response");
               callback(csvData)

               }
               else {
                     console.log("error:", txtFile.statusText);
               }
            }
         };

         txtFile.onerror = function (e) {
            console.log("error: ", txtFile.statusText);
         };

         txtFile.send(image_encoded);
}

function cb(data) {
      responseCust = data
      console.log(responseCust)
}

senddata("Don't be such a tsundere. Tell them to get off the computer!", cb)


var s = false
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
   // If the received message has the expected format...
   console.log("-->", msg.action)
   switch (msg.action) {
      case "Sparky_Talk":
         SparkyBlueRunoutTalk(responseCust);
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