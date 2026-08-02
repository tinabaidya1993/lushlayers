'use client';

import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';

/**
 * Custom React hook to automatically manage background scroll locking.
 * Locks scroll when `isOpen` is true and restores exact scroll position when `isOpen` becomes false.
 * Supports multiple nested/stacked overlays safely.
 *
 * @param isOpen boolean flag representing if the modal/overlay is currently active
 */
export function useScrollLock(isOpen: boolean): void {
  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);
}

export default useScrollLock;
