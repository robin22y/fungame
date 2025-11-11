import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Nfc } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tag } from '../types';

export function AddTag() {
  const { addTag } = useApp();
  const [tagName, setTagName] = useState('');
  const [generatedTag, setGeneratedTag] = useState<Tag | null>(null);
  const [step, setStep] = useState<'name' | 'write' | 'done'>('name');
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');
  const [nfcError, setNfcError] = useState('');

  const handleNext = () => {
    if (tagName.trim()) {
      setStep('write');
    }
  };

  const handleWriteNFC = async () => {
    if (!('NDEFReader' in window)) {
      setNfcError('NFC not supported. Use Chrome on Android or Safari on iOS 13+');
      setNfcStatus('error');
      return;
    }

    try {
      setNfcStatus('writing');
      setNfcError('');

      const ndef = new (window as any).NDEFReader();
      const tagID = `TAG_${Date.now()}`;

      await ndef.write({
        records: [{ recordType: 'text', data: tagID }]
      });

      const newTag: Tag = {
        id: crypto.randomUUID(),
        uid: tagID,
        qrCode: tagID,
        name: tagName.trim(),
      };

      addTag(newTag);
      setGeneratedTag(newTag);
      setNfcStatus('success');
      setStep('done');

    } catch (error: any) {
      console.error('NFC Write Error:', error);
      if (error.name === 'NotAllowedError') {
        setNfcError('Please allow NFC access in your browser');
      } else {
        setNfcError('Could not write to tag. Make sure it\'s a blank NFC sticker.');
      }
      setNfcStatus('error');
    }
  };

  const handleStartOver = () => {
    setTagName('');
    setGeneratedTag(null);
    setStep('name');
    setNfcStatus('idle');
    setNfcError('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏷️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create NFC Tag</h2>
          <p className="text-gray-600">Simple 3-step process</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 'name' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>1</div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 'name' ? 'bg-gray-300 text-gray-600' : step === 'write' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>2</div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`}>3</div>
          </div>
        </div>

        {step === 'name' && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Step 1: Name Your Tag
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Give this tag a simple name (like "Kitchen" or "Front Door")
              </p>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg text-center font-semibold"
                placeholder="e.g., Kitchen"
                autoFocus
              />
            </div>
            <button
              onClick={handleNext}
              disabled={!tagName.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                tagName.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next: Write to NFC Tag
            </button>
          </div>
        )}

        {step === 'write' && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200 text-center">
              <Nfc className={`w-20 h-20 text-purple-600 mx-auto mb-4 ${
                nfcStatus === 'writing' ? 'animate-pulse' : ''
              }`} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Step 2: Write to NFC Sticker
              </h3>
              <p className="text-gray-600 mb-6">
                Get a blank NFC sticker ready
              </p>

              {nfcStatus === 'idle' && (
                <div className="bg-white rounded-xl p-6 mb-6 text-left">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Instructions:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Get a blank NFC sticker (NTAG213 or similar)</li>
                    <li>Click the button below</li>
                    <li>Hold the NFC sticker against the back of your phone</li>
                    <li>Wait for "Success!" message</li>
                  </ol>
                </div>
              )}

              {nfcError && (
                <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl">
                  <p className="text-red-700 font-medium">{nfcError}</p>
                </div>
              )}

              <button
                onClick={handleWriteNFC}
                disabled={nfcStatus === 'writing'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  nfcStatus === 'writing'
                    ? 'bg-purple-300 text-white cursor-wait'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {nfcStatus === 'writing' ? 'Hold NFC Sticker to Phone...' : 'Write to NFC Sticker'}
              </button>
            </div>

            <button
              onClick={() => setStep('name')}
              className="w-full py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-800 transition-all"
            >
              ← Back
            </button>
          </div>
        )}

        {step === 'done' && generatedTag && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                NFC Tag Created!
              </h3>
              <p className="text-gray-700 mb-6">
                Your tag <strong>"{generatedTag.name}"</strong> is ready to use
              </p>

              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-4 border-gray-200">
                    <QRCodeSVG value={generatedTag.qrCode} size={200} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  QR Code (backup option)
                </p>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Print QR Code
                </button>
              </div>

              <div className="bg-blue-100 rounded-xl p-4 text-left">
                <p className="text-sm text-blue-900">
                  <strong>What's next?</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 mt-2">
                  <li>Stick the NFC tag at the location ({generatedTag.name})</li>
                  <li>Create a mission that uses this tag</li>
                  <li>Kids can scan the tag to complete the mission</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleStartOver}
              className="w-full py-4 rounded-xl font-bold text-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
            >
              Create Another Tag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
