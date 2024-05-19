// Background.js

// Initialize variables
let activeDomain = '';
let activeDomainStartTime = Date.now();
const domainTimes = {};
let alertThreshold = 0;

// Retrieve alert threshold from storage
chrome.storage.sync.get('alertThreshold', (data) => {
    alertThreshold = data.alertThreshold || 0;
});

// Function to update the active domain and track domain times
function updateActiveDomain(newDomain) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - activeDomainStartTime;

    if (activeDomain) {
        if (!domainTimes[activeDomain]) {
            domainTimes[activeDomain] = 0;
        }
        domainTimes[activeDomain] += elapsedTime;
    }

    activeDomain = newDomain;
    activeDomainStartTime = currentTime;

    // Check if domain time exceeds threshold and trigger alert
    if (alertThreshold > 0 && getActiveDomainTime() > alertThreshold) {
        alert(`You have spent more than ${alertThreshold} seconds on ${activeDomain}!`);
    }
}

// Function to get the active domain time
function getActiveDomainTime() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - activeDomainStartTime;
    return (domainTimes[activeDomain] || 0) + elapsedTime;
}

// Listener for tab activation events
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        const newDomain = new URL(tab.url).hostname;
        updateActiveDomain(newDomain);
    });
});

// Listener for window focus change events
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

// Listener for incoming messages
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
        alertThreshold = request.threshold; // Threshold is already in seconds
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});
