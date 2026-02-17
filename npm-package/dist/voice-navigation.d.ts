/**
 * TypeScript definitions for @liaplus/voice-navigation
 */

export interface VoiceNavigationConfig {
  /**
   * Base URL for LiaPlus API endpoints
   * @default 'https://liaplus.com/api'
   */
  apiBase?: string;

  /**
   * Language for voice recognition and synthesis
   * @default 'en-US'
   */
  language?: 'en-US' | 'hi-IN';

  /**
   * Auto-start listening on initialization
   * @default true
   */
  autoStart?: boolean;

  /**
   * Enable debug logging to console
   * @default true
   */
  debug?: boolean;
}

export interface DOMAnalysis {
  forms: FormStructure[];
  navigation: NavigationElement[];
  interactions: InteractableElement[];
  landmarks: Landmark[];
  pageInfo: PageInfo;
}

export interface FormStructure {
  id: string;
  action: string;
  method: string;
  fields: FormField[];
  buttons: FormButton[];
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  label: string | null;
  placeholder: string | null;
  required: boolean;
  value: string;
  index: number;
}

export interface FormButton {
  type: string;
  text: string;
  id: string;
  name: string;
}

export interface NavigationElement {
  type: 'link' | 'button' | 'menu';
  text: string;
  href?: string;
  id?: string;
}

export interface InteractableElement {
  type: 'button' | 'link' | 'input';
  text: string;
  id?: string;
  clickable: boolean;
  selector: string;
}

export interface Landmark {
  role: string;
  label?: string;
  element: string;
}

export interface PageInfo {
  title: string;
  url: string;
  language: string;
}

export interface LiaPlusVoiceAPI {
  /**
   * Current version of the library
   */
  readonly version: string;

  /**
   * Initialize voice navigation
   * @param config Configuration options
   */
  init(config?: VoiceNavigationConfig): void;

  /**
   * Start voice recognition
   */
  start(): void;

  /**
   * Stop voice recognition
   */
  stop(): void;

  /**
   * Re-analyze current page structure
   */
  analyzePage(): void;
}

declare global {
  interface Window {
    LiaPlusVoice: LiaPlusVoiceAPI;
  }
}

export const LiaPlusVoice: LiaPlusVoiceAPI;
export default LiaPlusVoice;
