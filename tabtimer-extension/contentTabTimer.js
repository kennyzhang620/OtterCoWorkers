document.addEventListener('DOMContentLoaded', () => {
    
chrome.runtime.sendMessage({ action: 'checkThreshold' }, (response) => {

    chrome.storage.sync.get('alertThreshold', (data) => {

        const current = response.current;
        const limit = data.alertThreshold;
        const funct = response.function;
        let checkThresholdElem = document.getElementById('check-threshold');
        checkThresholdElem.textContent = "overtime: " + current + "\nalertThreshold: " + limit + "\nfunct: " + funct + "\neval:" + (funct>limit);
        console.log("checkthres");
    });    
});
console.log("goddamn");
});
console.log("goddamn but ooutside");

