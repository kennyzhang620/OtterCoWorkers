let activeDomain = '';
let activeDomainStartTime = Date.now();
const domainTimes = {};
let alertThreshold = 0;

// chrome.storage.sync.get('alertThreshold', (data) => {
//   const alertThresholdSeconds = data.alertThreshold || 0;

//   chrome.tabs.onActivated.addListener(activeInfo => {
//     // Your existing code to track active domain and update domain times
//   });

//   chrome.windows.onFocusChanged.addListener(windowId => {
//     // Your existing code to track active domain and update domain times
//   });

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     // Your existing message listener code
    
//     // Check if domain time exceeds threshold and trigger alert
//     if (alertThresholdSeconds > 0 && elapsedTime > alertThresholdSeconds * 1000) {
//       alert(`You have spent more than ${alertThresholdSeconds} seconds on ${domain}!`);
//     }
//   });
// });


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
        chrome.windows.get(windowId, {
            populate: true
        }, window => {
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
        sendResponse({
            domain: activeDomain,
            elapsedTime: getActiveDomainTime()
        });
    } else if (request.action === 'getDomainTime') {
      const domain = request.domain;
      const elapsedTime = domainTimes[domain] || 0;
      sendResponse({ elapsedTime });
    } else if (request.action === 'updateDomainTime') {
      const domain = request.domain;
      const currentTime = Date.now();
      const lastActiveTime = domainTimes[domain] || currentTime; // If domain was not active before, set lastActiveTime as currentTime
      const elapsedTime = currentTime - lastActiveTime;
      domainTimes[domain] = currentTime;
      sendResponse({ elapsedTime });
    } else if (request.action === 'getWindowOpenTime') {
      let totalActiveTime = 0;
      const currentTime = Date.now();
      for (let domain in domainTimes) {
        totalActiveTime += currentTime - domainTimes[domain];
      }
      sendResponse({ elapsedTime: totalActiveTime });
    } else if (request.action === 'setThreshold') {
        alertThreshold = request.threshold * 60 * 1000; // Convert minutes to milliseconds
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});

function formatTime(elapsedTime) {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}
