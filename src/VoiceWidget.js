/**
 * LiaPlus Voice Navigation Widget
 * Vanilla JavaScript port of VoiceNavigationAdvanced React component
 * 
 * This is a direct port maintaining exact UI/UX from components/voice-navigation-advanced.tsx
 */

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { DOMAnalyzer, NavigationMap } from '@voice-sdk';
import { UIComponents } from './UIComponents.js';
import { CommandProcessor } from './CommandProcessor.js';
import { ApiManager } from './ApiManager.js';
import { AudioManager } from './AudioManager.js';
import './styles.css';

export class VoiceWidget {
  constructor(config = {}) {
    // Configuration
    this.config = {
      apiBase: config.apiBase || 'https://liaplus.com/api',
      mode: config.mode || 'hosted', // 'hosted' or 'custom'
      language: config.language || 'en-US',
      autoStart: config.autoStart !== undefined ? config.autoStart : false,
      debug: config.debug !== undefined ? config.debug : true,
      ...config
    };

    // State management (from React useState lines 31-44)
    this.state = {
      isListening: false,
      isSupported: true,
      transcript: '',
      voiceEnabled: true,
      showSettings: false,
      showCommands: true,
      commandHistory: [],
      isProcessing: false,
      language: this.config.language,
      showLanguageSelector: false,
      aiEnabled: true,
      useDynamicMode: true,
      domAnalysis: null,
      navigationMap: null
    };

    // References (from React useRef)
    this.refs = {
      recognizer: null,
      synthesizer: null,
      commandsList: null,
      mainButton: null,
      container: null
    };

    // DOM elements
    this.elements = {};

    // Managers
    this.uiComponents = new UIComponents(this);
    this.commandProcessor = new CommandProcessor(this);
    this.apiManager = new ApiManager(this);
    this.audioManager = new AudioManager(this);

    // Bound methods
    this.toggleListening = this.toggleListening.bind(this);
    this.handleVoiceCommand = this.handleVoiceCommand.bind(this);
    this.executeAction = this.executeAction.bind(this);
    this.speak = this.speak.bind(this);
    this.stopSpeaking = this.stopSpeaking.bind(this);
    
    // Initialize
    this.init();
  }

  /**
   * Initialize the widget
   */
  async init() {
    this.log('Initializing LiaPlus Voice Widget', this.config);
    
    // Load persistent state
    this.loadStateFromLocalStorage();
    
    // Create DOM elements
    this.createWidgetUI();
    
    // Initialize NavigationMap
    await this.initNavigationMap();
    
    // Analyze page
    if (this.state.useDynamicMode) {
      setTimeout(() => this.analyzePage(), 500);
    }
    
    // Listen for page changes
    this.observePageChanges();
    
    // Auto-start if configured
    if (this.config.autoStart && this.state.isListening) {
      this.startRecognition();
    }
    
    this.log('Widget initialized successfully');
  }

  /**
   * Load state from localStorage (from React useEffect lines 68-85)
   */
  loadStateFromLocalStorage() {
    if (typeof window === 'undefined') return;
    
    const savedListening = localStorage.getItem('voiceNavListening') === 'true';
    const savedVoiceEnabled = localStorage.getItem('voiceNavFeedback') !== 'false';
    const savedLanguage = localStorage.getItem('voiceNavLanguage') || 'en-US';
    const savedAI = localStorage.getItem('voiceNavAI') !== 'false';
    const savedDynamic = localStorage.getItem('voiceNavDynamic') !== 'false';
    
    this.setState({
      voiceEnabled: savedVoiceEnabled,
      language: savedLanguage,
      aiEnabled: savedAI,
      useDynamicMode: savedDynamic,
      isListening: savedListening
    }, false); // Don't render yet
  }

  /**
   * Save state to localStorage (from React useEffect lines 122-130)
   */
  saveStateToLocalStorage() {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('voiceNavListening', this.state.isListening.toString());
    localStorage.setItem('voiceNavFeedback', this.state.voiceEnabled.toString());
    localStorage.setItem('voiceNavLanguage', this.state.language);
    localStorage.setItem('voiceNavAI', this.state.aiEnabled.toString());
    localStorage.setItem('voiceNavDynamic', this.state.useDynamicMode.toString());
  }

  /**
   * Initialize NavigationMap (from React useEffect lines 53-65)
   */
  async initNavigationMap() {
    try {
      const navMap = new NavigationMap();
      this.setState({ navigationMap: navMap });
      this.log('🗺️ Navigation Map initialized with', navMap.getAllRoutes().length, 'routes');
    } catch (error) {
      this.log('❌ Navigation Map failed to initialize:', error);
    }
  }

  /**
   * Analyze page DOM (from React useEffect lines 88-98 and analyzePage lines 101-119)
   */
  analyzePage() {
    if (!this.state.useDynamicMode) return;
    
    try {
      this.log('📊 Analyzing page DOM...');
      const analyzer = new DOMAnalyzer();
      const analysis = analyzer.analyze();
      
      this.setState({ domAnalysis: analysis });
      
      this.log('✅ DOM Analysis complete:', {
        forms: analysis.forms.length,
        navigation: analysis.navigation.length,
        interactions: analysis.interactions.length,
        landmarks: analysis.landmarks.length,
        pageTitle: analysis.pageInfo.title
      });
    } catch (error) {
      this.log('❌ DOM Analysis failed:', error);
    }
  }

