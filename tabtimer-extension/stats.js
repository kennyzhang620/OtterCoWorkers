document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display stats
    chrome.runtime.sendMessage({ action: 'getStats' }, (stats) => {
      if (stats) {
        const statsContainer = document.getElementById('stats-container');
        statsContainer.innerHTML = `
          <p>Window Open Time: ${stats.windowOpenTime}</p>
          <p>Active Domain: ${stats.activeDomain}</p>
          <p>Active Domain Time: ${stats.activeDomainTime}</p>
          <ul>
            ${stats.domainTimes.map(domain => `<li>${domain.domain}: ${domain.time}</li>`).join('')}
          </ul>
        `;
      } else {
        console.error('Failed to retrieve stats.');
      }
    });
  });
  c