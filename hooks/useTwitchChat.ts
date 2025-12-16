import { useState, useEffect, useRef, useCallback } from 'react';
import tmi from 'tmi.js';
import { ChatMessage, AppSettings } from '../types';
import { generateId, getRandomPosition } from '../utils/random';

// Simple in-memory caches
const pronounCache: Record<string, string> = {};
const avatarCache: Record<string, string> = {};

export const useTwitchChat = (settings: AppSettings) => {
  const [messages, setMessages] = useState<(ChatMessage & { x?: number, y?: number, rot?: number })[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<tmi.Client | null>(null);
  const msgCounter = useRef(0);

  // Sound effect for new messages
  const playPopSound = () => {
     // Optional: Implement audio context beep
  };

  // Helper to fetch pronouns
  const getPronouns = async (username: string): Promise<string | undefined> => {
    const lowerUser = username.toLowerCase();
    if (pronounCache[lowerUser]) return pronounCache[lowerUser];

    try {
      const res = await fetch(`https://pronouns.alejo.io/api/users/${lowerUser}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const p = data[0];
          const formatted = `${p.subject}/${p.object}`;
          pronounCache[lowerUser] = formatted;
          return formatted;
        }
      }
    } catch (e) {
      // Silently fail
    }
    return undefined;
  };

  // Helper to fetch Avatar URL
  const getAvatar = async (username: string): Promise<string | undefined> => {
    const lowerUser = username.toLowerCase();
    if (avatarCache[lowerUser]) return avatarCache[lowerUser];

    try {
      // DecAPI returns the raw text URL of the avatar
      const res = await fetch(`https://decapi.me/twitch/avatar/${lowerUser}`);
      if (res.ok) {
        const url = await res.text();
        // Check if response is a URL and not an error message
        if (url && url.startsWith('http') && !url.includes('not found')) {
          avatarCache[lowerUser] = url;
          return url;
        }
      }
    } catch (e) {
      console.error('Avatar fetch failed', e);
    }
    // Fallback: Return undefined to let UI handle it or use a default
    return undefined;
  };

  const addMessage = useCallback(async (msg: Omit<ChatMessage, 'sequenceNumber'>) => {
    // 1. Fetch Pronouns
    if (settings.showPronouns && msg.type === 'message' && !msg.pronouns && msg.username !== 'System') {
       const fetchedPronouns = await getPronouns(msg.username);
       if (fetchedPronouns) {
         msg.pronouns = fetchedPronouns;
       }
    }

    // 2. Fetch Avatar
    if (settings.showAvatars && msg.username !== 'System' && !msg.avatarUrl) {
      const fetchedAvatar = await getAvatar(msg.username);
      if (fetchedAvatar) {
        msg.avatarUrl = fetchedAvatar;
      } else {
        // Fallback to pixel art if fetch fails
        msg.avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${msg.username}`;
      }
    }

    // Increment global counter
    msgCounter.current += 1;
    const currentSequence = msgCounter.current;

    setMessages((prev) => {
      // Create position metadata for scatter mode immediately upon creation
      const pos = getRandomPosition(window.innerWidth, window.innerHeight, 350, 150);
      
      const newMsg = { 
        ...msg, 
        sequenceNumber: currentSequence,
        x: pos.left, 
        y: pos.top, 
        rot: pos.rotation 
      };
      const newList = [...prev, newMsg];
      
      if (newList.length > settings.maxMessages) {
        return newList.slice(newList.length - settings.maxMessages);
      }
      return newList;
    });
    playPopSound();
  }, [settings.maxMessages, settings.showPronouns, settings.showAvatars]);

  // Connection Effect
  useEffect(() => {
    if (!settings.channel) return;

    const client = new tmi.Client({
      channels: [settings.channel],
    });

    client.connect().then(() => {
      setIsConnected(true);
      addMessage({
        id: generateId(),
        username: 'System',
        message: `Connected to #${settings.channel}... Protocol Y2K Initiated.`,
        type: 'alert',
        timestamp: Date.now(),
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=system`,
      });
    }).catch(console.error);

    client.on('message', (channel, tags, message, self) => {
      if (self) return;

      const isAlert = tags['msg-id'] === 'sub' || tags['msg-id'] === 'resub';
      const badges = tags.badges || {};
      const username = tags['display-name'] || tags.username || 'Anonymous';
      
      addMessage({
        id: tags.id || generateId(),
        username: username,
        message: message,
        color: tags.color,
        // Don't set avatarUrl here; let addMessage fetch it async
        isMod: tags.mod || false,
        isSubscriber: tags.subscriber || false,
        isBroadcaster: badges.broadcaster === '1',
        isVip: badges.vip === '1',
        badges: badges,
        type: isAlert ? 'alert' : 'message',
        alertType: isAlert ? 'sub' : undefined,
        timestamp: Number(tags['tmi-sent-ts']) || Date.now(),
      });
    });

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
      setIsConnected(false);
    };
  }, [settings.channel, addMessage]);

  // Cleanup Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => prev.filter(msg => (now - msg.timestamp) < (settings.messageTimeout * 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.messageTimeout]);

  // Demo Mode trigger
  const triggerDemoMessage = () => {
    const users = ['NeonHacker', 'CyberPunk99', 'GlitchQueen', 'RetroGamer'];
    const texts = [
      'Wow this overlay is sick!',
      'Can you play some synthwave?',
      'PogChamp PogChamp',
      'Is this Windows 95??',
      'ERROR 404: Chill vibes not found.',
      'Alert: Coolness overload.'
    ];
    const user = users[Math.floor(Math.random() * users.length)];
    const text = texts[Math.floor(Math.random() * texts.length)];
    
    // Simulate some badges
    const demoBadges: Record<string, string> = {};
    if (Math.random() > 0.7) demoBadges.subscriber = '1';
    if (Math.random() > 0.9) demoBadges.broadcaster = '1';
    if (Math.random() > 0.8) demoBadges.vip = '1';

    addMessage({
      id: generateId(),
      username: user,
      message: text,
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      // Provide explicit fallback for demo users so we don't spam API
      avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user}`,
      type: Math.random() > 0.9 ? 'alert' : 'message',
      alertType: 'sub',
      badges: demoBadges,
      isBroadcaster: !!demoBadges.broadcaster,
      isSubscriber: !!demoBadges.subscriber,
      isVip: !!demoBadges.vip,
      pronouns: ['He/Him', 'She/Her', 'They/Them'][Math.floor(Math.random() * 3)],
      timestamp: Date.now(),
    });
  };

  return { messages, isConnected, triggerDemoMessage, setMessages };
};