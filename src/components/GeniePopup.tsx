import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { getRandomCorner } from '../utils/genieMessage';

interface GeniePopupProps {
  message: string;
  genieImage?: string;
  showPhotoButton?: boolean;
  onPhotoClick?: () => void;
  onClose?: () => void;
  duration?: number;
}

export function GeniePopup({
  message,
  genieImage = '🧞',
  showPhotoButton = false,
  onPhotoClick,
  onClose,
  duration = 4000,
}: GeniePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [corner] = useState(getRandomCorner());

  useEffect(() => {
    setIsVisible(true);

    if (!showPhotoButton) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, showPhotoButton, onClose]);

  const handlePhotoClick = () => {
    onPhotoClick?.();
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={corner}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-4 w-80 max-w-full border-4 border-purple-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {genieImage.startsWith('http') || genieImage.startsWith('data:') ? (
              <img
                src={genieImage}
                alt="Genie"
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="text-6xl opacity-95">{genieImage}</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-purple-600 font-medium text-sm leading-relaxed">
              {message}
            </p>
            {showPhotoButton && (
              <button
                onClick={handlePhotoClick}
                className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            )}
            {!showPhotoButton && (
              <button
                onClick={handleClose}
                className="mt-2 text-xs text-purple-400 hover:text-purple-600"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
