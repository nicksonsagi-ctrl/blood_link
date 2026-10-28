import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // Build uncompressed scanlines: filter byte 0 + RGBA bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Drawing function for LifeLink Blood Drop & Heart Logo
function drawIcon(isMaskable) {
  return (x, y, w, h) => {
    const cx = w / 2;
    const cy = h / 2;

    // Background
    if (isMaskable) {
      // Full bleed red gradient background
      return [220, 10, 32, 255]; // #DC0A20
    }

    // Standard icon with rounded container
    const rx = Math.abs(x - cx);
    const ry = Math.abs(y - cy);
    const cornerR = w * 0.22;
    const innerW = w / 2 - cornerR;
    const innerH = h / 2 - cornerR;

    let inRoundedRect = false;
    if (rx <= innerW && ry <= h / 2) inRoundedRect = true;
    else if (ry <= innerH && rx <= w / 2) inRoundedRect = true;
    else if (rx > innerW && ry > innerH) {
      const dx = rx - innerW;
      const dy = ry - innerH;
      if (dx * dx + dy * dy <= cornerR * cornerR) inRoundedRect = true;
    }

    if (!inRoundedRect) {
      return [0, 0, 0, 0]; // Transparent outer
    }

    // Inside rounded rect background (#FFF0F2 light red tint)
    // Draw centered blood drop
    const dropScale = isMaskable ? 0.65 : 0.8;
    const nx = (x - cx) / (w * dropScale / 2);
    const ny = (y - cy) / (h * dropScale / 2);

    // Blood drop parametric shape: top point at ny = -0.85, round bottom at ny = 0.35, r = 0.55
    const distBottom = Math.sqrt(nx * nx + (ny - 0.2) * (ny - 0.2));
    const isInsideDrop = distBottom <= 0.6 || (ny <= 0.2 && ny >= -0.85 && Math.abs(nx) <= (0.2 - ny) * 0.55);

    if (isInsideDrop) {
      // Check heart cutout in center of drop
      const hx = nx * 2.8;
      const hy = (ny - 0.2) * 2.8;
      // Heart equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const hval = Math.pow(hx * hx + hy * hy - 0.5, 3) - hx * hx * Math.pow(hy, 3);
      if (hval <= 0.05 && hy >= -0.6) {
        return [255, 255, 255, 255]; // White heart
      }
      return [220, 10, 32, 255]; // Primary crimson #DC0A20
    }

    return [255, 240, 242, 255]; // Light soft red container
  };
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, drawIcon(false)));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, drawIcon(false)));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, drawIcon(true)));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, drawIcon(false)));

console.log('✅ PWA PNG icons generated successfully in public/');