  /**
   * Observe page changes for re-analysis
   */
  observePageChanges() {
    // Listen for route changes (for SPAs)
    let lastUrl = location.href;
    
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.log('🔄 Page changed, re-analyzing...');
        setTimeout(() => this.analyzePage(), 500);
      }
    }).observe(document.querySelector('body'), {
      subtree: true,
      childList: true
    });
  }

  /**
   * Set state and trigger re-render
   */
  setState(updates, shouldRender = true) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // Save to localStorage
    this.saveStateToLocalStorage();
    
    // Re-render if needed
    if (shouldRender) {
      this.render(oldState);
    }
  }

  /**
   * Logging utility
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[LiaPlusVoice]', ...args);
    }
  }

  /**
   * Toggle listening state
   */
  toggleListening() {
    this.setState({ isListening: !this.state.isListening });
    
    if (this.state.isListening) {
      this.startRecognition();
    } else {
      this.stopRecognition();
    }
  }

  /**
   * Destroy widget and cleanup
   */
  destroy() {
    this.stopRecognition();
    
    if (this.refs.container && this.refs.container.parentNode) {
      this.refs.container.parentNode.removeChild(this.refs.container);
    }
    
    this.log('Widget destroyed');
  }

  /**
   * Create widget UI
   */
  createWidgetUI() {
    // Create container
    this.refs.container = this.uiComponents.createContainer();
    document.body.appendChild(this.refs.container);
    
    // Initial render
    this.render();
  }

  /**
   * Render widget UI
   */
  render(oldState = {}) {
    if (!this.refs.container) return;
    
    // Clear container
    this.refs.container.innerHTML = '';
    
    // Create floating button wrapper
    const buttonWrapper = this.uiComponents.createFloatingButton();
    this.refs.container.appendChild(buttonWrapper);
    
    // Get the relative container (for positioning overlays)
    const relativeContainer = buttonWrapper.querySelector('.relative');
    
    // Add transcript overlay if needed
    const transcriptOverlay = this.uiComponents.createTranscriptOverlay();
    if (transcriptOverlay) {
      relativeContainer.appendChild(transcriptOverlay);
    }
    
    // Add settings panel if needed
    const settingsPanel = this.uiComponents.createSettingsPanel();
    if (settingsPanel) {
      relativeContainer.appendChild(settingsPanel);
    }
    
    // Add commands overlay if needed
    const commandsOverlay = this.uiComponents.createCommandsOverlay();
    if (commandsOverlay) {
      this.refs.container.appendChild(commandsOverlay);
    }
  }

  /**
   * Execute action (delegate to CommandProcessor)
   */
  executeAction(action, parameters) {
    return this.commandProcessor.executeAction(action, parameters);
  }

  /**
   * Start recognition
   */
  async startRecognition() {
    await this.audioManager.start();
  }

  /**
   * Stop recognition
   */
  stopRecognition() {
    this.audioManager.stop();
  }

  /**
   * Speak text
   */
  speak(text) {
    this.audioManager.speak(text);
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    this.audioManager.stopSpeaking();
  }

  /**
   * Reinitialize recognition (when language changes)
   */
  async reinitializeRecognition() {
    await this.audioManager.reinitialize();
  }

  /**
   * Handle voice command (lines 906-999)
   */
  async handleVoiceCommand(command) {
    if (!command || command.length < 2) return;
    
    this.log('🎤 [Voice Command]', command);
    this.setState({ isProcessing: true });

    // Add to command history
    const newHistory = [
      { command, timestamp: Date.now(), action: 'Processing...' },
      ...this.state.commandHistory.slice(0, 9)
    ];
    this.setState({ commandHistory: newHistory });

    try {
      // Call AI API
      const data = await this.apiManager.processVoiceCommand(
        command,
        this.state.domAnalysis,
        window.location.href
      );
      
      this.log('🤖 [AI Response]', data);
      
      // Speak the AI's response
      if (data.response) {
        this.log('🔊 [Speaking]', data.response);
        this.speak(data.response);
      }
      
      // Execute the action if not just chat
      if (data.action && data.action !== 'chat') {
        // Normalize action name
        const normalizedAction = data.action.replace(/\s+/g, '_').toLowerCase();
        this.log('⚡ [Action]', normalizedAction, data.parameters || {});
        
        const executed = this.executeAction(normalizedAction, data.parameters);
        this.log(executed ? '✅ [Executed]' : '❌ [Failed]', normalizedAction);
        
        // Update command history
        const updatedHistory = [...this.state.commandHistory];
        if (updatedHistory[0]) {
          updatedHistory[0].action = executed ? normalizedAction : 'Unknown action';
        }
        this.setState({ commandHistory: updatedHistory });
      } else {
        // Just conversation
        this.log('💬 [Chat Mode]', data.response);
        const updatedHistory = [...this.state.commandHistory];
        if (updatedHistory[0]) {
          updatedHistory[0].action = 'Chat';
        }
        this.setState({ commandHistory: updatedHistory });
      }
    } catch (error) {
      this.log('💥 [Error]', error);
      const errorMessage = this.state.language === 'hi-IN' 
        ? 'माफ़ करें, कुछ गड़बड़ हो गई। फिर से कोशिश करें।' 
        : 'Sorry, something went wrong. Please try again.';
      this.speak(errorMessage);
    } finally {
      this.setState({ isProcessing: false });
      this.log('✔️ [Processing Complete]');
    }
  }
}
