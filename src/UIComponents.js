/**
 * UI Components - DOM creation matching voice-navigation-advanced.tsx exactly
 * Lines 1027-1308 from React component
 */

import { Icons } from './Icons.js';

export class UIComponents {
  constructor(widget) {
    this.widget = widget;
  }

  /**
   * Create main widget container
   */
  createContainer() {
    const container = document.createElement('div');
    container.id = 'liaplus-voice-widget';
    container.className = 'liaplus-voice-widget-root';
    return container;
  }

  /**
   * Create floating button (lines 1030-1060)
   */
  createFloatingButton() {
    const { isListening, isProcessing } = this.widget.state;
    
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'fixed bottom-4 left-4 sm:bottom-auto sm:left-auto sm:top-6 sm:right-6 z-50';
    
    const relativeContainer = document.createElement('div');
    relativeContainer.className = 'relative';
    
    // Main button
    const button = document.createElement('button');
    button.className = `relative h-12 w-12 sm:h-10 sm:w-10 rounded-full transition-all duration-200 shadow-lg sm:shadow-none bg-background border ${
      isListening 
        ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 border-purple-300 dark:border-purple-700' 
        : 'hover:bg-muted border-border'
    }`;
    button.setAttribute('aria-label', isListening ? 'Stop voice navigation' : 'Start voice navigation');
    button.setAttribute('title', isListening ? 'Voice navigation active - Ask me anything!' : 'Click to enable voice navigation');
    button.onclick = () => this.widget.toggleListening();
    
    // Icon
    const iconContainer = document.createElement('span');
    iconContainer.className = 'flex items-center justify-center';
    
    if (isListening) {
      iconContainer.innerHTML = Icons.accessibility('h-5 w-5 sm:h-4 sm:w-4 animate-pulse');
      
      // Processing indicator
      if (isProcessing) {
        const sparkle = document.createElement('span');
        sparkle.className = 'absolute -top-0.5 -right-0.5';
        sparkle.innerHTML = Icons.sparkles('h-4 w-4 sm:h-3 sm:w-3 animate-spin');
        button.appendChild(sparkle);
      }
      
      // Ping animation
      const pingOuter = document.createElement('span');
      pingOuter.className = 'absolute -top-0.5 -right-0.5 flex h-3 w-3 sm:h-2 sm:w-2';
      pingOuter.innerHTML = `
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 sm:h-2 sm:w-2 bg-purple-500"></span>
      `;
      button.appendChild(pingOuter);
    } else {
      iconContainer.innerHTML = Icons.accessibility('h-5 w-5 sm:h-4 sm:w-4');
    }
    
    button.appendChild(iconContainer);
    relativeContainer.appendChild(button);
    
    // Secondary buttons (lines 1063-1082)
    if (isListening) {
      const commandsButton = this.createSecondaryButton(
        'list',
        'Hide examples',
        'absolute bottom-0 -right-14 sm:right-auto sm:bottom-auto sm:top-0 sm:-left-12',
        () => this.widget.setState({ showCommands: !this.widget.state.showCommands })
      );
      relativeContainer.appendChild(commandsButton);
      
      const settingsButton = this.createSecondaryButton(
        'settings',
        'Voice settings',
        'absolute bottom-0 -right-28 sm:right-auto sm:bottom-auto sm:top-0 sm:-left-24',
        () => this.widget.setState({ showSettings: !this.widget.state.showSettings })
      );
      relativeContainer.appendChild(settingsButton);
    }
    
    buttonWrapper.appendChild(relativeContainer);
    return buttonWrapper;
  }

  /**
   * Create secondary button
   */
  createSecondaryButton(icon, title, className, onclick) {
    const button = document.createElement('button');
    button.className = `${className} h-10 w-10 sm:h-8 sm:w-8 rounded-full hover:bg-muted shadow-lg sm:shadow-none bg-background border border-border`;
    button.setAttribute('title', title);
    button.onclick = onclick;
    
    const iconHtml = icon === 'list' ? Icons.list('h-5 w-5 sm:h-4 sm:w-4') : Icons.settings('h-5 w-5 sm:h-4 sm:w-4');
    button.innerHTML = iconHtml;
    
    return button;
  }

