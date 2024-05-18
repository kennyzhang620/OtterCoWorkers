let windowOpenTime = Date.now();

chrome.runtime.onStartup.addListener(() => {
  windowOpenTime = Date.now();
});

chrome.runtime.onInstalled.addListener(() => {
  windowOpenTime = Date.now();
});

chrome.windows.onCreated.addListener(() => {
  windowOpenTime = Date.now();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWindowOpenTime') {
    const currentTime = Date.now();
    const elapsedTime = currentTime - windowOpenTime;
    sendResponse({ elapsedTime });
  }
  return true; // Keep the message channel open for asynchronous sendResponse
});
