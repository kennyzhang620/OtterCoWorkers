document.addEventListener('DOMContentLoaded', () => {
    // Query all tabs in the current window
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const domainList = document.getElementById('domain-list');
      const domains = new Set();
  
      tabs.forEach(tab => {
        const url = new URL(tab.url);
        domains.add(url.hostname);
      });
  
      domains.forEach(domain => {
        const li = document.createElement('li');
        li.textContent = domain;
        domainList.appendChild(li);
      });
    });
  
    // Query the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const url = new URL(activeTab.url);
        const activeDomain = url.hostname;
  
        const activeTabDomain = document.getElementById('active-tab-domain');
        activeTabDomain.textContent = activeDomain;
      }
    });
  
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
  });
  