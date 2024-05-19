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
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getDomainTime') {
        const domain = request.domain;
        const elapsedTime = domainTimes[domain] || 0;
        sendResponse({
            elapsedTime
        });
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});

let windowOpenTime = Date.now(); // Define windowOpenTime within the listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getWindowOpenTime') {
        const currentTime = Date.now();
        const elapsedTime = currentTime - windowOpenTime;
        console.log("currentTime:");
        console.log(currentTime);
        console.log("windowOpenTime");
        console.log(windowOpenTime);
        console.log("elapsedTime");
        console.log(elapsedTime);
        sendResponse({
            elapsedTime
        });
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStats') {
        const windowOpenTime = formatTime(getWindowOpenTime());
        const activeDomain = getActiveDomain();
        const activeDomainTime = formatTime(getActiveDomainTime());
        const domainTimes = Object.entries(domainTimes).map(([domain, time]) => ({
            domain,
            time: formatTime(time)
        }));

        sendResponse({
            windowOpenTime,
            activeDomain,
            activeDomainTime,
            domainTimes
        });
    }
    return true; // Keep the message channel open for asynchronous sendResponse
});

function formatTime(elapsedTime) {
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}