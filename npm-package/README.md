# @amittrrajputtt/voice-navigation-ai

[![npm version](https://img.shields.io/npm/v/@amittrrajputtt/voice-navigation-ai.svg)](https://www.npmjs.com/package/@amittrrajputtt/voice-navigation-ai)
[![npm downloads](https://img.shields.io/npm/dm/@amittrrajputtt/voice-navigation-ai.svg)](https://www.npmjs.com/package/@amittrrajputtt/voice-navigation-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Universal AI-powered voice navigation for any website. No configuration required.**

Add voice control to your website with just 2 lines of code. Works on any site - e-commerce, forms, blogs, web apps. Powered by Azure OpenAI (GPT-4) and Azure Speech Services.

## ✨ Features

- 🎯 **Zero Configuration** - Works on any website out of the box
- 🧠 **AI-Powered** - GPT-4 understands natural language commands
- 📝 **Dynamic Form Filling** - Automatically detects and fills any form
- 🖱️ **Smart Element Detection** - Finds buttons, links, and inputs intelligently
- 🌍 **Multi-Language** - English (en-US) and Hindi (hi-IN)
- ♿ **Accessibility First** - Helps users with mobility or visual impairments
- 🔒 **Privacy Focused** - All credentials server-side, no data storage
- 📦 **Tiny Bundle** - ~50KB gzipped

## 🚀 Quick Start

### Installation

```bash
npm install @amittrrajputtt/voice-navigation-ai
```

Or via CDN:

```html
<script src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai@latest/dist/voice-navigation.js"></script>
```

### Usage

#### Simple (Use LiaPlus API - Recommended)

```html
<script src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai"></script>
<script>
  // That's it! No credentials needed
  LiaPlusVoice.init();
</script>
```

#### Custom Configuration

```html
<script src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai"></script>
<script>
  LiaPlusVoice.init({
    apiBase: 'https://liaplus.com/api',  // Your API base URL
    language: 'en-US',                    // 'en-US' or 'hi-IN'
    autoStart: true,                      // Auto-start on load
    debug: false                          // Disable console logs
  });
</script>
```

#### With Module Bundlers (Webpack, Vite, etc.)

```javascript
import '@amittrrajputtt/voice-navigation-ai';

// Initialize when ready
document.addEventListener('DOMContentLoaded', () => {
  window.LiaPlusVoice.init({
    language: 'en-US'
  });
});
```

#### React

```jsx
import { useEffect } from 'react';
import '@amittrrajputtt/voice-navigation-ai';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.LiaPlusVoice) {
      window.LiaPlusVoice.init({
        language: 'en-US',
        autoStart: true
      });
    }
  }, []);

  return <div>Your app content</div>;
}
```

#### Next.js

```jsx
// app/layout.tsx or pages/_app.tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai"
          strategy="afterInteractive"
          onLoad={() => {
            window.LiaPlusVoice?.init();
          }}
        />
      </body>
    </html>
  );
}
```

## 🎤 Voice Commands

Once activated, users can say:

### Form Filling
- "Fill my name as John Smith"
- "Enter email as john@example.com"
- "Set phone number as 555-1234"

### Navigation
- "Scroll down"
- "Go to top"
- "Go back"
- "Click submit button"

### Content
- "Read the page"
- "Read this to me"

### Hindi Commands
- "मेरा नाम राज भरें"
- "नीचे स्क्रॉल करें"
- "सबमिट बटन पर क्लिक करें"

## 🔧 API Reference

### `LiaPlusVoice.init(config?)`

Initialize voice navigation with optional configuration.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiBase` | string | `'https://liaplus.com/api'` | Base URL for API endpoints |
| `language` | string | `'en-US'` | Language code (`'en-US'` or `'hi-IN'`) |
| `autoStart` | boolean | `true` | Auto-start listening on initialization |
| `debug` | boolean | `true` | Enable console logging |

**Example:**

```javascript
LiaPlusVoice.init({
  language: 'hi-IN',
  autoStart: false,
  debug: false
});
```

### `LiaPlusVoice.start()`

Start voice recognition manually.

```javascript
LiaPlusVoice.start();
```

### `LiaPlusVoice.stop()`

Stop voice recognition.

```javascript
LiaPlusVoice.stop();
```

### `LiaPlusVoice.analyzePage()`

Re-analyze the current page structure (useful after dynamic content loads).

```javascript
// After loading dynamic content
loadMoreContent().then(() => {
  LiaPlusVoice.analyzePage();
});
```

## 🎨 UI Customization

The library creates a floating voice button. Customize it with CSS:

```css
/* Change button color */
#liaplus-voice-button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
}

/* Change position */
#liaplus-voice-widget {
  bottom: 80px !important;
  left: 20px !important;
  right: auto !important;
}

/* Change size */
#liaplus-voice-button {
  width: 70px !important;
  height: 70px !important;
  font-size: 28px !important;
}

/* Hide button completely (use programmatic API instead) */
#liaplus-voice-widget {
  display: none !important;
}
```

## 🔐 Self-Hosting (Advanced)

To use your own API endpoints instead of LiaPlus servers:

### 1. Set up API endpoints

You need three endpoints:

- `GET /api/voice-credentials` - Returns temporary Azure Speech tokens
- `POST /api/voice-synthesize` - Text-to-speech conversion
- `POST /api/voice-ai` - AI command processing

Example implementations available in our [GitHub repo](https://github.com/liaplus/voice-navigation).

### 2. Configure the library

```javascript
LiaPlusVoice.init({
  apiBase: 'https://your-domain.com/api'
});
```

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome 75+ | ✅ Full support |
| Edge 79+ | ✅ Full support |
| Safari 14.1+ | ✅ Full support |
| Firefox 125+ | ⚠️ Limited |
| Chrome Android | ✅ Full support |
| Safari iOS | ⚠️ Limited |

**Note:** Requires HTTPS (or localhost for development).

## 🐛 Troubleshooting

### Microphone not working?
- Ensure HTTPS (required for microphone access)
- Check browser permissions
- Test on a supported browser

### Commands not executing?
- Check browser console for errors
- Verify API endpoints are accessible
- Enable `debug: true` to see detailed logs

### "Failed to fetch credentials" error?
- Verify API base URL is correct
- Check CORS headers on your API
- Ensure API endpoints are publicly accessible

## 📊 TypeScript Support

Full TypeScript definitions included:

```typescript
import type { VoiceNavigationConfig, DOMAnalysis } from '@liaplus/voice-navigation';

