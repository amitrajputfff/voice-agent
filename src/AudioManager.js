/**
 * Audio Manager - Azure Speech SDK integration
 * Port of Azure Speech functions from voice-navigation-advanced.tsx lines 774-891
 */

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

export class AudioManager {
  constructor(widget) {
    this.widget = widget;
    this.recognizer = null;
    this.synthesizer = null;
  }

  /**
   * Initialize Azure Speech (lines 774-825)
   */
  async initializeAzureSpeech() {
    try {
      const credentials = await this.widget.apiManager.getAzureSpeechCredentials();
      
      if (!credentials.success) {
        this.widget.log('❌ [Speech] Failed to get credentials');
        return false;
      }

      const { token, region } = credentials;
      
      // Setup STT (Speech-to-Text)
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
      speechConfig.speechRecognitionLanguage = this.widget.state.language;
      
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      
      // Event handlers
      this.recognizer.recognizing = (s, e) => {
        if (e.result.text) {
          this.widget.setState({ transcript: e.result.text.toLowerCase().trim() });
        }
      };
      
      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech && e.result.text) {
          const command = e.result.text.toLowerCase().trim();
          this.widget.setState({ transcript: command });
          this.widget.handleVoiceCommand(command);
        }
      };

      this.recognizer.canceled = (s, e) => {
        if (e.reason !== SpeechSDK.CancellationReason.EndOfStream) {
          this.widget.log('❌ [Speech] Recognition canceled:', e.reason);
        }
      };
      
      // Start continuous recognition
      this.recognizer.startContinuousRecognitionAsync(
        () => {
          this.widget.log('✅ [Speech] Recognition started');
        },
        (err) => {
          this.widget.log('❌ [Speech] Failed to start recognition:', err);
        }
      );
      
      // Setup TTS (Text-to-Speech) with best voices
      const ttsConfig = SpeechSDK.SpeechConfig.fromSubscription(token, region);
      ttsConfig.speechSynthesisLanguage = this.widget.state.language;
      // Use Swara for Hindi (best female voice), Jenny for English
      ttsConfig.speechSynthesisVoiceName = this.widget.state.language === 'hi-IN' 
        ? 'hi-IN-SwaraNeural' 
        : 'en-US-JennyNeural';
      
      const audioConfigTTS = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
      this.synthesizer = new SpeechSDK.SpeechSynthesizer(ttsConfig, audioConfigTTS);
      
      this.widget.log('✅ [Speech] Azure Speech initialized');
      return true;
    } catch (error) {
      this.widget.log('❌ [Speech] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Start recognition
   */
  async start() {
    const initialized = await this.initializeAzureSpeech();
    
    if (initialized) {
      const message = this.widget.state.language === 'hi-IN' 
        ? 'वॉयस नेविगेशन चालू है' 
        : 'Voice navigation is on';
      this.speak(message);
    } else {
      this.speak('Unable to start voice navigation');
      this.widget.setState({ isListening: false });
    }
  }

  /**
   * Stop recognition
   */
  stop() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync(
        () => {
          this.recognizer.close();
          this.recognizer = null;
          this.widget.log('✅ [Speech] Recognition stopped');
        },
        (err) => {
          this.widget.log('❌ [Speech] Failed to stop recognition:', err);
        }
      );
    }
    
    if (this.synthesizer) {
      this.synthesizer.close();
      this.synthesizer = null;
    }
    
    this.widget.setState({ transcript: '' });
  }

  /**
   * Speak text (lines 874-884)
   */
  speak(text) {
    if (!this.widget.state.voiceEnabled) {
      this.widget.log('🔇 [Speech] Voice feedback disabled');
      return;
    }
    
    if (this.synthesizer) {
      this.widget.log('🔊 [Speaking]', text);
      this.synthesizer.speakTextAsync(
        text,
        () => {
          this.widget.log('✅ [Speech] Synthesis complete');
        },
        (error) => {
          this.widget.log('❌ [Speech] Synthesis error:', error);
        }
      );
    } else {
      this.widget.log('⚠️ [Speech] Synthesizer not initialized');
    }
  }

  /**
   * Stop speaking (lines 886-891)
   */
  stopSpeaking() {
    // Azure will auto-stop on next speak
    const message = this.widget.state.language === 'hi-IN' ? 'रुक गया' : 'Stopped';
    this.speak(message);
  }

  /**
   * Reinitialize when language changes
   */
  async reinitialize() {
    this.widget.log('🔄 [Speech] Reinitializing for language change...');
    this.stop();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (this.widget.state.isListening) {
      await this.start();
    }
  }
}
