/**
 * API Manager - Handle API calls for both hosted and custom modes
 */

export class ApiManager {
  constructor(widget) {
    this.widget = widget;
    this.config = widget.config;
  }

  /**
   * Get Azure Speech credentials
   */
  async getAzureSpeechCredentials() {
    if (this.config.mode === 'custom') {
      // Custom mode: use provided credentials
      return {
        token: this.config.azureSpeech.key,
        region: this.config.azureSpeech.region,
        success: true
      };
    }
    
    // Hosted mode: fetch from API
    try {
      const response = await fetch(`${this.config.apiBase}/azure-speech`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      this.widget.log('❌ [API] Failed to get Azure Speech credentials:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process voice command with AI
   */
  async processVoiceCommand(command, domAnalysis, currentUrl) {
    if (this.config.mode === 'custom') {
      // Custom mode: call Azure OpenAI directly
      return await this.processCommandWithCustomAI(command, domAnalysis, currentUrl);
    }
    
    // Hosted mode: use backend API
    return await this.processCommandWithHostedAI(command, domAnalysis, currentUrl);
  }

  /**
   * Process command with hosted AI (default)
   */
  async processCommandWithHostedAI(command, domAnalysis, currentUrl) {
    try {
      const requestBody = {
        command,
        language: this.widget.state.language,
        currentUrl: currentUrl || window.location.href
      };

      if (this.widget.state.useDynamicMode && domAnalysis) {
        requestBody.domAnalysis = domAnalysis;
        this.widget.log('✨ [Dynamic Mode] Sending DOM analysis:', {
          forms: domAnalysis.forms.length,
          navigation: domAnalysis.navigation.length,
          interactions: domAnalysis.interactions.length
        });
      }

      this.widget.log('📡 [API Call] Sending to /api/voice-ai...');
      
      const response = await fetch(`${this.config.apiBase}/voice-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      this.widget.log('📥 [API Response]', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        this.widget.log('🤖 [AI Response]', data);
        return data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        this.widget.log('❌ [API Error]', errorData);
        throw new Error('AI request failed');
      }
    } catch (error) {
      this.widget.log('💥 [Error]', error);
      throw error;
    }
  }

  /**
   * Process command with custom Azure OpenAI credentials
   */
  async processCommandWithCustomAI(command, domAnalysis, currentUrl) {
    try {
      const { azureOpenAI } = this.config;
      
      // Build system prompt based on DOM analysis
      const systemPrompt = this.buildSystemPrompt(this.widget.state.language, domAnalysis);
      
      // Build context
      const contextInfo = this.buildContext(currentUrl, domAnalysis);
      
      // Build messages
      const messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${contextInfo}\n\nUser said: "${command}"\n\nWhat should I do?`
        }
      ];
      
      // Call Azure OpenAI
      const apiUrl = `${azureOpenAI.endpoint}/openai/deployments/${azureOpenAI.deployment}/chat/completions?api-version=2024-08-01-preview`;
      
      this.widget.log('📡 [Custom AI] Calling Azure OpenAI directly...');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureOpenAI.apiKey
        },
        body: JSON.stringify({
          messages,
          temperature: 0.7,
          max_tokens: 250,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        this.widget.log('❌ [Custom AI Error]', error);
        throw new Error('Custom AI request failed');
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);

      // Ensure response has all required fields
      return {
        action: aiResponse.action || 'chat',
        parameters: aiResponse.parameters || {},
        response: aiResponse.response || '',
        context: aiResponse.context || null,
        confirmAction: aiResponse.confirmAction || false,
        confidence: aiResponse.confidence || 0.7
      };
    } catch (error) {
      this.widget.log('💥 [Custom AI Error]', error);
      throw error;
    }
  }

  /**
   * Build system prompt (simplified version from route.ts)
   */
  buildSystemPrompt(language, domAnalysis) {
    const isHindi = language === 'hi-IN';
    
    const formsInfo = domAnalysis?.forms?.length > 0 
      ? domAnalysis.forms.map((f, i) => {
          const fieldDetails = f.fields?.map(field => 
            `${field.label || field.name || field.placeholder || field.type}`
          ).join(', ');
          return `Form ${i + 1}: ${f.fields?.length || 0} fields (${fieldDetails})`;
        }).join('\n')
      : 'No forms on this page';
      
    const navInfo = domAnalysis?.navigation?.length > 0
      ? `Navigation options: ${domAnalysis.navigation.slice(0, 10).map(n => n.text).filter(t => t).join(', ')}`
      : 'No navigation menu detected';
    
    if (isHindi) {
      return `आप एक intelligent voice assistant हैं। Available actions: scroll, navigate, back, forward, refresh, zoom, click, fill_form, read, chat. Response format (JSON): {"action": "exact_action_name", "parameters": {}, "response": "user को friendly message", "confidence": 0.0-1.0}. Page analysis: ${formsInfo}. Navigation: ${navInfo}.`;
    }
    
    return `You are an intelligent voice assistant. Available actions: scroll, navigate, back, forward, refresh, zoom, click, fill_form, read, chat. Response format (JSON): {"action": "exact_action_name", "parameters": {}, "response": "friendly message", "confidence": 0.0-1.0}. Page analysis: ${formsInfo}. Navigation: ${navInfo}.`;
  }

  /**
   * Build context
   */
  buildContext(url, domAnalysis) {
    let context = `Current page: ${url}\nPage title: ${domAnalysis?.pageInfo?.title || 'Unknown'}\n\n`;
    
    if (domAnalysis) {
      context += `DOM Analysis:\n`;
      context += `- Forms: ${domAnalysis.forms?.length || 0}\n`;
      context += `- Navigation elements: ${domAnalysis.navigation?.length || 0}\n`;
      context += `- Interactive elements: ${domAnalysis.interactions?.length || 0}\n`;
    }
    
    return context;
  }
}
