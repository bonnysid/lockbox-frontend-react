import { useState, useCallback } from 'react';

// Получаем мастер-ключ из мастер-пароля и соли
const getMasterKey = async (masterPassword: string, salt: string) => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(masterPassword), { name: 'PBKDF2' }, false, [
    'deriveKey',
  ]);
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
};

const encryptPassword = async (plainPassword: string, masterKey: CryptoKey) => {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    masterKey,
    enc.encode(plainPassword),
  );
  // Склеиваем IV и encrypted data в одну строку (Base64)
  return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
};

const decryptPassword = async (encryptedBase64: string, masterKey: CryptoKey) => {
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = encryptedBytes.slice(0, 12);
  const data = encryptedBytes.slice(12);
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    masterKey,
    data,
  );
  return new TextDecoder().decode(decrypted);
};

export const encryptMasterKey = async (masterKey: CryptoKey, pin: string, salt: string) => {
  const enc = new TextEncoder();
  const masterKeyRaw = await crypto.subtle.exportKey('raw', masterKey);
  const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(pin), { name: 'PBKDF2' }, false, ['deriveKey']);
  const pinKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, pinKey, masterKeyRaw);
  // Сохраняем IV + зашифрованный ключ
  return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
};

export const decryptMasterKey = async (encryptedBase64: string, pin: string, salt: string) => {
  const enc = new TextEncoder();
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  const iv = encryptedBytes.slice(0, 12);
  const data = encryptedBytes.slice(12);
  const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(pin), { name: 'PBKDF2' }, false, ['deriveKey']);
  const pinKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
  const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, pinKey, data);
  return await crypto.subtle.importKey('raw', decrypted, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
};

export const useCrypto = (salt: string) => {
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);

  // Устанавливаем мастер-ключ (например, после ввода пользователем мастер-пароля)
  const loadMasterKey = useCallback(
    async (masterPassword: string) => {
      const key = await getMasterKey(masterPassword, salt);
      setMasterKey(key);
    },
    [salt],
  );

  // Обёртка для шифрования
  const encrypt = useCallback(
    async (plainPassword: string) => {
      if (!masterKey) throw new Error('Master key not loaded');
      return await encryptPassword(plainPassword, masterKey);
    },
    [masterKey],
  );

  // Обёртка для дешифрования
  const decrypt = useCallback(
    async (encryptedBase64: string) => {
      if (!masterKey) throw new Error('Master key not loaded');
      return await decryptPassword(encryptedBase64, masterKey);
    },
    [masterKey],
  );

  return {
    isMasterKeyLoaded: !!masterKey,
    loadMasterKey,
    encrypt,
    decrypt,
  };
};
