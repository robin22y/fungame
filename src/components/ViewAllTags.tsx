import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ViewAllTags() {
  const { family } = useApp();

  if (!family) return null;

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 no-print">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <QrCode className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">All QR Codes</h2>
            </div>
            <p className="text-gray-600">Print and place these QR codes at their locations</p>
          </div>
          <button
            onClick={handlePrintAll}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print All
          </button>
        </div>
      </div>

      {family.tags.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🏷️</div>
          <p className="text-gray-600 text-lg">No tags created yet</p>
          <p className="text-gray-500 text-sm mt-2">Go to Add Tag to create QR codes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {family.tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg print-break"
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
                  <QRCodeSVG value={tag.qrCode} size={200} />
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Scan this QR code</p>
                <p className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded inline-block">
                  {tag.uid}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
