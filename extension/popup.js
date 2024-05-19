function senddata(emo,txt) {
	var txtFile = new XMLHttpRequest();
	    txtFile.open("POST", "http://localhost:5010/chatrecvm");

	    txtFile.setRequestHeader("Accept", "application/json");
	    txtFile.setRequestHeader("Content-Type", "application/json");

	    let image_encoded = `{
	     "emotion": "${emo}",
		 "textString": "${txt}"
	    }`;
	    txtFile.onload = function (e) {
	        if (txtFile.readyState === 4) {
	            if (txtFile.status === 200) {
	                var csvData = txtFile.responseText;

	                console.log(csvData, "Response");


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


document.addEventListener('DOMContentLoaded', function(){
    //when the user clicks the submit button in the popup.html
    document.getElementById('mode').addEventListener('click', onclick, false)
    function onclick(){
		const switchStatus = document.getElementById('mode');
        //chrome.runtime.sendMessage()
        if(switchStatus.checked){
			document.getElementById("mode-text").innerHTML = "Work";
			chrome.tabs.query({currentWindow: true, active: true}, 
				//this function looks at the popup.html "respond to" textbox
				//grabs the value and sends the message to context.js    
				function(tabs){
					
					chrome.tabs.sendMessage(tabs[0].id, {action: "Sparky_Talk"}, function(res) {
						console.log(res)
					});
					
				})
		}
		else{
			document.getElementById("mode-text").innerHTML = "Chill";
		}
        //the function onlick is called we look at the tab that is currently open
        chrome.tabs.query({currentWindow: true, active: true}, 
        //this function looks at the popup.html "respond to" textbox
        //grabs the value and sends the message to context.js    
        function(tabs){
            const text = document.getElementById('respondtext').value
			const emo = document.getElementById('cars').value;
			senddata(emo, text);
			
          //  chrome.tabs.sendMessage(tabs[0].id, text)
			
        })
    }
}, false)