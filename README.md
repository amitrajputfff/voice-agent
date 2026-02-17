# 🎤 LiaPlus Voice Navigation Widget

AI-powered voice navigation widget that works on any website. Enable hands-free browsing with natural language commands.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/liaplus/voice-widget)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

- **🤖 AI-Powered:** Understands natural language, not just keywords
- **🌍 Multi-language:** English and Hindi support
- **📱 Responsive:** Works on desktop and mobile browsers
- **🎯 Dynamic DOM Analysis:** Automatically detects forms, buttons, and navigation
- **🔊 Voice Feedback:** Speaks responses back to you
- **💾 Persistent State:** Remembers settings across sessions
- **🎨 Customizable:** Easy to style and configure
- **🚀 Lightweight:** ~170-220KB gzipped bundle

## 🚀 Quick Start

### 3-Line Integration

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/liaplus/voice-widget@1.0.0/cdn/dist/voice-widget.css">
<script src="https://cdn.jsdelivr.net/gh/liaplus/voice-widget@1.0.0/cdn/dist/voice-widget.min.js"></script>
<script>
  LiaPlusVoice.init({ apiBase: 'https://liaplus.com/api' });
</script>
```

That's it! The voice navigation widget is now active on your website.

## 📖 Usage

### Basic Configuration

```javascript
LiaPlusVoice.init({
  // Required: API endpoint (uses hosted service)
  apiBase: 'https://liaplus.com/api',
  
  // Optional: Language selection
  language: 'en-US', // 'en-US' or 'hi-IN'
  
  // Optional: Auto-start listening on page load
  autoStart: false,
  
  // Optional: Enable debug logging
  debug: true
});
```

### Custom Azure Credentials

For enterprise users or custom deployments:

```javascript
LiaPlusVoice.init({
  mode: 'custom',
  azureOpenAI: {
    endpoint: 'https://your-resource.openai.azure.com/',
    apiKey: 'YOUR_OPENAI_API_KEY',
    deployment: 'gpt-4o'
  },
  azureSpeech: {
    key: 'YOUR_SPEECH_API_KEY',
    region: 'eastus'
  },
  language: 'en-US'
});
```

**⚠️ Security Warning:** Never expose API keys in production client-side code. Use a secure backend proxy.

## 🎯 Voice Commands

### Navigation
- "Scroll down" / "Scroll up"
- "Go to the top" / "Go to the bottom"
- "Go back" / "Go forward"
- "Refresh the page"
- "Navigate to [page name]"

### Forms & Interactions
- "Fill my email as john@example.com"
- "Enter name as John Smith"
- "Fill message as Hello world"
- "Click [button name]"
- "Submit the form"

### Zoom
- "Zoom in" / "Zoom out"
- "Reset zoom"

### Content
- "Read the page"
- "Stop reading"

### Conversational
- "Tell me about [topic]"
- "What is this page about?"
- "How much does it cost?"

The AI understands natural language, so feel free to phrase commands naturally!

## 📚 API Reference

### Initialization

#### `LiaPlusVoice.init(config)`

Initialize the widget with configuration options.

**Parameters:**
- `config` (Object): Configuration object

**Returns:** Widget instance

**Example:**
```javascript
const widget = LiaPlusVoice.init({
  apiBase: 'https://liaplus.com/api',
  language: 'en-US',
  autoStart: false,
  debug: true
});
```

### Control Methods

#### `LiaPlusVoice.start()`

Start voice recognition.

```javascript
LiaPlusVoice.start();
```

#### `LiaPlusVoice.stop()`

Stop voice recognition.

```javascript
LiaPlusVoice.stop();
```

#### `LiaPlusVoice.toggle()`

Toggle voice recognition on/off.

```javascript
LiaPlusVoice.toggle();
```

### Utility Methods

#### `LiaPlusVoice.analyzePage()`

Re-analyze the current page's DOM structure. Useful after dynamic content changes.

```javascript
LiaPlusVoice.analyzePage();
```

#### `LiaPlusVoice.updateConfig(newConfig)`

Update widget configuration without re-initialization.

```javascript
LiaPlusVoice.updateConfig({
  language: 'hi-IN',
  debug: false
});
```

#### `LiaPlusVoice.destroy()`

Remove the widget from the page and clean up resources.

```javascript
LiaPlusVoice.destroy();
```

### Information Methods

#### `LiaPlusVoice.getState()`

Get the current widget state.

**Returns:** State object

```javascript
const state = LiaPlusVoice.getState();
console.log(state.isListening); // true/false
console.log(state.language); // 'en-US' or 'hi-IN'
```

#### `LiaPlusVoice.getInstance()`

Get the internal widget instance for advanced usage.

**Returns:** Widget instance

```javascript
const instance = LiaPlusVoice.getInstance();
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiBase` | string | `'https://liaplus.com/api'` | Base URL for hosted API |
| `mode` | string | `'hosted'` | `'hosted'` or `'custom'` |
| `language` | string | `'en-US'` | `'en-US'` or `'hi-IN'` |
| `autoStart` | boolean | `false` | Auto-start listening on page load |
| `debug` | boolean | `true` | Enable console logging |
| `azureOpenAI` | object | - | Azure OpenAI config (custom mode) |
| `azureSpeech` | object | - | Azure Speech config (custom mode) |

### Azure OpenAI Config (Custom Mode)

```javascript
{
  endpoint: 'https://your-resource.openai.azure.com/',
  apiKey: 'YOUR_API_KEY',
  deployment: 'gpt-4o' // or 'gpt-4', 'gpt-35-turbo'
}
```

### Azure Speech Config (Custom Mode)

```javascript
{
  key: 'YOUR_SPEECH_KEY',
  region: 'eastus' // or your Azure region
}
```

## 🎨 Customization

### CSS Customization

Override default styles:

```css
/* Change button position */
.liaplus-voice-widget-root .fixed {
  bottom: 20px !important;
  right: 20px !important;
}

