/**
 * Global Scroll Lock Manager for Lush Layers Website
 * Locks background page scrolling across desktop, tablet, Android Chrome, and iOS Safari
 * while preserving scroll position and supporting nested stacked overlays.
 */

let activeLockCount = 0;
let savedScrollY = 0;
let isLocked = false;

export function lockScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  activeLockCount++;

  if (activeLockCount === 1 && !isLocked) {
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply fixed position body lock with scrollbar compensation
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.documentElement.classList.add('scroll-locked');
    isLocked = true;
  }
}

export function unlockScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  activeLockCount = Math.max(0, activeLockCount - 1);

  if (activeLockCount === 0 && isLocked) {
    // Restore body inline styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    document.documentElement.style.removeProperty('--scrollbar-width');
    document.documentElement.classList.remove('scroll-locked');
    isLocked = false;

    // Restore exact scroll position
    window.scrollTo(0, savedScrollY);
  }
}
