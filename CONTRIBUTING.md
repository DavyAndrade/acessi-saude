# Contributing to AcessiSaúde-Audit

Bem-vindo! Este projeto visa melhorar a acessibilidade das plataformas de saúde pública no Brasil (e-SUS, Conecte SUS, agendamentos municipais) sob a ótica da Lei Brasileira de Inclusão (LBI - Lei nº 13.146/2015) e WCAG 2.1.

---

## 🛠️ Requisitos de Ambiente

- **Bun**: v1.2+ (obrigatório para scripts e CLI)
- **Node.js**: v20+ (opcional, caso prefira rodar Vite/Playwright com Node)
- **Git**: Com suporte a hooks (Husky está configurado)
- **Navegador**: Chromium instalado (gerenciado via Playwright)

Instalação de dependências:
```bash
# Na raiz
bun install
bunx playwright install chromium

# No frontend
cd frontend
bun install
```

---

## 🚀 Como Executar

### 1. Executando uma Auditoria via CLI
Para escanear um portal público ou página de teste:
```bash
bun run audit https://exemplo.saude.gov.br
```
Os relatórios serão gerados em `reports/<timestamp>-<slug>.json`.

### 2. Rodando o Dashboard Localmente
Para visualizar e interagir com os relatórios gerados:
```bash
cd frontend
bun run build:manifest   # indexa os arquivos da pasta ../reports
bun run dev              # inicia servidor Vite local em http://localhost:5173
```

---

## 🧪 Qualidade de Código e Testes

O repositório possui pre-commit hooks ativos (via Husky). O commit será rejeitado se houver erros de lint ou tipagem.

### Comandos de Teste

**Root / CLI:**
```bash
bun run lint         # ESLint flat config
bun run typecheck    # TypeScript strict check
bun run test:unit    # Testes unitários (CLI)
```

**Frontend:**
```bash
cd frontend
bun run lint         # ESLint
bun run typecheck    # TypeScript strict
bun test             # Testes unitários via Vitest
bun run build        # Validação do build de produção
```

---

## 📜 Convenção de Commits

Seguimos o padrão **Conventional Commits**:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações em documentação
- `chore:` Manutenções, configs, dependências
- `test:` Inclusão ou ajuste de testes
- `refactor:` Refatoração sem alteração de comportamento

Exemplo:
```bash
git commit -m "feat(dashboard): add export to PDF option"
```

---

## ♿ Diretrizes de Acessibilidade

O próprio dashboard deve atender aos critérios **WCAG 2.1 nível AA**:
1. **Semântica HTML**: Sempre use tags semânticas (`<nav>`, `<main>`, `<header>`, etc.).
2. **Teclado**: Todas as interações devem ser acessíveis via teclado (Tab, Enter, Espaço, Esc).
3. **Contraste**: Relação de contraste mínima de 4.5:1 para texto normal e 3:1 para elementos interativos/bordas.
4. **Foco Visível**: Nunca remova outlines sem fornecer um indicador de foco claro e contrastante.
5. **Leitores de Tela**: Utilize atributos ARIA com moderação e precisão (ex.: `aria-live` para avisos dinâmicos).

---

## 🤝 Fluxo de Trabalho (Git Workflow)

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-feature
   ```
2. Desenvolva sua alteração respeitando os padrões de lint, testes e tipagem.
3. Certifique-se de que os testes e builds passem localmente.
4. Abra um Pull Request com descrição detalhada do impacto e evidências de acessibilidade.