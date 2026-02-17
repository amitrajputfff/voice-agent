/**
 * LiaPlus Voice Navigation Plugin TypeScript Definitions
 * @version 1.0.0
 */

declare namespace LiaPlusVoice {
  /**
   * Voice plugin configuration options
   */
  interface VoicePluginOptions {
    /** Language for speech recognition and synthesis */
    language?: 'en-US' | 'hi-IN';
    /** UI position */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Theme mode */
    theme?: 'light' | 'dark' | 'auto';
    /** Custom routes for navigation */
    routes?: Record<string, string>;
    /** Custom commands mapping */
    customCommands?: Record<string, string>;
    /** Enable offline mode (default: true) */
    offline?: boolean;
    /** Callback when command is executed */
    onCommand?: (data: CommandResult) => void;
    /** Error callback */
    onError?: (error: Error) => void;
  }

  /**
   * Command execution result
   */
  interface CommandResult {
    /** Action name */
    action: string;
    /** Action parameters */
    parameters?: Record<string, any>;
    /** Response text */
    response: string;
    /** Context for next turn */
    context: string | null;
    /** Whether action requires confirmation */
    confirmAction?: boolean;
    /** Whether response was generated offline */
    offline?: boolean;
  }

  /**
   * Page structure data
   */
  interface PageStructure {
    /** Page headings */
    headings: Heading[];
    /** ARIA landmarks */
    landmarks: Landmark[];
    /** Page links */
    links: Link[];
    /** Page forms */
    forms: Form[];
    /** Last parsed timestamp */
    lastParsed: number;
  }

  interface Heading {
    level: number;
    text: string;
    id: string | null;
    element: HTMLElement;
    index: number;
  }

  interface Landmark {
    role: string;
    label: string | null;
    element: HTMLElement;
  }

  interface Link {
    text: string;
    href: string;
    element: HTMLAnchorElement;
    index: number;
  }

  interface Form {
    id: string;
    action: string | null;
    method: string;
    fields: FormField[];
    element: HTMLFormElement;
  }

  interface FormField {
    type: string;
    name: string | null;
    label: string;
    required: boolean;
    element: HTMLElement;
  }

  /**
   * Voice Navigation Plugin class
   */
  class VoiceNavigationPlugin {
    constructor(options?: VoicePluginOptions);
    
    /** Initialize the plugin */
    init(): Promise<boolean>;
    
    /** Start listening for voice commands */
    startListening(): void;
    
    /** Stop listening */
    stopListening(): void;
    
    /** Set language */
    setLanguage(language: 'en-US' | 'hi-IN'): void;
    
    /** Process a command programmatically */
    processCommand(command: string): Promise<CommandResult>;
    
    /** Destroy the plugin */
    destroy(): void;
    
    /** Whether plugin is initialized */
    isInitialized: boolean;
    
    /** Whether currently listening */
    isListening: boolean;
    
    /** Accessibility features instance */
    accessibility: AccessibilityFeatures;
    
    /** Page parser instance */
    parser: PageParser;
    
    /** Content reader instance */
    reader: ContentReader;
  }

  /**
   * Page parser class
   */
  class PageParser {
    /** Parse page structure */
    parse(forceRefresh?: boolean): PageStructure;
    
    /** Extract headings */
    extractHeadings(): Heading[];
    
    /** Extract landmarks */
    extractLandmarks(): Landmark[];
    
    /** Extract links */
    extractLinks(): Link[];
    
    /** Extract forms */
    extractForms(): Form[];
    
    /** Get main content element */
    getMainContent(): HTMLElement;
    
    /** Get page content as text */
    getPageContent(): string;
  }

  /**
   * Content reader class
   */
  class ContentReader {
    constructor(synthesizer: any, language?: string);
    
    /** Set language */
    setLanguage(lang: string): void;
    
    /** Set reading speed (0.5 - 2.0) */
    setSpeed(speed: number): void;
    
