export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  avatarUrl?: string; // New: Twitch Avatar URL
  color?: string; // Username color
  isBroadcaster?: boolean;
  isMod?: boolean;
  isSubscriber?: boolean;
  isVip?: boolean;
  badges?: Record<string, string>; // Raw badge data from tmi.js
  pronouns?: string; // e.g. "He/Him"
  sequenceNumber: number; // To track "every 5th message"
  timestamp: number;
  type: 'message' | 'alert';
  alertType?: 'sub' | 'follow' | 'raid';
}

export enum LayoutMode {
  STACK = 'Stack',
  ZIGZAG = 'ZigZag',
  SCATTER = 'Scatter',
  SIDE_LEFT = 'All Left',
  SIDE_RIGHT = 'All Right',
}

export enum ThemePreset {
  CYBER = 'Cyber Virus',
  VAPORWAVE = 'Vaporwave',
  MATRIX = 'Matrix',
  HOTDOG = 'Hotdog Stand',
  CUSTOM = 'Custom',
}

export interface AppSettings {
  channel: string;
  layout: LayoutMode;
  theme: ThemePreset;
  maxMessages: number;
  messageTimeout: number; // in seconds
  showPronouns: boolean;
  showAvatars: boolean;
  forceUsernameColor: boolean; // New: Toggle to override twitch colors
  customColors: {
    bg: string;
    text: string;
    username: string; // New: Specific color for usernames
    headerStart: string;
    headerEnd: string;
    border: string;
  };
}