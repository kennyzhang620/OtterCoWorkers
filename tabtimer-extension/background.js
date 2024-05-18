let startTime = performance.now(); // Capture start time upon loading
let focusedTabUrls = [];


chrome.tabs.onActivated.addListener(details => {
    chrome.tabs.get(details.tabId, tab => {
      focusedTabUrls.push({ url: tab.url, timestamp: performance.now() }); // Store URL and timestamp
    });
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getChromeTime") {
    const elapsedTime = (performance.now() - startTime) / 1000; // Time in seconds
    sendResponse(elapsedTime.toFixed(2)); // Send time with 2 decimal places
  }

});



