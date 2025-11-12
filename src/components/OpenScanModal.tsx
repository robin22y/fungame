import React, { useState, useEffect } from 'react';
import { X, Scan, Camera, Nfc } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useApp } from '../context/AppContext';
import { MissionCompleteModal } from './MissionCompleteModal';
import { GeniePopup } from './GeniePopup';
import { speakGenie } from '../utils/speakGenie';

interface OpenScanModalProps {
  onClose: () => void;
  autoScanTag?: string | null;
}

export function OpenScanModal({ onClose, autoScanTag }: OpenScanModalProps) {
  const { family, currentMember } = useApp();
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [scanMode, setScanMode] = useState<'input' | 'camera' | 'nfc'>('input');
  const [nfcReading, setNfcReading] = useState(false);
  const [nfcError, setNfcError] = useState('');
  const [foundMission, setFoundMission] = useState<any>(null);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showGenieMessage, setShowGenieMessage] = useState(false);
  const [genieMessage, setGenieMessage] = useState('');

  if (!family || !currentMember) return null;

  useEffect(() => {
    if (autoScanTag) {
      handleVerify(autoScanTag);
    }
  }, [autoScanTag]);

  const handleVerify = (scannedValue: string) => {
    const normalizedValue = scannedValue.trim();

    let tag = family.tags.find(
      t => t.uid.toUpperCase() === normalizedValue.toUpperCase() ||
           t.qrCode.toUpperCase() === normalizedValue.toUpperCase()
    );

    if (!tag) {
      const urlMatch = normalizedValue.match(/\/(scan|message)\/([^/?]+)/);
      if (urlMatch && urlMatch[2]) {
        const urlTagName = decodeURIComponent(urlMatch[2]).toLowerCase();
        tag = family.tags.find(t => t.name?.toLowerCase() === urlTagName);
      } else {
        tag = family.tags.find(t => t.name?.toLowerCase() === normalizedValue.toLowerCase());
      }
    }

    if (!tag) {
      setError('Tag not found. Make sure this tag has been added by a parent.');
      return;
    }

    const tagName = tag.name?.toLowerCase().trim();
    if (!tagName) {
      setError('This tag has no name. Ask a parent to name it first.');
      return;
    }

    const availableMissions = family.missions.filter(
      m => !m.completed &&
           m.assignedTo === currentMember.id &&
           family.tags.find(t => t.id === m.tagId)?.name?.toLowerCase().trim() === tagName
    );

    if (availableMissions.length === 0) {
      let message = `Hi ${currentMember.nickname}! You found the ${tag.name}`;

      if (tag.message) {
        message += `!\n\n"${tag.message}"\n\nBut there's no mission here for you right now.`;
      } else {
        message += `, but there's no mission here for you right now.`;
      }

      setGenieMessage(message);
      setShowGenieMessage(true);

      if (family.genieSettings?.voiceEnabled) {
        const spokenMessage = tag.message
          ? `Hi ${currentMember.nickname}! You found the ${tag.name}! ${tag.message}. But there's no mission here for you right now.`
          : message;
        speakGenie(spokenMessage, family.genieSettings);
      }

      setTimeout(() => {
        setShowGenieMessage(false);
        onClose();
      }, 3500);
      return;
    }

    if (availableMissions.length > 1) {
      const firstMission = availableMissions[0];
      const clueText = firstMission.parentMessage || firstMission.taskName;
      const message = `Hi ${currentMember.nickname}! You found the ${tag.name}! You have ${availableMissions.length} missions here.\n\nHere's your first clue:\n"${clueText}"`;
      setGenieMessage(message);
      setShowGenieMessage(true);

      if (family.genieSettings?.voiceEnabled) {
        const spokenMessage = `Hi ${currentMember.nickname}! You found the ${tag.name}! You have ${availableMissions.length} missions here. Here's your first clue: ${clueText}`;
        speakGenie(spokenMessage, family.genieSettings);
      }

      setTimeout(() => {
        setShowGenieMessage(false);
        const mission = availableMissions[0];
        setFoundMission(mission);
        setShowMissionComplete(true);
        setError('');
      }, 4500);
      return;
    }

    const mission = availableMissions[0];
    const clueText = mission.parentMessage || mission.taskName;

    const message = `Hi ${currentMember.nickname}! You found the ${tag.name}!\n\n"${clueText}"`;
    setGenieMessage(message);
    setShowGenieMessage(true);

    if (family.genieSettings?.voiceEnabled) {
      const spokenMessage = `Hi ${currentMember.nickname}! You found the ${tag.name}! ${clueText}`;
      speakGenie(spokenMessage, family.genieSettings);
    }

    setTimeout(() => {
      setShowGenieMessage(false);
      setFoundMission(mission);
      setShowMissionComplete(true);
      setError('');
    }, 4500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) {
      setError('Please enter a tag ID');
      return;
    }
    handleVerify(tagInput);
  };

  const handleMissionComplete = () => {
    setShowMissionComplete(false);
    setFoundMission(null);
    onClose();
  };

  if (showMissionComplete && foundMission) {
    return (
      <MissionCompleteModal
        mission={foundMission}
        onClose={() => {
          setShowMissionComplete(false);
          setFoundMission(null);
        }}
        onComplete={handleMissionComplete}
      />
    );
  }

  return (
    <>
      {showGenieMessage && (
        <GeniePopup
          message={genieMessage}
          onClose={() => setShowGenieMessage(false)}
        />
      )}

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Scan Any Tag</h3>
            <p className="text-gray-600">
              Find your missions by scanning tags around the house
            </p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setScanMode('input')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                scanMode === 'input'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Scan className="w-4 h-4" />
                Input
              </div>
            </button>
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                scanMode === 'camera'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                QR Code
              </div>
            </button>
            <button
              onClick={() => setScanMode('nfc')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                scanMode === 'nfc'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Nfc className="w-4 h-4" />
                NFC
              </div>
            </button>
          </div>

          {scanMode === 'camera' ? (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <Scanner
                  onScan={(result) => {
                    if (result && result[0]?.rawValue) {
                      handleVerify(result[0].rawValue);
                    }
                  }}
                  onError={(error) => {
                    console.error('QR Scanner error:', error);
                  }}
                  components={{
                    audio: false,
                    finder: true,
                  }}
                  styles={{
                    container: {
                      width: '100%',
                      height: '300px',
                    },
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Point your camera at a QR code to scan
              </p>
              <button
                type="button"
                onClick={() => setScanMode('input')}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Switch to Manual Input
              </button>
            </div>
          ) : scanMode === 'nfc' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl p-8 text-center">
                <Nfc className={`w-16 h-16 text-blue-500 mx-auto mb-4 ${nfcReading ? 'animate-pulse' : ''}`} />
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {nfcReading ? 'Reading NFC Tag...' : 'NFC Ready'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {nfcReading ? 'Hold tag steady near device' : 'Tap the button below, then hold your NFC tag near the device'}
                </p>
                {nfcError && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 text-xs text-red-800 mb-4">
                    {nfcError}
                  </div>
                )}
                <button
                  onClick={async () => {
                    if (!('NDEFReader' in window)) {
                      setNfcError('NFC not supported. Use Chrome on Android or Safari on iOS 13+');
                      return;
                    }

                    try {
                      setNfcReading(true);
                      setNfcError('');

                      const ndef = new (window as any).NDEFReader();
                      await ndef.scan();

                      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
                        let tagId = serialNumber || '';

                        for (const record of message.records) {
                          if (record.recordType === 'text') {
                            const textDecoder = new TextDecoder(record.encoding);
                            const text = textDecoder.decode(record.data);

                            if (!text.startsWith('NAME:') && !text.startsWith('MSG:')) {
                              tagId = text;
                              break;
                            }
                          }
                        }

                        if (tagId) {
                          handleVerify(tagId);
                          setNfcReading(false);
                        }
                      });

                      ndef.addEventListener('readingerror', () => {
                        setNfcError('Failed to read NFC tag. Try again.');
                        setNfcReading(false);
                      });

                    } catch (error: any) {
                      console.error('NFC Read Error:', error);
                      if (error.name === 'NotAllowedError') {
                        setNfcError('NFC permission denied. Please allow NFC access.');
                      } else if (error.name === 'NotSupportedError') {
                        setNfcError('NFC is not supported on this device.');
                      } else {
                        setNfcError(`NFC Error: ${error.message || 'Unknown error'}`);
                      }
                      setNfcReading(false);
                    }
                  }}
                  disabled={nfcReading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    nfcReading
                      ? 'bg-blue-300 text-white cursor-wait'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {nfcReading ? 'Scanning... Hold Tag Near' : 'Start NFC Scan'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScanMode('input');
                  setNfcReading(false);
                  setNfcError('');
                }}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Switch to Manual Input
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Tag ID
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Enter tag ID manually"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste the tag ID here or switch to QR/NFC mode
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Scan Tag
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
