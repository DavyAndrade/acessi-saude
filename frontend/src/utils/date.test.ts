import { describe, it, expect } from 'vitest';
import { formatDateBR, formatDateShort, formatTime, isValidDate } from './date';

describe('date utils', () => {
  const testDate = '2026-01-15T10:30:00Z';
  const date = new Date(testDate);
  const expectedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const expectedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const expectedDateTime = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  describe('formatDateBR', () => {
    it('should format date in pt-BR', () => {
      const result = formatDateBR(testDate);
      expect(result).toBe(expectedDateTime);
    });
  });

  describe('formatDateShort', () => {
    it('should format short date in pt-BR', () => {
      const result = formatDateShort(testDate);
      expect(result).toBe(expectedDate);
    });
  });

  describe('formatTime', () => {
    it('should format time in pt-BR', () => {
      const result = formatTime(testDate);
      expect(result).toBe(expectedTime);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid ISO date', () => {
      expect(isValidDate('2026-01-15T10:30:00Z')).toBe(true);
      expect(isValidDate('2026-01-15')).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate('')).toBe(false);
    });
  });
});