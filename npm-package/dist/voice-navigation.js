/**
 * LiaPlus Dynamic Voice Navigation CDN
 * Version: 7.0.0 - Universal AI-Powered Voice Navigation
 * 
 * 🚀 Works on ANY website without configuration!
 * 
 * Features:
 * ✨ Automatic DOM Analysis - Detects forms, buttons, links automatically
 * ✨ AI-Powered Form Filling - Fills any form with voice commands
 * ✨ Smart Click Detection - Finds and clicks any button/link
 * ✨ Multi-Language Support - English & Hindi
 * ✨ Azure OpenAI Integration - GPT-4 powered understanding
 * ✨ Cross-Website Compatible - No hardcoded routes or selectors
 * 
 * Usage:
 * ```html
 * <script src="https://cdn.liaplus.com/voice-navigation-dynamic.js"></script>
 * <script>
 *   LiaPlusVoice.init({
 *     apiEndpoint: 'https://your-api.com/api/voice-ai',
 *     azureSpeechKey: 'YOUR_AZURE_KEY',
 *     azureSpeechRegion: 'YOUR_AZURE_REGION',
 *     language: 'en-US' // or 'hi-IN'
 *   });
 * </script>
 * ```
 * 
 * Commands:
 * - "Fill my name as John"
 * - "Enter email as john@example.com"
 * - "Click submit button"
 * - "Scroll down"
 * - "Go to top"
 * - "Read page"
 * 
 * Dependencies:
 * - Microsoft Azure Speech SDK (loaded automatically)
 */

