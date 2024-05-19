document.addEventListener('DOMContentLoaded', () => {
  // Get the window open time
  chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (response) => {
    if (response && response.elapsedTime !== undefined) {
      const elapsedTime = response.elapsedTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

      const timeString = `${hours}h ${minutes}m ${seconds}s`;
      const windowOpenTimeElem = document.getElementById('window-open-time');
      windowOpenTimeElem.textContent = timeString;
    } else {
      console.error('Failed to retrieve window open time.');
    }
    chrome.storage.sync.get('alertThreshold', (data) => {
        const currentThresholdElem = document.getElementById('current-threshold');
        currentThresholdElem.textContent += `${data.alertThreshold || 0} minutes`;
      });
  });

  document.getElementById('set-threshold-btn').addEventListener('click', () => {
    const thresholdInput = document.getElementById('threshold-input');
    const threshold = parseInt(thresholdInput.value, 10); // Convert to integer

    if (!isNaN(threshold)) {
      // Send threshold value to background script
      chrome.runtime.sendMessage({ action: 'setThreshold', threshold });
    } else {
      alert('Please enter a valid number for the threshold.');
    }
  });

  // Get the active domain time
  chrome.runtime.sendMessage({ action: 'getActiveDomainTime' }, (response) => {
    if (response && response.elapsedTime !== undefined) {
      const elapsedTime = response.elapsedTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

      const timeString = `${hours}h ${minutes}m ${seconds}s`;
      const activeDomainTimeElem = document.getElementById('active-domain-time');
      activeDomainTimeElem.textContent = `Domain: ${response.domain}, Time: ${timeString}`;
    } else {
      console.error('Failed to retrieve active domain time.');
    }
  });

  // Query all tabs in the current window
// Query all tabs in the current window
chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const domainList = document.getElementById('domain-list');
  
    // Get the total window open time
    chrome.runtime.sendMessage({ action: 'getWindowOpenTime' }, (windowResponse) => {
      const windowTime = windowResponse.elapsedTime;
  
      tabs.forEach(tab => {
        const url = new URL(tab.url);
        const domain = url.hostname;
  
        // Get the time spent on this domain
        chrome.runtime.sendMessage({ action: 'getDomainTime', domain }, (domainResponse) => {
          if (domainResponse && domainResponse.elapsedTime !== undefined) {
            const elapsedTime = domainResponse.elapsedTime;
            const percentage = (elapsedTime / windowTime) * 100;
  
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  
            const timeString = `${hours}h ${minutes}m ${seconds}s | ${percentage.toFixed(0)}%`;
            const li = document.createElement('li');
            li.textContent = `${domain} - ${timeString}`;
            domainList.appendChild(li);
          } else {
            console.error(`Failed to retrieve time for domain ${domain}.`);
          }
        });
      });
    });
  });
  
});
