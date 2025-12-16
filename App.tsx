import React, { useState, useEffect } from 'react';
import { AppSettings, LayoutMode } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { useTwitchChat } from './hooks/useTwitchChat';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { ControlPanel } from './components/ControlPanel';

const App: React.FC = () => {
  // Load settings from local storage if available
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('cybervirus-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const { messages, triggerDemoMessage } = useTwitchChat(settings);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem('cybervirus-settings', JSON.stringify(settings));
  }, [settings]);

  // Toggle config with ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsConfigOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Layout Logic
  const getContainerStyle = (): React.CSSProperties => {
    switch (settings.layout) {
      case LayoutMode.SIDE_LEFT:
        return { alignItems: 'flex-start', justifyContent: 'flex-end' };
      case LayoutMode.SIDE_RIGHT:
        return { alignItems: 'flex-end', justifyContent: 'flex-end' };
      case LayoutMode.SCATTER:
        return { display: 'block' }; // Relative positioning handled in items
      default: // Stack & ZigZag
        return { alignItems: 'center', justifyContent: 'flex-end' };
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative font-[VT323]">
      
      {/* Background Grid - Only visible if config open or for effect */}
      {isConfigOpen && (
        <div className="absolute inset-0 -z-10 bg-[#000020] digital-noise" style={{
            backgroundImage: `linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #ff00ff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.3,
            perspective: '500px'
        }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
      )}

      {/* Message Container */}
      <div 
        className={`w-full h-full flex flex-col p-8 pb-12 gap-4 transition-all duration-500 relative z-10`}
        style={getContainerStyle()}
      >
        {messages.map((msg, index) => {
           let style: React.CSSProperties = {};

           // ZigZag Logic
           if (settings.layout === LayoutMode.ZIGZAG) {
             style.alignSelf = index % 2 === 0 ? 'flex-start' : 'flex-end';
           }
           
           // Scatter Logic
           if (settings.layout === LayoutMode.SCATTER && msg.x !== undefined) {
             style = {
               position: 'absolute',
               left: msg.x,
               top: msg.y,
               transform: `rotate(${msg.rot}deg)`,
               zIndex: index, // Newer on top
             };
           }

           return (
             <ChatMessageBubble 
               key={msg.id} 
               msg={msg} 
               settings={settings}
               style={style}
             />
           );
        })}
      </div>

      <ControlPanel 
        isOpen={isConfigOpen} 
        setIsOpen={setIsConfigOpen}
        settings={settings}
        setSettings={setSettings}
        onDemoClick={triggerDemoMessage}
      />
    </div>
  );
};

export default App;