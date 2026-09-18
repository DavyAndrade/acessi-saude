import { describe, it, expect } from 'vitest';
import { getLBIArticle, getLBIArticleByTag, LBI_MAPPING } from './lbi';

describe('lbi utils', () => {
  describe('LBI_MAPPING', () => {
    it('should have mappings for common rules', () => {
      expect(LBI_MAPPING['color-contrast']).toBeDefined();
      expect(LBI_MAPPING['image-alt']).toBeDefined();
      expect(LBI_MAPPING['label']).toBeDefined();
      expect(LBI_MAPPING['heading-order']).toBeDefined();
      expect(LBI_MAPPING['focus-visible']).toBeDefined();
      expect(LBI_MAPPING['skip-link']).toBeDefined();
    });

    it('should have Portuguese article references', () => {
      expect(LBI_MAPPING['color-contrast']).toContain('Art.');
      expect(LBI_MAPPING['image-alt']).toContain('Art.');
    });
  });

  describe('getLBIArticle', () => {
    it('should return article for known rule', () => {
      const article = getLBIArticle('color-contrast');
      expect(article).toBe('Art. 6º, §1º, I - Contraste mínimo');
    });

    it('should return undefined for unknown rule', () => {
      const article = getLBIArticle('unknown-rule');
      expect(article).toBeUndefined();
    });
  });

  describe('getLBIArticleByTag', () => {
    it('should return article from tags array', () => {
      const tags = ['wcag2aa', 'color-contrast', 'cat.color'];
      const article = getLBIArticleByTag(tags);
      expect(article).toBe('Art. 6º, §1º, I - Contraste mínimo');
    });

    it('should return undefined when no matching tag', () => {
      const tags = ['wcag2aa', 'cat.color'];
      const article = getLBIArticleByTag(tags);
      expect(article).toBeUndefined();
    });
  });
});