import CryptoJS from 'crypto-js';

// 🛡️ SECURITY LAYER: SOVEREIGN ENCRYPTION [v1.0]
const SECRET = import.meta.env.VITE_ENCRYPTION_SECRET || 'codepilot-vault-v1-neural-link';

/**
 * Encrypts sensitive configuration data before storage.
 */
export const encryptConfig = (config) => {
  if (!config) return null;
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(config), SECRET).toString();
  } catch (err) {
    console.error("Encryption Failed:", err);
    return null;
  }
};

/**
 * Decrypts sensitive configuration data from storage.
 */
export const decryptConfig = (cipherText) => {
  if (!cipherText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
    const decoded = bytes.toString(CryptoJS.enc.Utf8);
    return decoded ? JSON.parse(decoded) : null;
  } catch (err) {
    console.error("Decryption Failed:", err);
    return null;
  }
};
// 🔑 ALIASES for Granular Key Encryption
export const encryptKey = (text) => {
  if (!text) return '';
  try {
    return CryptoJS.AES.encrypt(text, SECRET).toString();
  } catch (err) {
    return '';
  }
};

export const decryptKey = (cipherText) => {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    return '';
  }
};
