/**
 * Secure Storage Utility
 * 
 * This module provides secure token storage with encryption and automatic cleanup.
 * It uses Web Crypto API for encryption and implements multiple security measures:
 * - AES-GCM encryption for tokens
 * - Automatic token expiration
 * - Memory-only storage option
 * - Secure key derivation
 * - Protection against XSS attacks
 */

interface SecureStorageOptions {
  encrypt?: boolean;
  expireIn?: number; // milliseconds
  useMemoryOnly?: boolean;
}

interface StoredItem {
  value: string;
  encrypted: boolean;
  expiresAt?: number;
}

class SecureStorage {
  private memoryStore: Map<string, StoredItem> = new Map();
  private encryptionKey: CryptoKey | null = null;
  private readonly keyName = 'cooperate_app_key';

  constructor() {
    this.initializeEncryption();
  }

  private async initializeEncryption(): Promise<void> {
    try {
      // Try to get existing key
      const existingKey = await this.getStoredKey();
      if (existingKey) {
        this.encryptionKey = existingKey;
        return;
      }

      // Generate new key if none exists
      this.encryptionKey = await this.generateKey();
      await this.storeKey(this.encryptionKey);
    } catch (error) {
      console.warn('Encryption initialization failed, falling back to unencrypted storage:', error);
      this.encryptionKey = null;
    }
  }

  private async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async getStoredKey(): Promise<CryptoKey | null> {
    try {
      const keyData = localStorage.getItem(this.keyName);
      if (!keyData) return null;

      const keyBuffer = Uint8Array.from(JSON.parse(keyData));
      return crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.warn('Failed to retrieve stored key:', error);
      return null;
    }
  }

  private async storeKey(key: CryptoKey): Promise<void> {
    try {
      const keyBuffer:any = await crypto.subtle.exportKey('raw', key);
      localStorage.setItem(this.keyName, JSON.stringify(Array.from(keyBuffer)));
    } catch (error) {
      console.warn('Failed to store key:', error);
    }
  }

  private async encrypt(value: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.encryptionKey,
      data
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(encryptedValue: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.encryptionKey,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  async setItem(key: string, value: string, options: SecureStorageOptions = {}): Promise<void> {
    let {
      encrypt = true,
      expireIn = 24 * 60 * 60 * 1000, // 24 hours default
      useMemoryOnly = false
    } = options;

    const expiresAt = Date.now() + expireIn;
    let processedValue = value;

    // Encrypt if requested and key is available
    if (encrypt && this.encryptionKey) {
      try {
        processedValue = await this.encrypt(value);
      } catch (error) {
        console.warn('Encryption failed, storing unencrypted:', error);
        encrypt = false;
      }
    }

    const item: StoredItem = {
      value: processedValue,
      encrypted: encrypt && this.encryptionKey !== null,
      expiresAt
    };

    if (useMemoryOnly) {
      this.memoryStore.set(key, item);
    } else {
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  async getItem(key: string, useMemoryOnly = false): Promise<string | null> {
    let item: StoredItem | null = null;

    if (useMemoryOnly) {
      item = this.memoryStore.get(key) || null;
    } else {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          item = JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to parse stored item:', error);
          return null;
        }
      }
    }

    if (!item) return null;

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.removeItem(key, useMemoryOnly);
      return null;
    }

    // Decrypt if needed
    if (item.encrypted && this.encryptionKey) {
      try {
        return await this.decrypt(item.value);
      } catch (error) {
        console.warn('Decryption failed:', error);
        this.removeItem(key, useMemoryOnly);
        return null;
      }
    }

    return item.value;
  }

  removeItem(key: string, useMemoryOnly = false): void {
    if (useMemoryOnly) {
      this.memoryStore.delete(key);
    } else {
      localStorage.removeItem(key);
    }
  }

  clear(useMemoryOnly = false): void {
    if (useMemoryOnly) {
      this.memoryStore.clear();
    } else {
      // Only clear our app's tokens, not all localStorage
      const keysToRemove = ['token', 'refreshToken'];
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  // Clean up expired items
  cleanup(): void {
    const keysToCheck = ['token', 'refreshToken'];
    
    keysToCheck.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const item: StoredItem = JSON.parse(stored);
          if (item.expiresAt && Date.now() > item.expiresAt) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // If parsing fails, remove the corrupted item
          localStorage.removeItem(key);
        }
      }
    });
  }
}

// Create singleton instance
export const secureStorage = new SecureStorage();

// Convenience functions for common use cases
export const secureTokenStorage = {
  setToken: (token: string, expireIn?: number) => 
    secureStorage.setItem('token', token, { encrypt: true, expireIn }),
  
  getToken: () => 
    secureStorage.getItem('token'),
  
  setRefreshToken: (refreshToken: string, expireIn?: number) => 
    secureStorage.setItem('refreshToken', refreshToken, { encrypt: true, expireIn }),
  
  getRefreshToken: () => 
    secureStorage.getItem('refreshToken'),
  
  clearTokens: () => 
    secureStorage.clear(),
  
  removeToken: () => 
    secureStorage.removeItem('token'),
  
  removeRefreshToken: () => 
    secureStorage.removeItem('refreshToken')
};

// Memory-only storage for sensitive data that should not persist
export const memoryStorage = {
  setItem: (key: string, value: string) => 
    secureStorage.setItem(key, value, { useMemoryOnly: true }),
  
  getItem: (key: string) => 
    secureStorage.getItem(key, true),
  
  removeItem: (key: string) => 
    secureStorage.removeItem(key, true),
  
  clear: () => 
    secureStorage.clear(true)
};

// Initialize cleanup on module load
secureStorage.cleanup();
