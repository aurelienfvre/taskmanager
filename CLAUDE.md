# TaskManager

Application de gestion de tâches construite avec Next.js 16 (App Router), React 19 et Tailwind CSS v4.

## Stack

- **Next.js 16** avec App Router (`src/app/`)
- **React 19** — composants fonctionnels + hooks
- **Tailwind CSS v4** pour tout le style (pas de CSS modules)
- **JavaScript / JSX** — fichiers `.jsx`, pas de TypeScript
- **ESLint** (`eslint-config-next`)

> Next.js 16 contient des breaking changes par rapport aux versions antérieures. Avant d'écrire du code Next, consulter `node_modules/next/dist/docs/` pour vérifier les APIs et conventions actuelles.

## Conventions de code

- Composants fonctionnels React avec hooks uniquement
- Noms de composants en **PascalCase** (`TaskItem`, `TaskList`)
- Composants réutilisables dans `src/components/`
- Pages dans `src/app/` avec `export default`
- Balises HTML sémantiques (`main`, `section`, `nav`, `article`, `header`)
- Attributs d'accessibilité quand pertinent (`aria-label`, `alt`, `role`)
- **Commentaires en français**
- Style exclusivement avec classes Tailwind

## Dossier `rules/`

Le dossier `rules/` contient les règles générales du projet. C'est la **source de vérité** pour les conventions à suivre. Les consulter avant toute modification :

- `rules/stack.md` — règles générales du stack et conventions de code

Quand l'utilisateur ajoute ou modifie un fichier dans `rules/`, traiter son contenu comme prioritaire sur les habitudes par défaut.

## Subagents disponibles

Des subagents spécialisés sont définis dans `.claude/agents/`. Les utiliser via le tool `Agent` avec le `subagent_type` correspondant quand le contexte s'y prête :

- `frontend-developer` — création/modification de composants React, Next.js, Tailwind. À utiliser pour toute tâche de dev front.
- `git-helper` — rédaction de commits (Conventional Commits FR), découpage en commits atomiques, PR. À utiliser pour toute opération git.
- `code-reviewer` — audit de code existant (a11y, cas limites, lisibilité, perf). Ne modifie pas le code, ne fait que rapporter.

## Structure

```
src/
  app/           # App Router : pages, layouts, routes
    layout.jsx
    page.jsx
    globals.css
  components/    # Composants React réutilisables (PascalCase, .jsx)
rules/           # Règles générales du projet
.claude/
  agents/        # Définitions des subagents spécialisés
```

## Scripts

- `npm run dev` — serveur de dev
- `npm run build` — build de production
- `npm run start` — serveur de production
- `npm run lint` — ESLint