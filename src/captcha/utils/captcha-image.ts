export interface CaptchaImageOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  chars?: string;
}

export function generateCaptchaImage(code: string, options: CaptchaImageOptions = {}): string {
  const {
    width = 120,
    height = 40,
    fontSize = 24,
  } = options;

  const chars = code.split('');
  const charWidth = width / chars.length;
  const centerY = height / 2 + fontSize / 3;

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svgContent += `<rect width="${width}" height="${height}" fill="#f5f5f5"/>`;

  for (let i = 0; i < 6; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e0e0e0" stroke-width="1"/>`;
  }

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2;
    svgContent += `<circle cx="${x}" cy="${y}" r="${r}" fill="#d0d0d0"/>`;
  }

  chars.forEach((char, index) => {
    const x = index * charWidth + charWidth / 2;
    const rotation = (Math.random() - 0.5) * 0.4;
    const fontSizeVariation = fontSize + (Math.random() - 0.5) * 6;
    const colors = ['#333333', '#666666', '#999999', '#336699', '#663399'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    svgContent += `<text x="${x}" y="${centerY}" font-size="${fontSizeVariation}" font-family="Arial, sans-serif" fill="${color}" text-anchor="middle" transform="rotate(${rotation * 180 / Math.PI} ${x} ${centerY})" font-weight="bold">${char}</text>`;
  });

  svgContent += '</svg>';

  const base64 = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
