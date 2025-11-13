import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Nfc, Download, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tag } from '../types';
import { getCardThemeClasses, getTextThemeClasses } from '../utils/themeManager';
import { GeniePopup } from './GeniePopup';
import { getTagUrl } from '../utils/constants';

export function AddTag() {
  const { addTag, appTheme, family } = useApp();
  const [tagName, setTagName] = useState('');
  const [generatedTag, setGeneratedTag] = useState<Tag | null>(null);
  const [step, setStep] = useState<'name' | 'preview' | 'done'>('name');
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');
  const [nfcError, setNfcError] = useState('');
  const [showGenieSuccess, setShowGenieSuccess] = useState(false);
  const [genieSuccessMessage, setGenieSuccessMessage] = useState('');

  const handleGenerateTag = () => {
    if (!tagName.trim()) return;

    const tagID = `TAG_${Date.now()}`;
    const tagUrl = getTagUrl(tagID);

    const newTag: Tag = {
      id: crypto.randomUUID(),
      uid: tagID,
      qrCode: tagUrl,
      name: tagName.trim(),
      nfcWritten: false,
    };

    addTag(newTag);
    setGeneratedTag(newTag);
    setStep('preview');
  };

  const handleWriteNFC = async () => {
    if (!generatedTag) return;

    if (!('NDEFReader' in window)) {
      setNfcError('NFC not supported. Use Chrome on Android or Safari on iOS 13+');
      setNfcStatus('error');
      return;
    }

    try {
      setNfcStatus('writing');
      setNfcError('');

      const ndef = new (window as any).NDEFReader();

      await ndef.write({
        records: [{ recordType: 'url', data: generatedTag.qrCode }]
      });

      const updatedTag = { ...generatedTag, nfcWritten: true };

      if (family) {
        const tagIndex = family.tags.findIndex(t => t.id === generatedTag.id);
        if (tagIndex >= 0) {
          family.tags[tagIndex] = updatedTag;
          const families = JSON.parse(localStorage.getItem('families') || '[]');
          const familyIndex = families.findIndex((f: any) => f.id === family.id);
          if (familyIndex >= 0) {
            families[familyIndex] = family;
            localStorage.setItem('families', JSON.stringify(families));
          }
        }
      }

      setGeneratedTag(updatedTag);
      setNfcStatus('success');
      setGenieSuccessMessage(`✅ Tag written successfully! Your "${generatedTag.name}" NFC sticker is ready!`);
      setShowGenieSuccess(true);

    } catch (error: any) {
      console.error('NFC Write Error:', error);
      if (error.name === 'NotAllowedError') {
        setNfcError('Please allow NFC access in your browser');
      } else if (error.name === 'AbortError') {
        setNfcError('NFC write cancelled. Please try again.');
      } else {
        setNfcError('Could not write to tag. Make sure it\'s a blank NFC sticker.');
      }
      setNfcStatus('error');
    }
  };

  const handleDownloadQR = () => {
    if (!generatedTag) return;

    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${generatedTag.name}-QR.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleStartOver = () => {
    setTagName('');
    setGeneratedTag(null);
    setStep('name');
    setNfcStatus('idle');
    setNfcError('');
  };

  const cardClasses = getCardThemeClasses(appTheme);
  const textClasses = getTextThemeClasses(appTheme);

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`${cardClasses} rounded-3xl shadow-xl p-8 border-2`}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏷️</div>
          <h2 className={`text-3xl font-bold ${textClasses} mb-2`}>Create Tag</h2>
          <p className={`${textClasses} opacity-80`}>
            Generate a tag with both QR code and optional NFC
          </p>
        </div>

        {step === 'name' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Name Your Tag
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Give this tag a simple name (like "Kitchen" or "Front Door")
              </p>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateTag()}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-lg text-center font-semibold"
                placeholder="e.g., Kitchen"
                autoFocus
              />
            </div>

            <button
              onClick={handleGenerateTag}
              disabled={!tagName.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                tagName.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Tag
            </button>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 What happens next:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 mt-2">
                <li>Tag will be created with a unique ID</li>
                <li>QR code will be generated automatically</li>
                <li>You can download and print the QR code</li>
                <li>Optionally write to an NFC sticker later</li>
              </ul>
            </div>
          </div>
        )}

        {step === 'preview' && generatedTag && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-2 border-green-200 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Tag Created!
              </h3>
              <p className="text-gray-700 mb-2">
                <strong className="text-2xl">{generatedTag.name}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Tag ID: <code className="bg-gray-100 px-2 py-1 rounded">{generatedTag.uid}</code>
              </p>

              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <h4 className="text-lg font-bold text-gray-800 mb-4">QR Code</h4>
                <div className="flex justify-center mb-4">
                  <div className="inline-block">
                    <div className="p-4 bg-white rounded-xl border-4 border-gray-200">
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={generatedTag.qrCode}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 break-all">
                  {generatedTag.qrCode}
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold shadow-md"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-4 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Nfc className="w-8 h-8 text-purple-600" />
                    <div className="text-left">
                      <h4 className="text-lg font-bold text-gray-800">NFC Sticker</h4>
                      <p className="text-sm text-gray-600">Optional - Write to physical tag</p>
                    </div>
                  </div>
                  {generatedTag.nfcWritten && (
                    <Check className="w-8 h-8 text-green-600" />
                  )}
                </div>

                {!generatedTag.nfcWritten && (
                  <>
                    {nfcStatus === 'idle' && (
                      <div className="bg-white rounded-lg p-4 mb-4 text-left">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Instructions:</strong>
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          <li>Get a blank NFC sticker (NTAG213 or similar)</li>
                          <li>Click the button below</li>
                          <li>Hold the NFC sticker against your phone</li>
                          <li>Wait for success message</li>
                        </ol>
                      </div>
                    )}

                    {nfcStatus === 'writing' && (
                      <div className="bg-purple-100 rounded-lg p-4 mb-4">
                        <Nfc className="w-12 h-12 text-purple-600 mx-auto mb-2 animate-pulse" />
                        <p className="text-purple-900 font-semibold">
                          Hold NFC sticker to phone...
                        </p>
                      </div>
                    )}

                    {nfcError && (
                      <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                        <p className="text-red-700 font-medium text-sm">{nfcError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleWriteNFC}
                      disabled={nfcStatus === 'writing'}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        nfcStatus === 'writing'
                          ? 'bg-purple-300 text-white cursor-wait'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {nfcStatus === 'writing' ? 'Writing...' : 'Write to NFC Sticker'}
                    </button>
                  </>
                )}

                {generatedTag.nfcWritten && (
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-green-800 font-semibold flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      NFC Sticker Written Successfully!
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-left">
                <p className="text-sm text-yellow-900 mb-2">
                  <strong>📍 What's next:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                  <li>Place the QR code or NFC sticker at the location</li>
                  <li>Create missions that use this tag</li>
                  <li>Kids can scan the tag to view and complete missions</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleStartOver}
                className="py-3 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Create Another
              </button>
              <button
                onClick={() => setStep('done')}
                className="py-3 rounded-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800">
              All Set!
            </h3>
            <p className="text-gray-600">
              Your tag has been saved and is ready to use.
            </p>
            <button
              onClick={handleStartOver}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              Create Another Tag
            </button>
          </div>
        )}
      </div>

      {showGenieSuccess && (
        <GeniePopup
          message={genieSuccessMessage}
          onClose={() => setShowGenieSuccess(false)}
        />
      )}
    </div>
  );
}
