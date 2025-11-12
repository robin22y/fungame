import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useApp } from '../context/AppContext';
import { X, Printer } from 'lucide-react';

interface PrintQRCodesProps {
  onClose: () => void;
}

export function PrintQRCodes({ onClose }: PrintQRCodesProps) {
  const { family } = useApp();

  if (!family) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="no-print sticky top-0 bg-white border-b-2 border-gray-200 shadow-md z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Print QR Codes</h2>
            <p className="text-sm text-gray-600">
              {family.tags.length} tag{family.tags.length !== 1 ? 's' : ''} ready to print
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="no-print max-w-6xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">Printing Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click the Print button above</li>
            <li>• Select your printer and paper size (A4 recommended)</li>
            <li>• Each QR code is 5cm × 5cm for easy cutting</li>
            <li>• Approximately 12 codes fit per A4 sheet (3 columns × 4 rows)</li>
            <li>• Cut along the borders to create individual tag labels</li>
          </ul>
        </div>
      </div>

      <div className="print-content p-8 print:p-0">
        <div className="grid grid-cols-3 gap-6 print:gap-4 justify-items-center">
          {family.tags.map((tag) => (
            <div
              key={tag.id}
              className="flex flex-col items-center justify-center border-2 border-gray-300 border-dashed p-4 print:border-solid print:border-gray-400 bg-white"
              style={{
                width: '5cm',
                height: '5cm',
                pageBreakInside: 'avoid',
              }}
            >
              <QRCodeCanvas
                value={tag.uid}
                size={120}
                level="M"
                includeMargin={false}
              />
              <span className="text-xs mt-2 font-bold text-gray-900 text-center uppercase tracking-wide">
                {tag.name || 'Unnamed Tag'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {family.tags.length === 0 && (
        <div className="no-print text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">No tags created yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Create tags first, then come back to print them
          </p>
        </div>
      )}
    </div>
  );
}
