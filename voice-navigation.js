/**
 * myScheme Voice Navigation CDN
 * Version: 5.2.4 - Smooth Tell Me About Navigation
 * A complete accessibility solution for myScheme website (dev.myscheme.gov.in)
 * 
 * New in v5.2.4 - Seamless Navigation Experience:
 * ✨ FIXED: "Tell me about X" commands no longer speak twice
 * ✨ Removed interrupting speech before navigation
 * ✨ Single, clean explanation after page loads
 * ✨ "Tell me about" on current page triggers immediate explanation
 * ✨ No more cut-off voices during page transitions
 * 
 * v5.2.3 - Critical Bug Fixes:
 * ✨ FIXED: Infinite loop when asking for categories/schemes while already on that page
 * ✨ FIXED: Commands widget reopening on refresh after being closed
 * ✨ Smart page detection - checks if already on target page before navigating
 * ✨ Persistent commands widget state saved to localStorage
 * ✨ "Already on this page" feedback instead of unnecessary reloads
 * ✨ Prevents pendingExplanation when already on correct page
 * 
 * v5.2.2 - Enhanced Content Detection & Widget Stability:
 * ✨ Fixed widget not appearing on page load
 * ✨ Fixed widget disappearing on refresh
 * ✨ Enhanced content waiting - checks for paragraphs & headings (8s timeout)
 * ✨ Improved content extraction with multiple selector attempts
 * ✨ Filters out "loading", "please wait", and error messages
 * ✨ Retry mechanism if content not ready (2s retry delay)
 * ✨ Content verification before triggering explanation (100+ chars minimum)
 * ✨ Increased content limit to 4000 chars for better context
 * ✨ Removes navigation/footer from content when main not found
 * ✨ Enhanced CSS with !important flags for all critical styles
 * ✨ Position set AFTER DOM append for proper rendering
 * ✨ Periodic visibility monitor (checks every 3 seconds)
 * ✨ Auto-recovery if widget becomes hidden or removed
 * ✨ Visibility checks on tab focus and window resize
 * ✨ requestAnimationFrame for smooth positioning
 * ✨ DOM observer to keep widget on top of stacking order
 * 
 * v5.2.1 - Intelligent Content Processing:
 * ✨ Smart page content detection - waits for actual content to load
 * ✨ Filters out error messages, CORS errors, and technical content
 * ✨ Focuses on main content area for better context
 * ✨ Increased delays to ensure clean content before explaining
 * ✨ Better timing for auto-explanations after navigation
 * 
 * v5.2.0 - Navigate & Explain:
 * ✨ Voice navigation persists across all page navigations
 * ✨ "Tell me about X" commands navigate to page AND auto-explain content
 * ✨ Direct scheme navigation (e.g., "KSYJ") also provides auto-explanations
 * ✨ AI responses complete before page redirects (smart delay system)
 * ✨ Context-aware explanations (schemes, categories, general pages)
 * ✨ State saved before page unloads (beforeunload event)
 * ✨ Enhanced error handling and comprehensive logging
 * 
 * v5.1.2 - Maximum Z-Index & DOM Monitoring:
 * ✨ Increased z-index to maximum value (2147483647)
 * ✨ Added DOM MutationObserver to keep widget always on top
 * ✨ Added CSS isolation property for proper stacking context
 * ✨ Auto re-appends widget if pushed behind by dynamic content
 * ✨ Guaranteed to appear on top of all website elements
 * 
 * v5.1.0 - Enhanced Focus Features:
 * ✨ ADHD Mode: Horizontal reading bar (200px height) that follows cursor vertically
 *    - Full-width bright section at 100% brightness
 *    - Rest of page dimmed to 70% darkness for focus
 *    - Perfect for line-by-line reading and reducing distractions
 * ✨ Big Cursor: Large 40x40px pointer with high contrast and shadow effects
 * 
 * v5.0.0 - Accessibility Widget Suite:
 * ✨ Unified Accessibility Control Panel
 * - Voice Navigation with AI-powered commands
 * - Text Size Controls (3 levels: default, large, extra-large)
 * - Line Height Controls (3 levels: default, medium, large)
 * - Dyslexia Friendly Font (OpenDyslexic)
 * - ADHD Mode (spotlight focus with dark overlay)
 * - Color Adjustments (saturation, invert colors)
 * - Link Highlighting
 * - Big Custom Cursor (40x40px pointer)
 * - Pause Animations
 * - Hide Images option
 * - Keyboard Shortcut: Ctrl+F2 / Cmd+F2
 * - Persistent settings (saved in localStorage)
 * 
 * v4.x Features (retained):
 * - 100+ Voice Commands across 10 categories
 * - Multi-turn conversational AI with context awareness
 * - Speech interruption handling
 * - Command queueing system
 * - Page structure navigation (headings, landmarks, links)
 * - Full keyboard-free browsing experience
 * 
 * Dependencies:
 * - Microsoft Cognitive Services Speech SDK
 * - Lucide Icons (optional, will use fallback SVGs if not available)
 */

