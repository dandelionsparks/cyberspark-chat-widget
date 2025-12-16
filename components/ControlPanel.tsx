import React from 'react';
import { AppSettings, LayoutMode, ThemePreset } from '../types';
import { RetroWindow } from './RetroWindow';
import { THEMES } from '../constants';

interface ControlPanelProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onDemoClick: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  setSettings, 
  onDemoClick,
  isOpen,
  setIsOpen
}) => {
  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 left-4 z-50 win95-btn bg-gray-300 win95-border px-2 py-1 font-[VT323] text-sm opacity-50 hover:opacity-100"
    >
      Open Config
    </button>
  );

  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <RetroWindow 
        title="SYSTEM CONFIGURATION" 
        className="w-full max-w-lg shadow-2xl"
        onClose={() => setIsOpen(false)}
        headerStartColor="#800080"
        headerEndColor="#ff00ff"
      >
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] p-2 text-sm font-sans">
          
          <section className="space-y-2">
            <h3 className="font-bold bg-blue-900 text-white px-1">CONNECTION</h3>
            <div className="flex gap-2 items-center">
              <label className="w-24">Channel:</label>
              <input 
                type="text" 
                value={settings.channel} 
                onChange={(e) => handleChange('channel', e.target.value)}
                placeholder="twitch_username"
                className="flex-1 p-1 win95-border-inverted bg-white"
              />
            </div>
            <div className="text-xs text-gray-600">Enter channel name to connect. Clear to disconnect.</div>
          </section>

          <section className="space-y-2">
            <h3 className="font-bold bg-blue-900 text-white px-1">VISUALS</h3>
            
            <div className="flex gap-2 items-center">
              <label className="w-24">Layout:</label>
              <select 
                value={settings.layout}
                onChange={(e) => handleChange('layout', e.target.value)}
                className="flex-1 p-1 win95-border-inverted bg-white"
              >
                {Object.values(LayoutMode).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <label className="w-24">Theme:</label>
              <select 
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="flex-1 p-1 win95-border-inverted bg-white"
              >
                {Object.values(ThemePreset).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4 pt-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.forceUsernameColor}
                    onChange={(e) => handleChange('forceUsernameColor', e.target.checked)}
                  /> 
                  <span className="font-bold">Override User Colors</span>
               </label>
            </div>

            {settings.theme === ThemePreset.CUSTOM && (
               <div className="grid grid-cols-2 gap-2 pl-4 border-l-2 border-gray-400 mt-2">
                 {Object.entries(settings.customColors).map(([key, val]) => (
                   <label key={key} className="flex flex-col text-xs">
                     <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                     <input 
                       type="color" 
                       value={val} 
                       onChange={(e) => setSettings(prev => ({
                         ...prev,
                         customColors: { ...prev.customColors, [key]: e.target.value }
                       }))}
                       className="w-full h-6"
                     />
                   </label>
                 ))}
               </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="font-bold bg-blue-900 text-white px-1">BEHAVIOR</h3>
             <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={settings.showPronouns}
                    onChange={(e) => handleChange('showPronouns', e.target.checked)}
                  /> Pronouns
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={settings.showAvatars}
                    onChange={(e) => handleChange('showAvatars', e.target.checked)}
                  /> Avatars
                </label>
             </div>
             
             <label className="flex justify-between items-center">
                <span>Max Messages: {settings.maxMessages}</span>
                <input 
                  type="range" min="1" max="50" 
                  value={settings.maxMessages}
                  onChange={(e) => handleChange('maxMessages', Number(e.target.value))}
                  className="w-32"
                />
             </label>

             <label className="flex justify-between items-center">
                <span>Timeout (s): {settings.messageTimeout}</span>
                <input 
                  type="range" min="5" max="120" 
                  value={settings.messageTimeout}
                  onChange={(e) => handleChange('messageTimeout', Number(e.target.value))}
                  className="w-32"
                />
             </label>
          </section>

          <div className="pt-4 flex justify-between">
             <button 
                onClick={onDemoClick}
                className="win95-btn bg-green-200 px-4 py-2 border-2 border-green-600 font-bold active:translate-y-1"
              >
                TEST MESSAGE
              </button>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="win95-btn bg-gray-300 px-4 py-2 win95-border active:translate-y-1"
              >
                CLOSE PANEL
              </button>
          </div>
          <div className="text-center text-xs opacity-50 mt-2">
             Press ESC to toggle this menu in OBS.
          </div>
        </div>
      </RetroWindow>
    </div>
  );
};