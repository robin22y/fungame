export function downloadQR(canvasId: string, filename: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas not found:', canvasId);
    return;
  }

  try {
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download QR code:', error);
  }
}
