// Improved localization extraction script with better rate limiting
(function () {
  // Enhanced configuration
  const config = {
    projectKey: 'prj_421a6b8d1377ff668fe596396d475575',
    apiEndpoint: 'http://localhost:3000/phrases/batch-extract',
    sendFrequency: 30000, // Increased to 30 seconds
    minStringsToSend: 5, // Only send if we have at least 5 new strings
    maxRetries: 3,
    excludeTags: ['script', 'style', 'noscript', 'code', 'pre'],
    debounceDelay: 2000, // Wait 2 seconds after DOM changes before extracting
  };

  // State management
  let extractedStrings = new Set();
  let sentStrings = new Set(); // Track what we've already sent
  let lastSendTime = 0;
  let isProcessing = false;
  let debounceTimer = null;
  let retryCount = 0;

  // Debounced extraction to prevent excessive calls
  function debouncedExtract() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      if (!isProcessing) {
        extractText();
      }
    }, config.debounceDelay);
  }

  // Extract text with better duplicate prevention
  function extractText() {
    if (isProcessing) return;
    isProcessing = true;

    const currentStrings = new Set();

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

          // Skip hidden elements
          if (
            parent &&
            (parent.offsetParent === null ||
              getComputedStyle(parent).display === 'none' ||
              getComputedStyle(parent).visibility === 'hidden')
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
      if (text.length > 1 && !isNumericOrSymbolOnly(text)) {
        currentStrings.add(text);
      }
    }

    // Extract from common attributes
    document
      .querySelectorAll('[placeholder],[alt],[title],[aria-label]')
      .forEach((el) => {
        ['placeholder', 'alt', 'title', 'aria-label'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const text = el.getAttribute(attr).trim();
            if (text.length > 1 && !isNumericOrSymbolOnly(text)) {
              currentStrings.add(text);
            }
          }
        });
      });

    // Only add truly new strings
    const newStrings = new Set();
    currentStrings.forEach((str) => {
      if (!sentStrings.has(str)) {
        extractedStrings.add(str);
        newStrings.add(str);
      }
    });

    isProcessing = false;

    // Send if we have enough new strings and enough time has passed
    const timeSinceLastSend = Date.now() - lastSendTime;
    const hasEnoughStrings = newStrings.size >= config.minStringsToSend;
    const hasEnoughTime = timeSinceLastSend > config.sendFrequency;

    if (extractedStrings.size > 0 && hasEnoughStrings && hasEnoughTime) {
      sendStrings();
    }
  }

  // Helper function to filter out purely numeric or symbolic content
  function isNumericOrSymbolOnly(text) {
    // Skip if it's just numbers, symbols, or very short
    return (
      /^[\d\s\-\+\(\)\.,%$€£¥]+$/.test(text) ||
      /^[^\w\s]+$/.test(text) ||
      text.length < 3
    );
  }

  // Send to server with retry logic
  async function sendStrings() {
    if (isProcessing || extractedStrings.size === 0) return;

    isProcessing = true;
    const stringsToSend = Array.from(extractedStrings);

    const payload = {
      projectKey: config.projectKey,
      sourceUrl: window.location.href,
      sourceType: 'web',
      phrases: stringsToSend.map((text) => ({
        sourceText: text,
        context: window.location.pathname,
        hash: hashString(text), // Add hash for deduplication on server
      })),
    };

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.1.0',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      // Mark strings as sent
      stringsToSend.forEach((str) => sentStrings.add(str));
      extractedStrings.clear();
      lastSendTime = Date.now();
      retryCount = 0;

      console.log(
        `[Localize] Sent ${stringsToSend.length} strings successfully`
      );
    } catch (error) {
      console.error('[Localize] Error:', error);

      // Retry logic
      if (retryCount < config.maxRetries) {
        retryCount++;
        setTimeout(() => {
          isProcessing = false;
          sendStrings();
        }, 5000 * retryCount); // Exponential backoff
      } else {
        retryCount = 0;
      }
    } finally {
      if (retryCount === 0) {
        isProcessing = false;
      }
    }
  }

  // Simple hash function for deduplication
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  // Set up observer for dynamic content with better filtering
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldExtract = false;

      for (const mutation of mutations) {
        // Only care about text changes or new elements with text
        if (mutation.type === 'characterData') {
          shouldExtract = true;
          break;
        }

        if (mutation.type === 'childList') {
          // Check if added nodes contain text
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              shouldExtract = true;
              break;
            }
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.textContent.trim()
            ) {
              shouldExtract = true;
              break;
            }
          }
          if (shouldExtract) break;
        }
      }

      if (shouldExtract) {
        debouncedExtract();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return observer;
  }

  // Track URL changes more efficiently
  function setupUrlTracking() {
    let lastUrl = window.location.href;

    // Handle browser navigation
    window.addEventListener('popstate', () => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        sentStrings.clear(); // Clear sent strings on navigation
        debouncedExtract();
      }
    });

    // Handle programmatic navigation (SPA)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      setTimeout(() => {
        if (lastUrl !== window.location.href) {
          lastUrl = window.location.href;
          sentStrings.clear();
          debouncedExtract();
        }
      }, 100);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        if (lastUrl !== window.location.href) {
          lastUrl = window.location.href;
          sentStrings.clear();
          debouncedExtract();
        }
      }, 100);
    };
  }

  // Initialize with better error handling
  function init() {
    try {
      // Initial extraction
      setTimeout(extractText, 1000); // Delay initial extraction

      // Set up observers
      setupObserver();
      setupUrlTracking();

      console.log('[Localize] Initialized successfully');
    } catch (error) {
      console.error('[Localize] Initialization failed:', error);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API with manual trigger
  window.Localize = {
    scan: () => {
      extractedStrings.clear();
      sentStrings.clear();
      debouncedExtract();
    },
    getStats: () => ({
      extractedCount: extractedStrings.size,
      sentCount: sentStrings.size,
      lastSendTime: new Date(lastSendTime).toISOString(),
    }),
  };
})();
