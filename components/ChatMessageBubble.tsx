import React, { useMemo } from 'react';
import { ChatMessage, AppSettings, ThemePreset } from '../types';
import { RetroWindow } from './RetroWindow';
import { THEMES } from '../constants';
import { Crown, Star, Shield, Diamond, Zap } from 'lucide-react';

interface ChatMessageBubbleProps {
  msg: ChatMessage;
  settings: AppSettings;
  style?: React.CSSProperties;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ msg, settings, style }) => {
  const themeColors = settings.theme === ThemePreset.CUSTOM 
    ? settings.customColors 
    : THEMES[settings.theme];

  // Determine title text based on role or alert
  const titleText = useMemo(() => {
    if (msg.type === 'alert') {
      return msg.alertType === 'sub' ? '!!! NEW SUBSCRIBER !!!' : 'SYSTEM ALERT';
    }
    return `MSG_ID: ${msg.id.slice(0, 4).toUpperCase()}`;
  }, [msg]);

  // Alert special styling
  const isAlert = msg.type === 'alert';
  const effectiveBg = isAlert ? '#ffff00' : themeColors.bg;
  const effectiveText = isAlert ? '#000000' : themeColors.text;
  
  // Every 5th message gets a pixel-resolve effect
  const isSpecialSequence = msg.sequenceNumber > 0 && msg.sequenceNumber % 5 === 0;

  // Render Badge Icons
  const renderBadges = () => {
    if (!msg.badges) return null;
    return (
      <div className="flex items-center gap-1 mr-1">
        {msg.badges.broadcaster && <Crown size={14} className="text-red-600 fill-red-600" />}
        {msg.badges.moderator && <Shield size={14} className="text-green-600 fill-green-600" />}
        {msg.badges.vip && <Diamond size={14} className="text-pink-500 fill-pink-500" />}
        {msg.badges.subscriber && <Star size={14} className="text-blue-600 fill-blue-600" />}
        {msg.badges.prime && <Zap size={14} className="text-purple-600 fill-purple-600" />}
      </div>
    );
  };

  // Resolve Username Color
  const usernameColor = settings.forceUsernameColor 
    ? themeColors.username 
    : (msg.color || themeColors.username);

  return (
    <RetroWindow
      title={titleText}
      bgColor={effectiveBg}
      textColor={effectiveText}
      headerStartColor={isAlert ? '#ff0000' : themeColors.headerStart}
      headerEndColor={isAlert ? '#800000' : themeColors.headerEnd}
      borderColor={themeColors.border}
      className={`transition-all duration-300 ease-out origin-center group 
        ${isAlert ? 'animate-bounce' : ''} 
        ${isSpecialSequence ? 'pixel-anim' : ''}
      `}
      style={{ 
        maxWidth: '420px', 
        minWidth: '280px',
        opacity: 0.95,
        ...style 
      }}
    >
      <div className="flex flex-col gap-1 relative overflow-hidden">
        {/* Decorative Grid Background for Bubble */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, #000 25%, #000 26%, transparent 27%, transparent 74%, #000 75%, #000 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #000 25%, #000 26%, transparent 27%, transparent 74%, #000 75%, #000 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="flex items-start justify-between border-b border-black/20 pb-1 mb-1 border-dashed relative z-10">
          <div className="flex items-center gap-2">
            
            {/* Real Avatar with Fallback */}
            {settings.showAvatars && msg.avatarUrl && (
              <div className="relative">
                <img 
                  src={msg.avatarUrl}
                  alt="avatar"
                  className="w-9 h-9 border-2 border-black bg-white object-cover"
                  onError={(e) => {
                    // Fallback to pixel art if the main image fails
                    e.currentTarget.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${msg.username}`;
                  }}
                />
                {/* Online indicator dot */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-black animate-pulse"></div>
              </div>
            )}

            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                {renderBadges()}
                <span 
                  className="font-bold text-lg tracking-tight glitch-text cursor-default"
                  style={{ color: isAlert ? '#000' : usernameColor }}
                >
                  {msg.username}
                </span>
              </div>
              
              {settings.showPronouns && msg.pronouns && (
                <span className="text-[10px] font-mono opacity-80 uppercase tracking-widest bg-black/10 px-1 rounded-sm w-fit mt-0.5 border border-black/10">
                  {msg.pronouns}
                </span>
              )}
            </div>
          </div>
          
          <span className="text-[10px] opacity-60 font-mono bg-black/5 px-1">
             {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="text-lg leading-6 break-words font-[VT323] relative z-10 rgb-split">
          {isAlert ? (
            <div className="text-center">
              <div className="text-xl font-bold uppercase animate-pulse text-red-600 bg-yellow-300 border-2 border-red-600 p-2 transform rotate-1 shadow-lg">
                 ⚠ {msg.message} ⚠
              </div>
              <div className="mt-2 text-xs font-mono text-center opacity-70">
                &lt; SYSTEM_ALERT_RECEIVED /&gt;
              </div>
            </div>
          ) : (
             msg.message
          )}
        </div>
      </div>
    </RetroWindow>
  );
};