const config: VoiceNavigationConfig = {
  language: 'en-US',
  autoStart: true
};

window.LiaPlusVoice.init(config);
```

## 🔒 Security & Privacy

- **Server-side credentials** - Azure keys never exposed to client
- **Short-lived tokens** - Auto-refresh every 9 minutes
- **No data storage** - All processing in real-time
- **HTTPS required** - Ensures secure communication
- **CORS-enabled** - But rate-limited on server

## 💰 Pricing

### Free Tier
- 100 commands/month per domain
- Community support
- All features included

### Pro ($49/month)
- 10,000 commands/month
- Priority support
- Custom branding
- Analytics dashboard

### Enterprise (Custom)
- Unlimited commands
- SLA guarantee
- Dedicated support
- Self-hosted option

[View Pricing Details](https://liaplus.com/pricing)

## 📚 Examples

### E-commerce Checkout

```html
<!-- Customers can say: "Fill shipping address", "Enter card number", etc. -->
<script src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai"></script>
<script>
  LiaPlusVoice.init({ language: 'en-US' });
</script>
```

### Government Forms

```html
<!-- Citizens can fill complex forms by voice -->
<script src="https://unpkg.com/@amittrrajputtt/voice-navigation-ai"></script>
<script>
  LiaPlusVoice.init({ 
    language: 'hi-IN',  // Hindi for Indian users
    autoStart: true 
  });
</script>
```

### React SPA

```jsx
import { useEffect } from 'react';
import '@amittrrajputtt/voice-navigation-ai';

export default function VoiceEnabledApp() {
  useEffect(() => {
    window.LiaPlusVoice?.init({
      language: 'en-US',
      debug: process.env.NODE_ENV === 'development'
    });

    return () => {
      window.LiaPlusVoice?.stop();
    };
  }, []);

  return <YourApp />;
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website:** [https://liaplus.com](https://liaplus.com)
- **NPM:** [https://www.npmjs.com/package/@amittrrajputtt/voice-navigation-ai](https://www.npmjs.com/package/@amittrrajputtt/voice-navigation-ai)
- **GitHub:** [https://github.com/amittrrajputtt/voice-navigation-ai](https://github.com/amittrrajputtt/voice-navigation-ai)
- **Support:** [support@liaplus.com](mailto:support@liaplus.com)

## ⭐ Show Your Support

If you find this library helpful, please give it a star on [GitHub](https://github.com/amittrrajputtt/voice-navigation-ai)!

---

Made with ❤️ by [LiaPlus Technologies](https://liaplus.com)
