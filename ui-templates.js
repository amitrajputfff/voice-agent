// Beautiful UI Templates for Voice Navigation CDN
// Extracted from voice-navigation-advanced.tsx

const BEAUTIFUL_UI = {
  // SVG Icons (Lucide React icons as SVG)
  icons: {
    accessibility: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M9 18V8a3 3 0 0 1 6 0v10"/><line x1="9" y1="13" x2="15" y2="13"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    languages: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
    volume2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    volumeX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  },

  // CSS Styles
  css: `
    /* Reset and base styles */
    #liaplus-voice-widget * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    #liaplus-voice-widget {
      position: fixed;
      bottom: 16px;
      left: 16px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }

    @media (min-width: 640px) {
      #liaplus-voice-widget {
        bottom: auto;
        left: auto;
        top: 24px;
        right: 24px;
      }
    }

    /* Main button container */
    .voice-btn-container {
      position: relative;
    }

    /* Main voice button */
    .voice-main-btn {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .voice-main-btn:hover {
      background: #f9fafb;
    }

    .voice-main-btn.listening {
      background: #f3e8ff;
      border-color: #c084fc;
      color: #9333ea;
    }

    .voice-main-btn.listening:hover {
      background: #e9d5ff;
    }

    @media (min-width: 640px) {
      .voice-main-btn {
        width: 40px;
        height: 40px;
        box-shadow: none;
      }
    }

    .voice-main-btn svg {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 640px) {
      .voice-main-btn svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Pulse indicator */
    .pulse-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
    }

    @media (min-width: 640px) {
      .pulse-indicator {
        width: 8px;
        height: 8px;
      }
    }

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #a855f7;
      animation: pulse-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      opacity: 0.75;
    }

    .pulse-dot {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #9333ea;
    }

    @keyframes pulse-ring {
      0%, 100% {
        transform: scale(1);
        opacity: 0.75;
      }
      50% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    /* Processing spinner */
    .processing-spinner {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      animation: spin 1s linear infinite;
    }

    @media (min-width: 640px) {
      .processing-spinner {
        width: 12px;
        height: 12px;
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Secondary buttons (Settings & List) */
    .voice-secondary-btn {
      position: absolute;
      bottom: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .voice-secondary-btn:hover {
      background: #f9fafb;
    }

    .voice-secondary-btn svg {
      width: 20px;
      height: 20px;
    }

    .voice-secondary-btn.settings {
      right: -112px;
    }

    .voice-secondary-btn.list {
      right: -56px;
    }

    @media (min-width: 640px) {
      .voice-secondary-btn {
        width: 32px;
        height: 32px;
        box-shadow: none;
        top: 0;
        bottom: auto;
      }

      .voice-secondary-btn svg {
        width: 16px;
        height: 16px;
      }

      .voice-secondary-btn.settings {
        left: -96px;
        right: auto;
      }

      .voice-secondary-btn.list {
        left: -48px;
        right: auto;
      }
    }

    /* Transcript bubble */
    .transcript-bubble {
      position: absolute;
      bottom: 100%;
      margin-bottom: 8px;
      right: 0;
      left: 0;
      background: linear-gradient(to right, #fce7f3, #fbcfe8);
      border: 1px solid #f9a8d4;
      border-radius: 8px;
      padding: 12px 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      max-width: calc(100vw - 32px);
      z-index: 50;
      animation: slideUp 0.3s ease-out;
    }

    @media (min-width: 640px) {
      .transcript-bubble {
        top: 100%;
        bottom: auto;
        margin-top: 8px;
        margin-bottom: 0;
        left: auto;
        min-width: 280px;
        max-width: 400px;
        animation: slideDown 0.3s ease-out;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .transcript-content {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .listening-dots {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-bottom: 4px;
    }

    .listening-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #9333ea;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .listening-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .listening-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    .transcript-text {
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
      word-wrap: break-word;
    }

    @media (min-width: 640px) {
      .transcript-text {
        font-size: 14px;
      }
    }

    /* Settings panel */
    .settings-panel {
      position: absolute;
      bottom: 100%;
      margin-bottom: 8px;
      right: 0;
      left: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      min-width: 250px;
      max-width: calc(100vw - 32px);
      z-index: 50;
      animation: slideUp 0.3s ease-out;
    }

    @media (min-width: 640px) {
      .settings-panel {
        top: 100%;
        bottom: auto;
        margin-top: 8px;
        margin-bottom: 0;
        left: auto;
        min-width: 280px;
        max-width: 320px;
        animation: slideDown 0.3s ease-out;
      }
    }

    .settings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .settings-title {
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    @media (min-width: 640px) {
      .settings-title {
        font-size: 14px;
      }
    }

    .close-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
    }

    .close-btn svg {
      width: 16px;
      height: 16px;
      color: #6b7280;
    }

    .settings-content {
      padding: 12px 16px;
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
    }

    .setting-label {
      font-size: 12px;
      color: #6b7280;
    }

    @media (min-width: 640px) {
      .setting-label {
        font-size: 14px;
      }
    }

    .setting-btn {
      padding: 4px 12px;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .setting-btn:hover {
      background: #f9fafb;
    }

    .setting-btn svg {
      width: 12px;
      height: 12px;
    }

    /* Language selector dropdown */
    .lang-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      margin-top: 8px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      min-width: 120px;
      z-index: 60;
      overflow: hidden;
    }

    .lang-option {
      padding: 8px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
      width: 100%;
      text-align: left;
      background: white;
    }

    .lang-option:hover {
      background: #f9fafb;
    }

    .lang-option svg {
      width: 12px;
      height: 12px;
      margin-left: auto;
    }

    /* Hidden class */
    .hidden {
      display: none !important;
    }
  `,

  // HTML Template for main UI
  html: `
    <div id="liaplus-voice-widget">
      <style>${this.css}</style>
      <div class="voice-btn-container">
        <!-- Main voice button -->
        <button class="voice-main-btn" id="voice-main-btn" title="Voice Navigation">
          ${this.icons.accessibility}
          <span class="pulse-indicator hidden" id="pulse-indicator">
            <span class="pulse-ring"></span>
            <span class="pulse-dot"></span>
          </span>
          <span class="processing-spinner hidden" id="processing-spinner">
            ${this.icons.sparkles}
          </span>
        </button>

        <!-- Secondary buttons (shown when listening) -->
        <button class="voice-secondary-btn list hidden" id="list-btn" title="Show examples">
          ${this.icons.list}
        </button>
        <button class="voice-secondary-btn settings hidden" id="settings-btn" title="Settings">
          ${this.icons.settings}
        </button>

        <!-- Transcript bubble -->
        <div class="transcript-bubble hidden" id="transcript-bubble">
          <div class="transcript-content">
            <div style="flex: 1;">
              <div class="listening-dots">
                <span class="listening-dot"></span>
                <span class="listening-dot"></span>
                <span class="listening-dot"></span>
                <span style="font-size: 10px; font-weight: 500; color: #9333ea; margin-left: 4px;" id="listening-text">Listening...</span>
              </div>
              <p class="transcript-text" id="transcript-text"></p>
            </div>
            <span class="processing-spinner hidden" id="transcript-spinner">
              ${this.icons.sparkles}
            </span>
          </div>
        </div>

        <!-- Settings panel -->
        <div class="settings-panel hidden" id="settings-panel">
          <div class="settings-header">
            <h3 class="settings-title" id="settings-title">Voice Settings</h3>
            <button class="close-btn" id="close-settings">
              ${this.icons.x}
            </button>
          </div>
          <div class="settings-content">
            <!-- Language selector -->
            <div class="setting-row">
              <span class="setting-label" id="lang-label">Language</span>
              <div style="position: relative;">
                <button class="setting-btn" id="lang-btn">
                  ${this.icons.languages}
                  <span id="lang-text">English</span>
                </button>
                <div class="lang-dropdown hidden" id="lang-dropdown">
                  <button class="lang-option" data-lang="en-US">
                    🇺🇸 English
                    <span class="hidden" id="check-en">${this.icons.check}</span>
                  </button>
                  <button class="lang-option" data-lang="hi-IN">
                    🇮🇳 हिंदी
                    <span class="hidden" id="check-hi">${this.icons.check}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Voice feedback toggle -->
            <div class="setting-row">
              <span class="setting-label" id="voice-feedback-label">Voice Feedback</span>
              <button class="setting-btn" id="voice-feedback-btn">
                ${this.icons.volume2}
              </button>
            </div>

            <!-- AI Mode indicator -->
            <div class="setting-row">
              <div>
                <span class="setting-label">AI Mode</span>
                <p style="font-size: 10px; color: #9ca3af;" id="ai-subtitle">Understands everything</p>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 12px; height: 12px; color: #9333ea;">${this.icons.sparkles}</span>
                <span style="font-size: 12px; font-weight: 600; color: #9333ea;">ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

// Export for use in CDN
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BEAUTIFUL_UI;
}
