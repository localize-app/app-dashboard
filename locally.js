// Enhanced localization script with language switcher and translation support
(function () {
  // Enhanced configuration
  const config = {
    projectKey: 'prj_421a6b8d1377ff668fe596396d475575',
    apiEndpoint: 'http://localhost:3000/phrases/batch-extract',
    translationsEndpoint: 'http://localhost:3000/translate',
    sendFrequency: 30000,
    minStringsToSend: 5,
    maxRetries: 3,
    excludeTags: ['script', 'style', 'noscript', 'code', 'pre'],
    debounceDelay: 2000,
    defaultLanguage: 'en',
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr-CA', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ],
  };

  // State management
  let extractedStrings = new Set();
  let sentStrings = new Set();
  let lastSendTime = 0;
  let isProcessing = false;
  let debounceTimer = null;
  let retryCount = 0;
  let currentLanguage =
    localStorage.getItem('localize-language') || config.defaultLanguage;
  let translations = {};
  let originalTexts = new Map(); // Store original texts for elements

  // Create language switcher UI
  function createLanguageSwitcher() {
    // Remove existing switcher if any
    const existing = document.getElementById('localize-language-switcher');
    if (existing) existing.remove();

    // Create container
    const container = document.createElement('div');
    container.id = 'localize-language-switcher';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Create button
    const button = document.createElement('button');
    button.id = 'localize-language-button';
    const currentLang = config.availableLanguages.find(
      (l) => l.code === currentLanguage
    );
    button.innerHTML = `${currentLang.flag} ${currentLang.code.toUpperCase()}`;
    button.style.cssText = `
      background: #4F46E5;
      color: white;
      border: none;
      border-radius: 30px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
      button.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
    });

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'localize-language-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      bottom: 100%;
      right: 0;
      margin-bottom: 10px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: none;
      min-width: 200px;
    `;

    // Add language options
    config.availableLanguages.forEach((lang) => {
      const option = document.createElement('div');
      option.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: background-color 0.2s ease;
        font-size: 14px;
        color: #374151;
      `;

      option.innerHTML = `<span style="font-size: 20px;">${lang.flag}</span> ${lang.name}`;

      if (lang.code === currentLanguage) {
        option.style.backgroundColor = '#F3F4F6';
        option.style.fontWeight = '600';
      }

      option.addEventListener('mouseenter', () => {
        if (lang.code !== currentLanguage) {
          option.style.backgroundColor = '#F9FAFB';
        }
      });

      option.addEventListener('mouseleave', () => {
        if (lang.code !== currentLanguage) {
          option.style.backgroundColor = 'transparent';
        }
      });

      option.addEventListener('click', () => {
        if (lang.code !== currentLanguage) {
          changeLanguage(lang.code);
          dropdown.style.display = 'none';
        }
      });

      dropdown.appendChild(option);
    });

    // Toggle dropdown
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });

    container.appendChild(dropdown);
    container.appendChild(button);
    document.body.appendChild(container);
  }

  // Change language function
  async function changeLanguage(langCode) {
    currentLanguage = langCode;
    localStorage.setItem('localize-language', langCode);

    // Update button
    const button = document.getElementById('localize-language-button');
    const lang = config.availableLanguages.find((l) => l.code === langCode);
    if (button && lang) {
      button.innerHTML = `${lang.flag} ${lang.code.toUpperCase()}`;
    }

    // Show loading indicator
    showLoadingIndicator();

    // Fetch translations for the selected language
    await fetchTranslations(langCode);

    // Apply translations
    applyTranslations();

    // Hide loading indicator
    hideLoadingIndicator();
  }

  // Loading indicator
  function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'localize-loading';
    indicator.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      z-index: 1000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
    `;
    indicator.textContent = 'Loading translations...';
    document.body.appendChild(indicator);
  }

  function hideLoadingIndicator() {
    const indicator = document.getElementById('localize-loading');
    if (indicator) indicator.remove();
  }

  // Fetch translations from server
  async function fetchTranslations(langCode) {
    if (langCode === config.defaultLanguage) {
      translations = {};
      return;
    }

    try {
      const response = await fetch(
        `${config.translationsEndpoint}/${config.projectKey}/${langCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Project-Key': config.projectKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.status}`);
      }

      const data = await response.json();
      translations = data.translations || {};

      console.log(
        `[Localize] Loaded ${Object.keys(translations).length} translations for ${langCode}`
      );
    } catch (error) {
      console.error('[Localize] Error fetching translations:', error);
      translations = {};
    }
  }

  // Apply translations to the page
  function applyTranslations() {
    // If returning to default language, restore original texts
    if (currentLanguage === config.defaultLanguage) {
      restoreOriginalTexts();
      return;
    }

    // Walk through all text nodes and apply translations
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;

          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Skip excluded elements
          if (config.excludeTags.includes(parent.tagName.toLowerCase())) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip language switcher elements
          if (parent.closest('#localize-language-switcher')) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const originalText = getOriginalText(node);

      if (translations[originalText]) {
        // Store original if not already stored
        if (!originalTexts.has(node)) {
          originalTexts.set(node, originalText);
        }
        node.textContent = translations[originalText];
      }
    }

    // Apply translations to attributes
    document
      .querySelectorAll('[placeholder],[alt],[title],[aria-label]')
      .forEach((el) => {
        ['placeholder', 'alt', 'title', 'aria-label'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const originalText = getOriginalAttributeText(el, attr);

            if (translations[originalText]) {
              // Store original if not already stored
              const key = `${attr}:${el}`;
              if (!originalTexts.has(key)) {
                originalTexts.set(key, originalText);
              }
              el.setAttribute(attr, translations[originalText]);
            }
          }
        });
      });
  }

  // Get original text (either stored or current)
  function getOriginalText(node) {
    return originalTexts.has(node)
      ? originalTexts.get(node)
      : node.textContent.trim();
  }

  function getOriginalAttributeText(element, attr) {
    const key = `${attr}:${element}`;
    return originalTexts.has(key)
      ? originalTexts.get(key)
      : element.getAttribute(attr).trim();
  }

  // Restore original texts when switching back to default language
  function restoreOriginalTexts() {
    originalTexts.forEach((originalText, key) => {
      if (typeof key === 'string' && key.includes(':')) {
        // It's an attribute
        const [attr, element] = key.split(':');
        if (element && element.setAttribute) {
          element.setAttribute(attr, originalText);
        }
      } else if (key.nodeType === Node.TEXT_NODE) {
        // It's a text node
        key.textContent = originalText;
      }
    });
    originalTexts.clear();
  }

  // Modified extraction to store original texts
  function extractText() {
    // Only extract if current language is English
    if (currentLanguage !== config.defaultLanguage) {
      console.log(
        '[Localize] Skipping extraction - non-English language selected'
      );
      return;
    }

    if (isProcessing) return;
    isProcessing = true;

    const currentStrings = new Set();

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;

          const parent = node.parentElement;
          if (
            parent &&
            config.excludeTags.includes(parent.tagName.toLowerCase())
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip language switcher elements
          if (parent && parent.closest('#localize-language-switcher')) {
            return NodeFilter.FILTER_REJECT;
          }

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

    while (walker.nextNode()) {
      const originalText = getOriginalText(walker.currentNode);
      if (originalText.length > 1 && !isNumericOrSymbolOnly(originalText)) {
        currentStrings.add(originalText);
      }
    }

    document
      .querySelectorAll('[placeholder],[alt],[title],[aria-label]')
      .forEach((el) => {
        ['placeholder', 'alt', 'title', 'aria-label'].forEach((attr) => {
          if (el.hasAttribute(attr)) {
            const originalText = getOriginalAttributeText(el, attr);
            if (
              originalText.length > 1 &&
              !isNumericOrSymbolOnly(originalText)
            ) {
              currentStrings.add(originalText);
            }
          }
        });
      });

    const newStrings = new Set();
    currentStrings.forEach((str) => {
      if (!sentStrings.has(str)) {
        extractedStrings.add(str);
        newStrings.add(str);
      }
    });

    isProcessing = false;

    const timeSinceLastSend = Date.now() - lastSendTime;
    const hasEnoughStrings = newStrings.size >= config.minStringsToSend;
    const hasEnoughTime = timeSinceLastSend > config.sendFrequency;

    if (extractedStrings.size > 0 && hasEnoughStrings && hasEnoughTime) {
      sendStrings();
    }
  }

  // Debounced extraction
  function debouncedExtract() {
    // Only debounce extraction if current language is English
    if (currentLanguage !== config.defaultLanguage) {
      return;
    }

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      if (!isProcessing) {
        extractText();
      }
    }, config.debounceDelay);
  }

  // Helper function to filter out purely numeric or symbolic content
  function isNumericOrSymbolOnly(text) {
    return (
      /^[\d\s\-\+\(\)\.,%$€£¥]+$/.test(text) ||
      /^[^\w\s]+$/.test(text) ||
      text.length < 3
    );
  }

  // Send to server with retry logic
  async function sendStrings() {
    // Only send if current language is English
    if (currentLanguage !== config.defaultLanguage) {
      return;
    }

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
        hash: hashString(text),
      })),
    };

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '1.2.0',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      stringsToSend.forEach((str) => sentStrings.add(str));
      extractedStrings.clear();
      lastSendTime = Date.now();
      retryCount = 0;

      console.log(
        `[Localize] Sent ${stringsToSend.length} strings successfully`
      );
    } catch (error) {
      console.error('[Localize] Error:', error);

      if (retryCount < config.maxRetries) {
        retryCount++;
        setTimeout(() => {
          isProcessing = false;
          sendStrings();
        }, 5000 * retryCount);
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
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // Set up observer for dynamic content
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      // Only process mutations if current language is English
      if (currentLanguage !== config.defaultLanguage) {
        // Still check if we need to apply translations
        let shouldTranslate = false;

        for (const mutation of mutations) {
          if (
            mutation.target.closest &&
            mutation.target.closest('#localize-language-switcher')
          ) {
            continue;
          }

          if (
            mutation.type === 'characterData' ||
            mutation.type === 'childList'
          ) {
            shouldTranslate = true;
            break;
          }
        }

        if (shouldTranslate) {
          setTimeout(() => applyTranslations(), 100);
        }
        return;
      }

      let shouldExtract = false;
      let shouldTranslate = false;

      for (const mutation of mutations) {
        // Skip language switcher mutations
        if (
          mutation.target.closest &&
          mutation.target.closest('#localize-language-switcher')
        ) {
          continue;
        }

        if (mutation.type === 'characterData') {
          shouldExtract = true;
          shouldTranslate = true;
          break;
        }

        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.id === 'localize-language-switcher') continue;

            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              shouldExtract = true;
              shouldTranslate = true;
              break;
            }
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.textContent.trim()
            ) {
              shouldExtract = true;
              shouldTranslate = true;
              break;
            }
          }
          if (shouldExtract) break;
        }
      }

      if (shouldExtract) {
        debouncedExtract();
      }

      if (shouldTranslate && currentLanguage !== config.defaultLanguage) {
        // Apply translations to new content
        setTimeout(() => applyTranslations(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return observer;
  }

  // Track URL changes
  function setupUrlTracking() {
    let lastUrl = window.location.href;

    window.addEventListener('popstate', () => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        sentStrings.clear();
        originalTexts.clear();

        // Only extract if current language is English
        if (currentLanguage === config.defaultLanguage) {
          debouncedExtract();
        } else {
          setTimeout(() => applyTranslations(), 500);
        }
      }
    });

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      setTimeout(() => {
        if (lastUrl !== window.location.href) {
          lastUrl = window.location.href;
          sentStrings.clear();
          originalTexts.clear();

          // Only extract if current language is English
          if (currentLanguage === config.defaultLanguage) {
            debouncedExtract();
          } else {
            setTimeout(() => applyTranslations(), 500);
          }
        }
      }, 100);
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        if (lastUrl !== window.location.href) {
          lastUrl = window.location.href;
          sentStrings.clear();
          originalTexts.clear();

          // Only extract if current language is English
          if (currentLanguage === config.defaultLanguage) {
            debouncedExtract();
          } else {
            setTimeout(() => applyTranslations(), 500);
          }
        }
      }, 100);
    };
  }

  // Initialize
  async function init() {
    try {
      // Create language switcher UI
      createLanguageSwitcher();

      // Load translations if not default language
      if (currentLanguage !== config.defaultLanguage) {
        await fetchTranslations(currentLanguage);
      }

      // Initial extraction - only if current language is English
      setTimeout(() => {
        if (currentLanguage === config.defaultLanguage) {
          extractText();
        } else {
          // Apply translations if non-English
          applyTranslations();
        }
      }, 1000);

      // Set up observers
      setupObserver();
      setupUrlTracking();

      console.log('[Localize] Initialized successfully with language switcher');
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

  // Expose public API
  window.Localize = {
    scan: () => {
      // Only scan if current language is English
      if (currentLanguage !== config.defaultLanguage) {
        console.log('[Localize] Scan skipped - non-English language selected');
        return;
      }
      extractedStrings.clear();
      sentStrings.clear();
      debouncedExtract();
    },
    getStats: () => ({
      extractedCount: extractedStrings.size,
      sentCount: sentStrings.size,
      lastSendTime: new Date(lastSendTime).toISOString(),
      currentLanguage: currentLanguage,
      translationsLoaded: Object.keys(translations).length,
    }),
    changeLanguage: changeLanguage,
    getCurrentLanguage: () => currentLanguage,
    refreshTranslations: () =>
      fetchTranslations(currentLanguage).then(() => applyTranslations()),
  };
})();
