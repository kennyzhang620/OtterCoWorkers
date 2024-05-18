let activeDomain = '';
let activeDomainStartTime = Date.now();
const domainTimes = {};

function updateActiveDomain(newDomain) {
  const currentTime = Date.now();
  if (activeDomain) {
    const elapsedTime = currentTime - activeDomainStartTime;
    if (!domainTimes[activeDomain]) {
      domainTimes[activeDomain] = 0;
    }
    domainTimes[activeDomain] += elapsedTime;
  }
  activeDomain = newDomain;
  activeDomainStartTime = currentTime;
}

function getActiveDomainTime() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - activeDomainStartTime;
  return (domainTimes[activeDomain] || 0) + elapsedTime;
}

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    const newDomain = new URL(tab.url).hostname;
    updateActiveDomain(newDomain);
  });
});

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateActiveDomain('');
  } else {
    chrome.windows.get(windowId, { populate: true }, window => {
      const activeTab = window.tabs.find(tab => tab.active);
      if (activeTab) {
        const newDomain = new URL(activeTab.url).hostname;
        updateActiveDomain(newDomain);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getActiveDomainTime') {
    sendResponse({ domain: activeDomain, elapsedTime: getActiveDomainTime() });
  }
  return true; // Keep the message channel open for asynchronous sendResponse
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getDomainTime') {
      const domain = request.domain;
      const elapsedTime = domainTimes[domain] || 0;
      sendResponse({ elapsedTime });
    }
    return true; // Keep the message channel open for asynchronous sendResponse
  });
