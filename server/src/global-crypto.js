const crypto = require('crypto');
global.crypto = crypto;

// // main.ts (very top, before NestFactory.create)
// import { webcrypto } from 'crypto';

// if (!globalThis.crypto) {
//   globalThis.crypto = webcrypto as unknown as Crypto;
// }