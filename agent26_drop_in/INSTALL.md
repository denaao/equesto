# Agent 26 — Drop-in Installation

Este pacote adiciona o **Interactive Discovery & Project Foundation Agent (Agent 26)**
a qualquer projeto que já use o Universal Production AI Agent Orchestrator.

## Como instalar

1. Faça backup do seu projeto (ou commit do estado atual no git).
2. Extraia este zip na **raiz** do seu projeto. As pastas `agents/` e `.claude/`
   já existem — o conteúdo será adicionado/sobrescrito conforme abaixo.
3. Verifique que tudo foi copiado (ver "Verificação" no final).
4. Pronto. O agente está integrado.

## O que será ADICIONADO (15 arquivos novos)

```
agents/26_project_foundation_agent.md
agents/templates/foundation/README.md
agents/templates/foundation/PROJECT_BRIEF.template.md
agents/templates/foundation/MVP_SCOPE.template.md
agents/templates/foundation/INITIAL_ROADMAP.template.md
agents/templates/foundation/MODULE_MAP.template.md
agents/templates/foundation/RISKS_AND_ASSUMPTIONS.template.md
agents/templates/foundation/OPEN_QUESTIONS.template.md
agents/templates/foundation/CONTEXT_REGISTRY.template.md
agents/templates/foundation/DISCOVERY_LOG.template.md
agents/templates/foundation/ORCHESTRATOR_HANDOFF.template.md
.claude/commands/tasks/project-foundation.md
.claude/commands/tasks/mvp-structuring.md
.claude/commands/tasks/context-discovery.md
```

## O que será SUBSTITUÍDO (15 arquivos existentes)

> ⚠️ Estes arquivos serão SOBRESCRITOS. Se você modificou alguma dessas cópias
> localmente, faça merge manual em vez de extrair direto.

```
agents/00_orchestrator.md             ← classificações, gates, regras de seleção
agents/00_usage_protocol.md           ← Quick Commands + lista de tasks
agents/21_documentation_engineer.md   ← aceita foundation bundle como input

.claude/commands/README.md            ← tabela de tasks + nota foundation-squad
.claude/commands/start.md             ← rotas de intent novas
.claude/commands/new-project.md       ← passo 0 idea-stage

.claude/commands/tasks/feature.md             ← Pre-task context check
.claude/commands/tasks/bug.md                 ← Pre-task context check
.claude/commands/tasks/security.md            ← Pre-task context check
.claude/commands/tasks/sql-review.md          ← Pre-task context check
.claude/commands/tasks/architecture-review.md ← Pre-task context check
.claude/commands/tasks/production-readiness.md ← Pre-task context check
.claude/commands/tasks/test-flow.md           ← Pre-task context check
.claude/commands/tasks/incident.md            ← Pre-task context check
.claude/commands/tasks/migration-review.md    ← Pre-task context check
.claude/commands/tasks/project-discovery.md   ← Pre-task context check
```

## O que NÃO mexe

- Nenhum dos demais agentes (01–25) é tocado.
- Nenhum squad é alterado nem adicionado (foundation é single-agent por design).
- `CLAUDE.md` não precisa ser alterado — a constituição já cobre orchestration.
- `installer/`, `template/` (se existirem no projeto) — não tocados.

## Compatibilidade

- Requer projeto com a estrutura padrão do Universal Production AI Agent Orchestrator
  (pastas `agents/` e `.claude/commands/`).
- Compatível com agentes 01–25 existentes.
- Não quebra nenhum command ou squad existente.
- Compatível com Claude Code e qualquer ferramenta que leia `.claude/commands/`.

## Verificação pós-instalação

```bash
# Linux / macOS
ls agents/26_project_foundation_agent.md
ls agents/templates/foundation/
ls .claude/commands/tasks/{project-foundation,mvp-structuring,context-discovery}.md
grep -c "Foundation Gate" agents/00_orchestrator.md   # deve retornar 1
grep -c "Pre-task context check" .claude/commands/tasks/feature.md  # deve retornar 1+

# Windows PowerShell
Test-Path agents\26_project_foundation_agent.md
Test-Path agents\templates\foundation\
Test-Path .claude\commands\tasks\project-foundation.md
Select-String "Foundation Gate" agents\00_orchestrator.md
```

Se todos os comandos retornaram resultado positivo, a instalação está OK.

## Como invocar

```
/tasks/project-foundation Mode: AUTO <descrição da ideia>
/tasks/mvp-structuring Mode: AUTO <escopo a cortar>
/tasks/context-discovery Mode: LIGHT <gap de contexto>
```

Ou implicitamente: o orquestrador roteia automaticamente quando o
**Context Sufficiency Check** detecta contexto faltando.

## Suporte

- Spec completa do agente: `agents/26_project_foundation_agent.md`
- Templates de output: `agents/templates/foundation/`
- Documentação dos commands: `.claude/commands/README.md`

