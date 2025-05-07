// Simple localization extraction script
(function () {
  // Basic configuration
  const config = {
    projectKey: 'prj_9787e8d1c86195be15287c1a049a362d',
    apiEndpoint: 'http://localhost:3000/phrases/batch-extract',
    sendFrequency: 10000, // Only send every 10 seconds
    excludeTags: ['script', 'style', 'noscript', 'code', 'pre'],
  };

  // Store extracted strings
  const extractedStrings = new Set();
  let lastSendTime = 0;

  // Extract text using TreeWalker (more efficient DOM traversal)
  function extractText() {
    extractedStrings.clear();

    // Create a walker that only looks at text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Skip empty text nodes
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;

          // Skip excluded elements
          const parent = node.parentElement;
          if (
            parent &&
            config.excludeTags.includes(parent.tagName.toLowerCase())
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    // Collect text from all valid text nodes
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim();
      if (text.length > 1) {
        extractedStrings.add(text);
      }
    }

    // Extract from common attributes
    document
      .querySelectorAll('[placeholder],[alt],[title],[aria-label]')
      .forEach((el) => {
        ['placeholder', 'alt', 'title', 'aria-label'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const text = el.getAttribute(attr).trim();
            if (text.length > 1) {
              extractedStrings.add(text);
            }
          }
        });
      });

    // Send if we have strings and enough time has passed
    if (
      extractedStrings.size > 0 &&
      Date.now() - lastSendTime > config.sendFrequency
    ) {
      sendStrings();
    }
  }

  // Send to server
  function sendStrings() {
    const payload = {
      projectKey: config.projectKey,
      sourceUrl: window.location.href,
      sourceType: 'web',
      phrases: Array.from(extractedStrings).map((text) => ({
        sourceText: text,
        context: window.location.pathname,
      })),
    };

    fetch(config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`API request failed: ${response.status}`);
        return response.json();
      })
      .then(() => {
        lastSendTime = Date.now();
      })
      .catch((error) => {
        console.error('[Localize] Error:', error);
      });
  }

  // Set up observer for dynamic content
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some(
        (m) =>
          m.type === 'characterData' ||
          (m.type === 'childList' &&
            (m.addedNodes.length > 0 || m.removedNodes.length > 0))
      );

      if (hasRelevantChanges) {
        extractText();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Initialize
  function init() {
    extractText();
    setupObserver();

    // Handle SPA navigation
    window.addEventListener('popstate', extractText);

    // Check URL changes
    let lastUrl = window.location.href;
    setInterval(() => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        extractText();
      }
    }, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API
  window.Localize = { scan: extractText };
})();
