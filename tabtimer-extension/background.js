// Background.js

// Initialize variables
let activeDomain = '';
let activeDomainStartTime = Date.now();
const domainTimes = {};
let alertThreshold = 0;
let overtime = "false";
let totalWhiteListTime = 0;
let totalBlackListTime = 0;
const blacklistedDomains=["9gag.com","www.9gag.com","Chatroulette.com","www.Chatroulette.com","Gizmodo.com","www.Gizmodo.com","TechCrunch.com","www.TechCrunch.com","aliexpress.com","www.aliexpress.com","bbc.com","www.bbc.com","bongacams.com","www.bongacams.com","buzzfeed.com","www.buzzfeed.com","cams.com","www.cams.com","camsoda.com","www.camsoda.com","cbs.com","www.cbs.com","chaturbate.com","www.chaturbate.com","cheezburger.com","www.cheezburger.com","cnbc.com","www.cnbc.com","cnet.com","www.cnet.com","cnn.com","www.cnn.com","craigslist.org","www.craigslist.org","deviantart.com","www.deviantart.com","edition.cnn.com","www.edition.cnn.com","www.youtube.com"]

chrome.runtime.onStartup.addListener(() => {
    // Send a message to the popup to instruct it to close
    chrome.runtime.sendMessage({ closePopup: true });
  });

// Retrieve alert threshold from storage
chrome.storage.sync.get('alertThreshold', (data) => {
    if (data.alertThreshold) {
        alertThreshold = data.alertThreshold * 1000; // Assuming alertThreshold is in seconds
        console.log("Initial alertThreshold set to:", alertThreshold);
    } else {
        console.log("No alertThreshold found in storage, using default value of 0");
    }
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
        let i=0;
        let totalActiveTime = 0;
        const currentTime = Date.now();
        for (let domain in domainTimes) {
            totalActiveTime += domainTimes[domain];
            if(i==0){
                totalBlackListTime = 0;
                totalWhiteListTime = 0
            }
            
            // Check if the domain is in the blacklist
            const isBlacklisted = blacklistedDomains.some(blacklistedDomain => domain.includes(blacklistedDomain));
            
            if (isBlacklisted) {
                totalBlackListTime += domainTimes[domain];
            } else {
                totalWhiteListTime += domainTimes[domain];
            }
            i+=1;
        }
        sendResponse({ elapsedTime: totalActiveTime,
            totalBlackListTime: totalBlackListTime,
            totalWhiteListTime:totalWhiteListTime 
        });
    } else if (request.action === 'setThreshold') {
        alertThreshold = request.threshold * 1000; // Threshold is in seconds
        console.log("alertThreshold updated to:", alertThreshold);
    } else if (request.action === 'checkThreshold') {
        // If alertThreshold is 0, fetch from storage, else use the existing value
        if (alertThreshold === 0) {
            chrome.storage.sync.get('alertThreshold', (data) => {
                if (data.alertThreshold) {
                    alertThreshold = data.alertThreshold * 1000; // Assuming alertThreshold is in seconds
                }
                checkThreshold(sendResponse);
            });
        } else {
            checkThreshold(sendResponse);
        }
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});

function checkThreshold(sendResponse) {
    console.log("Checking threshold with alertThreshold:", alertThreshold);
    let overtime = '';

    if (alertThreshold > 0 && getActiveDomainTime() > alertThreshold) {
        overtime = true;
    } else {
        overtime = false;
    }

    // Send the response back to the popup script
    sendResponse({
        current: overtime,
        limit: alertThreshold,
        function: getActiveDomainTime()
    });
}

// // Fetch and parse the blacklist file
// fetch('blacklisted-domain.json')
//   .then(response => response.json())
//   .then(blacklist => {
//     // Send the blacklist data to the popup
//     chrome.runtime.sendMessage({ action: 'updateBlacklist', blacklist });
//   })
//   .catch(error => console.error('Failed to fetch blacklist:', error));

