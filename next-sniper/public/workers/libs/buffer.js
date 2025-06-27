export class Buffer extends Uint8Array {
  static from(data, encoding) {
    if (typeof data === 'string') {
      if (encoding === 'hex') {
        const arr = new Uint8Array(data.length / 2);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(data.substr(i * 2, 2), 16);
        }
        return new Buffer(arr);
      }
      if (encoding === 'base64') {
        const bin = atob(data);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        return new Buffer(arr);
      }
      return new Buffer(new TextEncoder().encode(data));
    }
    if (ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
      return new Buffer(data);
    }
    if (Array.isArray(data)) {
      return new Buffer(Uint8Array.from(data));
    }
    throw new Error('Unsupported Buffer.from input');
  }

  static alloc(size, fill = 0) {
    const buf = new Buffer(size);
    if (fill !== 0) buf.fill(fill);
    return buf;
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }

  toString(encoding = 'utf8') {
    if (encoding === 'hex') {
      return Array.from(this).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    if (encoding === 'base64') {
      let bin = '';
      for (const b of this) bin += String.fromCharCode(b);
      return btoa(bin);
    }
    return new TextDecoder().decode(this);
  }
}