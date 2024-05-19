let alertThreshold = 0;
let interval=10000;

// Function to retrieve alert threshold from storage and update alertThreshold
function updateAlertThreshold() {
    chrome.storage.sync.get('alertThreshold', (data) => {
        if (data.alertThreshold) {
            alertThreshold = data.alertThreshold * 1000; // Assuming alertThreshold is in seconds
        }
        console.log("Alert Threshold updated:", alertThreshold);
        chrome.runtime.sendMessage({ action: 'getActiveDomainTime' }, (response) =>{
            if (response && response.elapsedTime !== undefined) {
                const elapsedTime = response.elapsedTime;
                if(elapsedTime > alertThreshold)
                {
                    alert("bing bong motherfker");
                }
            }
        });
    });
}

// Run the function initially and then set it to run repeatedly every X milliseconds
updateAlertThreshold();
setInterval(updateAlertThreshold, interval); // Run every 60 seconds (adjust as needed)
