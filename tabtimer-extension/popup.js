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
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const domainList = document.getElementById('domain-list');
      tabs.forEach(tab => {
        const url = new URL(tab.url);
        const domain = url.hostname;
  
        // Get the time spent on this domain
        chrome.runtime.sendMessage({ action: 'getDomainTime', domain }, (response) => {
          if (response && response.elapsedTime !== undefined) {
            const elapsedTime = response.elapsedTime;
            const seconds = Math.floor((elapsedTime / 1000) % 60);
            const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
            const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  
            const timeString = `${hours}h ${minutes}m ${seconds}s`;
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
  