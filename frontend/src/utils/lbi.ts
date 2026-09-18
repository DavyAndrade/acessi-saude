import type { LBIArticle } from '@/types/audit';

export const LBI_MAPPING: Record<string, LBIArticle> = {
  'color-contrast': 'Art. 6º, §1º, I - Contraste mínimo',
  'image-alt': 'Art. 6º, §1º, II - Texto alternativo em imagens',
  'label': 'Art. 6º, §1º, III - Rótulos em formulários',
  'link-name': 'Art. 6º, §1º, IV - Nomes de links descritivos',
  'button-name': 'Art. 6º, §1º, V - Nomes de botões descritivos',
  'heading-order': 'Art. 6º, §1º, VI - Ordem lógica de cabeçalhos',
  'landmark-one-main': 'Art. 6º, §1º, VII - Região principal única',
  'region': 'Art. 6º, §1º, VIII - Regiões identificadas',
  'focus-order': 'Art. 6º, §2º, I - Ordem de foco lógica',
  'focus-visible': 'Art. 6º, §2º, II - Foco visível',
  'keyboard': 'Art. 6º, §2º, III - Acesso por teclado',
  'skip-link': 'Art. 6º, §2º, IV - Link de salto',
  'aria-required-attr': 'Art. 6º, §3º, I - Atributos ARIA obrigatórios',
  'aria-valid-attr-value': 'Art. 6º, §3º, II - Valores ARIA válidos',
  'aria-roles': 'Art. 6º, §3º, III - Roles ARIA válidas',
  'meta-viewport': 'Art. 6º, §4º, I - Viewport configurável',
  'html-has-lang': 'Art. 6º, §4º, II - Idioma da página',
  'html-lang-valid': 'Art. 6º, §4º, III - Idioma válido',
  'document-title': 'Art. 6º, §4º, IV - Título da página',
  'frame-title': 'Art. 6º, §4º, V - Título de iframes',
  'list': 'Art. 6º, §5º, I - Listas semânticas',
  'listitem': 'Art. 6º, §5º, II - Itens de lista',
  'table-headers': 'Art. 6º, §5º, III - Cabeçalhos de tabela',
  'th-has-data-cells': 'Art. 6º, §5º, IV - TH com células de dados',
  'td-has-header': 'Art. 6º, §5º, V - TD com cabeçalho',
};

export function getLBIArticle(ruleId: string): LBIArticle | undefined {
  return LBI_MAPPING[ruleId];
}

export function getLBIArticleByTag(tags: string[]): LBIArticle | undefined {
  for (const tag of tags) {
    const article = LBI_MAPPING[tag];
    if (article) return article;
  }
  return undefined;
}