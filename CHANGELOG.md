# Changelog

All notable changes to the LiaPlus Voice Navigation Widget will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-02-17

### Fixed
- Enhanced "Ask Me Anything" panel UI styling to match design specifications exactly
- Added sparkle icon to panel header for better visual consistency
- Improved responsive design and spacing across all UI components
- Fixed UI rendering issues on different screen sizes

### Changed
- Updated CDN deployment to include latest UI improvements
- Improved accessibility icon animations and visual feedback

## [1.0.0] - 2026-02-17

### Added
- Initial release of LiaPlus Voice Navigation Widget
- AI-powered voice command processing with Azure OpenAI
- Multi-language support (English and Hindi)
- Dynamic DOM analysis for automatic form and navigation detection
- Azure Speech SDK integration for STT and TTS
- Floating button UI with responsive design
- Settings panel with language selector and voice feedback toggle
- Commands overlay with contextual examples
- Recent command history tracking
- LocalStorage persistence for settings
- Hosted API mode (default) using LiaPlus backend
- Custom credentials mode for bring-your-own Azure
- Full CDN distribution via jsDelivr
- Comprehensive documentation and examples
- Dark mode support
- Mobile-responsive design
- Voice feedback with natural-sounding voices (Jenny for English, Swara for Hindi)

### Features
- Natural language understanding
- Form filling via voice commands
- Dynamic click detection
- Intelligent navigation mapping
- Scroll commands (up, down, top, bottom, middle)
- Zoom controls (in, out, reset)
- Browser navigation (back, forward, refresh)
- Page content reading
- Customizable styling via CSS
- Event handling and state management
- Complete API for programmatic control

### Technical
- Webpack 5 build system
- ES2018+ target
- Babel transpilation
- CSS extraction and minification
- Source maps for development
- UMD module format
- ~170-220KB gzipped bundle size
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Documentation
- Comprehensive README with API reference
- Basic integration example
- Custom credentials example
- Advanced configuration example
- Troubleshooting guide
- Security best practices

## [Unreleased]

### Planned Features
- NPM package distribution
- Additional language support (Spanish, French, German)
- Custom themes
- WordPress plugin wrapper
- Shopify app
- React/Vue/Angular component wrappers
- Analytics and usage tracking (opt-in)
- Offline mode with cached responses
- Custom command registration API
- Voice command macros
- Keyboard shortcuts
- Accessibility improvements (ARIA labels, screen reader support)

---

## Version History

### Version 1.0.0 (Current)
- First stable release
- Production-ready
- Full feature set as documented

---

For questions or suggestions about future releases, please open an issue on GitHub or contact support@liaplus.com.
