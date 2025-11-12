import React, { useState, useRef } from 'react';
import { Camera, X, Download } from 'lucide-react';

export function CameraSketch() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertToSketch = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.putImageData(imageData, 0, 0);

      const sobelData = applySobelFilter(tempCtx, tempCanvas.width, tempCanvas.height);
      ctx.putImageData(sobelData, 0, 0);

      const sketchUrl = canvas.toDataURL('image/png');
      setSketchImage(sketchUrl);

      const gallery = JSON.parse(localStorage.getItem('sketch_gallery') || '[]');
      gallery.push({
        original: imageUrl,
        sketch: sketchUrl,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('sketch_gallery', JSON.stringify(gallery));
    };
    img.src = imageUrl;
  };

  const applySobelFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = ctx.createImageData(width, height);

    const kernelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ];
    const kernelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = data[idx];
            pixelX += gray * kernelX[ky + 1][kx + 1];
            pixelY += gray * kernelY[ky + 1][kx + 1];
          }
        }

        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const idx = (y * width + x) * 4;
        const value = 255 - Math.min(255, magnitude);
        output.data[idx] = value;
        output.data[idx + 1] = value;
        output.data[idx + 2] = value;
        output.data[idx + 3] = 255;
      }
    }

    return output;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setOriginalImage(imageUrl);
        convertToSketch(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setOriginalImage(null);
    setSketchImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (sketchImage) {
      const link = document.createElement('a');
      link.href = sketchImage;
      link.download = `sketch_${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <Camera className="w-16 h-16 text-blue-600 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sketch Camera</h2>
          <p className="text-gray-600">Turn your photos into pencil sketches</p>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {!originalImage ? (
          <div className="text-center py-12">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              id="camera-input"
            />
            <label
              htmlFor="camera-input"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
            >
              <Camera className="w-6 h-6" />
              Take Photo
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Original</h3>
                <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-300">
                  <img src={originalImage} alt="Original" className="w-full rounded-xl" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Sketch</h3>
                <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-300">
                  {sketchImage ? (
                    <img src={sketchImage} alt="Sketch" className="w-full rounded-xl" />
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500">Processing...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={!sketchImage}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Sketch
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