  /**
   * Create transcript overlay (lines 1086-1107)
   */
  createTranscriptOverlay() {
    const { isListening, transcript, isProcessing } = this.widget.state;
    
    if (!isListening || !transcript) return null;
    
    const overlay = document.createElement('div');
    overlay.className = 'absolute bottom-full mb-2 sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0 right-0 left-0 sm:left-auto bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 backdrop-blur-md border border-purple-200 dark:border-purple-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-xl min-w-[200px] sm:min-w-[280px] max-w-[calc(100vw-2rem)] sm:max-w-[400px] z-50 animate-in slide-in-from-bottom sm:slide-in-from-top-2';
    
    overlay.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <div class="flex items-center gap-1">
              <div class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-500 animate-pulse"></div>
              <div class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-400 animate-pulse delay-75"></div>
              <div class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-300 animate-pulse delay-150"></div>
            </div>
            <p class="text-[10px] sm:text-xs font-medium text-purple-900 dark:text-purple-200">
              ${this.widget.state.language === 'hi-IN' ? 'सुन रहे हैं...' : 'Listening...'}
            </p>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate sm:whitespace-normal">${transcript}</p>
        </div>
        ${isProcessing ? `<span class="flex-shrink-0">${Icons.sparkles('h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400 animate-spin')}</span>` : ''}
      </div>
    `;
    
    return overlay;
  }

  /**
   * Create settings panel (lines 1110-1251)
   */
  createSettingsPanel() {
    const { showSettings, language, voiceEnabled, domAnalysis, useDynamicMode, commandHistory } = this.widget.state;
    
    if (!showSettings) return null;
    
    const panel = document.createElement('div');
    panel.className = 'absolute bottom-full mb-2 sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0 right-0 left-0 sm:left-auto bg-background border rounded-lg shadow-xl min-w-[250px] sm:min-w-[280px] max-w-[calc(100vw-2rem)] sm:max-w-[320px] z-50 animate-in slide-in-from-bottom sm:slide-in-from-top-2';
    
    const isHindi = language === 'hi-IN';
    
    panel.innerHTML = `
      <div class="p-3 sm:p-4">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h3 class="font-semibold text-xs sm:text-sm">
            ${isHindi ? 'वॉयस सेटिंग्स' : 'Voice Settings'}
          </h3>
          <button class="liaplus-close-settings h-7 w-7 sm:h-6 sm:w-6 hover:bg-muted rounded">
            ${Icons.x('h-4 w-4')}
          </button>
        </div>
        
        <div class="space-y-3">
          <!-- Language Selector -->
          <div class="flex items-center justify-between">
            <label class="text-xs sm:text-sm text-muted-foreground">
              ${isHindi ? 'भाषा' : 'Language'}
            </label>
            <div class="relative">
              <button class="liaplus-lang-toggle h-7 sm:h-8 text-xs border rounded px-2 flex items-center gap-1 hover:bg-muted">
                ${Icons.languages('h-3 w-3')}
                ${isHindi ? 'हिंदी' : 'English'}
              </button>
              <div class="liaplus-lang-dropdown hidden absolute right-0 top-full mt-2 bg-background border rounded-lg shadow-lg z-50 min-w-[120px]">
                <button class="liaplus-lang-en w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-2 text-xs">
                  🇺🇸 English
                  ${language === 'en-US' ? Icons.check('w-3 h-3 ml-auto') : ''}
                </button>
                <button class="liaplus-lang-hi w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-2 text-xs">
                  🇮🇳 हिंदी
                  ${language === 'hi-IN' ? Icons.check('w-3 h-3 ml-auto') : ''}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Voice Feedback Toggle -->
          <div class="flex items-center justify-between">
            <label class="text-xs sm:text-sm text-muted-foreground">
              ${isHindi ? 'वॉयस फीडबैक' : 'Voice Feedback'}
            </label>
            <button class="liaplus-voice-toggle h-7 sm:h-8 border rounded px-2 hover:bg-muted">
              ${voiceEnabled ? Icons.volume2('h-3 w-3 sm:h-4 sm:w-4') : Icons.volumeX('h-3 w-3 sm:h-4 sm:w-4')}
            </button>
          </div>
          
          <!-- AI Mode Indicator -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-xs sm:text-sm text-muted-foreground">
                ${isHindi ? 'AI मोड' : 'AI Mode'}
              </label>
              <p class="text-[10px] sm:text-xs text-muted-foreground/70">
                ${isHindi ? 'सब कुछ समझता है' : 'Understands everything'}
              </p>
            </div>
            <div class="flex items-center gap-1">
              ${Icons.sparkles('h-3 w-3 text-purple-600')}
              <span class="text-xs font-semibold text-purple-600">
                ${isHindi ? 'चालू' : 'ON'}
              </span>
            </div>
          </div>
          
          <!-- Dynamic Mode -->
          ${useDynamicMode ? `
          <div class="flex items-center justify-between">
            <div>
              <label class="text-xs sm:text-sm text-muted-foreground">
                ${isHindi ? 'डायनामिक मोड' : 'Dynamic Mode'}
              </label>
              <p class="text-[10px] sm:text-xs text-muted-foreground/70">
                ${domAnalysis 
                  ? `${domAnalysis.forms.length} forms, ${domAnalysis.navigation.length} nav`
                  : 'Not analyzed yet'}
              </p>
            </div>
            <button class="liaplus-analyze-page h-7 sm:h-8 text-xs border rounded px-2 hover:bg-muted">
              ${domAnalysis ? Icons.activity('h-3 w-3 text-green-600 mr-1') : ''}
              ${isHindi ? 'स्कैन' : 'Scan'}
            </button>
          </div>
          ` : ''}
        </div>
        
        <!-- Command History -->
        ${commandHistory.length > 0 ? `
        <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
          <h4 class="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2">
            ${isHindi ? 'हाल ही में' : 'Recent'}
          </h4>
          <div class="space-y-2 max-h-[120px] sm:max-h-[150px] overflow-y-auto">
            ${commandHistory.slice(0, 3).map(cmd => `
              <div class="text-xs p-2 bg-muted/50 rounded">
                <p class="font-medium truncate text-[10px] sm:text-xs">${cmd.command}</p>
                <p class="text-muted-foreground text-[9px] sm:text-[10px]">${cmd.action}</p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;
    
    // Attach event listeners
    this.attachSettingsPanelListeners(panel);
    
    return panel;
  }

  /**
   * Attach event listeners to settings panel
   */
  attachSettingsPanelListeners(panel) {
    // Close button
    panel.querySelector('.liaplus-close-settings').onclick = () => {
      this.widget.setState({ showSettings: false });
    };
    
    // Language toggle
    const langToggle = panel.querySelector('.liaplus-lang-toggle');
    const langDropdown = panel.querySelector('.liaplus-lang-dropdown');
    
    langToggle.onclick = (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('hidden');
    };
    
    // Language options
    panel.querySelector('.liaplus-lang-en').onclick = () => {
      this.widget.setState({ language: 'en-US' });
      this.widget.reinitializeRecognition();
    };
    
    panel.querySelector('.liaplus-lang-hi').onclick = () => {
      this.widget.setState({ language: 'hi-IN' });
      this.widget.reinitializeRecognition();
    };
    
    // Voice toggle
    panel.querySelector('.liaplus-voice-toggle').onclick = () => {
      this.widget.setState({ voiceEnabled: !this.widget.state.voiceEnabled });
    };
    
    // Analyze page
    const analyzeBtn = panel.querySelector('.liaplus-analyze-page');
    if (analyzeBtn) {
      analyzeBtn.onclick = () => this.widget.analyzePage();
    }
  }

  /**
   * Create commands overlay (lines 1256-1304)
   */
  createCommandsOverlay() {
    const { isListening, showCommands, language } = this.widget.state;
    
    if (!isListening || !showCommands) return null;
    
    const isHindi = language === 'hi-IN';
    
    const exampleCommands = isHindi 
      ? [
          '"होम पेज पर जाओ"',
          '"नीचे स्क्रॉल करो"',
          '"प्रोडक्ट्स दिखाओ"',
          '"LiaPlus के बारे में बताओ"',
          '"कीमत क्या है?"',
          '"चैटबॉट के बारे में बताओ"'
        ]
      : [
          '"Go to home page"',
          '"Scroll down"',
          '"Show products"',
          '"Tell me about LiaPlus"',
          '"What is the pricing?"',
          '"Tell me about the chatbot"'
        ];
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed left-4 right-4 bottom-20 sm:inset-auto sm:top-20 sm:right-6 lg:right-20 w-auto sm:w-[380px] lg:w-[420px] max-h-[50vh] sm:max-h-[calc(100vh-120px)] bg-background border shadow-2xl rounded-xl z-40 animate-in slide-in-from-bottom sm:slide-in-from-left duration-300 flex flex-col overflow-hidden';
    
    overlay.innerHTML = `
      <div class="flex items-center justify-between p-2.5 sm:p-3 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex-shrink-0">
        <div class="flex items-center gap-2">
          ${Icons.sparkles('h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400 animate-pulse')}
          <div>
            <h2 class="font-bold text-xs sm:text-sm">
              ${isHindi ? 'मुझसे कुछ भी पूछें' : 'Ask Me Anything'}
            </h2>
            <p class="text-[9px] sm:text-[10px] text-muted-foreground">
              ${isHindi ? 'AI-powered असिस्टेंट' : 'AI-powered assistant'}
            </p>
          </div>
        </div>
        <button class="liaplus-close-commands h-6 w-6 sm:h-7 sm:w-7 hover:bg-muted rounded" title="Hide">
          ${Icons.x('h-3 w-3')}
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-3 space-y-2">
        <p class="text-[10px] sm:text-xs text-muted-foreground mb-3">
          ${isHindi 
            ? '✨ कुछ भी पूछें, मैं समझ जाऊंगा! उदाहरण:' 
            : '✨ Just speak naturally, I understand! Examples:'}
        </p>
        ${exampleCommands.map(cmd => `
          <div class="text-[11px] sm:text-xs py-2 sm:py-1.5 px-2.5 sm:px-2 rounded bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-medium">
            ${cmd}
          </div>
        `).join('')}
      </div>
      
      <div class="p-2 sm:p-3 border-t bg-muted/30 text-center flex-shrink-0">
        <p class="text-[9px] sm:text-[10px] text-muted-foreground">
          ${isHindi 
            ? '🎤 बोलो और मैं करूंगा!' 
            : '🎤 Speak and I will help!'}
        </p>
      </div>
    `;
    
    // Close button
    overlay.querySelector('.liaplus-close-commands').onclick = () => {
      this.widget.setState({ showCommands: false });
    };
    
    return overlay;
  }
}
