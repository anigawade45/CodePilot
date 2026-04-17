import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils.js';

/**
 * 🛰️ ENTERPRISE UTILITY VALIDATION
 * This test confirms the core styling engine is functional.
 */
describe('CodePilot Utility Cluster', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('bg-red-500', 'p-4', { 'hidden': false });
    expect(result).toContain('bg-red-500');
    expect(result).toContain('p-4');
  });

  it('should handle conditional logic within the styling engine', () => {
    const isVisible = true;
    const isHidden = false;
    const result = cn('flex', isVisible && 'items-center', isHidden && 'justify-center');
    expect(result).toContain('flex');
    expect(result).toContain('items-center');
    expect(result).not.toContain('justify-center');
  });
});