    /** Read entire page */
    readPage(): Promise<void>;
    
    /** Read next section */
    readNext(): Promise<void>;
    
    /** Read previous section */
    readPrevious(): Promise<void>;
    
    /** Pause reading */
    pause(): void;
    
    /** Resume reading */
    resume(): void;
    
    /** Stop reading */
    stop(): void;
    
    /** Speak text */
    speak(text: string): Promise<void>;
    
    /** Announce element */
    announceElement(element: HTMLElement): Promise<void>;
    
    /** Current reading state */
    isReading: boolean;
    isPaused: boolean;
    speed: number;
    language: string;
  }

  /**
   * Action executor class
   */
  class ActionExecutor {
    constructor(reader: ContentReader, parser: PageParser, options?: any);
    
    /** Execute action */
    execute(action: string, parameters?: Record<string, any>): Promise<boolean>;
    
    /** Go to heading by text */
    goToHeading(targetText: string): Promise<void>;
    
    /** Click link by text */
    clickLink(targetText: string): Promise<void>;
    
    /** Search page for text */
    searchPage(searchText: string): Promise<void>;
    
    /** Describe page structure */
    describePage(): Promise<void>;
    
    /** List headings */
    listHeadings(): Promise<void>;
    
    /** List links */
    listLinks(): Promise<void>;
    
    /** List landmarks */
    listLandmarks(): Promise<void>;
  }

  /**
   * Initialize voice plugin
   */
  function init(options?: VoicePluginOptions): VoiceNavigationPlugin;

  /** Plugin version */
  const VERSION: string;
}

/**
 * Accessibility Features namespace
 */
declare namespace LiaPlusAccessibility {
  interface AccessibilitySettings {
    dyslexiaFont: boolean;
    adhdMode: boolean;
    bigCursor: boolean;
    textSize: 'default' | 'large' | 'extra-large';
    lineHeight: 'default' | 'medium' | 'large';
    saturation: number;
    invertColors: boolean;
    highlightLinks: boolean;
    pauseAnimations: boolean;
    hideImages: boolean;
  }

  /**
   * Accessibility features class
   */
  class AccessibilityFeatures {
    /** Current settings */
    settings: AccessibilitySettings;
    
    /** Toggle dyslexia-friendly font */
    toggleDyslexiaFont(): void;
    enableDyslexiaFont(): void;
    disableDyslexiaFont(): void;
    
    /** Toggle ADHD focus mode */
    toggleADHDMode(): void;
    enableADHDMode(): void;
    disableADHDMode(): void;
    
    /** Toggle big cursor */
    toggleBigCursor(): void;
    enableBigCursor(): void;
    disableBigCursor(): void;
    
    /** Set text size */
    setTextSize(size: 'default' | 'large' | 'extra-large'): void;
    increaseTextSize(): void;
    decreaseTextSize(): void;
    
    /** Set line height */
    setLineHeight(height: 'default' | 'medium' | 'large'): void;
    
    /** Set color saturation (0-200) */
    setSaturation(value: number): void;
    
    /** Invert colors */
    invertColors(enable: boolean): void;
    toggleInvertColors(): void;
    
    /** Highlight links */
    highlightLinks(enable: boolean): void;
    toggleHighlightLinks(): void;
    
    /** Pause animations */
    pauseAnimations(enable: boolean): void;
    togglePauseAnimations(): void;
    
    /** Hide images */
    hideImages(enable: boolean): void;
    toggleHideImages(): void;
    
    /** Reset all settings */
    resetAll(): void;
    
    /** Get current settings */
    getSettings(): AccessibilitySettings;
  }
}

declare global {
  interface Window {
    LiaPlusVoice: typeof LiaPlusVoice;
    LiaPlusAccessibility: typeof LiaPlusAccessibility;
  }
}

export = LiaPlusVoice;
export as namespace LiaPlusVoice;
