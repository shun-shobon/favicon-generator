const ICO_HEADER_SIZE = 6;
const ICO_DIR_ENTRY_SIZE = 16;
const BMP_INFO_HEADER_SIZE = 40;

export function createIco(
  width: number,
  height: number,
  pixels: Uint8Array,
): Uint8Array {
  const bmpHeight = height * 2;
  const bmpImageSize = bmpHeight * width * 4;
  const bmpSize = BMP_INFO_HEADER_SIZE + bmpImageSize;

  const bufferSize = ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE + bmpSize;
  const buffer = new ArrayBuffer(bufferSize);
  const cursor = new Cursor(buffer);

  // Write ICO header.
  cursor.writeUint16(0); // Reserved.
  cursor.writeUint16(1); // Type.
  cursor.writeUint16(1); // Number of images.

  // Write ICO directory entry.
  cursor.writeUint8(width); // Width.
  cursor.writeUint8(height); // Height.
  cursor.writeUint8(0); // Color count.
  cursor.writeUint8(0); // Reserved.
  cursor.writeUint16(0); // Color planes.
  cursor.writeUint16(32); // Bits per pixel.
  cursor.writeUint32(bmpSize); // Size of BMP data.
  cursor.writeUint32(ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE); // Offset of BMP data.

  // Write BMP info header.
  cursor.writeUint32(BMP_INFO_HEADER_SIZE); // Size of BMP info header.
  cursor.writeUint32(width); // Width.
  cursor.writeUint32(bmpHeight); // Height.
  cursor.writeUint16(1); // Color planes.
  cursor.writeUint16(32); // Bits per pixel.
  cursor.writeUint32(0); // Compression.
  cursor.writeUint32(bmpImageSize); // Size of BMP image data.
  cursor.writeUint32(0); // Horizontal resolution.
  cursor.writeUint32(0); // Vertical resolution.
  cursor.writeUint32(0); // Number of colors.
  cursor.writeUint32(0); // Number of important colors.

  // Write BMP image data.
  for (let i = 0; i < height; i++) {
    const y = height - i - 1;
    const row = y * width * 4;
    for (let x = 0; x < width; x++) {
      const r = pixels[row + x * 4 + 0]!;
      const g = pixels[row + x * 4 + 1]!;
      const b = pixels[row + x * 4 + 2]!;
      const a = pixels[row + x * 4 + 3]!;
      cursor.writeUint8(b);
      cursor.writeUint8(g);
      cursor.writeUint8(r);
      cursor.writeUint8(a);
    }
  }

  return new Uint8Array(buffer);
}

class Cursor {
  #view: DataView;
  #offset: number;

  constructor(buffer: ArrayBuffer) {
    this.#view = new DataView(buffer);
    this.#offset = 0;
  }

  get buffer(): ArrayBuffer {
    return this.#view.buffer;
  }

  get offset(): number {
    return this.#offset;
  }

  writeUint8(value: number) {
    this.#view.setUint8(this.#offset, value);
    this.#offset += 1;
  }

  writeUint16(value: number) {
    this.#view.setUint16(this.#offset, value, true);
    this.#offset += 2;
  }

  writeUint32(value: number) {
    this.#view.setUint32(this.#offset, value, true);
    this.#offset += 4;
  }
}
