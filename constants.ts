import { ThemePreset } from './types';

export const THEMES = {
  [ThemePreset.CYBER]: {
    bg: '#ff00ff',
    text: '#000000',
    username: '#000080', // Navy Blue on Magenta
    headerStart: '#00ffff',
    headerEnd: '#0000ff',
    border: '#c0c0c0',
  },
  [ThemePreset.VAPORWAVE]: {
    bg: '#ff71ce',
    text: '#01cdfe',
    username: '#fffeb3', // Pale Yellow
    headerStart: '#05ffa1',
    headerEnd: '#b967ff',
    border: '#fffeb3',
  },
  [ThemePreset.MATRIX]: {
    bg: '#000000',
    text: '#00ff00',
    username: '#ffffff', // White on Black/Green
    headerStart: '#003300',
    headerEnd: '#008800',
    border: '#004400',
  },
  [ThemePreset.HOTDOG]: {
    bg: '#ffff00',
    text: '#000000',
    username: '#ff0000', // Red on Yellow
    headerStart: '#ff0000',
    headerEnd: '#ff0000',
    border: '#ffffff',
  },
  [ThemePreset.CUSTOM]: {
    bg: '#c0c0c0',
    text: '#000000',
    username: '#000080',
    headerStart: '#000080',
    headerEnd: '#1084d0',
    border: '#c0c0c0',
  },
};

export const PRONOUN_MOCK_MAP: Record<string, string> = {
  'user': 'They/Them',
  'streamer': 'She/Her',
  'mod_guy': 'He/Him',
};

// Default settings
export const DEFAULT_SETTINGS = {
  channel: '',
  layout: 'Stack',
  theme: 'Cyber Virus',
  maxMessages: 10,
  messageTimeout: 30,
  showPronouns: true,
  showAvatars: true,
  forceUsernameColor: false, // Default to using Twitch colors
  customColors: THEMES[ThemePreset.CYBER],
};