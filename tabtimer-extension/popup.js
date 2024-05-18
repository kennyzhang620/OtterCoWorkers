chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    document.getElementById("tabTitle").textContent = url.hostname;
  
    // Get estimated Chrome window open time
    chrome.runtime.sendMessage("getChromeTime", function(response) {
      document.getElementById("chromeTime").textContent = "Chrome Open Time: " + response + " seconds";
    });

    
  });
  