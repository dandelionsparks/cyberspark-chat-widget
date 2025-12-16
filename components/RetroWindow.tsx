import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface RetroWindowProps {
  title: string;
  isActive?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  headerStartColor?: string;
  headerEndColor?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  isActive = true,
  onClose,
  children,
  headerStartColor = '#000080',
  headerEndColor = '#1084d0',
  bgColor = '#c0c0c0',
  borderColor = '#c0c0c0',
  textColor = '#000000',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`relative inline-flex flex-col p-1 win95-border ${className}`}
      style={{
        backgroundColor: borderColor,
        color: textColor,
        boxShadow: '4px 4px 10px rgba(0,0,0,0.5)',
        ...style
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-1 py-0.5 mb-1 select-none"
        style={{
          background: isActive
            ? `linear-gradient(90deg, ${headerStartColor}, ${headerEndColor})`
            : '#808080',
        }}
      >
        <div className="flex items-center gap-2 font-bold text-white px-1 overflow-hidden whitespace-nowrap text-sm tracking-wider">
           {/* Icon placeholder (e.g. error icon) */}
           {isActive && <div className="w-3 h-3 bg-white rounded-full border border-black animate-pulse" />}
           <span style={{ textShadow: '1px 1px #000' }}>{title}</span>
        </div>
        
        <div className="flex gap-0.5">
          <button className="win95-btn w-4 h-4 bg-[#c0c0c0] win95-border flex items-center justify-center active:translate-y-[1px]">
             <Minus size={10} color="black" />
          </button>
          <button className="win95-btn w-4 h-4 bg-[#c0c0c0] win95-border flex items-center justify-center active:translate-y-[1px]">
             <Square size={8} color="black" />
          </button>
          <button className="win95-btn w-4 h-4 bg-[#c0c0c0] win95-border flex items-center justify-center active:translate-y-[1px]" onClick={onClose}>
             <X size={10} color="black" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div 
        className="flex-1 p-2 win95-border-inverted overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {children}
      </div>
    </div>
  );
};