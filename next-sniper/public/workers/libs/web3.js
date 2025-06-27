import { Buffer } from './buffer.js';

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(bytes) {
  if (bytes.length === 0) return '';
  const digits = [0];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (const byte of bytes) {
    if (byte === 0) digits.push(0);
    else break;
  }
  return digits.reverse().map(d => ALPHABET[d]).join('');
}

export class PublicKey {
  constructor(value) {
    this.value = Uint8Array.from(value);
  }
  toBase58() {
    return base58Encode(this.value);
  }
  toString() {
    return this.toBase58();
  }
}

export class Keypair {
  constructor(secretKey) {
    this.secretKey = Uint8Array.from(secretKey);
    const pub = this.secretKey.slice(this.secretKey.length - 32);
    this.publicKey = new PublicKey(pub);
  }
  static fromSecretKey(secretKey) {
    return new Keypair(secretKey);
  }
}

export default { Keypair, PublicKey };