/* Change primary color */
.liaplus-voice-widget-root .bg-purple-100 {
  background-color: #your-color !important;
}

/* Hide commands overlay */
.liaplus-voice-widget-root .commands-overlay {
  display: none !important;
}
```

### Event Handling

```javascript
const widget = LiaPlusVoice.getInstance();

// Override setState to listen for changes
const originalSetState = widget.setState.bind(widget);
widget.setState = function(updates) {
  console.log('State changed:', updates);
  originalSetState(updates);
  
  // Custom logic
  if (updates.isListening) {
    console.log('Started listening');
  }
};
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with Web Speech API support

## 📦 Bundle Size

- Development build: ~250KB
- Production build: ~170-220KB (gzipped)
- CSS: ~15-20KB (gzipped)

## 🔒 Security & Privacy

### Hosted Mode (Default)
- Voice data processed through LiaPlus servers
- CORS-enabled API endpoints
- No data stored long-term
- HTTPS-only connections

### Custom Mode
- Direct Azure API calls from browser
- Your Azure subscription and credentials
- Full control over data processing
- Recommended for enterprise deployments

**Important:** Never expose API keys in production client-side code. Always use a secure backend proxy for custom mode.

## 🛠️ Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/liaplus/voice-widget.git
cd voice-widget/cdn

# Install dependencies
npm install

# Build development version
npm run build:dev

# Build production version
npm run build:prod

# Watch mode
npm run watch
```

### File Structure

```
cdn/
├── src/
│   ├── index.js              # Entry point
│   ├── VoiceWidget.js        # Main widget class
│   ├── UIComponents.js       # UI rendering
│   ├── CommandProcessor.js   # Command execution
│   ├── ApiManager.js         # API handling
│   ├── AudioManager.js       # Azure Speech SDK
│   ├── Icons.js              # SVG icons
│   └── styles.css            # Widget styles
├── dist/                      # Build output
├── examples/                  # Example HTML files
├── webpack.config.js          # Build configuration
└── package.json              # Dependencies
```

## 📝 Examples

Check the `examples/` directory for:

- **basic.html:** Simple integration example
- **custom-keys.html:** Custom Azure credentials
- **advanced.html:** Advanced configuration and API usage

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Documentation](https://docs.liaplus.com/voice-widget)
- [GitHub Repository](https://github.com/liaplus/voice-widget)
- [Live Demo](https://liaplus.com/demo/voice-widget)
- [Support](mailto:support@liaplus.com)

## 💡 Use Cases

- **Accessibility:** Enable hands-free navigation for users with disabilities
- **E-commerce:** Voice-guided shopping experiences
- **Customer Support:** Interactive voice-powered help centers
- **Education:** Accessible learning platforms
- **Enterprise:** Voice-enabled internal tools and dashboards

## 🆘 Troubleshooting

### Microphone Not Working
- Check browser permissions for microphone access
- Ensure HTTPS (required for Web Speech API)
- Try a different browser

### Commands Not Recognized
- Speak clearly and at normal pace
- Check language setting matches your speech
- View console logs with `debug: true`

### Widget Not Appearing
- Check that both CSS and JS are loaded
- Verify no CSP (Content Security Policy) blocking
- Open browser console for error messages

### API Errors
- Verify `apiBase` URL is correct
- Check CORS settings on your server
- Ensure Azure credentials are valid (custom mode)

## 📞 Support

- **Email:** support@liaplus.com
- **Documentation:** https://docs.liaplus.com
- **GitHub Issues:** https://github.com/liaplus/voice-widget/issues

---

Made with ❤️ by [LiaPlus](https://liaplus.com)
