let alertThreshold = 50;
let interval=1;
const blacklistedDomains=["9gag.com","www.9gag.com","Chatroulette.com","www.Chatroulette.com","Gizmodo.com","www.Gizmodo.com","TechCrunch.com","www.TechCrunch.com","aliexpress.com","www.aliexpress.com","bbc.com","www.bbc.com","bongacams.com","www.bongacams.com","buzzfeed.com","www.buzzfeed.com","cams.com","www.cams.com","camsoda.com","www.camsoda.com","cbs.com","www.cbs.com","chaturbate.com","www.chaturbate.com","cheezburger.com","www.cheezburger.com","cnbc.com","www.cnbc.com","cnet.com","www.cnet.com","cnn.com","www.cnn.com","craigslist.org","www.craigslist.org","deviantart.com","www.deviantart.com","edition.cnn.com","www.edition.cnn.com","www.youtube.com","www.instagram.com","www.x.com"]

var vi = false

// Function to retrieve alert threshold from storage and update alertThreshold
function updateAlertThreshold() {
    chrome.storage.sync.get(['alertThreshold', 'cBox'], (data) => {
        if (data.alertThreshold) {
            alertThreshold = data.alertThreshold; // Assuming alertThreshold is in seconds
        }
        else{
            alertThreshold = 50;
        }
        console.log("Alert Threshold updated:", alertThreshold);
        chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (windowResponse) =>{
            const windowTime = windowResponse.elapsedTime;
            const totalBlackListTime = windowResponse.totalBlackListTime;
            const totalWhiteListTime = windowResponse.totalWhiteListTime;
            const totalWhiteListPercentage=(totalWhiteListTime*100)/windowTime;
            const totalBlackListPercentage=(totalBlackListTime*100)/windowTime;
            const domain = ''
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    // Retrieve the URL of the active tab
                    const url = tabs[0].url;
                    
                    // Extract domain from URL
                    domain = extractDomain(url);
                    console.log("Domain of the active tab:", domain);
                }
            });

            const isBlacklisted = blacklistedDomains.some(blacklistedDomain => domain.includes(blacklistedDomain));

                if(totalWhiteListPercentage < alertThreshold && data.cBox == true && isBlacklisted)
                {
                   // alert("bing bong back to work motherfker");
                    if (!vi) {
                        if (Math.random() > 0.5) {
                            StormyFreezeScroll();
                        }
                        else {
                            StormyStopBap();
                        }
                        
                        vi = true;
                        
                    }
                }
                else {
                    if (vi) {
                        StormyRetreat();
                        vi = false;
                    }
                }
        });
    });
}

chrome.action.onClicked.addListener(() => {
    // Query the active tab
    
});

// Function to extract domain from URL
function extractDomain(url) {
    try {
        const domain = new URL(url).hostname;
        return domain;
    } catch (error) {
        console.error("Error extracting domain:", error);
        return null;
    }
}


// Run the function initially and then set it to run repeatedly every X milliseconds
updateAlertThreshold();
setInterval(updateAlertThreshold, interval); // Run every 60 seconds (adjust as needed)