(function (window) {
  'use strict';

  const VOICE_NAV_VERSION = '6.0.0'; // Dynamic DOM Analysis

  const API_BASE = 'https://liaplus.com/api';
  
  // ====================================================================
  // DYNAMIC DOM ANALYZER - Works on any website
  // ====================================================================
  class DOMAnalyzer {
    analyze() {
      return {
        forms: this.extractForms(),
        navigation: this.extractNavigation(),
        interactions: this.extractInteractables(),
        landmarks: this.extractLandmarks(),
        pageInfo: {
          title: document.title,
          url: window.location.href,
          language: document.documentElement.lang || 'en'
        }
      };
    }

    extractForms() {
      return Array.from(document.querySelectorAll('form')).map((form, index) => ({
        id: form.id || `form-${index}`,
        action: form.action || window.location.href,
        method: form.method || 'GET',
        fields: this.extractFormFields(form)
      }));
    }

    extractFormFields(form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      return Array.from(inputs)
        .filter(el => {
          const type = el.type;
          return type !== 'hidden' && type !== 'submit' && type !== 'button';
        })
        .map((field, i) => ({
          id: field.id || `field-${i}`,
          name: field.name || field.id,
          type: field.tagName === 'SELECT' ? 'select' : field.type || 'text',
          label: this.findLabel(field),
          placeholder: field.placeholder || null,
          required: field.hasAttribute('required'),
          value: field.value || ''
        }));
    }

    findLabel(field) {
      // Try multiple strategies to find label
      if (field.id) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) return label.textContent.trim();
      }
      const parentLabel = field.closest('label');
      if (parentLabel) {
        const clone = parentLabel.cloneNode(true);
        clone.querySelector('input, select, textarea')?.remove();
        return clone.textContent.trim();
      }
      return field.getAttribute('aria-label') || field.name || null;
    }

    extractNavigation() {
      const navContainers = document.querySelectorAll('nav, [role="navigation"], header');
      const links = [];
      navContainers.forEach(container => {
        container.querySelectorAll('a').forEach(link => {
          links.push({
            type: 'link',
            text: link.textContent.trim(),
            href: link.href
          });
        });
      });
      return links;
    }

    extractInteractables() {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
      return buttons.map(btn => ({
        type: 'button',
        text: btn.textContent.trim(),
        id: btn.id
      }));
    }

    extractLandmarks() {
      const landmarks = [];
      ['banner', 'navigation', 'main', 'complementary', 'contentinfo'].forEach(role => {
        document.querySelectorAll(`[role="${role}"]`).forEach((el, i) => {
          landmarks.push({ role, element: el.tagName + (el.id ? `#${el.id}` : `-${i}`) });
        });
      });
      return landmarks;
    }
  }

  // Icon helper - uses Lucide if available, otherwise fallback SVGs
  const getIcon = (name, size = 20) => {
    // Try to use Lucide icons via data attributes (Lucide will replace these)
    if (window.lucide) {
      return `<i data-lucide="${name.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}" style="width: ${size}px; height: ${size}px;"></i>`;
    }

    // Fallback SVGs if Lucide is not loaded
    const fallbackIcons = {
      Accessibility: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>',
      Volume2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
      VolumeX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>',
      Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
      X: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      Sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
      List: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      Languages: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
      Check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    };
    return fallbackIcons[name] || '';
  };

  class VoiceNavigation {
    constructor() {
      this.showWidget = false; // Main widget panel visibility
      this.isListening = false;
      this.voiceEnabled = true;
      this.showSettings = false;
      this.showCommands = false; // Default to false - user can open with button
      this.showLanguageSelector = false;
      this.language = 'en-US';
      this.transcript = '';
      this.isProcessing = false;
      this.commandHistory = [];
      this.conversationHistory = []; // Multi-turn conversation context
      this.lastContext = null; // Remember last topic/action
      this.recognizer = null;
      this.synthesizer = null;
      this.isSpeaking = false; // Track if bot is currently speaking
      this.speechTimer = null; // Timer for speech duration tracking
      this.speechToken = null; // Azure speech token for recreating synthesizer
      this.speechRegion = null; // Azure speech region for recreating synthesizer
      this.lastProcessedCommand = null; // Track last command to prevent duplicates
      this.lastProcessedTime = 0; // Timestamp of last processed command
      this.actionSpeakDisabled = false; // Flag to prevent actions from speaking when AI already spoke
      this.audioElement = null; // HTML5 audio element for controllable playback
      this.commandQueue = []; // Queue for commands received while bot is speaking
      this.isWaitingForBotToFinish = false; // Flag to show "please wait" UI
      
      // NEW: Dynamic DOM Analysis
      this.domAnalyzer = new DOMAnalyzer();
      this.currentDOMAnalysis = null;
      this.useDynamicMode = true; // Use dynamic DOM analysis instead of static commands
      
      // Accessibility settings
      this.textSize = 2; // 0: very small, 1: small, 2: normal, 3: large, 4: very large
      this.textSpacing = false;
      this.lineHeight = 1; // 0: compact, 1: normal, 2: relaxed, 3: extra relaxed
      this.dyslexiaFriendly = false;
      this.adhdMode = false; // Focus mode with cursor spotlight
      this.saturation = 1;
      this.invertColors = false;
      this.highlightLinks = false;
      this.customCursor = false;
      this.pauseAnimations = false;
      this.hideImages = false;

      this.loadState();
      this.init();
    }

    loadState() {
      this.isListening = localStorage.getItem('voiceNavListening') === 'true';
      this.voiceEnabled = localStorage.getItem('voiceNavFeedback') !== 'false';
      this.language = localStorage.getItem('voiceNavLanguage') || 'en-US';
      // Show commands: default to false unless explicitly set to true
      const savedShowCommands = localStorage.getItem('voiceNavShowCommands');
      this.showCommands = savedShowCommands === 'true'; // Only true if explicitly saved as true
      
      console.log('[Voice Nav] Loaded state - Listening:', this.isListening, 'Language:', this.language, 'Show Commands:', this.showCommands);
      
      // Load accessibility settings
      this.textSize = parseInt(localStorage.getItem('a11yTextSize') || '2');
      this.textSpacing = localStorage.getItem('a11yTextSpacing') === 'true';
      this.lineHeight = parseInt(localStorage.getItem('a11yLineHeight') || '1');
      this.dyslexiaFriendly = localStorage.getItem('a11yDyslexia') === 'true';
      this.adhdMode = localStorage.getItem('a11yADHD') === 'true';
      this.saturation = parseFloat(localStorage.getItem('a11ySaturation') || '1');
      this.invertColors = localStorage.getItem('a11yInvertColors') === 'true';
      this.highlightLinks = localStorage.getItem('a11yHighlightLinks') === 'true';
      this.customCursor = localStorage.getItem('a11yCursor') === 'true';
      this.pauseAnimations = localStorage.getItem('a11yPauseAnimations') === 'true';
      this.hideImages = localStorage.getItem('a11yHideImages') === 'true';
      
      // Apply saved settings
      this.applyAccessibilitySettings();
    }

    saveState() {
      localStorage.setItem('voiceNavListening', this.isListening.toString());
      localStorage.setItem('voiceNavFeedback', this.voiceEnabled.toString());
      localStorage.setItem('voiceNavLanguage', this.language);
      localStorage.setItem('voiceNavShowCommands', this.showCommands.toString());
      
      console.log('[Voice Nav] Saved state - Listening:', this.isListening, 'Show Commands:', this.showCommands);
      
      // Save accessibility settings
      localStorage.setItem('a11yTextSize', this.textSize.toString());
      localStorage.setItem('a11yTextSpacing', this.textSpacing.toString());
      localStorage.setItem('a11yLineHeight', this.lineHeight.toString());
      localStorage.setItem('a11yDyslexia', this.dyslexiaFriendly.toString());
      localStorage.setItem('a11yADHD', this.adhdMode.toString());
      localStorage.setItem('a11ySaturation', this.saturation.toString());
      localStorage.setItem('a11yInvertColors', this.invertColors.toString());
      localStorage.setItem('a11yHighlightLinks', this.highlightLinks.toString());
      localStorage.setItem('a11yCursor', this.customCursor.toString());
      localStorage.setItem('a11yPauseAnimations', this.pauseAnimations.toString());
      localStorage.setItem('a11yHideImages', this.hideImages.toString());
    }

    applyAccessibilitySettings() {
      const root = document.documentElement;
      const body = document.body;
      
      // Text size - 5 levels: very small, small, normal, large, very large
      const sizeMap = { 
        0: '0.75',   // Very small (75%)
        1: '0.875',  // Small (87.5%)
        2: '1',      // Normal (100%)
        3: '1.15',   // Large (115%)
        4: '1.3'     // Very large (130%)
      };
      root.style.fontSize = `${parseFloat(sizeMap[this.textSize] || '1') * 100}%`;
      
      // Text spacing - apply to body for cascade
      if (this.textSpacing) {
        body.style.letterSpacing = '0.12em';
        body.style.wordSpacing = '0.16em';
      } else {
        body.style.letterSpacing = '';
        body.style.wordSpacing = '';
      }
      
      // Line height - 4 levels: compact, normal, relaxed, extra relaxed
      const lineHeightMap = {
        0: '1.2',   // Compact
        1: '1.5',   // Normal
        2: '1.8',   // Relaxed
        3: '2.1'    // Extra relaxed
      };
      body.style.lineHeight = lineHeightMap[this.lineHeight] || '1.5';
      
      // Dyslexia friendly font - OpenDyslexic (Google Fonts fallback)
      if (this.dyslexiaFriendly) {
        // Load OpenDyslexic font if not already loaded
        if (!document.getElementById('lia-dyslexic-font')) {
          const link = document.createElement('link');
          link.id = 'lia-dyslexic-font';
          link.rel = 'stylesheet';
          link.href = 'https://fonts.googleapis.com/css2?family=OpenDyslexic&display=swap';
          document.head.appendChild(link);
        }
        body.style.fontFamily = 'OpenDyslexic, Comic Sans MS, Arial, Helvetica, sans-serif';
      } else {
        body.style.fontFamily = '';
      }
      
      // ADHD mode - Horizontal reading bar that follows cursor
      if (this.adhdMode) {
        body.classList.add('lia-adhd-mode');
        // Add horizontal reading bar overlay
        if (!document.getElementById('lia-adhd-spotlight')) {
          const spotlight = document.createElement('div');
          spotlight.id = 'lia-adhd-spotlight';
          spotlight.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2147483645;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.7) 0%,
              rgba(0, 0, 0, 0.7) calc(var(--mouse-y, 50%) - 100px),
              transparent calc(var(--mouse-y, 50%) - 100px),
              transparent calc(var(--mouse-y, 50%) + 100px),
              rgba(0, 0, 0, 0.7) calc(var(--mouse-y, 50%) + 100px),
              rgba(0, 0, 0, 0.7) 100%
            );
            transition: background 0.1s ease-out;
          `;
          body.appendChild(spotlight);
          
          // Track mouse movement smoothly
          let mouseY = window.innerHeight / 2;
          
          document.addEventListener('mousemove', (e) => {
            if (this.adhdMode) {
              mouseY = e.clientY;
              requestAnimationFrame(() => {
                spotlight.style.background = `linear-gradient(
                  to bottom,
                  rgba(0, 0, 0, 0.7) 0%,
                  rgba(0, 0, 0, 0.7) ${mouseY - 100}px,
                  transparent ${mouseY - 100}px,
                  transparent ${mouseY + 100}px,
                  rgba(0, 0, 0, 0.7) ${mouseY + 100}px,
                  rgba(0, 0, 0, 0.7) 100%
                )`;
              });
            }
          });
        }
      } else {
        body.classList.remove('lia-adhd-mode');
        const spotlight = document.getElementById('lia-adhd-spotlight');
        if (spotlight) {
          spotlight.remove();
        }
      }
      
      // Saturation and invert colors - apply to root for full page effect
      let filterValue = '';
      if (this.saturation !== 1) {
        filterValue += `saturate(${this.saturation}) `;
      }
      if (this.invertColors) {
        filterValue += 'invert(1) hue-rotate(180deg)';
      }
      root.style.filter = filterValue.trim();
      
      // Highlight links - use class for CSS rules
      if (this.highlightLinks) {
        body.classList.add('lia-highlight-links');
      } else {
        body.classList.remove('lia-highlight-links');
      }
      
      // Custom cursor - Big pointer cursor
      if (this.customCursor) {
        body.classList.add('lia-custom-cursor');
        // Set a large pointer cursor using SVG
        const cursorSVG = `data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="1" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
              </filter>
            </defs>
            <path d="M 5 5 L 5 30 L 12 23 L 16 32 L 20 30 L 16 21 L 24 21 Z" fill="white" stroke="black" stroke-width="1.5" filter="url(#shadow)"/>
          </svg>
        `)}`;
        body.style.cursor = `url("${cursorSVG}") 5 5, pointer`;
      } else {
        body.classList.remove('lia-custom-cursor');
        body.style.cursor = '';
      }
      
      // Pause animations - use class for CSS rules and inject additional styles
      if (this.pauseAnimations) {
        body.classList.add('lia-pause-animations');
        // Also add style rule to ensure it works everywhere
        if (!document.getElementById('lia-pause-animations-style')) {
          const style = document.createElement('style');
          style.id = 'lia-pause-animations-style';
          style.textContent = `
            body.lia-pause-animations *,
            body.lia-pause-animations *:before,
            body.lia-pause-animations *:after { 
              animation: none !important;
              animation-play-state: paused !important;
              animation-iteration-count: 0 !important;
              animation-duration: 0s !important;
            }
          `;
          document.head.appendChild(style);
        }
      } else {
        body.classList.remove('lia-pause-animations');
        const style = document.getElementById('lia-pause-animations-style');
        if (style) {
          style.remove();
        }
      }
      
      // Hide images - use class for CSS rules
      if (this.hideImages) {
        body.classList.add('lia-hide-images');
      } else {
        body.classList.remove('lia-hide-images');
      }
    }

    async init() {
      this.injectStyles();
      this.render();
      this.setupKeyboardShortcuts();
      this.setupPageUnloadHandler();
      this.startVisibilityMonitor();
      
      // Auto-restart voice navigation if it was previously enabled
      if (this.isListening) {
        // Small delay to ensure page is fully loaded
        setTimeout(async () => {
          try {
            await this.startRecognition();
            console.log('[Voice Nav] Auto-restarted on page load');
            
            // Check if we need to provide page explanation after navigation
            const pendingExplanation = localStorage.getItem('voiceNavPendingExplanation');
            if (pendingExplanation) {
              localStorage.removeItem('voiceNavPendingExplanation');
              console.log('[Voice Nav] Triggering pending explanation:', pendingExplanation);
              
              // Wait for page content to fully load before explaining
              // This ensures the AI gets actual content, not loading states
              this.waitForPageContent().then(() => {
                console.log('[Voice Nav] Page content loaded, waiting for complete render...');
                // Extra delay to ensure page is fully rendered and TTS is ready
                setTimeout(() => {
                  // Double-check that we have content before proceeding
                  const content = this.getCleanPageContent();
                  if (content && content.length > 100) {
                    console.log('[Voice Nav] Content verified, triggering explanation');
                    this.explainCurrentPage(pendingExplanation);
                  } else {
                    console.warn('[Voice Nav] Content still not ready, retrying in 2s...');
                    // Retry once after additional delay
                    setTimeout(() => {
                      this.explainCurrentPage(pendingExplanation);
                    }, 2000);
                  }
                }, 2000); // Increased delay from 1500ms to 2000ms
              });
            }
          } catch (error) {
            console.error('[Voice Nav] Failed to auto-restart:', error);
            // Reset state if auto-restart fails
            this.isListening = false;
            this.saveState();
            this.update();
          }
        }, 500);
      }
    }

    startVisibilityMonitor() {
      // Periodically check widget visibility and fix if needed
      setInterval(() => {
        const container = document.getElementById('lia-voice-container');
        if (container) {
          const isVisible = container.offsetWidth > 0 && container.offsetHeight > 0;
          if (!isVisible) {
            console.warn('[Voice Nav] Widget not visible, fixing...');
            this.updatePosition();
          }
        } else {
          console.warn('[Voice Nav] Widget container missing, re-rendering...');
          this.render();
        }
      }, 3000); // Check every 3 seconds
    }

    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+F2 or Cmd+F2 to toggle widget
        if ((e.ctrlKey || e.metaKey) && e.key === 'F2') {
          e.preventDefault();
          this.showWidget = !this.showWidget;
          this.update();
        }
      });
    }

    setupPageUnloadHandler() {
      // Save state before page unloads (navigation, refresh, etc.)
      window.addEventListener('beforeunload', () => {
        // Save current state immediately
        this.saveState();
        console.log('[Voice Nav] State saved before unload. Listening:', this.isListening);
      });

      // Also save state on visibility change (tab switch, minimize, etc.)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.saveState();
        } else {
          // When tab becomes visible, ensure widget is properly positioned and visible
          setTimeout(() => {
            this.ensureWidgetVisible();
          }, 100);
        }
      });
      
      // Ensure widget is visible after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.ensureWidgetVisible();
        }, 300);
      });
    }

    ensureWidgetVisible() {
      const container = document.getElementById('lia-voice-container');
      if (container) {
        this.updatePosition();
        console.log('[Voice Nav] Widget visibility check - Visible:', container.offsetWidth > 0 && container.offsetHeight > 0);
      } else {
        console.warn('[Voice Nav] Widget container not found, re-rendering');
        this.render();
      }
    }

    injectStyles() {
      // Remove existing style if present to prevent duplicates
      const existingStyle = document.getElementById('lia-voice-nav-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'lia-voice-nav-styles';
      style.textContent = `
        .lia-voice-nav * { box-sizing: border-box; }
        .lia-voice-nav { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          position: fixed !important; 
          z-index: 2147483647 !important;
          isolation: isolate !important;
          visibility: visible !important;
          opacity: 1 !important;
          display: block !important;
          pointer-events: auto !important;
        }
        .lia-voice-btn { cursor: pointer; border: none; background: white; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(147,51,234,0.3); transition: all 0.2s; position: relative; z-index: 2147483647; }
        .lia-voice-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(147,51,234,0.4); }
        .lia-voice-btn.active { background: #9333ea; color: white; }
        .lia-voice-btn svg { width: 24px; height: 24px; }
        .lia-pulse { position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; z-index: 2147483647; }
        .lia-pulse-dot { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #9333ea; animation: lia-pulse 2s infinite; }
        @keyframes lia-pulse { 0%, 100% { opacity: 1; transform: scale(0.8); } 50% { opacity: 0.5; transform: scale(1.2); } }
        @keyframes lia-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .lia-panel { position: absolute; background: white; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 16px; min-width: 280px; z-index: 2147483646; }
        
        /* Main Widget Panel */
        .lia-widget-panel { position: absolute; background: white; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); padding: 20px; min-width: 360px; max-width: 400px; z-index: 2147483646; }
        .lia-widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6; }
        .lia-widget-title { font-size: 18px; font-weight: 700; color: #1f2937; margin: 0; }
        .lia-widget-close { cursor: pointer; border: none; background: #f3f4f6; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .lia-widget-close:hover { background: #e5e7eb; }
        
        /* Widget Grid */
        .lia-widget-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
        .lia-widget-item { position: relative; cursor: pointer; border: 2px solid #e5e7eb; background: white; border-radius: 12px; padding: 16px 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s; text-align: center; }
        .lia-widget-item:hover { border-color: #9333ea; background: #faf5ff; transform: translateY(-2px); }
        .lia-widget-item.active { border-color: #9333ea; background: #f3e8ff; }
        .lia-widget-item svg { width: 24px; height: 24px; color: #6b7280; }
        .lia-widget-item.active svg { color: #9333ea; }
        .lia-widget-item span { font-size: 11px; font-weight: 600; color: #4b5563; line-height: 1.3; }
        .lia-widget-item.active span { color: #9333ea; }
        
        /* Reset Button */
        .lia-reset-btn { width: 100%; padding: 12px; border: none; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: white; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
        .lia-reset-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(147,51,234,0.4); }
        
        /* Voice Navigation Active Indicator */
        .lia-voice-active-badge { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #10b981; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        
        .lia-transcript { background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); border: 1px solid #e9d5ff; border-radius: 8px; padding: 12px; margin-bottom: 8px; z-index: 2147483646 !important; }
        .lia-cmd-item { background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); border: 1px solid #e9d5ff; border-radius: 6px; padding: 8px 12px; margin: 6px 0; font-size: 12px; color: #7c3aed; font-weight: 500; }
        .lia-setting-row { display: flex; justify-content: space-between; align-items: center; margin: 12px 0; }
        .lia-setting-label { font-size: 14px; color: #6b7280; }
        .lia-icon-btn { cursor: pointer; border: 1px solid #e5e7eb; background: white; border-radius: 6px; padding: 6px 12px; display: inline-flex; align-items: center; gap: 4px; font-size: 13px; }
        .lia-icon-btn:hover { background: #f9fafb; }
        .lia-icon-btn svg { width: 16px; height: 16px; }
        
        /* Accessibility Features Styles */
        body.lia-highlight-links a,
        body.lia-highlight-links a:link,
        body.lia-highlight-links a:visited,
        body.lia-highlight-links a:hover,
        body.lia-highlight-links a:active { 
          outline: 3px solid #9333ea !important; 
          outline-offset: 2px !important;
        }
        
        body.lia-adhd-mode *,
        body.lia-adhd-mode *:before,
        body.lia-adhd-mode *:after { 
          animation-duration: 0s !important; 
          animation-delay: 0s !important;
          transition-duration: 0.1s !important;
          transition-delay: 0s !important;
        }
        
        body.lia-pause-animations *,
        body.lia-pause-animations *:before,
        body.lia-pause-animations *:after { 
          animation-play-state: paused !important;
          animation-iteration-count: 0 !important;
        }
        
        body.lia-hide-images img,
        body.lia-hide-images picture,
        body.lia-hide-images svg { 
          opacity: 0.1 !important;
          filter: grayscale(100%) !important;
          pointer-events: none !important;
        }
        
        body.lia-custom-cursor *,
        body.lia-custom-cursor button,
        body.lia-custom-cursor a,
        body.lia-custom-cursor input,
        body.lia-custom-cursor select,
        body.lia-custom-cursor textarea {
          cursor: inherit !important;
        }
        
        /* Highlight styles for structure commands */
        .lia-highlight {
          position: relative !important;
          z-index: 1000 !important;
          outline: 4px solid #9333ea !important;
          outline-offset: 4px !important;
          background-color: rgba(147, 51, 234, 0.1) !important;
          transition: all 0.3s ease !important;
          animation: lia-highlight-pulse 2s ease-in-out infinite !important;
        }
        
        @keyframes lia-highlight-pulse {
          0%, 100% {
            outline-color: #9333ea;
            background-color: rgba(147, 51, 234, 0.1);
          }
          50% {
            outline-color: #7c3aed;
            background-color: rgba(147, 51, 234, 0.2);
          }
        }
        
        @media (max-width: 640px) {
          .lia-voice-btn { width: 56px; height: 56px; }
          .lia-widget-panel { min-width: calc(100vw - 32px); max-width: calc(100vw - 32px); }
          .lia-widget-grid { grid-template-columns: repeat(2, 1fr); }
          .lia-panel { min-width: calc(100vw - 32px); max-width: calc(100vw - 32px); }
        }
      `;
      document.head.appendChild(style);
    }

    render() {
      // Remove existing container if it exists
      const existing = document.getElementById('lia-voice-container');
      if (existing) {
        existing.remove();
      }
      
      const container = document.createElement('div');
      container.className = 'lia-voice-nav';
      container.id = 'lia-voice-container';
      
      // Ensure it's appended as the last child to be on top in stacking order
      document.body.appendChild(container);
      
      // Set position and styles AFTER appending to DOM
      this.updatePosition();
      container.innerHTML = this.getHTML();
      
      this.attachEventListeners();

      // Initialize Lucide icons if available
      if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
      }

      // Update position on resize (remove old listener first to prevent duplicates)
      const resizeHandler = () => this.updatePosition();
      window.removeEventListener('resize', resizeHandler);
      window.addEventListener('resize', resizeHandler);
      
      // Force visibility and positioning after a frame
      requestAnimationFrame(() => {
        this.updatePosition();
        // Ensure visibility
        container.style.visibility = 'visible';
        container.style.opacity = '1';
      });
      
      // Monitor DOM changes and ensure widget stays on top and visible
      if (!this.domObserver) {
        this.domObserver = new MutationObserver(() => {
          const widgetContainer = document.getElementById('lia-voice-container');
          if (widgetContainer && widgetContainer.parentNode === document.body) {
            // If widget is not the last child, move it to the end
            if (document.body.lastChild !== widgetContainer) {
              document.body.appendChild(widgetContainer);
            }
            // Ensure it stays visible
            if (widgetContainer.style.visibility !== 'visible') {
              widgetContainer.style.visibility = 'visible';
              widgetContainer.style.opacity = '1';
            }
          }
        });
        
        this.domObserver.observe(document.body, { childList: true, subtree: false });
      }
    }

    updatePosition() {
      const container = document.getElementById('lia-voice-container');
      if (!container) return;

      // Always set base styles first
      container.style.setProperty('position', 'fixed', 'important');
      container.style.setProperty('z-index', '2147483647', 'important');
      container.style.setProperty('pointer-events', 'auto', 'important');
      container.style.setProperty('isolation', 'isolate', 'important');
      container.style.setProperty('visibility', 'visible', 'important');
      container.style.setProperty('opacity', '1', 'important');
      container.style.setProperty('display', 'block', 'important');

      // Check if desktop (640px is 'sm' breakpoint)
      if (window.innerWidth >= 640) {
        // Desktop: top-right with !important to prevent override
        container.style.setProperty('top', '24px', 'important');
        container.style.setProperty('right', '24px', 'important');
        container.style.setProperty('bottom', 'auto', 'important');
        container.style.setProperty('left', 'auto', 'important');
      } else {
        // Mobile: bottom-left with !important to prevent override
        container.style.setProperty('top', 'auto', 'important');
        container.style.setProperty('right', 'auto', 'important');
        container.style.setProperty('bottom', '16px', 'important');
        container.style.setProperty('left', '16px', 'important');
      }
      
      console.log('[Voice Nav] Position updated - Desktop:', window.innerWidth >= 640, 'Container visible:', container.offsetWidth > 0 && container.offsetHeight > 0);
    }

    getHTML() {
      const examples = this.language === 'hi-IN'
        ? [
            '🏠 "होम पेज पर जाओ"', 
            '📋 "मेरे लिए योजनाएं खोजें"', 
            '⬇️ "नीचे स्क्रॉल करो"',
            '⬆️ "ऊपर जाओ"',
            '🔍 "ज़ूम इन करो"',
            '📝 "शीर्षक सुनाओ"',
            '🔗 "लिंक सुनाओ"',
            '✏️ "टाइप करो hello"',
            '❌ "बंद करो"'
          ]
        : [
            '🏠 "Go to home page"', 
            '📋 "Find schemes for me"', 
            '⬇️ "Scroll down"',
            '⬆️ "Go to top"',
            '🔍 "Zoom in"',
            '📝 "List headings"',
            '🔗 "List links"',
            '✏️ "Type hello world"',
            '❌ "Exit"'
          ];

      const isDesktop = window.innerWidth >= 640;
      
      const isHindi = this.language === 'hi-IN';

      // Desktop: buttons to left, panels below
      // Mobile: buttons to right, panels above
      const btnStyle1 = isDesktop
        ? 'position: absolute; top: 0; left: -48px; width: 40px; height: 40px;'
        : 'position: absolute; bottom: 0; left: 60px; width: 40px; height: 40px;';
      const btnStyle2 = isDesktop
        ? 'position: absolute; top: 0; left: -96px; width: 40px; height: 40px;'
        : 'position: absolute; bottom: 0; left: 110px; width: 40px; height: 40px;';

      const transcriptStyle = isDesktop
        ? 'position: absolute; top: 60px; right: 0; left: auto;'
        : 'position: absolute; bottom: 60px; left: 0; right: auto;';

      const settingsStyle = isDesktop
        ? 'position: absolute; top: 60px; right: 0; left: auto;'
        : 'position: absolute; bottom: 60px; left: 0; right: auto;';

      const commandsStyle = isDesktop
        ? 'position: absolute; top: 80px; right: 0; left: auto; max-width: 360px; max-height: 400px; overflow-y: auto;'
        : 'position: absolute; bottom: 60px; left: 0; right: auto; max-width: calc(100vw - 32px); max-height: 50vh; overflow-y: auto;';

      const widgetStyle = isDesktop
        ? 'position: absolute; top: 70px; right: 0;'
        : 'position: absolute; bottom: 70px; left: 0;';

      return `
        <div style="position: relative;">
          <button class="lia-voice-btn ${this.showWidget ? 'active' : ''}" id="lia-main-toggle" title="${isHindi ? 'सुलभता विकल्प' : 'Accessibility Options'}">
            ${getIcon('Accessibility')}
            ${this.isListening ? '<span class="lia-voice-active-badge">🎤</span>' : ''}
          </button>
          
          ${this.showWidget ? `
            <div class="lia-widget-panel" style="${widgetStyle}">
              <div class="lia-widget-header">
                <h3 class="lia-widget-title">${isHindi ? 'सुलभता विकल्प' : 'Accessibility Options'}</h3>
                <button class="lia-widget-close" id="lia-widget-close" title="${isHindi ? 'बंद करें' : 'Close'}">
                  ${getIcon('X', 16)}
                </button>
              </div>
              
              <div class="lia-widget-grid">
                <!-- Voice Navigation -->
                <div class="lia-widget-item ${this.isListening ? 'active' : ''}" id="lia-voice-nav-toggle" title="${isHindi ? 'वॉयस नेविगेशन' : 'Voice Navigation'}">
                  ${this.isListening ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  <span>${isHindi ? 'वॉयस नेविगेशन' : 'Voice Navigation'}</span>
                </div>
                
                <!-- Text Size (Cycle through levels) -->
                <div class="lia-widget-item ${this.textSize !== 2 ? 'active' : ''}" id="lia-text-size" title="${isHindi ? 'टेक्स्ट साइज' : 'Text Size'}">
                  ${this.textSize !== 2 ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>
                  <span style="font-size: 10px;">${
                    this.textSize === 0 ? (isHindi ? 'बहुत छोटा' : 'Very Small') :
                    this.textSize === 1 ? (isHindi ? 'छोटा' : 'Small') :
                    this.textSize === 2 ? (isHindi ? 'सामान्य' : 'Normal') :
                    this.textSize === 3 ? (isHindi ? 'बड़ा' : 'Large') :
                    (isHindi ? 'बहुत बड़ा' : 'Very Large')
                  }</span>
                </div>
                
                <!-- Text Spacing -->
                <div class="lia-widget-item ${this.textSpacing ? 'active' : ''}" id="lia-text-spacing" title="${isHindi ? 'टेक्स्ट स्पेसिंग' : 'Text Spacing'}">
                  ${this.textSpacing ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="4" y2="20"/><line x1="18" x2="18" y1="4" y2="20"/><polyline points="4 8 2 12 4 16"/><polyline points="20 8 22 12 20 16"/></svg>
                  <span>${isHindi ? 'टेक्स्ट स्पेसिंग' : 'Text Spacing'}</span>
                </div>
                
                <!-- Line Height (Cycle through levels) -->
                <div class="lia-widget-item ${this.lineHeight !== 1 ? 'active' : ''}" id="lia-line-height" title="${isHindi ? 'लाइन हाइट' : 'Line Height'}">
                  ${this.lineHeight !== 1 ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><polyline points="7 4 3 8 7 12"/><polyline points="17 4 21 8 17 12"/></svg>
                  <span style="font-size: 10px;">${
                    this.lineHeight === 0 ? (isHindi ? 'कॉम्पैक्ट' : 'Compact') :
                    this.lineHeight === 1 ? (isHindi ? 'सामान्य' : 'Normal') :
                    this.lineHeight === 2 ? (isHindi ? 'आरामदायक' : 'Relaxed') :
                    (isHindi ? 'अतिरिक्त' : 'Extra')
                  }</span>
                </div>
                
                <!-- Dyslexia Friendly -->
                <div class="lia-widget-item ${this.dyslexiaFriendly ? 'active' : ''}" id="lia-dyslexia" title="${isHindi ? 'डिस्लेक्सिया फ्रेंडली' : 'Dyslexia Friendly'}">
                  ${this.dyslexiaFriendly ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                  <span>${isHindi ? 'डिस्लेक्सिया फ्रेंडली' : 'Dyslexia Friendly'}</span>
                </div>
                
                <!-- ADHD Mode -->
                <div class="lia-widget-item ${this.adhdMode ? 'active' : ''}" id="lia-adhd" title="${isHindi ? 'ADHD मोड' : 'ADHD Mode'}">
                  ${this.adhdMode ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  <span>${isHindi ? 'ADHD मोड' : 'ADHD Mode'}</span>
                </div>
                
                <!-- Highlight Links -->
                <div class="lia-widget-item ${this.highlightLinks ? 'active' : ''}" id="lia-highlight-links" title="${isHindi ? 'लिंक हाइलाइट' : 'Highlight Links'}">
                  ${this.highlightLinks ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <span>${isHindi ? 'लिंक हाइलाइट' : 'Highlight Links'}</span>
                </div>
                
                <!-- Invert Colors -->
                <div class="lia-widget-item ${this.invertColors ? 'active' : ''}" id="lia-invert-colors" title="${isHindi ? 'रंग उलटें' : 'Invert Colors'}">
                  ${this.invertColors ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/></svg>
                  <span>${isHindi ? 'रंग उलटें' : 'Invert Colors'}</span>
                </div>
                
                <!-- Custom Cursor -->
                <div class="lia-widget-item ${this.customCursor ? 'active' : ''}" id="lia-cursor" title="${isHindi ? 'बड़ा कर्सर' : 'Big Cursor'}">
                  ${this.customCursor ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                  <span>${isHindi ? 'बड़ा कर्सर' : 'Big Cursor'}</span>
                </div>
                
                <!-- Pause Animations -->
                <div class="lia-widget-item ${this.pauseAnimations ? 'active' : ''}" id="lia-pause-anim" title="${isHindi ? 'एनिमेशन रोकें' : 'Pause Animations'}">
                  ${this.pauseAnimations ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  <span>${isHindi ? 'एनिमेशन रोकें' : 'Pause Animations'}</span>
                </div>
                
                <!-- Hide Images -->
                <div class="lia-widget-item ${this.hideImages ? 'active' : ''}" id="lia-hide-images" title="${isHindi ? 'इमेज छुपाएं' : 'Hide Images'}">
                  ${this.hideImages ? '<div style="position: absolute; top: 8px; right: 8px; color: #9333ea; font-size: 16px; font-weight: bold;">✓</div>' : ''}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" x2="6" y1="13.5" y2="21"/><line x1="18" x2="21" y1="12" y2="15"/><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/><path d="M21 15V5a2 2 0 0 0-2-2H9"/></svg>
                  <span>${isHindi ? 'इमेज छुपाएं' : 'Hide Images'}</span>
                </div>
              </div>
              
              <button class="lia-reset-btn" id="lia-reset-all">
                ${isHindi ? 'सभी सेटिंग्स रीसेट करें' : 'Reset All Settings'}
              </button>
            </div>
          ` : ''}
          
          ${this.isListening ? `
            <button class="lia-voice-btn" id="lia-list-toggle" style="${btnStyle1}" title="${this.showCommands ? 'Hide examples' : 'Show examples'}">
              ${getIcon('List')}
            </button>
            <button class="lia-voice-btn" id="lia-settings-toggle" style="${btnStyle2}" title="Voice settings">
              ${getIcon('Settings')}
            </button>
          ` : ''}
          
          ${this.isListening && this.transcript ? `
            <div class="lia-panel lia-transcript" style="${transcriptStyle}">
              <div style="display: flex; gap: 4px; margin-bottom: 4px; align-items: center;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.isSpeaking ? '#ef4444' : '#9333ea'}; animation: lia-pulse 1s infinite;"></div>
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.isSpeaking ? '#ef4444' : '#9333ea'}; animation: lia-pulse 1s infinite 0.2s;"></div>
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${this.isSpeaking ? '#ef4444' : '#9333ea'}; animation: lia-pulse 1s infinite 0.4s;"></div>
                ${this.lastContext ? `<span style="margin-left: 8px; font-size: 10px; color: #9333ea; background: rgba(147, 51, 234, 0.1); padding: 2px 6px; border-radius: 4px;">💬 ${this.lastContext}</span>` : ''}
              </div>
              ${this.isSpeaking ? `
                <p style="margin: 0; font-size: 12px; color: #ef4444; font-weight: 600;">🔊 ${this.language === 'hi-IN' ? 'बॉट बोल रहा है...' : 'Bot is speaking...'}</p>
                ${this.isWaitingForBotToFinish ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #f97316; background: rgba(249, 115, 22, 0.1); padding: 4px 8px; border-radius: 4px; border-left: 3px solid #f97316;">⏳ ${this.language === 'hi-IN' ? 'कृपया प्रतीक्षा करें...' : 'Please wait, command queued...'}</p>` : ''}
              ` : `
              <p style="margin: 0; font-size: 12px; color: #6b7280;">${this.language === 'hi-IN' ? 'सुन रहे हैं...' : 'Listening...'}</p>
              `}
              <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #1f2937;">${this.transcript}</p>
              ${this.isProcessing ? `<div style="margin-top: 4px;"><div style="width: 16px; height: 16px; color: #9333ea; animation: lia-spin 1s linear infinite;">${getIcon('Sparkles', 16)}</div></div>` : ''}
              ${this.commandQueue.length > 0 ? `<p style="margin: 8px 0 0 0; font-size: 10px; color: #9333ea; background: rgba(147, 51, 234, 0.1); padding: 4px 8px; border-radius: 4px;">📋 ${this.commandQueue.length} ${this.language === 'hi-IN' ? 'कमांड कतार में' : 'command(s) in queue'}</p>` : ''}
            </div>
          ` : ''}
          
          ${this.showSettings ? `
            <div class="lia-panel" id="lia-settings-panel" style="${settingsStyle}">
              <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${this.language === 'hi-IN' ? 'वॉयस सेटिंग्स' : 'Voice Settings'}</h3>
                <button id="lia-close-settings" style="border: none; background: none; cursor: pointer;">${getIcon('X')}</button>
              </div>
              
              <div class="lia-setting-row">
                <span class="lia-setting-label">${this.language === 'hi-IN' ? 'भाषा' : 'Language'}</span>
                <div style="position: relative;">
                  <button class="lia-icon-btn" id="lia-lang-toggle">
                    ${getIcon('Languages', 16)}
                    ${this.language === 'hi-IN' ? 'हिंदी' : 'English'}
                  </button>
                  ${this.showLanguageSelector ? `
                    <div style="position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 120px; z-index: 10001;">
                      <button class="lia-lang-option" data-lang="en-US" style="width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px;">
                        🇺🇸 English ${this.language === 'en-US' ? '<span style="margin-left: auto; width: 16px; height: 16px;">' + getIcon('Check', 16) + '</span>' : ''}
                      </button>
                      <button class="lia-lang-option" data-lang="hi-IN" style="width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px;">
                        🇮🇳 हिंदी ${this.language === 'hi-IN' ? '<span style="margin-left: auto; width: 16px; height: 16px;">' + getIcon('Check', 16) + '</span>' : ''}
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
              
              <div class="lia-setting-row">
                <span class="lia-setting-label">${this.language === 'hi-IN' ? 'वॉयस फीडबैक' : 'Voice Feedback'}</span>
                <button class="lia-icon-btn" id="lia-voice-toggle">
                  ${this.voiceEnabled ? getIcon('Volume2', 16) : getIcon('VolumeX', 16)}
                </button>
              </div>
              
              <div class="lia-setting-row">
                <div>
                  <span class="lia-setting-label">${this.language === 'hi-IN' ? 'AI मोड' : 'AI Mode'}</span>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af;">${this.language === 'hi-IN' ? 'सब कुछ समझता है' : 'Understands everything'}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <div style="width: 16px; height: 16px; color: #9333ea;">${getIcon('Sparkles', 16)}</div>
                  <span style="font-size: 13px; font-weight: 600; color: #9333ea;">${this.language === 'hi-IN' ? 'चालू' : 'ON'}</span>
                </div>
              </div>
              
              ${this.conversationHistory.length > 0 ? `
                <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
                  <button class="lia-icon-btn" id="lia-clear-conversation" style="width: 100%; justify-content: center;">
                    ${getIcon('X', 16)}
                    <span>${this.language === 'hi-IN' ? 'बातचीत रीसेट करें' : 'Clear Conversation'}</span>
                  </button>
                  <p style="margin: 4px 0 0 0; font-size: 10px; color: #9ca3af; text-align: center;">
                    ${this.conversationHistory.length / 2} ${this.language === 'hi-IN' ? 'बातें' : 'messages'}
                  </p>
                </div>
              ` : ''}
            </div>
          ` : ''}
          
          ${this.isListening && this.showCommands ? `
            <div class="lia-panel" style="${commandsStyle}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 20px; height: 20px; color: #9333ea;">${getIcon('Sparkles', 20)}</div>
                  <div>
                    <h3 style="margin: 0; font-size: 14px; font-weight: 600;">${this.language === 'hi-IN' ? 'मुझसे कुछ भी पूछें' : 'Ask Me Anything'}</h3>
                    <p style="margin: 0; font-size: 11px; color: #6b7280;">${this.language === 'hi-IN' ? 'AI-powered असिस्टेंट' : 'AI-powered assistant'}</p>
                  </div>
                </div>
                <button id="lia-close-commands" style="border: none; background: none; cursor: pointer; flex-shrink: 0;">${getIcon('X')}</button>
              </div>
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">
                ${this.language === 'hi-IN' ? '✨ कुछ भी पूछें, मैं समझ जाऊंगा! उदाहरण:' : '✨ Just speak naturally, I understand! Examples:'}
              </p>
              ${examples.map(cmd => `<div class="lia-cmd-item">${cmd}</div>`).join('')}
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #6b7280;">
                  ${this.language === 'hi-IN' ? '🎤 बोलो और मैं करूंगा!' : '🎤 Speak and I will help!'}
                </p>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    update() {
      const container = document.querySelector('.lia-voice-nav');
      if (container) {
        container.innerHTML = this.getHTML();
        this.attachEventListeners();

        // Re-initialize Lucide icons after update
        if (window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
        
        // Ensure position is maintained after update
        requestAnimationFrame(() => {
          this.updatePosition();
        });
      }
    }

    attachEventListeners() {
      // Main toggle button - opens/closes widget
      const mainToggle = document.getElementById('lia-main-toggle');
      if (mainToggle) mainToggle.onclick = () => { 
        this.showWidget = !this.showWidget; 
        this.update(); 
      };

      // Widget close button
      const widgetClose = document.getElementById('lia-widget-close');
      if (widgetClose) widgetClose.onclick = () => { 
        this.showWidget = false; 
        this.update(); 
      };

      // Voice Navigation toggle
      const voiceNavToggle = document.getElementById('lia-voice-nav-toggle');
      if (voiceNavToggle) voiceNavToggle.onclick = () => this.toggleListening();

      // Text size control - cycle through 5 levels
      const textSize = document.getElementById('lia-text-size');
      if (textSize) textSize.onclick = () => {
        // Cycle: 0 → 1 → 2 → 3 → 4 → 0
        this.textSize = (this.textSize + 1) % 5;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Text spacing
      const textSpacing = document.getElementById('lia-text-spacing');
      if (textSpacing) textSpacing.onclick = () => {
        this.textSpacing = !this.textSpacing;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Line height - cycle through 4 levels
      const lineHeight = document.getElementById('lia-line-height');
      if (lineHeight) lineHeight.onclick = () => {
        // Cycle: 0 → 1 → 2 → 3 → 0
        this.lineHeight = (this.lineHeight + 1) % 4;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Dyslexia friendly
      const dyslexia = document.getElementById('lia-dyslexia');
      if (dyslexia) dyslexia.onclick = () => {
        this.dyslexiaFriendly = !this.dyslexiaFriendly;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // ADHD mode
      const adhd = document.getElementById('lia-adhd');
      if (adhd) adhd.onclick = () => {
        this.adhdMode = !this.adhdMode;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Highlight links
      const highlightLinks = document.getElementById('lia-highlight-links');
      if (highlightLinks) highlightLinks.onclick = () => {
        this.highlightLinks = !this.highlightLinks;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Invert colors
      const invertColors = document.getElementById('lia-invert-colors');
      if (invertColors) invertColors.onclick = () => {
        this.invertColors = !this.invertColors;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Custom cursor
      const cursor = document.getElementById('lia-cursor');
      if (cursor) cursor.onclick = () => {
        this.customCursor = !this.customCursor;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Pause animations
      const pauseAnim = document.getElementById('lia-pause-anim');
      if (pauseAnim) pauseAnim.onclick = () => {
        this.pauseAnimations = !this.pauseAnimations;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Hide images
      const hideImages = document.getElementById('lia-hide-images');
      if (hideImages) hideImages.onclick = () => {
        this.hideImages = !this.hideImages;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
      };

      // Reset all button
      const resetAll = document.getElementById('lia-reset-all');
      if (resetAll) resetAll.onclick = () => {
        this.textSize = 2; // Reset to Normal
        this.textSpacing = false;
        this.lineHeight = 1; // Reset to Normal
        this.dyslexiaFriendly = false;
        this.adhdMode = false;
        this.saturation = 1;
        this.invertColors = false;
        this.highlightLinks = false;
        this.customCursor = false;
        this.pauseAnimations = false;
        this.hideImages = false;
        this.applyAccessibilitySettings();
        this.saveState();
        this.update();
        this.speak(this.language === 'hi-IN' ? 'सभी सेटिंग्स रीसेट हो गईं' : 'All settings reset');
      };

      // Voice navigation settings (when voice nav is active)
      const listToggle = document.getElementById('lia-list-toggle');
      if (listToggle) listToggle.onclick = () => { 
        this.showCommands = !this.showCommands; 
        this.saveState(); // Save preference
        this.update(); 
      };

      const settingsToggle = document.getElementById('lia-settings-toggle');
      if (settingsToggle) settingsToggle.onclick = () => { 
        this.showSettings = !this.showSettings; 
        if (this.showSettings) {
          this.showCommands = false;
          this.saveState(); // Save preference
        }
        this.update(); 
      };

      const closeSettings = document.getElementById('lia-close-settings');
      if (closeSettings) closeSettings.onclick = () => { 
        this.showSettings = false; 
        this.update(); 
      };

      const closeCommands = document.getElementById('lia-close-commands');
      if (closeCommands) closeCommands.onclick = () => { 
        this.showCommands = false; 
        this.saveState(); // Save preference
        this.update(); 
      };

      const langToggle = document.getElementById('lia-lang-toggle');
      if (langToggle) langToggle.onclick = () => { this.showLanguageSelector = !this.showLanguageSelector; this.update(); };

      const langOptions = document.querySelectorAll('.lia-lang-option');
      langOptions.forEach(opt => {
        opt.onclick = () => {
          this.language = opt.dataset.lang;
          this.showLanguageSelector = false;
          this.saveState();
          if (this.isListening) {
            this.stopRecognition();
            setTimeout(() => this.startRecognition(), 500);
          }
          this.update();
        };
      });

      const voiceToggle = document.getElementById('lia-voice-toggle');
      if (voiceToggle) voiceToggle.onclick = () => { this.voiceEnabled = !this.voiceEnabled; this.saveState(); this.update(); };

      const clearConversation = document.getElementById('lia-clear-conversation');
      if (clearConversation) clearConversation.onclick = () => { this.conversationHistory = []; this.lastContext = null; this.commandHistory = []; this.speak(this.language === 'hi-IN' ? 'बातचीत रीसेट हो गई' : 'Conversation cleared'); this.update(); };
    }

    async toggleListening() {
      this.isListening = !this.isListening;
      this.saveState(); // Save immediately
      console.log('[Voice Nav] Toggled listening to:', this.isListening);
      
      if (this.isListening) {
        try {
          await this.startRecognition(true); // Pass true to indicate manual activation
        } catch (error) {
          console.error('[Voice Nav] Failed to start recognition:', error);
          // Revert state if failed
          this.isListening = false;
          this.saveState();
        }
      } else {
        // Stop any ongoing speech when deactivating voice navigation
        if (this.isSpeaking) {
          this.forceStopSpeech();
        }
        this.stopRecognition();
      }
      this.update();
    }

    async startRecognition(manualActivation = false) {
      try {
        console.log('[Voice Nav] Starting recognition...');
        const response = await fetch(`${API_BASE}/azure-speech`);
        if (!response.ok) {
          throw new Error(`Failed to get speech token: ${response.status}`);
        }
        const { token, region } = await response.json();
        
        // Store for later use (e.g., recreating synthesizer)
        this.speechToken = token;
        this.speechRegion = region;

        const SpeechSDK = window.SpeechSDK;
        if (!SpeechSDK) {
          throw new Error('Speech SDK not loaded');
        }
        
        // Use fromSubscription (token is actually the subscription key)
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
        speechConfig.speechRecognitionLanguage = this.language;

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        this.recognizer.recognizing = (s, e) => {
          if (e.result.text) {
            // Update transcript
            this.transcript = e.result.text.toLowerCase().trim();
            
            // If bot is speaking, show "please wait" indicator
            if (this.isSpeaking) {
              this.isWaitingForBotToFinish = true;
            }
            
            this.update();
          }
        };

        this.recognizer.recognized = (s, e) => {
          if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech && e.result.text) {
            const command = e.result.text.toLowerCase().trim();
            const now = Date.now();
            
            // Prevent duplicate command processing (within 2 seconds)
            if (this.lastProcessedCommand === command && (now - this.lastProcessedTime) < 2000) {
              return;
            }
            
            const wordCount = command.split(/\s+/).filter(w => w.length > 0).length;
            // Only process commands with 3+ words OR recognized single-word commands
            const singleWordCommands = ['help', 'exit', 'quit', 'stop', 'home', 'back', 'forward', 'refresh', 'print', 'tab', 'enter', 'click'];
            const shouldProcess = wordCount >= 3 || singleWordCommands.includes(command);
            
            if (shouldProcess) {
            this.transcript = command;
              
              // If bot is speaking, queue the command instead of processing immediately
              if (this.isSpeaking) {
                this.commandQueue.push(command);
                this.isWaitingForBotToFinish = true;
                this.update(); // Update UI to show "please wait"
              } else {
                // Bot is not speaking, process immediately
                this.lastProcessedCommand = command;
                this.lastProcessedTime = now;
            this.handleVoiceCommand(command);
              }
            }
          }
        };

        this.recognizer.startContinuousRecognitionAsync();

        // Setup TTS
        const ttsConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
        ttsConfig.speechSynthesisLanguage = this.language;
        ttsConfig.speechSynthesisVoiceName = this.language === 'hi-IN' ? 'hi-IN-SwaraNeural' : 'en-US-JennyNeural';

        const audioConfigTTS = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
        this.synthesizer = new SpeechSDK.SpeechSynthesizer(ttsConfig, audioConfigTTS);

        console.log('[Voice Nav] Recognition started successfully');
        
        // Only speak welcome message if manually activated (not on page reload)
        if (manualActivation) {
          this.speak(this.language === 'hi-IN' ? 'वॉयस नेविगेशन चालू है' : 'Voice navigation is on');
        }
      } catch (error) {
        console.error('[Voice Nav] Failed to start recognition:', error);
        this.isListening = false;
        this.saveState(); // Save the failed state
        this.update();
        throw error; // Re-throw so caller can handle
      }
    }

    stopRecognition() {
      console.log('[Voice Nav] Stopping recognition...');
      
      // Force stop any ongoing speech immediately
      if (this.isSpeaking) {
        this.isSpeaking = false;
        
        // Clear speech timer
        if (this.speechTimer) {
          clearTimeout(this.speechTimer);
          this.speechTimer = null;
        }
      }
      
      if (this.recognizer) {
        this.recognizer.stopContinuousRecognitionAsync(() => {
          this.recognizer.close();
          this.recognizer = null;
          console.log('[Voice Nav] Recognizer stopped and closed');
        });
      }
      if (this.synthesizer) {
        this.synthesizer.close();
        this.synthesizer = null;
      }
      this.transcript = '';
    }

    speak(text) {
      // Skip speaking if action-level speaking is disabled (AI already spoke)
      if (this.actionSpeakDisabled) {
        return;
      }
      
      if (!this.voiceEnabled || !this.synthesizer) {
        return;
      }
      
      // Clear any existing speech timer
      if (this.speechTimer) {
        clearTimeout(this.speechTimer);
        this.speechTimer = null;
      }
      
      // Calculate accurate speech duration
      // Average speaking rate: 150 words/min, but add buffer for synthesis and audio latency
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      const charsPerSecond = 15; // More accurate: ~15 characters per second for TTS
      const estimatedDuration = (text.length / charsPerSecond) * 1000; // Convert to milliseconds
      const totalDuration = estimatedDuration + 500; // Add 500ms buffer for synthesis delay
      // Delay to ensure previous speech stops and synthesizer is ready
      setTimeout(() => {
        if (this.synthesizer && this.voiceEnabled) {
          this.isSpeaking = true;
          
          this.synthesizer.speakTextAsync(
            text,
            (result) => {
              // Callback fired when synthesis completes (NOT when audio finishes playing!)
            },
            (error) => {
              // On error - speech stopped/failed
              this.isSpeaking = false;
              
              if (this.speechTimer) {
                clearTimeout(this.speechTimer);
                this.speechTimer = null;
              }
            }
          );
          
          // Set timer to reset isSpeaking flag after the estimated playback duration
          this.speechTimer = setTimeout(() => {
            this.isSpeaking = false;
            this.speechTimer = null;
            
            // Process queued commands
            if (this.commandQueue.length > 0) {
              const nextCommand = this.commandQueue.shift(); // Get first command from queue
              this.isWaitingForBotToFinish = false;
              this.update();
              
              // Update last processed tracking
              this.lastProcessedCommand = nextCommand;
              this.lastProcessedTime = Date.now();
              
              // Process the queued command
              setTimeout(() => {
                this.handleVoiceCommand(nextCommand);
              }, 300); // Small delay before processing next command
            } else {
              this.isWaitingForBotToFinish = false;
              this.update();
            }
          }, totalDuration);
        }
      }, 200); // Increased delay to ensure synthesizer is ready after force stop
    }

    stopSpeaking() {
      if (this.synthesizer && this.isSpeaking) {
        this.synthesizer.stopSpeakingAsync();
        this.isSpeaking = false;
        
        // Clear speech timer
        if (this.speechTimer) {
          clearTimeout(this.speechTimer);
          this.speechTimer = null;
        }
      }
    }

    forceStopSpeech() {
      // Clear state immediately
      this.isSpeaking = false;
      
      // Clear speech timer
      if (this.speechTimer) {
        clearTimeout(this.speechTimer);
        this.speechTimer = null;
      }
      
      // Try to stop speaking before closing
      if (this.synthesizer) {
        try {
          // Try to stop any ongoing speech
          if (typeof this.synthesizer.stopSpeakingAsync === 'function') {
            this.synthesizer.stopSpeakingAsync(
              () => {},
              (error) => {}
            );
          }
          
          // Small delay to let stop complete, then close
          setTimeout(() => {
            if (this.synthesizer) {
              this.synthesizer.close();
              // Try to interrupt audio buffer by playing silent audio
              try {
                const silentAudio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
                silentAudio.volume = 0;
                silentAudio.play().catch(() => {});
              } catch (e) {
              }
              
              // Recreate synthesizer for future speech
              if (this.speechToken && this.speechRegion) {
                try {
                  const SpeechSDK = window.SpeechSDK;
                  const ttsConfig = SpeechSDK.SpeechConfig.fromSubscription(this.speechToken, this.speechRegion);
                  ttsConfig.speechSynthesisLanguage = this.language;
                  ttsConfig.speechSynthesisVoiceName = this.language === 'hi-IN' ? 'hi-IN-SwaraNeural' : 'en-US-JennyNeural';
                  
                  const audioConfigTTS = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
                  this.synthesizer = new SpeechSDK.SpeechSynthesizer(ttsConfig, audioConfigTTS);
                } catch (e) {
                }
              }
            }
          }, 50);
        } catch (e) {
        }
      }
    }

    waitForPageContent(timeout = 8000) {
      // Wait for actual page content to load (not just loading states/errors)
      return new Promise((resolve) => {
        const startTime = Date.now();
        
        const checkContent = () => {
          // Check for specific content indicators that show page is loaded
          const main = document.querySelector('main, [role="main"], #__next, .main-content, article');
          
          // Check for common content indicators
          const hasParagraphs = document.querySelectorAll('p').length > 3;
          const hasHeadings = document.querySelectorAll('h1, h2, h3').length > 0;
          const bodyText = document.body.textContent.trim();
          const hasSubstantialContent = bodyText.length > 500; // Increased threshold
          
          // Check if main content area exists and has actual content
          const mainContent = main ? main.textContent.trim() : '';
          const mainHasContent = mainContent.length > 300;
          
          // More stringent check - need multiple indicators
          const contentReady = (main && mainHasContent && hasParagraphs) || 
                               (hasSubstantialContent && hasParagraphs && hasHeadings);
          
          if (contentReady) {
            console.log('[Voice Nav] Page content ready - Body:', bodyText.length, 'chars, Paragraphs:', hasParagraphs, 'Headings:', hasHeadings);
            resolve();
            return;
          }
          
          // Timeout after specified duration
          if (Date.now() - startTime > timeout) {
            console.log('[Voice Nav] Content wait timeout after', timeout, 'ms - proceeding with available content');
            resolve();
            return;
          }
          
          // Check again in 300ms (increased from 200ms for more stable loading)
          setTimeout(checkContent, 300);
        };
        
        checkContent();
      });
    }

    async explainCurrentPage(context) {
      // Automatically explain the current page after navigation
      const pageTitle = document.title;
      const url = window.location.pathname;
      
      console.log('[Voice Nav] Explaining page - Context:', context, 'URL:', url);
      
      // Create a contextual prompt based on what page we're on
      let prompt = '';
      
      if (context === 'scheme') {
        // Scheme page - provide brief overview
        prompt = this.language === 'hi-IN' 
          ? 'इस योजना के बारे में संक्षेप में बताओ - मुख्य लाभ, पात्रता और कैसे आवेदन करें'
          : 'Briefly tell me about this scheme - main benefits, eligibility, and how to apply';
      } else if (context === 'categories') {
        // Categories page - list available categories
        prompt = this.language === 'hi-IN'
          ? 'यहां कौन-कौन सी श्रेणियां उपलब्ध हैं?'
          : 'What categories are available on this page?';
      } else if (context === 'page_info') {
        // Generic page info - describe what's on the page
        prompt = this.language === 'hi-IN'
          ? 'इस पेज पर क्या उपलब्ध है, संक्षेप में बताओ'
          : 'Briefly tell me what is available on this page';
      }
      
      if (prompt) {
        console.log('[Voice Nav] Sending auto-prompt:', prompt);
        this.handleVoiceCommand(prompt);
      }
    }

    getCleanPageContent() {
      // Get clean page content, filtering out errors and technical messages
      try {
        // Try to get main content from multiple possible selectors
        const mainSelectors = [
          'main',
          '[role="main"]',
          '#__next',
          '.main-content',
          'article',
          '.content',
          '.scheme-content',
          '.page-content'
        ];
        
        let main = null;
        for (const selector of mainSelectors) {
          main = document.querySelector(selector);
          if (main && main.textContent.trim().length > 200) {
            console.log('[Voice Nav] Found content in:', selector);
            break;
          }
        }
        
        let content = '';
        
        if (main) {
          content = main.textContent || '';
        } else {
          // Fallback: get body but try to skip navigation and footers
          const nav = document.querySelector('nav, header');
          const footer = document.querySelector('footer');
          
          // Clone body to manipulate
          const bodyClone = document.body.cloneNode(true);
          
          // Remove navigation and footer from clone
          if (nav) {
            const navClone = bodyClone.querySelector('nav, header');
            if (navClone) navClone.remove();
          }
          if (footer) {
            const footerClone = bodyClone.querySelector('footer');
            if (footerClone) footerClone.remove();
          }
          
          content = bodyClone.textContent || '';
        }
        
        // Filter out common error patterns and technical content
        const linesToFilter = content.split('\n').filter(line => {
          const trimmed = line.trim().toLowerCase();
          // Skip error messages, technical logs, and unwanted content
          if (trimmed.length < 3) return false; // Skip very short lines
          if (trimmed.includes('cors policy')) return false;
          if (trimmed.includes('access to manifest')) return false;
          if (trimmed.includes('x-frame-options')) return false;
          if (trimmed.includes('err_failed')) return false;
          if (trimmed.includes('cognito')) return false;
          if (trimmed.includes('oauth2')) return false;
          if (trimmed.includes('redirect_uri')) return false;
          if (trimmed.includes('loading')) return false;
          if (trimmed.includes('please wait')) return false;
          if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return false;
          if (/^[\d\s:]+$/.test(trimmed)) return false; // Skip lines with only numbers/colons
          if (/^[\d.,]+$/.test(trimmed)) return false; // Skip lines with only numbers and punctuation
          return true;
        });
        
        content = linesToFilter.join(' ').replace(/\s+/g, ' ').trim();
        
        // Log sample of content for debugging
        const sample = content.substring(0, 150);
        console.log('[Voice Nav] Clean content length:', content.length, 'chars. Sample:', sample);
        
        // Return empty if content is suspiciously short
        if (content.length < 100) {
          console.warn('[Voice Nav] Content too short, may not be loaded yet');
          return '';
        }
        
        return content.slice(0, 4000); // Increased limit to 4000 chars for more context
      } catch (error) {
        console.error('[Voice Nav] Error getting page content:', error);
        return '';
      }
    }

    async handleVoiceCommand(command) {
      this.isProcessing = true;
      this.update();

      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: command,
        timestamp: Date.now()
      });

      // Keep only last 10 turns to avoid token limits
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      try {
        const response = await fetch(`${API_BASE}/voice-ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command,
            language: this.language,
            pageContent: this.getCleanPageContent(),
            currentUrl: window.location.pathname,
            conversationHistory: this.conversationHistory.slice(-10), // Last 5 turns
            lastContext: this.lastContext
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          // Store AI response in conversation history
          if (data.response) {
            this.conversationHistory.push({
              role: 'assistant',
              content: data.response,
              timestamp: Date.now()
            });
            this.speak(data.response);
          }

          // Update context for next turn
          if (data.context) {
            this.lastContext = data.context;
          }

          // Execute action if provided (skip 'chat' which is info-only)
          if (data.action && data.action !== 'chat') {
            // Normalize action name: replace spaces with underscores and lowercase
            const normalizedAction = data.action.replace(/\s+/g, '_').toLowerCase();
            
            // Check if this is a navigation action that redirects the page
            const navigationActions = [
              'home', 'go_home', 'find_schemes_for_me', 'show_categories', 'show_states', 
              'show_ministries', 'show_faq', 'kisan_samriddhi_yojana', 'ksyj', 
              'gopal_incentive_scheme', 'gis', 'training_ai_selfemployment', 'toaifse',
              'kharmore_sonchidia_award', 'ksas', 'educational_study_scheme', 'essg',
              'open_kisan_samriddhi', 'open_gopal_incentive', 'open_ai_training',
              'open_kharmore_award', 'open_educational_study',
              'reload_page', 'refresh_page', 'previous_page', 'back', 'forward',
              'tell_about_kisan_samriddhi', 'tell_about_gopal_incentive',
              'tell_about_ai_training', 'tell_about_kharmore_award',
              'tell_about_educational_study'
            ];
            
            // For navigation actions with auto-explanation, DON'T speak the AI response
            // Just navigate immediately and let the auto-explanation handle it
            const tellAboutActions = [
              'tell_about_kisan_samriddhi', 'tell_about_gopal_incentive',
              'tell_about_ai_training', 'tell_about_kharmore_award',
              'tell_about_educational_study'
            ];
            
            if (tellAboutActions.includes(normalizedAction)) {
              // Skip AI response, navigate immediately, auto-explanation will handle it
              console.log('[Voice Nav] Tell about command - skipping AI response, navigating immediately');
              this.actionSpeakDisabled = true;
              this.executeAction(normalizedAction, data.parameters || {});
              this.actionSpeakDisabled = false;
            } else if (data.response && data.response.trim()) {
              // For other actions with AI responses
              this.actionSpeakDisabled = true;
              
              // If it's a navigation action AND there's a response to speak, delay the navigation
              if (navigationActions.includes(normalizedAction)) {
                // Calculate speech duration to wait before redirecting
                const text = data.response;
                const charsPerSecond = 15;
                const estimatedDuration = (text.length / charsPerSecond) * 1000;
                const delayBeforeNavigation = estimatedDuration + 800; // Add buffer
                
                console.log('[Voice Nav] Delaying navigation for', delayBeforeNavigation, 'ms to allow speech to complete');
                
                // Execute navigation after speech completes
                setTimeout(() => {
                  this.executeAction(normalizedAction, data.parameters || {});
                  this.actionSpeakDisabled = false;
                }, delayBeforeNavigation);
              } else {
                // Non-navigation action, execute immediately
                this.executeAction(normalizedAction, data.parameters || {});
                this.actionSpeakDisabled = false;
              }
            } else {
              // No AI response, execute immediately
              this.executeAction(normalizedAction, data.parameters || {});
            }
          }

          // Add command to visible history
          this.commandHistory.unshift({
            command,
            response: data.response,
            action: data.action,
            timestamp: Date.now()
          });
          
          // Keep only last 5 for UI
          if (this.commandHistory.length > 5) {
            this.commandHistory = this.commandHistory.slice(0, 5);
          }
        }
      } catch (error) {
        this.speak(this.language === 'hi-IN' ? 'माफ़ करें, कुछ गड़बड़ हो गई' : 'Sorry, something went wrong');
      } finally {
        this.isProcessing = false;
        this.update();
      }
    }

    // Helper function to highlight elements
    highlightElements(elements, duration = 5000) {
      console.log('[Voice Nav] Highlighting', elements.length, 'elements');
      
      // Remove any existing highlights
      document.querySelectorAll('.lia-highlight').forEach(el => {
        el.classList.remove('lia-highlight');
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.backgroundColor = '';
        el.style.transition = '';
      });

      // Add highlight to new elements
      elements.forEach((el, index) => {
        el.classList.add('lia-highlight');
        el.style.outline = '4px solid #9333ea';
        el.style.outlineOffset = '4px';
        el.style.backgroundColor = 'rgba(147, 51, 234, 0.1)';
        el.style.transition = 'all 0.3s ease';
        el.style.scrollMarginTop = '100px';
        el.style.position = 'relative';
        el.style.zIndex = '1000';
        
        // Scroll first element into view with delay
        if (index === 0) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('[Voice Nav] Scrolled to first element');
          }, 300);
        }
      });

      // Remove highlights after duration
      setTimeout(() => {
        elements.forEach(el => {
          el.classList.remove('lia-highlight');
          el.style.outline = '';
          el.style.outlineOffset = '';
          el.style.backgroundColor = '';
          el.style.transition = '';
          el.style.zIndex = '';
        });
        console.log('[Voice Nav] Highlights removed');
      }, duration);
    }

    executeAction(action, parameters = {}) {
      const actions = {
        // Conversational (no action needed - AI handles response)
        chat: () => {
          // Info-only response, no action needed
          // Response already spoken in handleVoiceCommand
        },

        // ===== WIDGET CONTROL =====
        show_widget: () => {
          this.showCommands = true;
          this.update();
          this.speak(this.language === 'hi-IN' ? 'विजेट दिख रहा है' : 'Widget shown');
        },
        open_widget: () => {
          this.showCommands = true;
          this.update();
          this.speak(this.language === 'hi-IN' ? 'विजेट खुला' : 'Widget opened');
        },
        close_widget: () => {
          this.showCommands = false;
          this.showSettings = false;
          this.update();
          this.speak(this.language === 'hi-IN' ? 'विजेट बंद' : 'Widget closed');
        },
        hide_widget: () => {
          this.showCommands = false;
          this.showSettings = false;
          this.update();
          this.speak(this.language === 'hi-IN' ? 'विजेट छुपा' : 'Widget hidden');
        },

        // ===== STOP VOICE NAVIGATION =====
        exit: () => {
          this.isListening = false;
          this.saveState();
          this.stopRecognition();
          this.speak(this.language === 'hi-IN' ? 'वॉयस नेविगेशन बंद' : 'Voice navigation stopped');
          this.update();
        },
        quit: () => {
          this.isListening = false;
          this.saveState();
          this.stopRecognition();
          this.speak(this.language === 'hi-IN' ? 'बंद कर रहे हैं' : 'Quitting');
          this.update();
        },
        stop: () => {
          this.isListening = false;
          this.saveState();
          this.stopRecognition();
          this.speak(this.language === 'hi-IN' ? 'रुक गए' : 'Stopped');
          this.update();
        },
        stop_voice_assistance: () => {
          this.isListening = false;
          this.saveState();
          this.stopRecognition();
          this.speak(this.language === 'hi-IN' ? 'वॉयस असिस्टेंट बंद' : 'Voice assistance stopped');
          this.update();
        },

        // ===== PAGE STRUCTURE =====
        list_headings: () => {
          // Get all visible headings
          const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          const headings = allHeadings.filter(h => {
            // Only include visible headings with actual text
            const text = h.textContent.trim();
            return text.length > 0 && h.offsetParent !== null && h.offsetWidth > 0 && h.offsetHeight > 0;
          });
          
          console.log('[Voice Nav] Found', headings.length, 'visible headings out of', allHeadings.length, 'total');
          
          if (headings.length > 0) {
            // Highlight all visible headings
            this.highlightElements(headings, 6000);
            
            // Get first 5 headings with their text and level
            const first5 = headings.slice(0, 5).map((h, index) => {
              const text = h.textContent.trim().substring(0, 60);
              const level = h.tagName.toLowerCase();
              return `${index + 1}. ${text}`;
            });
            
            const headingsList = first5.join('. ');
            
            const message = this.language === 'hi-IN' 
              ? `${headings.length} शीर्षक पाए और हाइलाइट किए गए। पहले पांच: ${headingsList}`
              : `Found and highlighted ${headings.length} headings. Top five: ${headingsList}`;
            
            this.speak(message);
          } else {
            this.speak(this.language === 'hi-IN' ? 'कोई दिखाई देने वाला शीर्षक नहीं मिला' : 'No visible headings found');
          }
        },
        show_heading: () => actions.list_headings(),
        show_headings: () => actions.list_headings(),
        list_landmark: () => {
          // Get all landmark elements
          const allLandmarks = Array.from(document.querySelectorAll('nav, main, header, footer, aside, section[aria-label], [role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]'));
          const landmarks = allLandmarks.filter(el => {
            return el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0;
          });
          
          console.log('[Voice Nav] Found', landmarks.length, 'visible landmarks out of', allLandmarks.length, 'total');
          
          if (landmarks.length > 0) {
            // Highlight all visible landmarks
            this.highlightElements(landmarks, 6000);
            
            // Get landmark types with better descriptions
            const landmarkTypes = landmarks.map(el => {
              const tag = el.tagName.toLowerCase();
              const role = el.getAttribute('role');
              const label = el.getAttribute('aria-label');
              
              let description = tag;
              if (role) description = role;
              if (label) description += ` (${label})`;
              
              return description;
            }).slice(0, 5).join(', ');
            
            const message = this.language === 'hi-IN' 
              ? `${landmarks.length} लैंडमार्क क्षेत्र पाए और हाइलाइट किए गए। मुख्य: ${landmarkTypes}`
              : `Found and highlighted ${landmarks.length} landmark regions. Main areas: ${landmarkTypes}`;
            
            this.speak(message);
          } else {
            this.speak(this.language === 'hi-IN' ? 'कोई दिखाई देने वाला लैंडमार्क नहीं मिला' : 'No visible landmarks found');
          }
        },
        show_landmark: () => actions.list_landmark(),
        show_landmarks: () => actions.list_landmark(),
        list_landmarks: () => actions.list_landmark(),
        list_link: () => {
          // Get all visible links with text
          const allLinks = Array.from(document.querySelectorAll('a[href]'));
          const links = allLinks.filter(link => {
            const text = link.textContent.trim();
            const hasText = text.length > 0 || link.getAttribute('aria-label');
            const isVisible = link.offsetParent !== null && link.offsetWidth > 0 && link.offsetHeight > 0;
            return hasText && isVisible;
          });
          
          console.log('[Voice Nav] Found', links.length, 'visible links out of', allLinks.length, 'total');
          
          if (links.length > 0) {
            // Highlight all visible links
            this.highlightElements(links, 6000);
            
            // Get first 5 links with their text
            const first5 = links.slice(0, 5).map((link, index) => {
              const text = (link.textContent.trim().substring(0, 60) || link.getAttribute('aria-label') || 'Link').replace(/\s+/g, ' ');
              return `${index + 1}. ${text}`;
            });
            
            const linksList = first5.join('. ');
            
            const message = this.language === 'hi-IN' 
              ? `${links.length} लिंक पाए और हाइलाइट किए गए। पहले पांच: ${linksList}`
              : `Found and highlighted ${links.length} links. Top five: ${linksList}`;
            
            this.speak(message);
          } else {
            this.speak(this.language === 'hi-IN' ? 'कोई दिखाई देने वाला लिंक नहीं मिला' : 'No visible links found');
          }
        },
        show_links: () => actions.list_link(),
        list_links: () => actions.list_link(),

        // ===== BASIC NAVIGATION =====
        scroll_down: () => {
          window.scrollBy({ top: 400, behavior: 'smooth' });
        },
        go_down: () => {
          window.scrollBy({ top: 400, behavior: 'smooth' });
        },
        page_down: () => {
          window.scrollBy({ top: 400, behavior: 'smooth' });
        },
        scroll_up: () => {
          window.scrollBy({ top: -400, behavior: 'smooth' });
        },
        go_up: () => {
          window.scrollBy({ top: -400, behavior: 'smooth' });
        },
        page_up: () => {
          window.scrollBy({ top: -400, behavior: 'smooth' });
        },
        scroll_small_up: () => {
          window.scrollBy({ top: -200, behavior: 'smooth' });
        },
        scroll_small_down: () => {
          window.scrollBy({ top: 200, behavior: 'smooth' });
        },
        scroll_large_up: () => {
          window.scrollBy({ top: -800, behavior: 'smooth' });
        },
        scroll_large_down: () => {
          window.scrollBy({ top: 800, behavior: 'smooth' });
        },
        go_to_top: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        scroll_to_top: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        top: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        go_to_bottom: () => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        },
        scroll_to_bottom: () => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        },
        bottom: () => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        },
        middle: () => {
          window.scrollTo({ top: document.documentElement.scrollHeight / 2, behavior: 'smooth' });
        },

        tab: () => {
          const event = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, bubbles: true });
          document.activeElement?.dispatchEvent(event) || document.dispatchEvent(event);
          this.speak(this.language === 'hi-IN' ? 'अगला' : 'Next');
        },
        next: () => {
          const event = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, bubbles: true });
          document.activeElement?.dispatchEvent(event) || document.dispatchEvent(event);
          this.speak(this.language === 'hi-IN' ? 'अगला' : 'Next');
        },
        tab_back: () => {
          const event = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, shiftKey: true, bubbles: true });
          document.activeElement?.dispatchEvent(event) || document.dispatchEvent(event);
          this.speak(this.language === 'hi-IN' ? 'पिछला' : 'Previous');
        },
        previous: () => {
          const event = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', keyCode: 9, shiftKey: true, bubbles: true });
          document.activeElement?.dispatchEvent(event) || document.dispatchEvent(event);
          this.speak(this.language === 'hi-IN' ? 'पिछला' : 'Previous');
        },
        enter: () => {
          const element = document.activeElement;
          if (element) {
            element.click();
            this.speak(this.language === 'hi-IN' ? 'क्लिक किया' : 'Clicked');
          }
        },
        click: () => actions.enter(),
        reload_page: () => window.location.reload(),
        refresh_page: () => window.location.reload(),
        go_home: () => window.location.href = 'https://dev.myscheme.gov.in/',
        previous_page: () => window.history.back(),

        // ===== BASIC GESTURES =====
        zoom_in: () => {
          const newZoom = (parseFloat(document.body.style.zoom || 1) + 0.1);
          document.body.style.zoom = newZoom.toString();
          this.speak(this.language === 'hi-IN' ? 'ज़ूम इन' : 'Zoomed in');
        },
        increase_size: () => {
          const newZoom = (parseFloat(document.body.style.zoom || 1) + 0.1);
          document.body.style.zoom = newZoom.toString();
          this.speak(this.language === 'hi-IN' ? 'ज़ूम इन' : 'Zoomed in');
        },
        zoom_out: () => {
          const currentZoom = parseFloat(document.body.style.zoom || 1);
          if (currentZoom > 0.5) {
            const newZoom = currentZoom - 0.1;
            document.body.style.zoom = newZoom.toString();
            this.speak(this.language === 'hi-IN' ? 'ज़ूम आउट' : 'Zoomed out');
          } else {
          }
        },
        decrease_size: () => {
          const currentZoom = parseFloat(document.body.style.zoom || 1);
          if (currentZoom > 0.5) {
            document.body.style.zoom = (currentZoom - 0.1).toString();
            this.speak(this.language === 'hi-IN' ? 'ज़ूम आउट' : 'Zoomed out');
          }
        },

        // ===== TEXT NAVIGATION (Arrow Keys for Text Cursor) =====
        move_left: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart > 0) {
              element.selectionStart = element.selectionEnd = element.selectionStart - 1;
            }
          }
        },
        left: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart > 0) {
              element.selectionStart = element.selectionEnd = element.selectionStart - 1;
            }
          }
        },
        move_cursor_left: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart > 0) {
              element.selectionStart = element.selectionEnd = element.selectionStart - 1;
            }
          }
        },
        move_right: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart < element.value.length) {
              element.selectionStart = element.selectionEnd = element.selectionStart + 1;
            }
          }
        },
        right: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart < element.value.length) {
              element.selectionStart = element.selectionEnd = element.selectionStart + 1;
            }
          }
        },
        move_cursor_right: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            if (element.selectionStart < element.value.length) {
              element.selectionStart = element.selectionEnd = element.selectionStart + 1;
            }
          }
        },
        move_up: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            // For textarea, move up one line
            const pos = element.selectionStart;
            const text = element.value;
            const lineStart = text.lastIndexOf('\n', pos - 1);
            if (lineStart >= 0) {
              const colInLine = pos - lineStart - 1;
              const prevLineStart = text.lastIndexOf('\n', lineStart - 1);
              const prevLineEnd = lineStart;
              const newPos = Math.min(prevLineStart + 1 + colInLine, prevLineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              // Already on first line, go to start
              element.selectionStart = element.selectionEnd = 0;
            }
          }
        },
        up: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            const pos = element.selectionStart;
            const text = element.value;
            const lineStart = text.lastIndexOf('\n', pos - 1);
            if (lineStart >= 0) {
              const colInLine = pos - lineStart - 1;
              const prevLineStart = text.lastIndexOf('\n', lineStart - 1);
              const prevLineEnd = lineStart;
              const newPos = Math.min(prevLineStart + 1 + colInLine, prevLineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              element.selectionStart = element.selectionEnd = 0;
            }
          }
        },
        move_cursor_up: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            const pos = element.selectionStart;
            const text = element.value;
            const lineStart = text.lastIndexOf('\n', pos - 1);
            if (lineStart >= 0) {
              const colInLine = pos - lineStart - 1;
              const prevLineStart = text.lastIndexOf('\n', lineStart - 1);
              const prevLineEnd = lineStart;
              const newPos = Math.min(prevLineStart + 1 + colInLine, prevLineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              element.selectionStart = element.selectionEnd = 0;
            }
          }
        },
        move_down: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            // For textarea, move down one line
            const pos = element.selectionStart;
            const text = element.value;
            const currentLineStart = text.lastIndexOf('\n', pos - 1) + 1;
            const nextLineStart = text.indexOf('\n', pos);
            if (nextLineStart >= 0) {
              const colInLine = pos - currentLineStart;
              const nextLineEnd = text.indexOf('\n', nextLineStart + 1);
              const lineEnd = nextLineEnd >= 0 ? nextLineEnd : text.length;
              const newPos = Math.min(nextLineStart + 1 + colInLine, lineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              // Already on last line, go to end
              element.selectionStart = element.selectionEnd = text.length;
            }
          }
        },
        down: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            const pos = element.selectionStart;
            const text = element.value;
            const currentLineStart = text.lastIndexOf('\n', pos - 1) + 1;
            const nextLineStart = text.indexOf('\n', pos);
            if (nextLineStart >= 0) {
              const colInLine = pos - currentLineStart;
              const nextLineEnd = text.indexOf('\n', nextLineStart + 1);
              const lineEnd = nextLineEnd >= 0 ? nextLineEnd : text.length;
              const newPos = Math.min(nextLineStart + 1 + colInLine, lineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              element.selectionStart = element.selectionEnd = text.length;
            }
          }
        },
        move_cursor_down: () => {
          const element = document.activeElement;
          if (element && element.tagName === 'TEXTAREA') {
            const pos = element.selectionStart;
            const text = element.value;
            const currentLineStart = text.lastIndexOf('\n', pos - 1) + 1;
            const nextLineStart = text.indexOf('\n', pos);
            if (nextLineStart >= 0) {
              const colInLine = pos - currentLineStart;
              const nextLineEnd = text.indexOf('\n', nextLineStart + 1);
              const lineEnd = nextLineEnd >= 0 ? nextLineEnd : text.length;
              const newPos = Math.min(nextLineStart + 1 + colInLine, lineEnd);
              element.selectionStart = element.selectionEnd = newPos;
            } else {
              element.selectionStart = element.selectionEnd = text.length;
            }
          }
        },
        move_to_beginning: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.selectionStart = element.selectionEnd = 0;
          }
        },
        move_to_end: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.selectionStart = element.selectionEnd = element.value.length;
          }
        },

        // ===== TEXT SELECTION =====
        select_all: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.select();
            this.speak(this.language === 'hi-IN' ? 'सब चुना गया' : 'All selected');
          } else {
            document.execCommand('selectAll');
            this.speak(this.language === 'hi-IN' ? 'सब चुना गया' : 'All selected');
          }
        },
        extend_selection_to_beginning: () => {
          const event = new KeyboardEvent('keydown', { key: 'Home', code: 'Home', keyCode: 36, shiftKey: true, bubbles: true });
          document.activeElement?.dispatchEvent(event);
        },
        deselect_that: () => {
          window.getSelection()?.removeAllRanges();
          this.speak(this.language === 'hi-IN' ? 'चयन हटाया' : 'Deselected');
        },

        // ===== TEXT EDITING =====
        type: (params) => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const text = params.text || params.query || '';
            element.value += text;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        // Smart form filling - finds first empty required input
        fill_form: (params) => {
          const inputs = Array.from(document.querySelectorAll('input[required]:not([type="hidden"]), input:not([type="hidden"]):not([value]), textarea:not([value])'));
          const firstEmpty = inputs.find(input => !input.value || input.value.trim() === '');
          if (firstEmpty) {
            firstEmpty.focus();
            firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        },
        // Click next/submit/continue button
        click_next: () => {
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a.button, [role="button"]'));
          const nextButton = buttons.find(btn => {
            const text = btn.textContent || btn.value || btn.getAttribute('aria-label') || '';
            return /next|continue|proceed|submit|apply|start/i.test(text);
          });
          if (nextButton) {
            nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => nextButton.click(), 300);
          }
        },
        // Click button by text
        click_button: (params) => {
          const buttonText = params.text || params.query || '';
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a.button, [role="button"]'));
          const button = buttons.find(btn => {
            const text = (btn.textContent || btn.value || btn.getAttribute('aria-label') || '').toLowerCase();
            return text.includes(buttonText.toLowerCase());
          });
          if (button) {
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => button.click(), 300);
          }
        },
        clear_input: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.value = '';
            element.dispatchEvent(new Event('input', { bubbles: true }));
            this.speak(this.language === 'hi-IN' ? 'साफ़ किया' : 'Cleared');
          }
        },
        erase: () => actions.clear_input(),
        remove: () => actions.clear_input(),
        delete: () => actions.clear_input(),
        cut_that: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const selectedText = element.value.substring(start, end);
              // Copy to clipboard
              navigator.clipboard.writeText(selectedText).then(() => {
                // Remove selected text
                const before = element.value.substring(0, start);
                const after = element.value.substring(end);
                element.value = before + after;
                element.selectionStart = element.selectionEnd = start;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                this.speak(this.language === 'hi-IN' ? 'काटा' : 'Cut');
              }).catch(() => {
                // Fallback
                document.execCommand('cut');
                this.speak(this.language === 'hi-IN' ? 'काटा' : 'Cut');
              });
            }
          } else {
            document.execCommand('cut');
            this.speak(this.language === 'hi-IN' ? 'काटा' : 'Cut');
          }
        },
        copy_that: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const selectedText = element.value.substring(start, end);
              navigator.clipboard.writeText(selectedText).then(() => {
                this.speak(this.language === 'hi-IN' ? 'कॉपी किया' : 'Copied');
              }).catch(() => {
                // Fallback
                document.execCommand('copy');
                this.speak(this.language === 'hi-IN' ? 'कॉपी किया' : 'Copied');
              });
            }
          } else {
            document.execCommand('copy');
            this.speak(this.language === 'hi-IN' ? 'कॉपी किया' : 'Copied');
          }
        },
        paste_that: async () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            try {
              // Try modern clipboard API
              const text = await navigator.clipboard.readText();
              const start = element.selectionStart;
              const end = element.selectionEnd;
              const before = element.value.substring(0, start);
              const after = element.value.substring(end);
              element.value = before + text + after;
              element.selectionStart = element.selectionEnd = start + text.length;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              this.speak(this.language === 'hi-IN' ? 'पेस्ट किया' : 'Pasted');
            } catch (error) {
              // Fallback: try execCommand
              document.execCommand('paste');
              this.speak(this.language === 'hi-IN' ? 'पेस्ट किया' : 'Pasted');
            }
          }
        },
        lowercase_that: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const selectedText = element.value.substring(start, end);
              const before = element.value.substring(0, start);
              const after = element.value.substring(end);
              element.value = before + selectedText.toLowerCase() + after;
              element.selectionStart = start;
              element.selectionEnd = start + selectedText.length;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              this.speak(this.language === 'hi-IN' ? 'छोटे अक्षर में' : 'Lowercase');
            }
          }
        },
        uppercase_that: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const selectedText = element.value.substring(start, end);
              const before = element.value.substring(0, start);
              const after = element.value.substring(end);
              element.value = before + selectedText.toUpperCase() + after;
              element.selectionStart = start;
              element.selectionEnd = start + selectedText.length;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              this.speak(this.language === 'hi-IN' ? 'बड़े अक्षर में' : 'Uppercase');
            }
          }
        },
        capitalize_that: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const selectedText = element.value.substring(start, end);
              const before = element.value.substring(0, start);
              const after = element.value.substring(end);
              // Capitalize first letter of each word
              const capitalized = selectedText.replace(/\b\w/g, char => char.toUpperCase());
              element.value = before + capitalized + after;
              element.selectionStart = start;
              element.selectionEnd = start + capitalized.length;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              this.speak(this.language === 'hi-IN' ? 'पहला अक्षर बड़ा' : 'Capitalized');
            }
          }
        },
        replace_with: (params) => {
          if (params.from && params.to) {
            const element = document.activeElement;
            if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
              element.value = element.value.replace(new RegExp(params.from, 'gi'), params.to);
              element.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        },
        delete_selected: () => {
          const element = document.activeElement;
          if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            const start = element.selectionStart;
            const end = element.selectionEnd;
            if (start !== end) {
              const before = element.value.substring(0, start);
              const after = element.value.substring(end);
              element.value = before + after;
              element.selectionStart = element.selectionEnd = start;
              element.dispatchEvent(new Event('input', { bubbles: true }));
              this.speak(this.language === 'hi-IN' ? 'मिटाया' : 'Deleted');
            }
          } else {
            document.execCommand('delete');
            this.speak(this.language === 'hi-IN' ? 'मिटाया' : 'Deleted');
          }
        },

        // ===== SKIP LINKS =====
        skip_to_content: () => {
          const main = document.querySelector('main, [role="main"], #main, #content');
          if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
            main.focus();
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री पर' : 'Jumped to content');
          } else {
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री नहीं मिली' : 'Main content not found');
          }
        },
        navigate_to_content: () => {
          const main = document.querySelector('main, [role="main"], #main, #content');
          if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
            main.focus();
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री पर' : 'Jumped to content');
          } else {
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री नहीं मिली' : 'Main content not found');
          }
        },
        go_to_content: () => {
          const main = document.querySelector('main, [role="main"], #main, #content');
          if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
            main.focus();
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री पर' : 'Jumped to content');
          } else {
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री नहीं मिली' : 'Main content not found');
          }
        },
        main_content: () => {
          const main = document.querySelector('main, [role="main"], #main, #content');
          if (main) {
            main.scrollIntoView({ behavior: 'smooth', block: 'start' });
            main.focus();
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री पर' : 'Jumped to content');
          } else {
            this.speak(this.language === 'hi-IN' ? 'मुख्य सामग्री नहीं मिली' : 'Main content not found');
          }
        },
        skip_to_navigation: () => {
          const nav = document.querySelector('nav, [role="navigation"]');
          if (nav) {
            nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
            nav.focus();
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन पर' : 'Jumped to navigation');
          } else {
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन नहीं मिला' : 'Navigation not found');
          }
        },
        go_to_navigation: () => {
          const nav = document.querySelector('nav, [role="navigation"]');
          if (nav) {
            nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
            nav.focus();
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन पर' : 'Jumped to navigation');
          } else {
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन नहीं मिला' : 'Navigation not found');
          }
        },
        main_navigation: () => {
          const nav = document.querySelector('nav, [role="navigation"]');
          if (nav) {
            nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
            nav.focus();
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन पर' : 'Jumped to navigation');
          } else {
            this.speak(this.language === 'hi-IN' ? 'नेविगेशन नहीं मिला' : 'Navigation not found');
          }
        },
        skip_to_footer: () => {
          const footer = document.querySelector('footer, [role="contentinfo"]');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            footer.focus();
            this.speak(this.language === 'hi-IN' ? 'फूटर पर' : 'Jumped to footer');
          } else {
            this.speak(this.language === 'hi-IN' ? 'फूटर नहीं मिला' : 'Footer not found');
          }
        },
        footer: () => {
          const footer = document.querySelector('footer, [role="contentinfo"]');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            footer.focus();
            this.speak(this.language === 'hi-IN' ? 'फूटर पर' : 'Jumped to footer');
          } else {
            this.speak(this.language === 'hi-IN' ? 'फूटर नहीं मिला' : 'Footer not found');
          }
        },
        go_to_footer: () => {
          const footer = document.querySelector('footer, [role="contentinfo"]');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            footer.focus();
            this.speak(this.language === 'hi-IN' ? 'फूटर पर' : 'Jumped to footer');
          } else {
            this.speak(this.language === 'hi-IN' ? 'फूटर नहीं मिला' : 'Footer not found');
          }
        },
        navigate_to_footer: () => {
          const footer = document.querySelector('footer, [role="contentinfo"]');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            footer.focus();
            this.speak(this.language === 'hi-IN' ? 'फूटर पर' : 'Jumped to footer');
          } else {
            this.speak(this.language === 'hi-IN' ? 'फूटर नहीं मिला' : 'Footer not found');
          }
        },

        // ===== SYSTEM =====
        back: () => window.history.back(),
        forward: () => window.history.forward(),
        refresh: () => window.location.reload(),
        open_in_new_tab: () => window.open(window.location.href, '_blank'),
        print: () => window.print(),
        copy_url: () => {
          // Try modern clipboard API with fallback
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(window.location.href)
              .then(() => {
                this.speak(this.language === 'hi-IN' ? 'URL कॉपी हो गया' : 'URL copied');
              })
              .catch(err => {
                // Fallback: create temp input
                const temp = document.createElement('input');
                temp.value = window.location.href;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                this.speak(this.language === 'hi-IN' ? 'URL कॉपी हो गया' : 'URL copied');
              });
          } else {
            // Old browser fallback
            const temp = document.createElement('input');
            temp.value = window.location.href;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            this.speak(this.language === 'hi-IN' ? 'URL कॉपी हो गया' : 'URL copied');
          }
        },
        full_screen: () => {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          }
        },
        exit_full_screen: () => {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        },
        hide_commands: () => { 
          this.showCommands = false; 
          this.update(); 
          this.speak(this.language === 'hi-IN' ? 'कमांड छुपाए' : 'Commands hidden');
        },
        show_commands: () => { 
          this.showCommands = true; 
          this.update(); 
          this.speak(this.language === 'hi-IN' ? 'कमांड दिखाए' : 'Commands shown');
        },

        // Information commands - note: most info is now handled by AI with context
        tell_about_myscheme: () => {
          this.lastContext = 'about_myscheme';
          // AI response already provides the info, no need to speak here
          this.update();
        },
        check_website: () => {
          this.lastContext = 'website_info';
          // AI response already provides the info, no need to speak here
          this.update();
        },
        about_myscheme: () => {
          this.lastContext = 'about_myscheme';
          // AI response already provides the info, no need to speak here
          this.update();
        },

        // Content reading
        read: () => {
          const text = document.body.textContent.slice(0, 500);
          if (this.voiceEnabled && this.synthesizer) {
            this.speak(text);
          }
        },
        stop_reading: () => {
          this.stopSpeaking();
        },
        read_faster: () => {
          // Increase speech rate (note: would need to be implemented in TTS config)
          this.speak(this.language === 'hi-IN' ? 'तेज़ गति में बोल रहे हैं' : 'Speaking faster now');
        },
        read_slower: () => {
          // Decrease speech rate (note: would need to be implemented in TTS config)
          this.speak(this.language === 'hi-IN' ? 'धीमी गति में बोल रहे हैं' : 'Speaking slower now');
        },
        find_on_page: (params) => {
          // Trigger browser's find function
          if (params && params.query) {
            window.find(params.query);
          }
        },
        current_page: () => {
          const title = document.title;
          const info = this.language === 'hi-IN'
            ? `आप ${title} पेज पर हैं`
            : `You are on the ${title} page`;
          this.speak(info);
        },
        help: () => {
          // AI response already provides the info, no need to speak here
        },

        // myScheme.gov.in Navigation
        home: () => {
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '') {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से होम पेज पर हैं' : 'You are already on the home page');
          } else {
            window.location.href = 'https://dev.myscheme.gov.in/';
          }
        },
        find_schemes_for_me: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/find-scheme')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस पेज पर हैं' : 'You are already on this page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'page_info');
            window.location.href = 'https://dev.myscheme.gov.in/find-scheme';
          }
        },
        show_categories: () => {
          const currentPath = window.location.pathname;
          // Check if already on any categories page
          if (currentPath.includes('/search/category/')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से श्रेणियों के पेज पर हैं' : 'You are already on the categories page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'categories');
            window.location.href = 'https://dev.myscheme.gov.in/search/category/Agriculture,Rural%20&%20Environment';
          }
        },
        show_states: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/search/state/')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से राज्यों के पेज पर हैं' : 'You are already on the states page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'page_info');
            window.location.href = 'https://dev.myscheme.gov.in/search/state/all-states';
          }
        },
        show_ministries: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/search/ministry/')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से मंत्रालयों के पेज पर हैं' : 'You are already on the ministries page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'page_info');
            window.location.href = 'https://dev.myscheme.gov.in/search/ministry/all-ministries';
          }
        },
        show_faq: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/faq')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से FAQ पेज पर हैं' : 'You are already on the FAQ page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'page_info');
            window.location.href = 'https://dev.myscheme.gov.in/faq';
          }
        },

        // Popular Schemes - Navigate and explain
        kisan_samriddhi_yojana: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksyj')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksyj';
          }
        },
        ksyj: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksyj')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksyj';
          }
        },
        gopal_incentive_scheme: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/gis')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/gis';
          }
        },
        gis: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/gis')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/gis';
          }
        },
        training_ai_selfemployment: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/toaifse')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/toaifse';
          }
        },
        toaifse: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/toaifse')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/toaifse';
          }
        },
        kharmore_sonchidia_award: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksas')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksas';
          }
        },
        ksas: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksas')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksas';
          }
        },
        educational_study_scheme: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/essg')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/essg';
          }
        },
        essg: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/essg')) {
            this.speak(this.language === 'hi-IN' ? 'आप पहले से इस योजना के पेज पर हैं' : 'You are already on this scheme page');
          } else {
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/essg';
          }
        },

        // Scheme Info Commands - Navigate to page AND provide explanation
        // No initial speech - just navigate and let auto-explanation handle it
        tell_about_kisan_samriddhi: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksyj')) {
            // Already on page, just explain
            this.explainCurrentPage('scheme');
          } else {
            this.lastContext = 'ksyj';
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksyj';
          }
        },
        tell_about_gopal_incentive: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/gis')) {
            // Already on page, just explain
            this.explainCurrentPage('scheme');
          } else {
            this.lastContext = 'gis';
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/gis';
          }
        },
        tell_about_ai_training: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/toaifse')) {
            // Already on page, just explain
            this.explainCurrentPage('scheme');
          } else {
            this.lastContext = 'toaifse';
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/toaifse';
          }
        },
        tell_about_kharmore_award: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/ksas')) {
            // Already on page, just explain
            this.explainCurrentPage('scheme');
          } else {
            this.lastContext = 'ksas';
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/ksas';
          }
        },
        tell_about_educational_study: () => {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/schemes/essg')) {
            // Already on page, just explain
            this.explainCurrentPage('scheme');
          } else {
            this.lastContext = 'essg';
            localStorage.setItem('voiceNavPendingExplanation', 'scheme');
            window.location.href = 'https://dev.myscheme.gov.in/schemes/essg';
          }
        },
        
        // Open scheme page commands - Direct navigation with explanation
        open_kisan_samriddhi: () => {
          localStorage.setItem('voiceNavPendingExplanation', 'scheme');
          window.location.href = 'https://dev.myscheme.gov.in/schemes/ksyj';
        },
        open_gopal_incentive: () => {
          localStorage.setItem('voiceNavPendingExplanation', 'scheme');
          window.location.href = 'https://dev.myscheme.gov.in/schemes/gis';
        },
        open_ai_training: () => {
          localStorage.setItem('voiceNavPendingExplanation', 'scheme');
          window.location.href = 'https://dev.myscheme.gov.in/schemes/toaifse';
        },
        open_kharmore_award: () => {
          localStorage.setItem('voiceNavPendingExplanation', 'scheme');
          window.location.href = 'https://dev.myscheme.gov.in/schemes/ksas';
        },
        open_educational_study: () => {
          localStorage.setItem('voiceNavPendingExplanation', 'scheme');
          window.location.href = 'https://dev.myscheme.gov.in/schemes/essg';
        },
      };

      
      if (actions[action]) {
        try {
          const result = actions[action](parameters);
          // Handle async actions
          if (result instanceof Promise) {
            result.catch(() => {
              // Async action failed silently
            });
          }
        } catch (error) {
          // Action execution failed
        }
      } else {
        this.speak(this.language === 'hi-IN' 
          ? 'यह कमांड उपलब्ध नहीं है' 
          : 'Command not available');
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VoiceNavigation());
  } else {
    new VoiceNavigation();
  }

  window.MySchemeVoiceNav = VoiceNavigation;
})(window);