(function(window) {
  'use strict';

  // =====================================================================
  // CONFIGURATION
  // =====================================================================
  
  const VERSION = '7.0.0';
  const AZURE_SPEECH_SDK_URL = 'https://aka.ms/csspeech/jsbrowserpackageraw';
  
  // Default API endpoints (can be overridden during init)
  const DEFAULT_API_BASE = 'https://liaplus.com/api';
  
  let config = {
    apiBase: DEFAULT_API_BASE, // Base URL for all APIs
    language: 'en-US',
    autoStart: true,
    debug: true
  };

  // =====================================================================
  // DOM ANALYZER - Extracts page structure dynamically
  // =====================================================================
  
  class DOMAnalyzer {
    analyze() {
      const startTime = Date.now();
      this.log('Starting page analysis...');
      
      const analysis = {
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
      
      const duration = Date.now() - startTime;
      this.log(`Analysis complete in ${duration}ms:`, {
        forms: analysis.forms.length,
        navigation: analysis.navigation.length,
        interactions: analysis.interactions.length,
        landmarks: analysis.landmarks.length
      });
      
      return analysis;
    }

    extractForms() {
      const forms = Array.from(document.querySelectorAll('form'));
      this.log(`Found ${forms.length} form(s)`);
      
      return forms.map((form, index) => {
        const fields = this.extractFormFields(form);
        return {
          id: form.id || `form-${index}`,
          action: form.action || window.location.href,
          method: form.method || 'GET',
          fields: fields,
          buttons: this.extractFormButtons(form)
        };
      });
    }

    extractFormFields(form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      return Array.from(inputs)
        .filter(input => {
          const type = input.type;
          return type !== 'hidden' && type !== 'submit' && type !== 'button' && type !== 'reset';
        })
        .map((input, index) => ({
          id: input.id || `field-${index}`,
          name: input.name || input.id || `field-${index}`,
          type: input.type || 'text',
          label: this.findLabel(input),
          placeholder: input.placeholder || null,
          required: input.required,
          value: input.value || '',
          index: index
        }));
    }

    findLabel(field) {
      // Strategy 1: Associated label
      if (field.id) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) return label.textContent.trim();
      }
      
      // Strategy 2: Parent label
      const parentLabel = field.closest('label');
      if (parentLabel) {
        const clone = parentLabel.cloneNode(true);
        const fieldClone = clone.querySelector('input, select, textarea');
        if (fieldClone) fieldClone.remove();
        const text = clone.textContent.trim();
        if (text) return text;
      }
      
      // Strategy 3: ARIA label
      return field.getAttribute('aria-label') || null;
    }

    extractFormButtons(form) {
      const buttons = form.querySelectorAll('button, input[type="submit"], input[type="button"]');
      return Array.from(buttons).map((btn, index) => ({
        type: btn.type || 'button',
        text: btn.textContent || btn.value || 'Submit',
        id: btn.id || `button-${index}`,
        name: btn.name || ''
      }));
    }

    extractNavigation() {
      const navElements = document.querySelectorAll('nav a, [role="navigation"] a');
      return Array.from(navElements).map(link => ({
        type: 'link',
        text: link.textContent.trim(),
        href: link.href,
        id: link.id || undefined
      }));
    }

    extractInteractables() {
      const buttons = document.querySelectorAll('button:not([type="hidden"]), a[role="button"], [role="button"]');
      return Array.from(buttons).map(btn => ({
        type: 'button',
        text: btn.textContent.trim(),
        id: btn.id || undefined,
        clickable: true,
        selector: this.getSelector(btn)
      }));
    }

    extractLandmarks() {
      const landmarks = document.querySelectorAll('[role], header, nav, main, footer, aside, section');
      return Array.from(landmarks).map(el => ({
        role: el.getAttribute('role') || el.tagName.toLowerCase(),
        label: el.getAttribute('aria-label') || undefined,
        element: el.tagName.toLowerCase()
      }));
    }

    getSelector(element) {
      if (element.id) return `#${element.id}`;
      if (element.className) {
        const classes = element.className.split(' ').filter(c => c).slice(0, 3).join('.');
        return `${element.tagName.toLowerCase()}.${classes}`;
      }
      return element.tagName.toLowerCase();
    }

    log(...args) {
      if (config.debug) console.log('[DOMAnalyzer]', ...args);
    }
  }

  // =====================================================================
  // VOICE NAVIGATION CONTROLLER
  // =====================================================================
  
  class VoiceNavigationController {
    constructor(options) {
      this.config = { ...config, ...options };
      this.recognizer = null;
      this.synthesizer = null;
      this.isListening = false;
      this.domAnalysis = null;
      this.domAnalyzer = new DOMAnalyzer();
      
      this.log('Initialized with config:', this.config);
    }

    async init() {
      try {
        // Load Azure Speech SDK
        await this.loadSpeechSDK();
        
        // Get Azure credentials from API
        await this.fetchAzureCredentials();
        
        // Analyze page
        this.analyzePage();
        
        // Initialize speech services
        await this.initializeSpeech();
        
        // Create UI
        this.createUI();
        
        // Auto-start if configured
        if (this.config.autoStart) {
          await this.start();
        }
        
        this.log('✅ Voice navigation ready!');
      } catch (error) {
        console.error('[VoiceNav] Initialization failed:', error);
      }
    }

    async fetchAzureCredentials() {
      try {
        this.log('Fetching Azure credentials...');
        const response = await fetch(`${this.config.apiBase}/voice-credentials`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch credentials');
        }
        
        const credentials = await response.json();
        this.azureToken = credentials.token;
        this.azureRegion = credentials.region;
        this.tokenExpiry = Date.now() + (credentials.expiresIn * 1000);
        
        this.log('✅ Credentials fetched, valid for', credentials.expiresIn, 'seconds');
      } catch (error) {
        console.error('[VoiceNav] Failed to fetch credentials:', error);
        throw error;
      }
    }

    async refreshCredentialsIfNeeded() {
      // Refresh token 1 minute before expiry
      if (Date.now() >= this.tokenExpiry - 60000) {
        this.log('🔄 Refreshing credentials...');
        await this.fetchAzureCredentials();
      }
    }

    async loadSpeechSDK() {
      return new Promise((resolve, reject) => {
        if (window.SpeechSDK) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = AZURE_SPEECH_SDK_URL;
        script.onload = () => {
          this.log('Speech SDK loaded');
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    analyzePage() {
      this.domAnalysis = this.domAnalyzer.analyze();
      this.log('Page analyzed:', this.domAnalysis);
    }

    async initializeSpeech() {
      const { language } = this.config;
      
      if (!this.azureToken || !this.azureRegion) {
        throw new Error('Azure credentials not available');
      }

      const speechConfig = window.SpeechSDK.SpeechConfig.fromAuthorizationToken(
        this.azureToken,
        this.azureRegion
      );
      speechConfig.speechRecognitionLanguage = language;

      const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new window.SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === window.SpeechSDK.ResultReason.RecognizedSpeech) {
          this.showTranscript(e.result.text);
          this.handleCommand(e.result.text);
        }
      };

      this.recognizer.recognizing = (s, e) => {
        if (e.result.text) {
          this.showTranscript(e.result.text);
        }
      };

      this.log('✅ Speech recognizer initialized');
    }

    async start() {
      if (this.isListening) return;
      
      try {
        // Refresh credentials if needed
        await this.refreshCredentialsIfNeeded();
        
        await this.recognizer.startContinuousRecognitionAsync();
        this.isListening = true;
        this.updateUI();
        this.speak('Voice navigation activated');
        this.log('🎤 Listening started');
      } catch (error) {
        console.error('[VoiceNav] Start failed:', error);
      }
    }

    stop() {
      if (!this.isListening) return;
      
      this.recognizer.stopContinuousRecognitionAsync();
      this.isListening = false;
      this.updateUI();
      this.log('🔇 Listening stopped');
    }

    async handleCommand(command) {
      this.log('🎤 Command:', command);
      this.showProcessing(true);
      
      try {
        // Call AI API
        const response = await fetch(`${this.config.apiBase}/voice-ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: command,
            language: this.config.language,
            currentUrl: window.location.href,
            domAnalysis: this.domAnalysis
          })
        });

        const result = await response.json();
        this.log('🤖 AI Response:', result);

        this.showProcessing(false);

        if (result.response && this.voiceFeedbackEnabled) {
          await this.speak(result.response);
        }

        if (result.action) {
          this.executeAction(result.action, result.parameters);
        }
      } catch (error) {
        console.error('[VoiceNav] Command processing failed:', error);
        this.showProcessing(false);
        if (this.voiceFeedbackEnabled) {
          await this.speak('Sorry, I encountered an error');
        }
      }
    }

    executeAction(action, parameters = {}) {
      this.log('⚡ Execute:', action, parameters);

      const actions = {
        // Scrolling
        'scroll_up': () => window.scrollBy({ top: -400, behavior: 'smooth' }),
        'scroll_down': () => window.scrollBy({ top: 400, behavior: 'smooth' }),
        'top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        'bottom': () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }),
        
        // Dynamic actions
        'fill_form': () => this.fillForm(parameters),
        'click': () => this.clickElement(parameters),
        
        // Navigation
        'back': () => window.history.back(),
        'refresh': () => window.location.reload(),
        
        // Content
        'read': () => this.readPage()
      };

      const actionFn = actions[action];
      if (actionFn) {
        actionFn();
        return true;
      }
      
      this.log('❌ Unknown action:', action);
      return false;
    }

    fillForm(parameters) {
      this.log('📝 Fill Form:', parameters);
      
      if (!this.domAnalysis || this.domAnalysis.forms.length === 0) {
        this.log('⚠️ No forms found');
        return;
      }

      const form = this.domAnalysis.forms[0];
      const fieldValues = parameters.fields || parameters;

      Object.entries(fieldValues).forEach(([key, value]) => {
        // Find matching field
        const field = form.fields.find(f =>
          f.label?.toLowerCase().includes(key.toLowerCase()) ||
          f.name?.toLowerCase().includes(key.toLowerCase()) ||
          f.placeholder?.toLowerCase().includes(key.toLowerCase())
        );

        if (!field) {
          this.log('⚠️ Field not found:', key);
          return;
        }

        // Find input element using multiple strategies
        let input = null;

        // Try by label
        if (field.label) {
          const labels = Array.from(document.querySelectorAll('label'));
          const matchingLabel = labels.find(l => 
            l.textContent?.trim().toLowerCase() === field.label?.toLowerCase()
          );
          if (matchingLabel) {
            const forAttr = matchingLabel.getAttribute('for');
            input = forAttr 
              ? document.querySelector(`#${forAttr}`)
              : matchingLabel.querySelector('input, select, textarea');
          }
        }

        // Try by placeholder
        if (!input && field.placeholder) {
          input = document.querySelector(`input[placeholder="${field.placeholder}"], textarea[placeholder="${field.placeholder}"]`);
        }

        // Try by index
        if (!input && typeof field.index === 'number') {
          const formElement = document.querySelector('form');
          if (formElement) {
            const allInputs = formElement.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
            input = allInputs[field.index];
          }
        }

        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          this.log(`✅ Filled "${field.label || field.name}" with "${value}"`);
        } else {
          this.log(`⚠️ Input element not found for "${key}"`);
        }
      });

      this.speak('Fields have been filled');
    }

    clickElement(parameters) {
      this.log('🖱️ Click:', parameters);
      
      const target = parameters?.target || parameters?.element || parameters?.button || 'submit';
      let element = null;

      // Search in form buttons
      if (this.domAnalysis?.forms.length) {
        for (const form of this.domAnalysis.forms) {
          const button = form.buttons?.find(b =>
            b.text?.toLowerCase().includes(target.toLowerCase()) ||
            target.toLowerCase().includes('submit')
          );
          if (button) {
            element = document.querySelector(`button[type="submit"], input[type="submit"]`);
            break;
          }
        }
      }

      // Search in interactions
      if (!element && this.domAnalysis?.interactions.length) {
        const interaction = this.domAnalysis.interactions.find(i =>
          i.text?.toLowerCase().includes(target.toLowerCase())
        );
        if (interaction) {
          element = document.querySelector(interaction.selector);
        }
      }

      // Fallback: search by text
      if (!element) {
        const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a'));
        element = buttons.find(btn =>
          btn.textContent?.toLowerCase().includes(target.toLowerCase()) ||
          btn.value?.toLowerCase().includes(target.toLowerCase())
        );
      }

      if (element) {
        this.log('✅ Clicking:', element);
        element.click();
        this.speak('Clicked');
      } else {
        this.log('⚠️ Element not found:', target);
        this.speak('Element not found');
      }
    }

    readPage() {
      const main = document.querySelector('main, article, [role="main"]');
      const content = main ? main.textContent : document.body.textContent;
      const text = content.substring(0, 500).trim();
      this.speak(text);
    }

    async speak(text) {
      if (!text) return;
      
      try {
        this.log('🔊 Speaking:', text.substring(0, 50));
        
        // Call voice-synthesize API
        const response = await fetch(`${this.config.apiBase}/voice-synthesize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            language: this.config.language
          })
        });

        if (!response.ok) {
          throw new Error('Speech synthesis failed');
        }

        // Get audio blob and play it
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        await audio.play();
        
        // Clean up
        audio.onended = () => URL.revokeObjectURL(audioUrl);
      } catch (error) {
        console.error('[VoiceNav] Speech error:', error);
      }
    }

    // =====================================================================
    // UI CREATION - Beautiful Accessibility UI
    // =====================================================================
    
    createUI() {
      const widget = document.createElement('div');
      widget.id = 'liaplus-voice-widget';
      
      // SVG Icons
      const icons = {
        accessibility: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M9 18V8a3 3 0 0 1 6 0v10"/><line x1="9" y1="13" x2="15" y2="13"/></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
        languages: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
        volume2: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        volumeX: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>',
        sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
        x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      };

      widget.innerHTML = `
        <style>
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

          .voice-btn-container {
            position: relative;
          }

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

          .voice-main-btn:hover { background: #f9fafb; }
          .voice-main-btn.listening {
            background: #f3e8ff;
            border-color: #c084fc;
            color: #9333ea;
          }
          .voice-main-btn.listening:hover { background: #e9d5ff; }
          
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

          .voice-secondary-btn:hover { background: #f9fafb; }
          .voice-secondary-btn svg { width: 20px; height: 20px; }
          .voice-secondary-btn.settings { right: -112px; }
          
          @media (min-width: 640px) {
            .voice-secondary-btn {
              width: 32px;
              height: 32px;
              box-shadow: none;
              top: 0;
              bottom: auto;
            }
            .voice-secondary-btn svg { width: 16px; height: 16px; }
            .voice-secondary-btn.settings {
              left: -48px;
              right: auto;
            }
          }

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
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
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

          .listening-dot:nth-child(2) { animation-delay: 0.2s; }
          .listening-dot:nth-child(3) { animation-delay: 0.4s; }

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
            .transcript-text { font-size: 14px; }
          }

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
            .settings-title { font-size: 14px; }
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

          .close-btn:hover { background: #f3f4f6; }
          .close-btn svg { width: 16px; height: 16px; color: #6b7280; }

          .settings-content { padding: 12px 16px; }
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
            .setting-label { font-size: 14px; }
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

          .setting-btn:hover { background: #f9fafb; }
          .setting-btn svg { width: 12px; height: 12px; }

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

          .lang-option:hover { background: #f9fafb; }
          .lang-option svg { width: 12px; height: 12px; margin-left: auto; }

          .hidden { display: none !important; }
        </style>
        
        <div class="voice-btn-container">
          <button class="voice-main-btn" id="voice-main-btn" title="Voice Navigation">
            ${icons.accessibility}
            <span class="pulse-indicator hidden" id="pulse-indicator">
              <span class="pulse-ring"></span>
              <span class="pulse-dot"></span>
            </span>
            <span class="processing-spinner hidden" id="processing-spinner">
              ${icons.sparkles}
            </span>
          </button>

          <button class="voice-secondary-btn settings hidden" id="settings-btn" title="Settings">
            ${icons.settings}
          </button>

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
                ${icons.sparkles}
              </span>
            </div>
          </div>

          <div class="settings-panel hidden" id="settings-panel">
            <div class="settings-header">
              <h3 class="settings-title" id="settings-title">Voice Settings</h3>
              <button class="close-btn" id="close-settings">
                ${icons.x}
              </button>
            </div>
            <div class="settings-content">
              <div class="setting-row">
                <span class="setting-label" id="lang-label">Language</span>
                <div style="position: relative;">
                  <button class="setting-btn" id="lang-btn">
                    ${icons.languages}
                    <span id="lang-text">English</span>
                  </button>
                  <div class="lang-dropdown hidden" id="lang-dropdown">
                    <button class="lang-option" data-lang="en-US">
                      🇺🇸 English
                      <span class="hidden" id="check-en">${icons.check}</span>
                    </button>
                    <button class="lang-option" data-lang="hi-IN">
                      🇮🇳 हिंदी
                      <span class="hidden" id="check-hi">${icons.check}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="setting-row">
                <span class="setting-label" id="voice-feedback-label">Voice Feedback</span>
                <button class="setting-btn" id="voice-feedback-btn">
                  ${icons.volume2}
                </button>
              </div>

              <div class="setting-row">
                <div>
                  <span class="setting-label">AI Mode</span>
                  <p style="font-size: 10px; color: #9ca3af;" id="ai-subtitle">Understands everything</p>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="width: 12px; height: 12px; color: #9333ea;">${icons.sparkles}</span>
                  <span style="font-size: 12px; font-weight: 600; color: #9333ea;">ON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(widget);
      this.setupUIEventListeners();
    }

    setupUIEventListeners() {
      // Main button
      document.getElementById('voice-main-btn').addEventListener('click', () => {
        if (this.isListening) {
          this.stop();
        } else {
          this.start();
        }
      });

      // Settings button
      document.getElementById('settings-btn').addEventListener('click', () => {
        const panel = document.getElementById('settings-panel');
        panel.classList.toggle('hidden');
      });

      // Close settings
      document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.add('hidden');
      });

      // Language button
      document.getElementById('lang-btn').addEventListener('click', () => {
        document.getElementById('lang-dropdown').classList.toggle('hidden');
      });

      // Language options
      document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
          const lang = option.getAttribute('data-lang');
          this.config.language = lang;
          document.getElementById('lang-text').textContent = lang === 'hi-IN' ? 'हिंदी' : 'English';
          document.getElementById('lang-dropdown').classList.add('hidden');
          
          // Update check marks
          document.getElementById('check-en').classList.toggle('hidden', lang !== 'en-US');
          document.getElementById('check-hi').classList.toggle('hidden', lang !== 'hi-IN');
          
          // Update text labels
          if (lang === 'hi-IN') {
            document.getElementById('settings-title').textContent = 'वॉयस सेटिंग्स';
            document.getElementById('lang-label').textContent = 'भाषा';
            document.getElementById('voice-feedback-label').textContent = 'वॉयस फीडबैक';
            document.getElementById('ai-subtitle').textContent = 'सब कुछ समझता है';
            document.getElementById('listening-text').textContent = 'सुन रहे हैं...';
          } else {
            document.getElementById('settings-title').textContent = 'Voice Settings';
            document.getElementById('lang-label').textContent = 'Language';
            document.getElementById('voice-feedback-label').textContent = 'Voice Feedback';
            document.getElementById('ai-subtitle').textContent = 'Understands everything';
            document.getElementById('listening-text').textContent = 'Listening...';
          }
        });
      });

      // Voice feedback toggle
      this.voiceFeedbackEnabled = true;
      document.getElementById('voice-feedback-btn').addEventListener('click', () => {
        this.voiceFeedbackEnabled = !this.voiceFeedbackEnabled;
        const btn = document.getElementById('voice-feedback-btn');
        btn.innerHTML = this.voiceFeedbackEnabled 
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
      });
    }

    updateUI() {
      const mainBtn = document.getElementById('voice-main-btn');
      const pulseIndicator = document.getElementById('pulse-indicator');
      const settingsBtn = document.getElementById('settings-btn');
      const transcriptBubble = document.getElementById('transcript-bubble');
      
      if (this.isListening) {
        mainBtn.classList.add('listening');
        pulseIndicator.classList.remove('hidden');
        settingsBtn.classList.remove('hidden');
        transcriptBubble.classList.remove('hidden');
      } else {
        mainBtn.classList.remove('listening');
        pulseIndicator.classList.add('hidden');
        settingsBtn.classList.add('hidden');
        transcriptBubble.classList.add('hidden');
        document.getElementById('settings-panel').classList.add('hidden');
      }
    }

    showTranscript(text) {
      const transcriptText = document.getElementById('transcript-text');
      if (transcriptText) {
        transcriptText.textContent = text;
      }
    }

    showProcessing(isProcessing) {
      const spinner = document.getElementById('processing-spinner');
      const transcriptSpinner = document.getElementById('transcript-spinner');
      
      if (isProcessing) {
        spinner?.classList.remove('hidden');
        transcriptSpinner?.classList.remove('hidden');
      } else {
        spinner?.classList.add('hidden');
        transcriptSpinner?.classList.add('hidden');
      }
    }

    log(...args) {
      if (config.debug) console.log('[VoiceNav]', ...args);
    }
  }

  // =====================================================================
  // PUBLIC API
  // =====================================================================
  
  window.LiaPlusVoice = {
    version: VERSION,
    
    init: function(options = {}) {
      // Merge with defaults
      const mergedConfig = {
        apiBase: options.apiBase || DEFAULT_API_BASE,
        language: options.language || 'en-US',
        autoStart: options.autoStart !== undefined ? options.autoStart : true,
        debug: options.debug !== undefined ? options.debug : true
      };

      const controller = new VoiceNavigationController(mergedConfig);
      controller.init();
      
      // Store instance
      this._controller = controller;
      
      console.log(`[LiaPlusVoice] v${VERSION} initialized with API base: ${mergedConfig.apiBase}`);
    },
    
    start: function() {
      this._controller?.start();
    },
    
    stop: function() {
      this._controller?.stop();
    },
    
    analyzePage: function() {
      this._controller?.analyzePage();
    }
  };

  console.log(`[LiaPlusVoice] v${VERSION} loaded. Call LiaPlusVoice.init() to start.`);

})(window);
