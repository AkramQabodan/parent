import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Safely get an item from localStorage
   * @param key The key to retrieve from localStorage
   * @returns The value associated with the key, or null
   */
  getItem(key: string): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  /**
   * Safely set an item in localStorage
   * @param key The key to set in localStorage
   * @param value The value to store
   */
  setItem(key: string, value: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  /**
   * Safely remove an item from localStorage
   * @param key The key to remove from localStorage
   */
  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  /**
   * Check if an item exists in localStorage
   * @param key The key to check
   * @returns Boolean indicating if the key exists
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
