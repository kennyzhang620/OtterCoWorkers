let alertThreshold = 50;
let interval=500;

var vi = false

// Function to retrieve alert threshold from storage and update alertThreshold
function updateAlertThreshold() {
    chrome.storage.sync.get('alertThreshold', (data) => {
        if (data.alertThreshold) {
            alertThreshold = data.alertThreshold; // Assuming alertThreshold is in seconds
        }
        console.log("Alert Threshold updated:", alertThreshold);
        chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (windowResponse) =>{
            const windowTime = windowResponse.elapsedTime;
            const totalBlackListTime = windowResponse.totalBlackListTime;
            const totalWhiteListTime = windowResponse.totalWhiteListTime;
            const totalWhiteListPercentage=(totalWhiteListTime*100)/windowTime;
            const totalBlackListPercentage=(totalBlackListTime*100)/windowTime;

                if(totalWhiteListPercentage < alertThreshold)
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



// Run the function initially and then set it to run repeatedly every X milliseconds
updateAlertThreshold();
setInterval(updateAlertThreshold, interval); // Run every 60 seconds (adjust as needed)
