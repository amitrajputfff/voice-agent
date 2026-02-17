/**
 * LiaPlus Voice Navigation Widget
 * Main entry point for CDN distribution
 * 
 * Usage:
 * ```html
 * <script src="https://cdn.jsdelivr.net/gh/liaplus/voice-widget@1.0.0/cdn/dist/voice-widget.min.js"></script>
 * <script>
 *   LiaPlusVoice.init({
 *     apiBase: 'https://liaplus.com/api',
 *     language: 'en-US'
 *   });
 * </script>
 * ```
 */

import { VoiceWidget } from './VoiceWidget.js';

// Global widget instance
let widgetInstance = null;

// Main API
const LiaPlusVoice = {
  /**
   * Initialize the widget
   */
  init(config = {}) {
    if (widgetInstance) {
      console.warn('[LiaPlusVoice] Widget already initialized. Call destroy() first.');
      return widgetInstance;
    }
    
    widgetInstance = new VoiceWidget(config);
    return widgetInstance;
  },

  /**
   * Start listening
   */
  start() {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return;
    }
    
    if (!widgetInstance.state.isListening) {
      widgetInstance.toggleListening();
    }
  },

  /**
   * Stop listening
   */
  stop() {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return;
    }
    
    if (widgetInstance.state.isListening) {
      widgetInstance.toggleListening();
    }
  },

  /**
   * Toggle listening
   */
  toggle() {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return;
    }
    
    widgetInstance.toggleListening();
  },

  /**
   * Analyze page (re-scan DOM)
   */
  analyzePage() {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return;
    }
    
    widgetInstance.analyzePage();
  },

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return;
    }
    
    widgetInstance.config = { ...widgetInstance.config, ...newConfig };
    
    // Reinitialize if language changed
    if (newConfig.language && newConfig.language !== widgetInstance.state.language) {
      widgetInstance.setState({ language: newConfig.language });
      widgetInstance.reinitializeRecognition();
    }
  },

  /**
   * Destroy widget
   */
  destroy() {
    if (!widgetInstance) {
      console.warn('[LiaPlusVoice] Widget not initialized.');
      return;
    }
    
    widgetInstance.destroy();
    widgetInstance = null;
  },

  /**
   * Get current state
   */
  getState() {
    if (!widgetInstance) {
      console.error('[LiaPlusVoice] Widget not initialized. Call init() first.');
      return null;
    }
    
    return { ...widgetInstance.state };
  },

  /**
   * Get widget instance (for advanced usage)
   */
  getInstance() {
    return widgetInstance;
  }
};

// Export for UMD
export default LiaPlusVoice;

// Also attach to window for CDN usage
if (typeof window !== 'undefined') {
  window.LiaPlusVoice = LiaPlusVoice;
}
