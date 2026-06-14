# Attributions

`@clean99/liquid-glass` is a wrapper component library built on top of `@hashintel/refractive`.

- `@hashintel/refractive`
  - Package: https://www.npmjs.com/package/@hashintel/refractive
  - Documentation: https://hash.design/libs/refractive
  - License: MIT OR Apache-2.0
  - Repository: https://github.com/hashintel/hash/tree/main/libs/@hashintel/refractive

The visual direction is informed by Chris Feijoo's public Liquid Glass research and the HASH Refractive documentation. This repository does not copy third-party source code.

- Kube Liquid Glass article and component behavior reference
  - Article: https://kube.io/blog/liquid-glass-css-svg/
  - Author: Chris Feijoo
  - Used as a visual and behavioral reference for the Storybook kube-aligned demos.

- `rdev/liquid-glass-react`
  - Repository: https://github.com/rdev/liquid-glass-react
  - Inspected commit: `ac48eab18d1f7f444ae30002d240cae29c863a21`
  - License: MIT
  - Used as an implementation reference during optical-model and pointer-elasticity research. No source code has been copied into this package.
  - The demos recreate component behavior and styling parameters, not the article source code.

- `shuding/liquid-glass`
  - Repository: https://github.com/shuding/liquid-glass
  - Mentioned by `rdev/liquid-glass-react` as an adaptation source for shader utilities.
  - Used only as an attribution and research trail. No source code has been copied into this package.

- `react-resizable-panels`
  - Package: https://www.npmjs.com/package/react-resizable-panels
  - Repository: https://github.com/bvaughn/react-resizable-panels
  - License: MIT
  - Used as the behavior engine for `LiquidResizablePanelGroup`, `LiquidResizablePanel`, and `LiquidResizableHandle`.

- `@tanstack/react-table`
  - Package: https://www.npmjs.com/package/@tanstack/react-table
  - Repository: https://github.com/TanStack/table
  - License: MIT
  - Used as the row-model, sorting, filtering, and pagination engine for `LiquidDataTable`.

- Kube searchbox demo image
  - Source: https://images.unsplash.com/photo-1497250681960-ef046c08a56e
  - Credit shown in the story: Teemu Paananen / Unsplash.
  - License/source terms: Unsplash.
  - Stored under `stories/assets/kube/` as a Storybook/parity fixture and excluded from the published package.

- Kube lens demo image
  - Source: https://images.unsplash.com/photo-1579380656108-f98e4df8ea62
  - Credit shown in the story: Stephanie LeBlanc / Unsplash.
  - License/source terms: Unsplash.
  - Stored under `stories/assets/kube/` as a Storybook/parity fixture and excluded from the published package.

- Kube lens page background image
  - Source: https://images.unsplash.com/photo-1688494930098-e88c53c26e3a
  - Credit/source terms: Unsplash.
  - Stored under `stories/assets/kube/` as a Storybook/parity fixture and excluded from the published package.

- Kube same-origin SVG filter maps
  - Source: https://kube.io/blog/liquid-glass-css-svg/
  - Used only as Storybook/parity fixtures and exact-gate diagnostics for map dimensions, hashes, and optical gap classification.
  - Stored under `stories/assets/kube/maps/` and excluded from the published package. Runtime components still generate their own maps.

- Inter variable font
  - Project: https://rsms.me/inter/
  - Fixture source: https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1
  - License/source terms: SIL Open Font License 1.1.
  - Used as a Kube page text-rendering fixture for Storybook/parity screenshots.
  - Stored under `stories/assets/kube/fonts/` as a Storybook/parity fixture and excluded from the published package.

- Kube Music Player album art fixtures
  - Source: https://is1-ssl.mzstatic.com/image/thumb/
  - Observed from the public Kube Music Player demo via Chrome pageAssets sampling.
  - License/source terms: Apple Music/iTunes artwork URL terms.
  - Stored under `stories/assets/kube/music/` as Storybook/parity fixtures and excluded from the published package.

Open-source governance and visual documentation references:

- `shadcn/ui`
  - Repository: https://github.com/shadcn-ui/ui
  - Documentation: https://ui.shadcn.com/docs
  - License: MIT
  - Used as a governance, visual documentation, and registry-distribution reference. No source code has been copied into this package.

- `radix-ui/primitives`
  - Repository: https://github.com/radix-ui/primitives
  - Documentation: https://www.radix-ui.com/primitives
  - License: MIT
  - Used as an accessibility-first primitives, public documentation, and visual documentation governance reference. No source code has been copied into this package.

- `chakra-ui/chakra-ui`
  - Repository: https://github.com/chakra-ui/chakra-ui
  - Documentation: https://chakra-ui.com/docs
  - License: MIT
  - Used as a contribution, issue routing, visual documentation, and accessible component library governance reference. No source code has been copied into this package.

- `heroui-inc/heroui`
  - Repository: https://github.com/heroui-inc/heroui
  - Documentation: https://www.heroui.com
  - License: Apache-2.0
  - Used as a full component-library governance, visual documentation, template, and release workflow reference. No source code has been copied into this package.

- `llms.txt`
  - Proposal: https://llmstxt.org/
  - Used as an assistant-facing documentation index format reference. No source code has been copied into this package.

Accessibility standards and documentation references:

- WAI-ARIA Authoring Practices Guide
  - Documentation: https://www.w3.org/WAI/ARIA/apg/
  - License: W3C Document License
  - Used as an accessibility behavior and composite-widget semantics reference. No source code or documentation text has been copied into this package.
