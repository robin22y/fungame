import React from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { downloadQR } from '../utils/downloadQR';

export function ViewAllTags() {
  const { family } = useApp();

  if (!family) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <QrCode className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">All QR Codes</h2>
        </div>
        <p className="text-gray-600">Download QR codes and place them at their locations</p>
      </div>

      {family.tags.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-gray-600 text-lg">No tags created yet</p>
          <p className="text-gray-500 text-sm mt-2">Go to Add Tag to create QR codes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {family.tags.map((tag) => {
            const tagUrl = `https://fungame.netlify.app/message/${encodeURIComponent((tag.name || tag.uid).toLowerCase())}`;

            return (
              <div
                key={tag.id}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {tag.name || tag.uid}
                  </h3>
                  {tag.message && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700">{tag.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-xl border-4 border-gray-300">
                    <QRCodeSVG value={tagUrl} size={200} />
                    <div className="hidden">
                      <QRCodeCanvas
                        id={`qr-canvas-${tag.id}`}
                        value={tagUrl}
                        size={512}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-xs text-gray-500 mb-1">Scan this QR code</p>
                  <p className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded inline-block break-all max-w-full">
                    {tagUrl}
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => downloadQR(`qr-canvas-${tag.id}`, tag.name || `tag-${tag.uid}`)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
