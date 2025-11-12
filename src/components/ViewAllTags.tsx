import React, { useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { QrCode, Printer, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrintQRCodes } from './PrintQRCodes';
import { downloadQR } from '../utils/downloadQR';

export function ViewAllTags() {
  const { family } = useApp();
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!family) return null;

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
            <p className="text-sm text-gray-500 mt-1">QR codes will print at 5cm × 5cm on A4 paper</p>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Printer className="w-5 h-5" />
            Print All QR Codes
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
        <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-6">
          {family.tags.map((tag) => (
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
                  <QRCodeSVG value={tag.uid} size={200} />
                  <div className="hidden">
                    <QRCodeCanvas
                      id={`qr-canvas-${tag.id}`}
                      value={tag.uid}
                      size={512}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 mb-1">Scan this QR code</p>
                <p className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded inline-block">
                  {tag.uid}
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
          ))}
        </div>
      )}

      {/* Print Layout */}
      <div className="print-only">
        <div className="print-page">
          {family.tags.map((tag, index) => (
            <div key={tag.id} className="qr-print-item">
              <div className="qr-container">
                <QRCodeSVG value={tag.qrCode} size={150} />
              </div>
              <div className="qr-label">
                <p className="qr-name">{tag.name || 'Tag'}</p>
                <p className="qr-id">ID: {tag.uid}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .print-only {
          display: none;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          body {
            background: white;
            margin: 0;
            padding: 0;
          }

          .print-page {
            width: 210mm;
            height: 297mm;
            padding: 10mm;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            gap: 5mm;
          }

          .qr-print-item {
            width: 50mm;
            height: 60mm;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 2.5mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            page-break-inside: avoid;
            background: white;
          }

          .qr-container {
            width: 50mm;
            height: 50mm;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.5mm;
            background: white;
            border: 2px solid #d1d5db;
            border-radius: 4px;
          }

          .qr-container svg {
            width: 45mm !important;
            height: 45mm !important;
          }

          .qr-label {
            text-align: center;
            margin-top: 2mm;
            width: 100%;
          }

          .qr-name {
            font-size: 10pt;
            font-weight: bold;
            color: #000;
            margin: 0 0 1mm 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .qr-id {
            font-size: 8pt;
            font-family: monospace;
            color: #4b5563;
            margin: 0;
          }
        }
      `}</style>

      {showPrintModal && (
        <PrintQRCodes onClose={() => setShowPrintModal(false)} />
      )}
    </div>
  );
}
