# Installation

`@clean99/liquid-glass` is prepared for public npm release but is not published
yet. After the first release, install it with:

```sh
pnpm add @clean99/liquid-glass
```

Import the CSS once in your app:

```tsx
import "@clean99/liquid-glass/styles.css";
```

For design-token-only usage:

```tsx
import "@clean99/liquid-glass/tokens.css";
```

React and React DOM are peer dependencies. The current package is tested against React 19.

Until the first npm release, use this repository for local validation:

```sh
pnpm install
pnpm build
pnpm test:package
```
