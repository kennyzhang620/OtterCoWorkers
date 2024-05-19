function senddata(txt, callback) {
	var txtFile = new XMLHttpRequest();
	    txtFile.open("POST", "http://localhost:5010/response");

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

window.onload = function(){
    //when the user clicks the submit button in the popup.html
    document.getElementById('mode').addEventListener('click', onclick, false)
	var cBox = false;
	
	chrome.storage.sync.get('cBox', (data) => {
		cBox = data.cBox
	});

	const switchStatus = document.getElementById('mode');
	switchStatus.checked = cBox
	
    function onclick(){
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

			chrome.storage.sync.set({ cBox: switchStatus.checked }, () => {
			});
    }
}