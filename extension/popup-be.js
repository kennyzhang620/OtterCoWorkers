const stormymini = document.getElementById('stormy_hs');

function stormypos(x,y) {
  stormymini.style.top = `${x}px`
  stormymini.style.left = `${y}px`

}

function animateStormy() {
    const v = setInterval(animator, 30);
    var vx = 360; 
    var vy = 315
    function animator() {
        if (vy > 90) {
          stormypos(vx,vy--);
        }
        else {
          clearInterval(v)
        }
    }
}

function animateStormy2() {
  const v = setInterval(animator, 30);
  var vx = 360; 
  var vy = 90
  function animator() {
      if (vy < 360) {
        stormypos(vx,vy++);
      }
      else {
        clearInterval(v)
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
    
  // Get the window open time
  chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (response) => {
    if (response && response.elapsedTime !== undefined) {
      const elapsedTime = response.elapsedTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

      const timeString = `${hours}h ${minutes}m ${seconds}s`;
      const windowOpenTimeElem = document.getElementById('window-open-time');
      windowOpenTimeElem.textContent = timeString;
    } else {
      console.error('Failed to retrieve window open time.');
    }
    chrome.storage.sync.get('alertThreshold', (data) => {
        const currentThresholdElem = document.getElementById('current-threshold');
        currentThresholdElem.textContent += `${data.alertThreshold || 0} seconds`;
      });
  });

  document.getElementById('set-threshold-btn').addEventListener('click', () => {
    const thresholdInput = document.getElementById('threshold-input');
    const threshold = parseInt(thresholdInput.value, 10); // Convert to integer

    if (!isNaN(threshold)) {
        // Save threshold value to storage
        chrome.storage.sync.set({ alertThreshold: threshold }, () => {
          // Update displayed threshold after savingf
          const currentThresholdElem = document.getElementById('current-threshold');
          currentThresholdElem.textContent = `Current Threshold: ${threshold} %`;
        });
      } else {
        alert('Please enter a valid number for the threshold.');
      }
  });
  // Get the active domain time
  chrome.runtime.sendMessage({ action: 'getActiveDomainTime' }, (response) => {
    if (response && response.elapsedTime !== undefined) {
      const elapsedTime = response.elapsedTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

      const timeString = `${hours}h ${minutes}m ${seconds}s`;
      const activeDomainTimeElem = document.getElementById('active-domain-time');
      activeDomainTimeElem.textContent = `Domain: ${response.domain}, Time: ${timeString}`;
      console.log("getactivedomaintime");
    } else {
      console.error('Failed to retrieve active domain time.');
    }
  });

  chrome.runtime.sendMessage({ action: 'checkThreshold' }, (response) => {

    chrome.storage.sync.get('alertThreshold', (data) => {

        const current = response.current;
        const limit = response.limit;
        const funct = response.function;
        let checkThresholdElem = document.getElementById('check-threshold');
        checkThresholdElem.textContent = "overtime: " + current + "\nThreshold: " + limit + "\nfunct: " + funct + "\neval:" + (funct>limit);
        console.log("checkthres");
    });    
});



  // Query all tabs in the current window
// Query all tabs in the current window
chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const domainList = document.getElementById('data-text');
  
    // Get the total window open time
    chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (windowResponse) => {
       const windowTime = windowResponse.elapsedTime;
      const totalBlackListTime = windowResponse.totalBlackListTime;
      const totalWhiteListTime = windowResponse.totalWhiteListTime;
      const blacklistTotalTimeElem = document.getElementById('total-blacklist-time');
      const whitelistTotalTimeElem = document.getElementById('total-whitelist-time');
      whitelistTotalTimeElem.textContent = Math.floor((totalWhiteListTime * 100) / windowTime);
      blacklistTotalTimeElem.textContent=Math.floor((totalBlackListTime*100)/windowTime);
      document.getElementById('white-percentage').style.width = Math.floor((totalWhiteListTime * 100) / windowTime) + '%';
      document.getElementById('black-percentage').style.width = Math.floor((totalBlackListTime*100)/windowTime) + '%';
  
      tabs.forEach(tab => {
        const url = new URL(tab.url);
        const domain = url.hostname;
  
        // Get the time spent on this domain
        chrome.runtime.sendMessage({ action: 'getDomainTime', domain }, (domainResponse) => {
          if (domainResponse && domainResponse.elapsedTime !== undefined) {
            const elapsedTime = domainResponse.elapsedTime;
            const percentage = (elapsedTime / windowTime) * 100;
  
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  
            const timeString = `${hours}h ${minutes}m ${seconds}s | ${percentage.toFixed(0)}%`;
            const li = document.createElement('li');
            li.textContent = `${domain} - ${timeString}`;
            domainList.appendChild(li);

            // chrome.runtime.sendMessage({ action: 'checkThreshold', domain }, (domainResponse) => {
            //     const alertmsg = domainResponse.overtime;
            //     const checkThresholdElem = document.getElementById('check-threshold');
            //     checkThresholdElem.textContent = alertmsg;
            // })
            
          } else {
            console.error(`Failed to retrieve time for domain ${domain}.`);
          }
        });
      });
    });
  });

});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message is to close the popup
    if (message.closePopup) {
      // Close the popup
      window.close();
    }
  });

  var cBox = false;
  
  window.onload = function(){
    //when the user clicks the submit button in the popup.html
    document.getElementById('mode').addEventListener('click', onclick, false)
		const switchStatus = document.getElementById('mode');
    
	chrome.storage.sync.get('cBox', (data) => {
		cBox = data.cBox
    switchStatus.checked = cBox
    console.log(cBox)
    if(cBox == true){
      //work
      document.getElementById("mode-text").innerHTML = "Work!";
    }
    else{
      //chill
      document.getElementById("mode-text").innerHTML = "Chill!";
    }
  });


  function toggle() {
    //chrome.runtime.sendMessage()
    if(switchStatus.checked){
			document.getElementById("mode-text").innerHTML = "Work!";
      stormypos(315,90);
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
			document.getElementById("mode-text").innerHTML = "Chill.";
      stormypos(315,360);
		}
  }

    toggle();
	
    function onclick(){
        toggle();

        chrome.storage.sync.set({ cBox: switchStatus.checked }, () => {
        });
    }
}

function updateModeText(){
  chrome.storage.sync.get('cBox', (data) => {
		cBox = data.cBox
    switchStatus.checked = cBox
    console.log(cBox)
    if(switchStatus.checked){
			document.getElementById("mode-text").innerHTML = "Work!";
      stormypos(315,90);
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
			document.getElementById("mode-text").innerHTML = "Chill.";
      stormypos(315,360);
		}

	});
}